import { ShipCompliance } from "../domain/ShipCompliance.js";
export interface ComplianceRepository {
  saveSnapshot(entry: Omit<ShipCompliance, "id" | "createdAt">): Promise<void>;
  getLatest(shipId: string, year: number): Promise<ShipCompliance | null>;
}
