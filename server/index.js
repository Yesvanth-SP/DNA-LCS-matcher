import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import app from "./app.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const PORT = Number(process.env.PORT) || 8080;

if (process.env.NODE_ENV === "production") {
  app.use(express.static(distDir));

  app.get("*", (_request, response) => {
    response.sendFile(path.join(distDir, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`DNA LCS server running on http://localhost:${PORT}`);
});
