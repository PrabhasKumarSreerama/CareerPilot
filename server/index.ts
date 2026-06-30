import dns from "node:dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

import dotenv from "dotenv";
dotenv.config();

import app from './src/app'
import connectToMongo from './src/config/database';

connectToMongo();

const port = process.env.PORT || "3000";
const server = app.listen(port);
server.on('listening', () =>
  console.log(`Server running on http://localhost:${port}`)
)
