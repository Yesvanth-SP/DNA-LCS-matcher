import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sampleDNA } from "../src/data/sampleDNA.js";
import { generateRandomDNA, validateDNAInput } from "../src/utils/dnaGenerator.js";
import { computeLCS } from "../src/utils/lcsAlgorithm.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const app = express();
const PORT = Number(process.env.PORT) || 8080;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({
    ok: true,
    service: "dna-lcs-api",
    deployedAt: new Date().toISOString(),
  });
});

app.get("/api/samples", (_request, response) => {
  response.json({ samples: sampleDNA });
});

app.get("/api/random", (request, response) => {
  const requestedLength = Number(request.query.length) || 16;
  const length = Math.min(Math.max(requestedLength, 4), 60);

  response.json({
    sequence1: generateRandomDNA(length),
    sequence2: generateRandomDNA(length),
    length,
  });
});

app.post("/api/compare", (request, response) => {
  const sequence1 = String(request.body?.sequence1 ?? "").toUpperCase();
  const sequence2 = String(request.body?.sequence2 ?? "").toUpperCase();

  const errors = {
    sequence1: validateDNAInput(sequence1),
    sequence2: validateDNAInput(sequence2),
  };

  if (errors.sequence1 || errors.sequence2) {
    response.status(400).json({
      ok: false,
      errors,
    });
    return;
  }

  response.json({
    ok: true,
    result: computeLCS(sequence1, sequence2),
  });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(distDir));

  app.get("*", (_request, response) => {
    response.sendFile(path.join(distDir, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`DNA LCS server running on http://localhost:${PORT}`);
});
