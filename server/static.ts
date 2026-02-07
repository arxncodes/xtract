import type { Express } from "express";
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function serveStatic(app: Express) {
  // dist/public relative to project root
  const distPath = path.resolve(__dirname, "../dist/public");

  if (!fs.existsSync(distPath)) {
    console.warn(
      `[WARN] Frontend build not found at ${distPath}. ` +
      `Make sure "vite build" ran before starting server.`
    );
    return;
  }

  // Serve static assets
  app.use(express.static(distPath));

  // SPA fallback (Express 5 compatible)
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}
