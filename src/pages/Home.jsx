import { useEffect, useState } from "react";
import { FileDown } from "lucide-react";
import { jsPDF } from "jspdf";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import FeatureCards from "../components/FeatureCards";
import DNAInputForm from "../components/DNAInputForm";
import ResultCards from "../components/ResultCards";
import DPTableVisualization from "../components/DPTableVisualization";
import LCSVisualization from "../components/LCSVisualization";
import ComplexitySection from "../components/ComplexitySection";
import AlgorithmExplanation from "../components/AlgorithmExplanation";
import BioinformaticsUseCases from "../components/BioinformaticsUseCases";
import Footer from "../components/Footer";
import { sampleDNA } from "../data/sampleDNA";
import { computeLCS } from "../utils/lcsAlgorithm";
import {
  generateRandomDNA,
  sanitizeDNAInput,
  validateDNAInput,
} from "../utils/dnaGenerator";
import { fetchComparison, fetchHealth, fetchRandomSequences, fetchSamples } from "../utils/api";

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
  const [apiStatus, setApiStatus] = useState("Checking API");
  const [samples, setSamples] = useState(sampleDNA);
  const [result, setResult] = useState(() =>
    computeLCS(initialSequences.sequence1, initialSequences.sequence2)
  );

  useEffect(() => {
    document.body.dataset.theme = theme;
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    let isMounted = true;

    async function loadInitialApiState() {
      try {
        const [healthPayload, samplesPayload] = await Promise.all([fetchHealth(), fetchSamples()]);

        if (!isMounted) {
          return;
        }

        setApiStatus(healthPayload.ok ? "API Online" : "API Offline");
        setSamples(samplesPayload.samples?.length ? samplesPayload.samples : sampleDNA);
      } catch {
        if (!isMounted) {
          return;
        }

        setApiStatus("Frontend Fallback");
        setSamples(sampleDNA);
      }
    }

    loadInitialApiState();

    return () => {
      isMounted = false;
    };
  }, []);

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

  async function compareSequences(first, second) {
    const nextErrors = {
      sequence1: validateDNAInput(first),
      sequence2: validateDNAInput(second),
    };

    setErrors(nextErrors);

    if (nextErrors.sequence1 || nextErrors.sequence2) {
      return;
    }

    setIsProcessing(true);

    try {
      const payload = await fetchComparison(first, second);
      setResult(payload.result);
      setApiStatus("API Online");
    } catch (error) {
      const apiErrors = error?.payload?.errors;

      if (apiErrors?.sequence1 || apiErrors?.sequence2) {
        setErrors(apiErrors);
      } else {
        setResult(computeLCS(first, second));
        setApiStatus("Frontend Fallback");
      }
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleGenerateRandom() {
    try {
      const payload = await fetchRandomSequences(randomLength);
      setSequence1(payload.sequence1);
      setSequence2(payload.sequence2);
      setErrors({ sequence1: "", sequence2: "" });
      await compareSequences(payload.sequence1, payload.sequence2);
      setApiStatus("API Online");
    } catch {
      const nextSequence1 = generateRandomDNA(randomLength);
      const nextSequence2 = generateRandomDNA(randomLength);
      setSequence1(nextSequence1);
      setSequence2(nextSequence2);
      setErrors({ sequence1: "", sequence2: "" });
      await compareSequences(nextSequence1, nextSequence2);
      setApiStatus("Frontend Fallback");
    }
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
    { label: "Samples Loaded", value: samples.length },
    { label: "Current Length", value: Math.max(sequence1.length, sequence2.length) },
    { label: "DP States", value: (sequence1.length + 1) * (sequence2.length + 1) },
    { label: "Backend Status", value: apiStatus },
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
          sampleDNA={samples}
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
