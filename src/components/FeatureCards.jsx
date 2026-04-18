import {
  Activity,
  BarChart3,
  Binary,
  Blocks,
  BrainCircuit,
  Microscope,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    title: "Sequence Comparison",
    description: "Compare two DNA sequences with validation, counts, and guided controls.",
    icon: Activity,
  },
  {
    title: "LCS Visualization",
    description: "Highlight the common subsequence directly in both strands.",
    icon: Binary,
  },
  {
    title: "Similarity Analysis",
    description: "Measure match percentage and characterize sequence closeness.",
    icon: BarChart3,
  },
  {
    title: "Dynamic Programming Table",
    description: "Animate the DP matrix cell by cell or row by row with path tracing.",
    icon: Blocks,
  },
  {
    title: "Complexity Analysis",
    description: "Present best case, worst case, time, and space in DAA format.",
    icon: BrainCircuit,
  },
  {
    title: "Bioinformatics Use Cases",
    description: "Connect LCS to mutation detection, disease research, and genomics.",
    icon: Microscope,
  },
];

export default function FeatureCards() {
  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="section-kicker">Platform Features</p>
          <h2 className="section-heading mt-2">
            Built to look like a professional bioinformatics application
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className="glass-card group relative overflow-hidden p-6"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/0 via-transparent to-fuchsia-500/0 transition duration-500 group-hover:from-cyan-400/10 group-hover:to-fuchsia-500/10" />
                <div className="relative">
                  <div className="inline-flex rounded-2xl bg-white/5 p-3 text-cyan-300 ring-1 ring-white/10">
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold">{feature.title}</h3>
                  <p className="mt-3 leading-7" style={{ color: "var(--text-secondary)" }}>
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
