import { ComputeCB } from "../../src/core/application/ComputeCB.js";
import { MemoryComplianceRepository } from "../../src/adapters/outbound/memory/MemoryComplianceRepository.js";
import { Route } from "../../src/core/domain/Route.js";

test("ComputeCB computes positive when actual < target", async () => {
  const repo = new MemoryComplianceRepository();
  const svc = new ComputeCB(repo);
  const route: Route = {
    id: 1, routeId: "R002", shipId: "R002", vesselType: "Bulk", fuelType: "LNG", year: 2024,
    ghgIntensity: 80, fuelConsumption: 10, distance: 100, totalEmissions: 8, isBaseline: false
  };
  const cb = svc.computeForRoute(route);
  expect(cb).toBeGreaterThan(0);
});
