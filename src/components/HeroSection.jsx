import { ArrowDownRight, Cpu, Dna, Microscope, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const helixRows = Array.from({ length: 14 }, (_, index) => index);

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pb-8 pt-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200"
          >
            <Sparkles size={16} />
            Design and Analysis of Algorithms mini project
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mt-6 max-w-4xl font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
          >
            DNA Sequence Matching using{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-pink-400 bg-clip-text text-transparent">
              Longest Common Subsequence
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mt-6 max-w-2xl text-lg leading-8"
            style={{ color: "var(--text-secondary)" }}
          >
            Compare DNA strands with Dynamic Programming, visualize the full DP matrix,
            trace the final subsequence, and present similarity insights in a polished
            bioinformatics-style dashboard.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <a href="#dashboard" className="action-primary">
              Start Matching
              <ArrowDownRight size={18} />
            </a>
            <a href="#theory" className="action-secondary">
              View DAA Theory
            </a>
          </motion.div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Algorithm", value: "Dynamic Programming", icon: Cpu },
              { label: "Data Type", value: "DNA Sequences", icon: Dna },
              { label: "Use Case", value: "Genetic Analysis", icon: Microscope },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="glass-card px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-fuchsia-400/10 p-2.5 text-fuchsia-300">
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                      {label}
                    </p>
                    <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
                      {value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.12 }}
          className="relative"
        >
          <div className="glass-card relative overflow-hidden p-8">
            <div className="dna-grid absolute inset-0 opacity-25" />
            <div className="absolute -left-20 top-8 h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="absolute -right-16 bottom-10 h-40 w-40 rounded-full bg-fuchsia-500/10 blur-3xl" />

            <div className="relative min-h-[440px]">
              <div className="absolute right-0 top-0 rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-cyan-200">
                Live Sequence Model
              </div>

              <div className="flex h-full items-center justify-center">
                <div className="w-full max-w-md">
                  {helixRows.map((index) => (
                    <motion.div
                      key={index}
                      animate={{ x: index % 2 === 0 ? [0, 18, 0] : [0, -18, 0] }}
                      transition={{
                        duration: 3.2 + index * 0.15,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="mb-4 flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <span className="h-2.5 w-20 rounded-full bg-gradient-to-r from-cyan-300 to-sky-400" />
                        <span className="text-xs font-semibold tracking-[0.25em] text-cyan-200">
                          {index % 2 === 0 ? "A-T" : "C-G"}
                        </span>
                      </span>
                      <span className="h-px flex-1 bg-white/15" />
                      <span className="flex items-center gap-2">
                        <span className="text-xs font-semibold tracking-[0.25em] text-fuchsia-200">
                          {index % 2 === 0 ? "T-A" : "G-C"}
                        </span>
                        <span className="h-2.5 w-20 rounded-full bg-gradient-to-r from-fuchsia-400 to-cyan-300" />
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
