import { ComplianceRepository } from "../../../core/ports/ComplianceRepository.js";
import { ShipCompliance } from "../../../core/domain/ShipCompliance.js";

export class MemoryComplianceRepository implements ComplianceRepository {
  private entries: ShipCompliance[] = [];
  private id = 1;

  async saveSnapshot(entry: Omit<ShipCompliance, "id" | "createdAt">): Promise<void> {
    this.entries.push({ id: this.id++, createdAt: new Date(), ...entry });
  }

  async getLatest(shipId: string, year: number): Promise<ShipCompliance | null> {
    const filtered = this.entries.filter(e => e.shipId === shipId && e.year === year);
    return filtered.length ? filtered[filtered.length - 1] : null;
  }
}
