import type { Express } from "express";
import express from "express";
import path from "path";
import fs from "fs";

export function serveStatic(app: Express) {
  const distPath = path.resolve(process.cwd(), "dist/public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find frontend build at ${distPath}. Did you run vite build?`
    );
  }

  app.use(express.static(distPath));

  // Catch-all for SPA routing (Express 5 compatible)
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}
