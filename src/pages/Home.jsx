import { useEffect, useMemo, useState } from "react";
import { FileDown } from "lucide-react";
import { jsPDF } from "jspdf";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import FeatureCards from "../components/FeatureCards";
import DNAInputForm from "../components/DNAInputForm";
import ResultCards from "../components/ResultCards";
import DPTableVisualization from "../components/DPTableVisualization";
import LCSVisualization from "../components/LCSVisualization";
import ChartsSection from "../components/ChartsSection";
import ComplexitySection from "../components/ComplexitySection";
import AlgorithmExplanation from "../components/AlgorithmExplanation";
import BioinformaticsUseCases from "../components/BioinformaticsUseCases";
import Footer from "../components/Footer";
import { sampleDNA } from "../data/sampleDNA";
import { computeLCS } from "../utils/lcsAlgorithm";
import {
  generateRandomDNA,
  getFrequencyData,
  sanitizeDNAInput,
  validateDNAInput,
} from "../utils/dnaGenerator";

const initialSequences = {
  sequence1: sampleDNA[0].sequence1,
  sequence2: sampleDNA[0].sequence2,
};

function downloadReport({ sequence1, sequence2, result }) {
  const pdf = new jsPDF();
  let y = 20;

  const addLine = (label, value) => {
    pdf.text(`${label}: ${value}`, 18, y);
    y += 10;
  };

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(20);
  pdf.text("DNA Sequence Matching using LCS", 18, y);
  y += 14;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  addLine("Sequence 1", sequence1);
  addLine("Sequence 2", sequence2);
  addLine("Longest Common Subsequence", result.lcs || "No common subsequence");
  addLine("LCS Length", result.lcsLength);
  addLine("Similarity Percentage", `${result.similarity}%`);
  addLine("Matching Characters", result.matchCount);
  addLine("Time Complexity", result.timeComplexity);
  addLine("Space Complexity", result.spaceComplexity);
  addLine("Rows Processed", result.rowSteps.length);
  addLine("DP Cells Evaluated", result.fillOrder.length);

  y += 4;
  pdf.setFont("helvetica", "bold");
  pdf.text("Recurrence Relation", 18, y);
  y += 10;
  pdf.setFont("helvetica", "normal");
  pdf.text("LCS[i][j] = 0 if i = 0 or j = 0", 22, y);
  y += 8;
  pdf.text("If X[i-1] == Y[j-1], LCS[i][j] = LCS[i-1][j-1] + 1", 22, y);
  y += 8;
  pdf.text("Else, LCS[i][j] = max(LCS[i-1][j], LCS[i][j-1])", 22, y);

  pdf.save("dna-lcs-report.pdf");
}

export default function Home() {
  const [theme, setTheme] = useState("dark");
  const [sequence1, setSequence1] = useState(initialSequences.sequence1);
  const [sequence2, setSequence2] = useState(initialSequences.sequence2);
  const [randomLength, setRandomLength] = useState(16);
  const [errors, setErrors] = useState({ sequence1: "", sequence2: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(() =>
    computeLCS(initialSequences.sequence1, initialSequences.sequence2)
  );

  useEffect(() => {
    document.body.dataset.theme = theme;
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const frequencyData = useMemo(
    () => getFrequencyData(sequence1, sequence2, result?.lcs ?? ""),
    [result?.lcs, sequence1, sequence2]
  );

  const comparisonData = useMemo(() => {
    if (!result) {
      return [];
    }

    return [
      { name: "Sequence 1", value: sequence1.length },
      { name: "Sequence 2", value: sequence2.length },
      { name: "LCS", value: result.lcsLength },
    ];
  }, [result, sequence1.length, sequence2.length]);

  function updateSequence(field, rawValue) {
    const sanitized = sanitizeDNAInput(rawValue);

    if (field === "sequence1") {
      setSequence1(sanitized);
    } else {
      setSequence2(sanitized);
    }

    setErrors((current) => ({
      ...current,
      [field]:
        rawValue && sanitized !== rawValue.toUpperCase().replace(/\s+/g, "")
          ? "Only A, T, C, and G are allowed. Invalid characters were removed."
          : "",
    }));
  }

  function compareSequences(first, second) {
    const nextErrors = {
      sequence1: validateDNAInput(first),
      sequence2: validateDNAInput(second),
    };

    setErrors(nextErrors);

    if (nextErrors.sequence1 || nextErrors.sequence2) {
      return;
    }

    setIsProcessing(true);
    window.setTimeout(() => {
      setResult(computeLCS(first, second));
      setIsProcessing(false);
    }, 750);
  }

  function handleGenerateRandom() {
    const nextSequence1 = generateRandomDNA(randomLength);
    const nextSequence2 = generateRandomDNA(randomLength);
    setSequence1(nextSequence1);
    setSequence2(nextSequence2);
    setErrors({ sequence1: "", sequence2: "" });
    compareSequences(nextSequence1, nextSequence2);
  }

  function handleClear() {
    setSequence1("");
    setSequence2("");
    setResult(null);
    setErrors({ sequence1: "", sequence2: "" });
  }

  function handleSampleLoad(sample) {
    setSequence1(sample.sequence1);
    setSequence2(sample.sequence2);
    setErrors({ sequence1: "", sequence2: "" });
    compareSequences(sample.sequence1, sample.sequence2);
  }

  const dashboardStats = [
    { label: "Samples Loaded", value: sampleDNA.length },
    { label: "Current Length", value: Math.max(sequence1.length, sequence2.length) },
    { label: "DP States", value: (sequence1.length + 1) * (sequence2.length + 1) },
  ];

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />

      <Navbar
        theme={theme}
        onToggleTheme={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
      />

      <main className="relative z-10 pb-10">
        <HeroSection />
        <FeatureCards />
        <DNAInputForm
          sequence1={sequence1}
          sequence2={sequence2}
          errors={errors}
          randomLength={randomLength}
          sampleDNA={sampleDNA}
          dashboardStats={dashboardStats}
          isProcessing={isProcessing}
          onRandomLengthChange={setRandomLength}
          onSequenceChange={updateSequence}
          onGenerateRandom={handleGenerateRandom}
          onCompare={() => compareSequences(sequence1, sequence2)}
          onClear={handleClear}
          onLoadSample={handleSampleLoad}
        />

        {result ? (
          <>
            <section className="px-4 pt-3 sm:px-6 lg:px-8">
              <div className="mx-auto flex max-w-7xl justify-end">
                <button
                  type="button"
                  onClick={() => downloadReport({ sequence1, sequence2, result })}
                  className="action-secondary"
                >
                  <FileDown size={18} />
                  Download Report
                </button>
              </div>
            </section>
            <ResultCards result={result} />
            <LCSVisualization result={result} sequence1={sequence1} sequence2={sequence2} />
            <DPTableVisualization result={result} sequence1={sequence1} sequence2={sequence2} />
            <ChartsSection
              result={result}
              frequencyData={frequencyData}
              comparisonData={comparisonData}
            />
          </>
        ) : null}

        <ComplexitySection />
        <AlgorithmExplanation />
        <BioinformaticsUseCases />
      </main>

      <Footer />
    </div>
  );
}
