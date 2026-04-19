import { motion } from "framer-motion";
import { Beaker, Dna, Eraser, FlaskConical, Shuffle, TestTubeDiagonal } from "lucide-react";

function InputCard({ label, value, onChange, error, placeholder }) {
  return (
    <div className="glass-card p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <label className="font-display text-lg font-semibold">{label}</label>
        <span
          className="rounded-full border px-3 py-1 text-xs"
          style={{ borderColor: "var(--border-soft)", color: "var(--text-muted)" }}
        >
          {value.length} bases
        </span>
      </div>

      <textarea
        rows={7}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        spellCheck={false}
        className="w-full rounded-[24px] border bg-slate-950/40 px-4 py-4 text-sm uppercase tracking-[0.3em] outline-none transition duration-300"
        style={{
          borderColor: error ? "rgba(244, 114, 182, 0.45)" : "var(--border-soft)",
          color: "var(--text-primary)",
        }}
      />

      <p className="mt-3 text-sm" style={{ color: error ? "#fda4af" : "var(--text-muted)" }}>
        {error || "Accepted DNA bases: A, T, C, G"}
      </p>
    </div>
  );
}

export default function DNAInputForm({
  sequence1,
  sequence2,
  errors,
  randomLength,
  sampleDNA,
  dashboardStats,
  isProcessing,
  onRandomLengthChange,
  onSequenceChange,
  onGenerateRandom,
  onCompare,
  onClear,
  onLoadSample,
}) {
  return (
    <section id="dashboard" className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-kicker">Comparison Dashboard</p>
            <h2 className="section-heading mt-2">Run sequence matching with guided inputs</h2>
          </div>
          <div className="glass-card flex items-center gap-3 px-4 py-3 text-sm" style={{ color: "var(--text-secondary)" }}>
            <FlaskConical size={16} className="text-cyan-300" />
            Dynamic Programming powered analysis
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {dashboardStats.map((item) => (
            <div key={item.label} className="glass-card p-5">
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                {item.label}
              </p>
              <p className="mt-2 font-display text-3xl font-bold break-words">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <InputCard
            label="DNA Sequence 1"
            value={sequence1}
            onChange={(event) => onSequenceChange("sequence1", event.target.value)}
            error={errors.sequence1}
            placeholder="ATGCTAACGTTACG"
          />
          <InputCard
            label="DNA Sequence 2"
            value={sequence2}
            onChange={(event) => onSequenceChange("sequence2", event.target.value)}
            error={errors.sequence2}
            placeholder="TACTAACCGTTGCG"
          />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="glass-card p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-300">
                <Shuffle size={18} />
              </div>
              <div>
                <p className="font-display text-lg font-semibold">Random DNA Generator</p>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  Generate custom test cases for demos, theory explanations, and viva runs.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    Sequence length
                  </label>
                  <span className="text-sm font-semibold text-cyan-200">{randomLength} bases</span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="36"
                  value={randomLength}
                  onChange={(event) => onRandomLengthChange(Number(event.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>
              <button type="button" onClick={onGenerateRandom} className="action-primary">
                <Shuffle size={18} />
                Generate Random DNA
              </button>
            </div>
          </div>

          <div className="glass-card p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-fuchsia-400/10 p-3 text-fuchsia-300">
                <TestTubeDiagonal size={18} />
              </div>
              <div>
                <p className="font-display text-lg font-semibold">Sample Dataset Library</p>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  Load ready-made DNA examples for mutation and similarity demonstrations.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {sampleDNA.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => onLoadSample(sample)}
                  className="rounded-[22px] border px-4 py-4 text-left transition duration-300 hover:bg-fuchsia-400/10"
                  style={{ borderColor: "var(--border-soft)", background: "rgba(255,255,255,0.04)" }}
                >
                  <div className="flex items-center gap-2">
                    <Beaker size={16} className="text-fuchsia-300" />
                    <span className="font-semibold">{sample.title}</span>
                  </div>
                  <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
                    {sample.summary}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-6 flex flex-wrap gap-3"
        >
          <button type="button" onClick={onCompare} disabled={isProcessing} className="action-primary">
            <Dna size={18} />
            {isProcessing ? "Processing Sequences..." : "Compare Sequences"}
          </button>
          <button type="button" onClick={onClear} className="action-secondary">
            <Eraser size={18} />
            Clear
          </button>
        </motion.div>
      </div>
    </section>
  );
}
