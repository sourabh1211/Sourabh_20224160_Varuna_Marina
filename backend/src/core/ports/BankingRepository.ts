import { BankEntry } from "../domain/BankEntry.js";
export interface BankingRepository {
  listRecords(shipId: string, year?: number): Promise<BankEntry[]>;
  addEntry(entry: Omit<BankEntry, "id" | "createdAt">): Promise<void>;
  totalBanked(shipId: string): Promise<number>;
}
