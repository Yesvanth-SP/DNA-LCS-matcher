import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { PauseCircle, PlayCircle, Rabbit, Route, Rows3 } from "lucide-react";

export default function DPTableVisualization({ result, sequence1, sequence2 }) {
  const [visibleStep, setVisibleStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(220);
  const [stepMode, setStepMode] = useState("cell");

  const fillOrder = result?.fillOrder ?? [];
  const rowSteps = result?.rowSteps ?? [];

  const finalPathSet = useMemo(() => new Set(result?.path.map((cell) => `${cell.i}-${cell.j}`)), [result]);

  useEffect(() => {
    setVisibleStep(0);
    setIsPlaying(true);
  }, [result, stepMode]);

  useEffect(() => {
    const totalSteps = stepMode === "cell" ? fillOrder.length : rowSteps.length;

    if (!isPlaying || totalSteps === 0 || visibleStep >= totalSteps) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setVisibleStep((current) => Math.min(current + 1, totalSteps));
    }, speed);

    return () => window.clearTimeout(timer);
  }, [fillOrder.length, isPlaying, rowSteps.length, speed, stepMode, visibleStep]);

  if (!result) {
    return null;
  }

  const visibleCells = new Map();

  if (stepMode === "cell") {
    fillOrder.slice(0, visibleStep).forEach((step) => {
      visibleCells.set(`${step.i}-${step.j}`, step);
    });
  } else {
    rowSteps.slice(0, visibleStep).forEach((rowStep) => {
      rowStep.cells.forEach((step) => {
        visibleCells.set(`${step.i}-${step.j}`, step);
      });
    });
  }

  const totalSteps = stepMode === "cell" ? fillOrder.length : rowSteps.length;

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-kicker">DP Matrix</p>
            <h2 className="section-heading mt-2">Step-by-step table construction</h2>
          </div>

          <div className="glass-card flex flex-wrap items-center gap-3 px-4 py-3">
            <button type="button" onClick={() => setIsPlaying((current) => !current)} className="action-secondary !px-4 !py-2 text-sm">
              {isPlaying ? <PauseCircle size={16} /> : <PlayCircle size={16} />}
              {isPlaying ? "Pause" : "Play"}
            </button>

            <button
              type="button"
              onClick={() => setStepMode((current) => (current === "cell" ? "row" : "cell"))}
              className="action-secondary !px-4 !py-2 text-sm"
            >
              <Rows3 size={16} />
              {stepMode === "cell" ? "Row Mode" : "Cell Mode"}
            </button>

            <div className="flex items-center gap-3">
              <Rabbit size={16} className="text-cyan-300" />
              <input
                type="range"
                min="80"
                max="700"
                step="20"
                value={speed}
                onChange={(event) => setSpeed(Number(event.target.value))}
                className="w-36 accent-cyan-400"
              />
            </div>
          </div>
        </div>

        <div className="glass-card overflow-hidden p-5">
          <div className="mb-5 grid gap-4 lg:grid-cols-2">
            <div className="rounded-[24px] border border-cyan-300/20 bg-cyan-400/10 p-4">
              <p className="text-sm font-semibold text-cyan-100">Match = Diagonal + 1</p>
              <p className="mt-2 text-sm leading-6" style={{ color: "var(--text-secondary)" }}>
                If the characters match, use <code>dp[i-1][j-1] + 1</code>. That means move
                diagonally and add 1.
              </p>
            </div>
            <div className="rounded-[24px] border border-violet-300/20 bg-violet-400/10 p-4">
              <p className="text-sm font-semibold text-violet-100">Mismatch = max(Top, Left)</p>
              <p className="mt-2 text-sm leading-6" style={{ color: "var(--text-secondary)" }}>
                If the characters do not match, use <code>max(dp[i-1][j], dp[i][j-1])</code>.
                Take the maximum of top or left, not the diagonal.
              </p>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-4 text-sm" style={{ color: "var(--text-secondary)" }}>
            <span className="inline-flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-cyan-300" />
              Matching cell
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-violet-400" />
              Inherited maximum
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-fuchsia-400" />
              Final LCS path
            </span>
            <span className="inline-flex items-center gap-2">
              <Route size={16} className="text-fuchsia-300" />
              Visible steps: {visibleStep}/{totalSteps}
            </span>
          </div>

          <div className="mb-4 rounded-[24px] border border-white/10 bg-white/5 p-4 text-sm leading-7" style={{ color: "var(--text-secondary)" }}>
            <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
              Dynamic Programming Table dp[i][j]
            </p>
            <p className="mt-1">
              <code>dp[i][j]</code> = length of LCS for <code>S1[0...i-1]</code> and <code>S2[0...j-1]</code>
            </p>
          </div>

          <div className="scrollbar-thin overflow-auto rounded-[28px] border border-slate-300/20 bg-[#f8fafc] p-4 shadow-inner">
            <table className="dp-notebook-table min-w-full text-center text-sm">
              <thead>
                <tr>
                  <th className="dp-label-cell">S2 →</th>
                  <th className="dp-header-cell">0</th>
                  {sequence2.split("").map((character, index) => (
                    <th key={`${character}-${index}`} className="dp-header-cell">
                      {character}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {result.table.map((row, rowIndex) => (
                  <tr key={`row-${rowIndex}`}>
                    <th className={`dp-label-cell ${rowIndex === 0 ? "font-semibold" : ""}`}>
                      {rowIndex === 0 ? "S1 ↓" : sequence1[rowIndex - 1]}
                    </th>

                    {row.map((cell, columnIndex) => {
                      if (rowIndex === 0 || columnIndex === 0) {
                        return (
                          <td
                            key={`${rowIndex}-${columnIndex}`}
                            className="dp-base-cell"
                          >
                            {cell}
                          </td>
                        );
                      }

                      const id = `${rowIndex}-${columnIndex}`;
                      const step = visibleCells.get(id);
                      const isVisible = Boolean(step);
                      const isPath = finalPathSet.has(id);
                      const isMatch = step?.type === "match";
                      const cellClasses = [
                        "dp-base-cell",
                        isVisible ? "dp-cell-visible" : "dp-cell-hidden",
                        isMatch ? "dp-cell-match" : "",
                        isPath ? "dp-cell-path" : "",
                      ]
                        .filter(Boolean)
                        .join(" ");

                      return (
                        <motion.td
                          key={id}
                          initial={{ opacity: 0.25, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={cellClasses}
                        >
                          <span>{isVisible ? cell : "."}</span>
                        </motion.td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-6 text-sm" style={{ color: "var(--text-secondary)" }}>
            <span className="inline-flex items-center gap-2">
              <span className="h-6 w-6 rounded border-2 border-slate-900 bg-white" />
              Match cell boxed like diagonal + 1
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-1 w-10 rounded-full bg-amber-500" />
              Traceback path
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
