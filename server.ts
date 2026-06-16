/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import generateHandler from "./api/generate";

// Load local environment variables
dotenv.config();

const PORT = 3000;
const app = express();

// Set up bodies with higher limits for handling complex prompts or descriptions
app.use(express.json({ limit: "10mb" }));

// Commerce engine package generation endpoint
app.post("/api/generate", generateHandler);

// Configure Vite integration or static file serving
async function startServer() {
  const isProduction = process.env.NODE_ENV === "production";
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Sellify GH Commerce Engine running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
