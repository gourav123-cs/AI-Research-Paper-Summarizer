import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clipboard, Check, Download } from "lucide-react";
import type { AnalysisResult } from "@/lib/groq";

const cardMeta = [
  { emoji: "🎯", title: "Problem Statement", key: "problem" as const },
  { emoji: "⚙️", title: "Methodology", key: "methodology" as const },
  { emoji: "📊", title: "Results & Findings", key: "results" as const },
  { emoji: "⚠️", title: "Limitations & Future Work", key: "limitations" as const },
];

const difficultyColor: Record<string, string> = {
  Beginner: "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/30 hover:bg-green-500/15",
  Intermediate: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/15",
  Advanced: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30 hover:bg-red-500/15",
};

interface ResultsSectionProps {
  visible: boolean;
  data?: AnalysisResult | null;
  isLoading?: boolean;
  mode?: "expert" | "eli5";
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="absolute top-4 right-4 p-1.5 rounded-md hover:bg-muted transition-colors min-w-[28px] min-h-[28px] flex items-center justify-center"
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-500" />
      ) : (
        <Clipboard className="h-3.5 w-3.5 text-muted-foreground" />
      )}
    </button>
  );
}

function downloadSummary(data: AnalysisResult, mode: string) {
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
  const content = `═══════════════════════════════
PAPERMIND AI — RESEARCH SUMMARY
Mode: ${mode === "eli5" ? "ELI5" : "Expert"}
Date: ${date}
═══════════════════════════════

🎯 PROBLEM:
${data.problem}

⚙️ METHODOLOGY:
${data.methodology}

📊 RESULTS & FINDINGS:
${data.results}

⚠️ LIMITATIONS & FUTURE WORK:
${data.limitations}

💡 KEY TAKEAWAY:
${data.takeaway}

🏷️ KEYWORDS: ${data.keywords.join(", ")}
📊 DIFFICULTY: ${data.difficulty}
`;
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const dateStr = new Date().toISOString().split("T")[0];
  a.href = url;
  a.download = `PaperMind_Summary_${dateStr}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

const ResultsSection = ({ visible, data, isLoading, mode }: ResultsSectionProps) => {
  if (!visible) return null;

  return (
    <section className="max-w-2xl mx-auto mt-12 space-y-6">
      {/* Header */}
      {data && (
        <div className="text-center" style={{ animation: "fadeIn 0.5s ease both" }}>
          <h2 className="text-lg font-bold font-display text-foreground">
            ✨ Here's your breakdown
          </h2>
        </div>
      )}

      {/* Difficulty badge */}
      {data?.difficulty && (
        <div className="flex justify-center" style={{ animation: "fadeIn 0.4s ease 100ms both" }}>
          <Badge className={difficultyColor[data.difficulty] ?? ""}>
            {data.difficulty}
          </Badge>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cardMeta.map((card, i) => (
          <Card
            key={card.key}
            className="shadow-card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-[3px] relative"
            style={data ? { animation: `fadeIn 0.4s ease ${i * 150 + 200}ms both` } : undefined}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold font-display flex items-center gap-2">
                <span>{card.emoji}</span>
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading || !data ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full animate-pulse-soft" />
                  <Skeleton className="h-4 w-4/5 animate-pulse-soft" />
                  <Skeleton className="h-4 w-3/5 animate-pulse-soft" />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground leading-relaxed pr-6">
                  {data[card.key]}
                </p>
              )}
            </CardContent>
            {data && !isLoading && <CopyButton text={data[card.key]} />}
          </Card>
        ))}
      </div>

      {/* Key Takeaway */}
      <Card
        className="shadow-card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-[3px] border-primary/20 relative"
        style={data ? { animation: "fadeIn 0.4s ease 800ms both" } : undefined}
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold font-display flex items-center gap-2">
            <span>💡</span>
            Key Takeaway
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading || !data ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full animate-pulse-soft" />
              <Skeleton className="h-4 w-2/3 animate-pulse-soft" />
            </div>
          ) : (
            <p className="text-sm text-foreground font-medium leading-relaxed pr-6">
              {data.takeaway}
            </p>
          )}
        </CardContent>
        {data && !isLoading && <CopyButton text={data.takeaway} />}
      </Card>

      {/* Keywords */}
      {data?.keywords && data.keywords.length > 0 && (
        <div
          className="flex flex-wrap justify-center gap-2"
          style={{ animation: "fadeIn 0.4s ease 950ms both" }}
        >
          {data.keywords.map((kw) => (
            <Badge
              key={kw}
              className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/15"
            >
              {kw}
            </Badge>
          ))}
        </div>
      )}

      {/* Download */}
      {data && !isLoading && (
        <div className="flex justify-center" style={{ animation: "fadeIn 0.4s ease 1100ms both" }}>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 min-h-[44px]"
            onClick={() => downloadSummary(data, mode || "expert")}
          >
            <Download className="h-4 w-4" />
            Download Summary
          </Button>
        </div>
      )}
    </section>
  );
};

export default ResultsSection;
