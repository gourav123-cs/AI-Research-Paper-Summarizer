import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface ReAnalyzeBannerProps {
  targetMode: "expert" | "eli5";
  onConfirm: () => void;
  onCancel: () => void;
}

const ReAnalyzeBanner = ({ targetMode, onConfirm, onCancel }: ReAnalyzeBannerProps) => (
  <div className="bg-accent border-b border-border py-3 animate-fade-in">
    <div className="container flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
      <span className="text-foreground font-medium text-center">
        Switch to {targetMode === "eli5" ? "ELI5" : "Expert"} mode? This will re-analyze your paper.
      </span>
      <div className="flex gap-2">
        <Button size="sm" variant="gradient" className="gap-1.5 min-h-[44px]" onClick={onConfirm}>
          <Sparkles className="h-3.5 w-3.5" />
          Re-Analyze
        </Button>
        <Button size="sm" variant="outline" className="min-h-[44px]" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  </div>
);

export default ReAnalyzeBanner;
