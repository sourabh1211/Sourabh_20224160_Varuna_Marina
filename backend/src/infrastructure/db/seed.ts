import { pgPool } from "../../adapters/outbound/postgres/index.js";

async function seed() {
  await pgPool.query("DELETE FROM pool_members");
  await pgPool.query("DELETE FROM pools");
  await pgPool.query("DELETE FROM bank_entries");
  await pgPool.query("DELETE FROM ship_compliance");
  await pgPool.query("DELETE FROM routes");

  const rows = [
    {route_id:"R001", vessel_type:"Container", fuel_type:"HFO", year:2024, ghg_intensity:91.0, fuel_consumption:5000, distance_km:12000, total_emissions:4500, is_baseline:true},
    {route_id:"R002", vessel_type:"BulkCarrier", fuel_type:"LNG", year:2024, ghg_intensity:88.0, fuel_consumption:4800, distance_km:11500, total_emissions:4200, is_baseline:false},
    {route_id:"R003", vessel_type:"Tanker", fuel_type:"MGO", year:2024, ghg_intensity:93.5, fuel_consumption:5100, distance_km:12500, total_emissions:4700, is_baseline:false},
    {route_id:"R004", vessel_type:"RoRo", fuel_type:"HFO", year:2025, ghg_intensity:89.2, fuel_consumption:4900, distance_km:11800, total_emissions:4300, is_baseline:true},
    {route_id:"R005", vessel_type:"Container", fuel_type:"LNG", year:2025, ghg_intensity:90.5, fuel_consumption:4950, distance_km:11900, total_emissions:4400, is_baseline:false},
  ];

  for (const r of rows) {
    await pgPool.query(
      `INSERT INTO routes (route_id, ship_id, vessel_type, fuel_type, year, ghg_intensity, fuel_consumption, distance_km, total_emissions, is_baseline)
       VALUES ($1,$1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [r.route_id, r.vessel_type, r.fuel_type, r.year, r.ghg_intensity, r.fuel_consumption, r.distance_km, r.total_emissions, r.is_baseline]
    );
  }

  console.log("Seed complete.");
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
