import request from "supertest";
import { createServer } from "../../src/infrastructure/server/createServer.js";

test("health", async () => {
  const app = createServer();
  const res = await request(app).get("/health");
  expect(res.status).toBe(200);
  expect(res.body.ok).toBe(true);
});
