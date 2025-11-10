import dotenv from "dotenv";
dotenv.config();
import { createServer } from "./createServer.js";
const app = createServer();
const port = Number(process.env.PORT || 4000);
app.listen(port, () => console.log(`FuelEU backend listening on :${port}`));
