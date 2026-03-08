import { Brain, Github } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border/50 mt-20 py-8">
    <div className="container flex flex-col sm:flex-row items-center justify-center gap-3 text-sm text-muted-foreground">
      <div className="flex items-center gap-1.5">
        <Brain className="h-4 w-4 text-primary" />
        <span className="font-semibold text-foreground">PaperMind AI</span>
      </div>
      <span className="hidden sm:inline">•</span>
      <span>Built by Gourav</span>
      <span className="hidden sm:inline">•</span>
      <span>Powered by Groq + Llama 3.3</span>
      <a
        href="#"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-foreground transition-colors"
        aria-label="GitHub"
      >
        <Github className="h-4 w-4" />
      </a>
    </div>
  </footer>
);

export default Footer;
