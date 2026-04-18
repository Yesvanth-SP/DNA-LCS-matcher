export default function Footer() {
  return (
    <footer className="px-4 pb-10 pt-4 sm:px-6 lg:px-8">
      <div
        className="mx-auto max-w-7xl rounded-[28px] border px-6 py-5 text-sm"
        style={{
          borderColor: "var(--border-soft)",
          background: "rgba(255,255,255,0.05)",
          color: "var(--text-muted)",
        }}
      >
        DNA Sequence Matching using LCS. Built with React, Tailwind CSS, Framer Motion,
        Lucide React, Recharts, and jsPDF for a polished DAA mini project dashboard.
      </div>
    </footer>
  );
}
