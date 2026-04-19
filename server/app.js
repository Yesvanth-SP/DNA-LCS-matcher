import express from "express";
import cors from "cors";
import { sampleDNA } from "../src/data/sampleDNA.js";
import { generateRandomDNA, validateDNAInput } from "../src/utils/dnaGenerator.js";
import { computeLCS } from "../src/utils/lcsAlgorithm.js";

const app = express();

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

export default app;
