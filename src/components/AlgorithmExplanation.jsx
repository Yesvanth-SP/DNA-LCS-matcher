import { Code2, Sigma, Workflow } from "lucide-react";

const formulas = [
  "LCS[i][j] = 0 if i = 0 or j = 0",
  "If X[i-1] == Y[j-1], LCS[i][j] = LCS[i-1][j-1] + 1",
  "Else, LCS[i][j] = max(LCS[i-1][j], LCS[i][j-1])",
];

export default function AlgorithmExplanation() {
  return (
    <section id="theory" className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <p className="section-kicker">DAA Theory</p>
          <h2 className="section-heading mt-2">LCS explained for presentations and viva</h2>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="glass-card p-6">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <div className="inline-flex rounded-2xl bg-cyan-400/10 p-3 text-cyan-300">
                  <Workflow size={20} />
                </div>
                <h3 className="mt-4 font-display text-2xl font-semibold">
                  What is Longest Common Subsequence?
                </h3>
                <p className="mt-4 leading-7" style={{ color: "var(--text-secondary)" }}>
                  A subsequence preserves the order of characters but does not require them to be
                  adjacent. The LCS is the longest ordered sequence present in both DNA strings.
                </p>
              </div>

              <div>
                <div className="inline-flex rounded-2xl bg-fuchsia-400/10 p-3 text-fuchsia-300">
                  <Sigma size={20} />
                </div>
                <h3 className="mt-4 font-display text-2xl font-semibold">
                  Why Dynamic Programming?
                </h3>
                <p className="mt-4 leading-7" style={{ color: "var(--text-secondary)" }}>
                  LCS has overlapping subproblems and optimal substructure. Dynamic Programming
                  stores smaller prefix answers so each state is computed once and reused.
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-[28px] border border-white/10 bg-slate-950/35 p-5">
              <p className="font-display text-lg font-semibold">Pseudocode</p>
              <pre className="mt-4 overflow-auto rounded-2xl bg-black/30 p-4 text-sm leading-7 text-cyan-100">
{`for i = 0 to n:
  LCS[i][0] = 0
for j = 0 to m:
  LCS[0][j] = 0

for i = 1 to n:
  for j = 1 to m:
    if X[i-1] == Y[j-1]:
      LCS[i][j] = LCS[i-1][j-1] + 1
    else:
      LCS[i][j] = max(LCS[i-1][j], LCS[i][j-1])`}
              </pre>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card p-6">
              <div className="inline-flex rounded-2xl bg-emerald-400/10 p-3 text-emerald-300">
                <Code2 size={20} />
              </div>
              <h3 className="mt-4 font-display text-2xl font-semibold">Recurrence Relation</h3>
              <div className="mt-4 grid gap-3">
                {formulas.map((formula) => (
                  <div
                    key={formula}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {formula}
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-[24px] border border-cyan-300/20 bg-cyan-400/10 p-4">
                <p className="font-semibold text-cyan-100">Memory Trick</p>
                <p className="mt-2 text-sm leading-6" style={{ color: "var(--text-secondary)" }}>
                  Match means diagonal plus 1. Mismatch means take the maximum of top or left.
                </p>
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="font-display text-2xl font-semibold">Substring vs Subsequence</h3>
              <p className="mt-4 leading-7" style={{ color: "var(--text-secondary)" }}>
                A substring must be contiguous, while a subsequence only preserves order. DNA
                comparison usually prefers subsequences because insertions and deletions can create
                biologically meaningful gaps.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-4">
                  <p className="text-sm text-cyan-200">Substring</p>
                  <p className="mt-2 font-semibold">Contiguous match only</p>
                </div>
                <div className="rounded-2xl border border-fuchsia-300/20 bg-fuchsia-400/10 p-4">
                  <p className="text-sm text-fuchsia-200">Subsequence</p>
                  <p className="mt-2 font-semibold">Order preserved with gaps</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
