import { useState, useEffect, useRef, useCallback } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import UploadZone from "@/components/UploadZone";
import ResultsSection from "@/components/ResultsSection";
import Footer from "@/components/Footer";
import ApiKeyWarning from "@/components/ApiKeyWarning";
import ReAnalyzeBanner from "@/components/ReAnalyzeBanner";
import SessionHistory, { type HistoryEntry } from "@/components/SessionHistory";
import { analyzeWithGroq, type AnalysisResult } from "@/lib/groq";

const Index = () => {
  const [mode, setMode] = useState<"expert" | "eli5">("expert");
  const [apiKeySaved, setApiKeySaved] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [lastText, setLastText] = useState("");
  const [pendingMode, setPendingMode] = useState<"expert" | "eli5" | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setApiKeySaved(!!localStorage.getItem("groq_api_key"));
    const saved = sessionStorage.getItem("papermind_history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const handleApiKeyChange = useCallback((saved: boolean) => {
    setApiKeySaved(saved);
  }, []);

  const handleClear = useCallback(() => {
    setResult(null);
    setError(null);
    setLastText("");
  }, []);

  const saveToHistory = (text: string, m: "expert" | "eli5", data: AnalysisResult) => {
    const entry: HistoryEntry = {
      id: Date.now().toString(),
      text,
      mode: m,
      result: data,
      timestamp: Date.now(),
    };
    setHistory((prev) => {
      const next = [entry, ...prev].slice(0, 3);
      sessionStorage.setItem("papermind_history", JSON.stringify(next));
      return next;
    });
  };

  const handleAnalyze = async (text: string) => {
    setError(null);
    setResult(null);
    setLastText(text);
    setIsAnalyzing(true);
    try {
      const data = await analyzeWithGroq(text, mode);
      setResult(data);
      saveToHistory(text, mode, data);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleModeChange = (newMode: "expert" | "eli5") => {
    if (result && lastText && newMode !== mode) {
      setPendingMode(newMode);
    } else {
      setMode(newMode);
    }
  };

  const handleReAnalyze = async () => {
    if (!pendingMode) return;
    setMode(pendingMode);
    setPendingMode(null);
    setError(null);
    setResult(null);
    setIsAnalyzing(true);
    try {
      const data = await analyzeWithGroq(lastText, pendingMode);
      setResult(data);
      saveToHistory(lastText, pendingMode, data);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRestoreHistory = (entry: HistoryEntry) => {
    setMode(entry.mode);
    setResult(entry.result);
    setLastText(entry.text);
    setError(null);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header
        onApiKeyChange={handleApiKeyChange}
        settingsOpen={settingsOpen}
        onSettingsOpenChange={setSettingsOpen}
      />
      {!apiKeySaved && <ApiKeyWarning onOpenSettings={() => setSettingsOpen(true)} />}
      {pendingMode && (
        <ReAnalyzeBanner
          targetMode={pendingMode}
          onConfirm={handleReAnalyze}
          onCancel={() => setPendingMode(null)}
        />
      )}
      <main className="flex-1 container pb-8">
        <HeroSection mode={mode} onModeChange={handleModeChange} />
        <UploadZone onAnalyze={handleAnalyze} onClear={handleClear} isAnalyzing={isAnalyzing} error={error} />
        <div ref={resultsRef}>
          <ResultsSection visible={isAnalyzing || !!result} data={result} isLoading={isAnalyzing} mode={mode} />
        </div>
        {history.length > 0 && (
          <SessionHistory entries={history} onRestore={handleRestoreHistory} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
