import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Settings, ChevronDown, ChevronUp, Trash2 } from "lucide-react";

interface ApiKeySetupProps {
  onKeyChange: (saved: boolean) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const ApiKeySetup = ({ onKeyChange, open: controlledOpen, onOpenChange }: ApiKeySetupProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [key, setKey] = useState("");
  const [saved, setSaved] = useState(false);

  const isOpen = controlledOpen ?? internalOpen;
  const setOpen = (v: boolean) => {
    setInternalOpen(v);
    onOpenChange?.(v);
  };

  useEffect(() => {
    const existing = localStorage.getItem("groq_api_key");
    if (existing) {
      setSaved(true);
      onKeyChange(true);
    }
  }, [onKeyChange]);

  // Sync controlled open prop
  useEffect(() => {
    if (controlledOpen !== undefined) {
      setInternalOpen(controlledOpen);
    }
  }, [controlledOpen]);

  const handleSave = () => {
    if (!key.trim()) return;
    localStorage.setItem("groq_api_key", key.trim());
    setSaved(true);
    onKeyChange(true);
    setKey("");
  };

  const handleClear = () => {
    localStorage.removeItem("groq_api_key");
    setSaved(false);
    onKeyChange(false);
  };

  return (
    <div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(!isOpen)}
        className="rounded-full gap-1.5 text-muted-foreground"
      >
        <Settings className="h-4 w-4" />
        Setup
        {isOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </Button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full border-b border-border bg-card/95 backdrop-blur-sm z-40 animate-fade-in">
          <div className="container flex items-center gap-3 py-3">
            <label className="text-sm font-medium text-foreground whitespace-nowrap">
              Groq API Key
            </label>
            <Input
              type="password"
              placeholder="gsk_..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="max-w-xs h-8 text-sm"
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
            <Button size="sm" onClick={handleSave} className="h-8">
              Save Key
            </Button>
            {saved && (
              <>
                <Badge className="bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/30 hover:bg-green-500/15">
                  ✅ API Key saved
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="h-8 text-destructive hover:text-destructive gap-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiKeySetup;
