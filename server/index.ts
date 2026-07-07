import "dotenv/config";
import dns from "node:dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);


import app from './src/app'
import connectToMongo from './src/config/database';
import aiIntraction from "./src/handlers/ai.handlers";

connectToMongo();
aiIntraction();

const port = process.env.PORT || "3000";
const server = app.listen(port);
server.on('listening', () =>
  console.log(`Server running on http://localhost:${port}`)
)
