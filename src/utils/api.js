async function handleJsonResponse(response) {
  const payload = await response.json();

  if (!response.ok) {
    const error = new Error(payload?.message || "Request failed");
    error.payload = payload;
    throw error;
  }

  return payload;
}

export async function fetchHealth() {
  const response = await fetch("/api/health");
  return handleJsonResponse(response);
}

export async function fetchSamples() {
  const response = await fetch("/api/samples");
  return handleJsonResponse(response);
}

export async function fetchRandomSequences(length) {
  const response = await fetch(`/api/random?length=${length}`);
  return handleJsonResponse(response);
}

export async function fetchComparison(sequence1, sequence2) {
  const response = await fetch("/api/compare", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sequence1, sequence2 }),
  });

  return handleJsonResponse(response);
}
