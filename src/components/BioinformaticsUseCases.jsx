import { Dna, HeartPulse, Microscope, ScanSearch } from "lucide-react";

const useCases = [
  {
    title: "DNA Sequence Comparison",
    description: "Identify conserved base patterns between biological samples and reference data.",
    icon: Dna,
  },
  {
    title: "Mutation Detection",
    description: "Reveal where insertions and deletions disrupt expected matches within the strands.",
    icon: ScanSearch,
  },
  {
    title: "Genetic Similarity Analysis",
    description: "Estimate closeness between two genomes using their longest ordered common pattern.",
    icon: Microscope,
  },
  {
    title: "Disease Research",
    description: "Track recurring markers that may correlate with disease-linked sequence regions.",
    icon: HeartPulse,
  },
];

export default function BioinformaticsUseCases() {
  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <p className="section-kicker">Applications</p>
          <h2 className="section-heading mt-2">Bioinformatics use cases</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {useCases.map((useCase) => {
            const Icon = useCase.icon;

            return (
              <div key={useCase.title} className="glass-card p-6">
                <div className="w-fit rounded-2xl bg-white/5 p-3 text-cyan-300">
                  <Icon size={20} />
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold">{useCase.title}</h3>
                <p className="mt-3 leading-7" style={{ color: "var(--text-secondary)" }}>
                  {useCase.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
