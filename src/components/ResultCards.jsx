import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Binary, Clock3, Gauge, Layers2, Sparkles } from "lucide-react";

const cards = [
  { key: "lcs", label: "Longest Common Subsequence", icon: Binary, accent: "from-cyan-400/25 to-blue-500/10" },
  { key: "lcsLength", label: "Length of LCS", icon: Layers2, accent: "from-violet-400/25 to-cyan-500/10" },
  { key: "similarity", label: "Similarity Percentage", icon: Gauge, accent: "from-pink-400/20 to-cyan-500/10" },
  { key: "matchCount", label: "Matching Characters", icon: Sparkles, accent: "from-teal-400/25 to-cyan-500/10" },
  { key: "timeComplexity", label: "Time Complexity", icon: Clock3, accent: "from-cyan-400/20 to-fuchsia-500/10" },
  { key: "spaceComplexity", label: "Space Complexity", icon: Activity, accent: "from-fuchsia-400/20 to-sky-500/10" },
];

function AnimatedNumber({ value, suffix = "" }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let frameId;
    let start;
    const duration = 850;

    const animate = (timestamp) => {
      if (!start) {
        start = timestamp;
      }

      const progress = Math.min((timestamp - start) / duration, 1);
      setDisplayValue(value * progress);

      if (progress < 1) {
        frameId = window.requestAnimationFrame(animate);
      }
    };

    frameId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frameId);
  }, [value]);

  return (
    <span>
      {Number.isInteger(value) ? Math.round(displayValue) : displayValue.toFixed(2)}
      {suffix}
    </span>
  );
}

function renderValue(key, value) {
  if (key === "lcs") {
    return value || "No subsequence";
  }

  if (key === "similarity") {
    return <AnimatedNumber value={value} suffix="%" />;
  }

  if (typeof value === "number") {
    return <AnimatedNumber value={value} />;
  }

  return value;
}

export default function ResultCards({ result }) {
  if (!result) {
    return null;
  }

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="section-kicker">Results</p>
          <h2 className="section-heading mt-2">Sequence similarity insights</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card, index) => {
            const Icon = card.icon;

            return (
              <motion.div
                key={card.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                className="glass-card relative overflow-hidden p-6"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${card.accent}`} />
                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                      {card.label}
                    </p>
                    <div className="mt-4 break-words font-display text-3xl font-bold">
                      {renderValue(card.key, result[card.key])}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white/8 p-3 text-cyan-300">
                    <Icon size={20} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
