const DNA_BASES = ["A", "T", "C", "G"];

export function sanitizeDNAInput(input) {
  return input.toUpperCase().replace(/\s+/g, "").replace(/[^ATCG]/g, "");
}

export function validateDNAInput(input) {
  const normalized = input.toUpperCase().replace(/\s+/g, "");

  if (!normalized) {
    return "DNA sequence is required.";
  }

  if (/[^ATCG]/.test(normalized)) {
    return "Only A, T, C, and G characters are allowed.";
  }

  if (normalized.length < 4) {
    return "Use at least 4 DNA bases for meaningful comparison.";
  }

  return "";
}

export function generateRandomDNA(length = 12) {
  return Array.from({ length }, () => DNA_BASES[Math.floor(Math.random() * DNA_BASES.length)]).join("");
}

export function getFrequencyData(sequence1, sequence2, lcs = "") {
  return DNA_BASES.map((base) => ({
    name: base,
    sequence1: sequence1.split("").filter((character) => character === base).length,
    sequence2: sequence2.split("").filter((character) => character === base).length,
    lcs: lcs.split("").filter((character) => character === base).length,
  }));
}
