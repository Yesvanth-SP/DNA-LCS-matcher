function buildLCSPath(table, seq1, seq2) {
  let i = seq1.length;
  let j = seq2.length;
  const lcsCharacters = [];
  const path = [];
  const matchedIndices1 = [];
  const matchedIndices2 = [];

  while (i > 0 && j > 0) {
    if (seq1[i - 1] === seq2[j - 1]) {
      path.push({ i, j, type: "match" });
      lcsCharacters.push(seq1[i - 1]);
      matchedIndices1.push(i - 1);
      matchedIndices2.push(j - 1);
      i -= 1;
      j -= 1;
    } else if (table[i - 1][j] >= table[i][j - 1]) {
      path.push({ i, j, type: "up" });
      i -= 1;
    } else {
      path.push({ i, j, type: "left" });
      j -= 1;
    }
  }

  return {
    lcs: lcsCharacters.reverse().join(""),
    path: path.reverse(),
    matchedIndices1: matchedIndices1.reverse(),
    matchedIndices2: matchedIndices2.reverse(),
  };
}

function createAlignment(sequence, matches) {
  const matchedSet = new Set(matches);

  return sequence.split("").map((character, index) => ({
    character,
    index,
    isMatch: matchedSet.has(index),
  }));
}

export function computeLCS(sequence1, sequence2) {
  const seq1 = sequence1.toUpperCase();
  const seq2 = sequence2.toUpperCase();
  const n = seq1.length;
  const m = seq2.length;
  const table = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
  const fillOrder = [];
  const rowSteps = [];

  for (let i = 1; i <= n; i += 1) {
    const rowCells = [];

    for (let j = 1; j <= m; j += 1) {
      const isMatch = seq1[i - 1] === seq2[j - 1];
      let direction = "left";

      if (isMatch) {
        table[i][j] = table[i - 1][j - 1] + 1;
        direction = "diag";
      } else if (table[i - 1][j] >= table[i][j - 1]) {
        table[i][j] = table[i - 1][j];
        direction = "up";
      } else {
        table[i][j] = table[i][j - 1];
        direction = "left";
      }

      const step = {
        i,
        j,
        value: table[i][j],
        char1: seq1[i - 1],
        char2: seq2[j - 1],
        isMatch,
        type: isMatch ? "match" : "inherit",
        direction,
      };

      fillOrder.push(step);
      rowCells.push(step);
    }

    rowSteps.push({
      row: i,
      character: seq1[i - 1],
      cells: rowCells,
    });
  }

  const { lcs, path, matchedIndices1, matchedIndices2 } = buildLCSPath(table, seq1, seq2);
  const pathSet = new Set(path.map((cell) => `${cell.i}-${cell.j}`));
  const totalLength = n + m;
  const matchCount = lcs.length;
  const similarity = totalLength === 0 ? 0 : Number(((2 * matchCount * 100) / totalLength).toFixed(2));

  return {
    table,
    lcs,
    lcsLength: matchCount,
    similarity,
    matchCount,
    mismatchCount: Math.max(0, Math.max(n, m) - matchCount),
    timeComplexity: "O(n x m)",
    spaceComplexity: "O(n x m)",
    fillOrder,
    rowSteps,
    path,
    pathSet,
    matchedIndices1,
    matchedIndices2,
    alignedSequence1: createAlignment(seq1, matchedIndices1),
    alignedSequence2: createAlignment(seq2, matchedIndices2),
  };
}
