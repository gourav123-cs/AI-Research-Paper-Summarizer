import type { AnalysisResult } from "@/lib/groq";
import { FileText } from "lucide-react";

export interface HistoryEntry {
  id: string;
  text: string;
  mode: "expert" | "eli5";
  result: AnalysisResult;
  timestamp: number;
}

function timeAgo(ts: number) {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

interface SessionHistoryProps {
  entries: HistoryEntry[];
  onRestore: (entry: HistoryEntry) => void;
}

const SessionHistory = ({ entries, onRestore }: SessionHistoryProps) => (
  <div className="max-w-2xl mx-auto mt-10 space-y-3" style={{ animation: "fadeIn 0.4s ease both" }}>
    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
      Recent
    </p>
    <div className="flex flex-wrap gap-2">
      {entries.map((entry) => (
        <button
          key={entry.id}
          onClick={() => onRestore(entry)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors text-sm text-foreground min-h-[44px]"
        >
          <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
          <span className="truncate max-w-[180px]">
            {entry.text.slice(0, 30)}…
          </span>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {entry.mode === "eli5" ? "ELI5" : "Expert"} • {timeAgo(entry.timestamp)}
          </span>
        </button>
      ))}
    </div>
  </div>
);

export default SessionHistory;
