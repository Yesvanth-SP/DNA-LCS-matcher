import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const pieColors = ["#22d3ee", "#f472b6"];

function ChartCard({ title, children }) {
  return (
    <div className="glass-card p-5">
      <p className="font-display text-lg font-semibold">{title}</p>
      <div className="mt-4 h-72">{children}</div>
    </div>
  );
}

function tooltipStyle() {
  return {
    backgroundColor: "rgba(2, 6, 23, 0.92)",
    border: "1px solid rgba(103, 232, 249, 0.18)",
    borderRadius: "16px",
    color: "#f8fafc",
  };
}

export default function ChartsSection({ result, frequencyData, comparisonData }) {
  if (!result) {
    return null;
  }

  const similarityData = [
    { name: "Similarity", value: result.similarity },
    { name: "Remaining", value: Math.max(0, 100 - result.similarity) },
  ];

  const matchData = [
    { name: "Match", value: result.matchCount },
    { name: "Mismatch", value: result.mismatchCount },
  ];

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <p className="section-kicker">Analytics</p>
          <h2 className="section-heading mt-2">Charts and statistical insights</h2>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <ChartCard title="Similarity Percentage">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={similarityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.35} />
                <XAxis dataKey="name" stroke="#cbd5e1" />
                <YAxis stroke="#cbd5e1" />
                <Tooltip contentStyle={tooltipStyle()} />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} fill="#22d3ee" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Match vs Mismatch">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={matchData} dataKey="value" nameKey="name" outerRadius={100} innerRadius={55}>
                  {matchData.map((entry, index) => (
                    <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle()} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="LCS Length Comparison">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.35} />
                <XAxis dataKey="name" stroke="#cbd5e1" />
                <YAxis stroke="#cbd5e1" />
                <Tooltip contentStyle={tooltipStyle()} />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Character Frequency Graph">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={frequencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.35} />
                <XAxis dataKey="name" stroke="#cbd5e1" />
                <YAxis stroke="#cbd5e1" />
                <Tooltip contentStyle={tooltipStyle()} />
                <Legend />
                <Bar dataKey="sequence1" name="Sequence 1" radius={[8, 8, 0, 0]} fill="#22d3ee" />
                <Bar dataKey="sequence2" name="Sequence 2" radius={[8, 8, 0, 0]} fill="#a855f7" />
                <Bar dataKey="lcs" name="LCS" radius={[8, 8, 0, 0]} fill="#14b8a6" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </section>
  );
}
