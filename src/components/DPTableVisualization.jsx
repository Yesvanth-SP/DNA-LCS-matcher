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

          <div className="scrollbar-thin overflow-auto">
            <table className="min-w-full border-separate border-spacing-2 text-center text-sm">
              <thead>
                <tr>
                  <th className="rounded-2xl bg-white/5 px-4 py-3">0</th>
                  <th className="rounded-2xl bg-white/5 px-4 py-3">0</th>
                  {sequence2.split("").map((character, index) => (
                    <th key={`${character}-${index}`} className="rounded-2xl bg-white/5 px-4 py-3 text-cyan-200">
                      {character}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {result.table.map((row, rowIndex) => (
                  <tr key={`row-${rowIndex}`}>
                    <th className="rounded-2xl bg-white/5 px-4 py-3 text-cyan-200">
                      {rowIndex === 0 ? "0" : sequence1[rowIndex - 1]}
                    </th>

                    {row.map((cell, columnIndex) => {
                      if (rowIndex === 0 || columnIndex === 0) {
                        return (
                          <td
                            key={`${rowIndex}-${columnIndex}`}
                            className="rounded-2xl border bg-slate-950/25 px-4 py-3"
                            style={{ borderColor: "rgba(255,255,255,0.05)", color: "var(--text-secondary)" }}
                          >
                            {cell}
                          </td>
                        );
                      }

                      const id = `${rowIndex}-${columnIndex}`;
                      const step = visibleCells.get(id);
                      const isVisible = Boolean(step);
                      const isPath = finalPathSet.has(id);
                      const directionLabel = step?.direction === "diag" ? "diag" : step?.direction;

                      let cellClasses = "border-white/5 bg-slate-950/15";
                      let textColor = "var(--text-muted)";

                      if (isVisible && step?.type === "match") {
                        cellClasses = "border-cyan-300/30 bg-cyan-400/15";
                        textColor = "#e0f2fe";
                      } else if (isVisible) {
                        cellClasses = "border-violet-300/25 bg-violet-400/12";
                        textColor = "#ede9fe";
                      }

                      return (
                        <motion.td
                          key={id}
                          initial={{ opacity: 0.25, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`rounded-2xl border px-4 py-3 transition ${cellClasses} ${isPath ? "ring-2 ring-fuchsia-400/80" : ""}`}
                          style={{ color: textColor }}
                        >
                          <div className="flex flex-col items-center gap-1">
                            <span>{isVisible ? cell : "."}</span>
                            {isVisible ? (
                              <span className="text-[10px] uppercase tracking-[0.24em]" style={{ color: "var(--text-muted)" }}>
                                {directionLabel}
                              </span>
                            ) : null}
                          </div>
                        </motion.td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
