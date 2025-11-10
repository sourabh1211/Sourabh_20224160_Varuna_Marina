import { PoolRepository } from "../ports/PoolRepository.js";
import { GetAdjustedCB } from "./GetAdjustedCB.js";
import { AppError } from "../../shared/errors.js";

export class CreatePool {
  constructor(private poolRepo: PoolRepository, private getAdjusted: GetAdjustedCB) {}

  async run(year: number, members: { shipId: string }[]) {
    if (!members.length) throw new AppError("Pool must have members");

    const withCB = await Promise.all(
      members.map(async m => {
        const res = await this.getAdjusted.run(m.shipId, year);
        return { shipId: m.shipId, cb_before: res.cb_after };
      })
    );

    const sum = withCB.reduce((s, m) => s + m.cb_before, 0);
    if (sum < 0) throw new AppError("Pool sum must be >= 0");

    const surpluses = withCB.filter(m => m.cb_before > 0).sort((a, b) => b.cb_before - a.cb_before);
    const deficits = withCB.filter(m => m.cb_before < 0).map(m => ({ ...m, need: -m.cb_before }));

    for (const d of deficits) {
      let remaining = d.need;
      for (const s of surpluses) {
        if (remaining <= 0) break;
        const give = Math.min(s.cb_before, remaining);
        s.cb_before -= give;
        remaining -= give;
      }
      d.need = remaining;
    }

    const afterMap = new Map<string, number>();
    for (const s of surpluses) {
      if (s.cb_before < 0) throw new AppError("Surplus ship would exit negative");
      afterMap.set(s.shipId, s.cb_before);
    }
    for (const d of deficits) {
      const after = -d.need;
      if (after < d.cb_before) throw new AppError("Deficit ship would exit worse");
      afterMap.set(d.shipId, after);
    }
    for (const m of withCB.filter(x => x.cb_before === 0)) afterMap.set(m.shipId, 0);

    const finalMembers = withCB.map(m => ({
      shipId: m.shipId,
      cb_before: m.cb_before,
      cb_after: afterMap.get(m.shipId)!
    }));

    const pool = await this.poolRepo.createPool(year, finalMembers);
    return { pool, members: finalMembers, poolSum: finalMembers.reduce((s, x) => s + x.cb_after, 0) };
  }
}
