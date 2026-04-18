import { BadgeCheck, Gauge, Layers3, TimerReset } from "lucide-react";

const complexityCards = [
  {
    title: "Best Case",
    description: "The standard DP solution still evaluates the table, so the asymptotic running time remains the same.",
    value: "O(n x m)",
    icon: BadgeCheck,
  },
  {
    title: "Worst Case",
    description: "When sequences diverge heavily, every state is still considered to preserve the optimal answer.",
    value: "O(n x m)",
    icon: TimerReset,
  },
  {
    title: "Time Complexity",
    description: "Each state LCS[i][j] is computed once using previously solved prefix subproblems.",
    value: "O(n x m)",
    icon: Gauge,
  },
  {
    title: "Space Complexity",
    description: "The full DP table stores solutions for all prefix combinations across both input strings.",
    value: "O(n x m)",
    icon: Layers3,
  },
];

export default function ComplexitySection() {
  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <p className="section-kicker">Complexity</p>
          <h2 className="section-heading mt-2">Complexity analysis card set</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {complexityCards.map((card) => {
            const Icon = card.icon;

            return (
              <div key={card.title} className="glass-card p-6">
                <div className="w-fit rounded-2xl bg-cyan-400/10 p-3 text-cyan-300">
                  <Icon size={20} />
                </div>
                <p className="mt-5 text-sm" style={{ color: "var(--text-muted)" }}>
                  {card.title}
                </p>
                <p className="mt-2 font-display text-2xl font-bold">{card.value}</p>
                <p className="mt-3 leading-7" style={{ color: "var(--text-secondary)" }}>
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
