import { BankingRepository } from "../../../core/ports/BankingRepository.js";
import { BankEntry } from "../../../core/domain/BankEntry.js";

export class MemoryBankingRepository implements BankingRepository {
  private entries: BankEntry[] = [];
  private id = 1;

  async listRecords(shipId: string, year?: number): Promise<BankEntry[]> {
    return this.entries.filter(e => e.shipId === shipId && (year ? e.year === year : true));
  }

  async addEntry(entry: Omit<BankEntry, "id" | "createdAt">): Promise<void> {
    this.entries.push({ id: this.id++, createdAt: new Date(), ...entry });
  }

  async totalBanked(shipId: string): Promise<number> {
    return this.entries.filter(e => e.shipId === shipId).reduce((s, e) => s + e.amount_gco2eq, 0);
  }
}
