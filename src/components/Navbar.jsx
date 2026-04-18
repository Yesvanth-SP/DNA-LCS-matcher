import { Dna, MoonStar, ScanSearch, SunMedium } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar({ theme, onToggleTheme }) {
  const isDark = theme === "dark";

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="glass-card flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-cyan-400/12 p-3 text-cyan-300 ring-1 ring-cyan-200/20">
              <Dna size={22} />
            </div>
            <div>
              <p className="font-display text-lg font-bold">DNA Sequence Matching</p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Longest Common Subsequence Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="hidden items-center gap-2 rounded-full border px-3 py-2 text-xs sm:flex"
              style={{ borderColor: "var(--border-soft)", color: "var(--text-secondary)" }}
            >
              <ScanSearch size={14} className="text-cyan-300" />
              Premium bioinformatics workflow
            </div>
            <button type="button" onClick={onToggleTheme} className="action-secondary !rounded-full !px-4 !py-2">
              {isDark ? <SunMedium size={16} /> : <MoonStar size={16} />}
              {isDark ? "Light" : "Dark"}
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
