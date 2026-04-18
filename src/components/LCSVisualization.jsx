import { motion } from "framer-motion";
import { CheckCircle2, Sparkles, XCircle } from "lucide-react";

function SequenceLine({ label, alignedSequence }) {
  return (
    <div className="glass-card p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="font-display text-lg font-semibold">{label}</p>
        <div className="rounded-full border px-3 py-1 text-xs" style={{ borderColor: "var(--border-soft)", color: "var(--text-muted)" }}>
          Ordered subsequence tracking
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {alignedSequence.map(({ character, index, isMatch }) => (
          <motion.span
            key={`${character}-${index}`}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.03 }}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border text-sm font-bold ${
              isMatch
                ? "border-cyan-300/35 bg-cyan-400/18 text-cyan-50"
                : "border-white/10 bg-white/5"
            }`}
            style={{ color: isMatch ? "#ecfeff" : "var(--text-muted)" }}
          >
            {character}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

export default function LCSVisualization({ result }) {
  if (!result) {
    return null;
  }

  const matched = result.matchCount;
  const unmatched = Math.max(
    0,
    result.alignedSequence1.length + result.alignedSequence2.length - matched * 2
  );

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <p className="section-kicker">LCS Trace</p>
          <h2 className="section-heading mt-2">Visualize the matching subsequence</h2>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_1fr_0.92fr]">
          <SequenceLine label="Sequence 1" alignedSequence={result.alignedSequence1} />
          <SequenceLine label="Sequence 2" alignedSequence={result.alignedSequence2} />

          <div className="glass-card flex flex-col justify-between p-6">
            <div>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Final LCS
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-fuchsia-300/30 bg-fuchsia-400/10 px-5 py-3 text-lg font-bold text-fuchsia-100">
                <Sparkles size={18} />
                {result.lcs || "No common subsequence"}
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              <div className="rounded-[22px] border border-cyan-300/20 bg-cyan-400/10 p-4">
                <div className="flex items-center gap-2 text-cyan-100">
                  <CheckCircle2 size={18} />
                  <span className="font-semibold">Matched Characters</span>
                </div>
                <p className="mt-2 text-2xl font-bold">{matched}</p>
              </div>
              <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
                  <XCircle size={18} />
                  <span className="font-semibold">Unmatched Positions</span>
                </div>
                <p className="mt-2 text-2xl font-bold">{unmatched}</p>
              </div>
            </div>

            <p className="mt-6 leading-7" style={{ color: "var(--text-secondary)" }}>
              Cyan blocks mark characters that participate in the final longest common subsequence.
              Unmatched characters remain visible so it is easy to explain gaps and preserved order.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
