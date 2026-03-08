import { Brain, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import ApiKeySetup from "./ApiKeySetup";

interface HeaderProps {
  onApiKeyChange: (saved: boolean) => void;
  settingsOpen?: boolean;
  onSettingsOpenChange?: (open: boolean) => void;
}

const Header = ({ onApiKeyChange, settingsOpen, onSettingsOpenChange }: HeaderProps) => {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50 relative">
      <div className="container flex items-center justify-between py-3 md:py-4">
        <div>
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 md:h-7 md:w-7 text-primary" />
            <span className="text-lg md:text-xl font-bold font-display tracking-tight text-foreground">
              PaperMind
            </span>
            <span className="gradient-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-md">
              AI
            </span>
          </div>
          <p className="hidden md:block text-xs text-muted-foreground mt-0.5 ml-9">
            Understand any research paper in seconds
          </p>
        </div>
        <div className="flex items-center gap-1 md:gap-2">
          <ApiKeySetup
            onKeyChange={onApiKeyChange}
            open={settingsOpen}
            onOpenChange={onSettingsOpenChange}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDark(!dark)}
            className="rounded-full"
          >
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
