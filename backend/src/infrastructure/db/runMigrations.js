import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pgPool } from "../../adapters/outbound/postgres/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  const dir = path.join(__dirname, "migrations");
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".sql")).sort();
  for (const f of files) {
    const sql = fs.readFileSync(path.join(dir, f), "utf-8");
    console.log("Running migration:", f);
    await pgPool.query(sql);
  }
  console.log("Migrations complete.");
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
