import { Upload, Loader2, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useRef, useState, useCallback } from "react";
import { extractPdfText } from "@/lib/pdf";
import { toast } from "sonner";

const SAMPLE_ABSTRACT = `We present BERT: Bidirectional Encoder Representations from Transformers. BERT is designed to pre-train deep bidirectional representations from unlabeled text by jointly conditioning on both left and right context in all layers. As a result, the pre-trained BERT model can be fine-tuned with just one additional output layer to create state-of-the-art models for a wide range of tasks, such as question answering and language inference, without substantial task-specific architecture modifications. BERT is conceptually simple and empirically powerful. It obtains new state-of-the-art results on eleven natural language processing tasks, including pushing the GLUE score to 80.5% (7.7% point absolute improvement), MultiNLI accuracy to 86.7% (4.6% absolute improvement), SQuAD v1.1 question answering Test F1 to 93.2 (1.5 point absolute improvement) and SQuAD v2.0 Test F1 to 83.1 (5.1 point absolute improvement).`;

interface UploadZoneProps {
  onAnalyze: (text: string) => void;
  onClear: () => void;
  isAnalyzing: boolean;
  error: string | null;
}

const UploadZone = ({ onAnalyze, onClear, isAnalyzing, error }: UploadZoneProps) => {
  const [text, setText] = useState("");
  const [pdfInfo, setPdfInfo] = useState<{ fileName: string; pages: number } | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [shakeError, setShakeError] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const charCount = text.length;
  const hasContent = text.trim().length > 0 || !!pdfInfo;

  const handlePdf = useCallback(async (file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are supported");
      return;
    }
    setExtracting(true);
    setProgress(0);
    try {
      const result = await extractPdfText(file, setProgress);
      setText(result.text);
      setPdfInfo({ fileName: result.fileName, pages: result.pages });
    } catch {
      toast.error("Failed to extract PDF text");
    } finally {
      setExtracting(false);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handlePdf(file);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handlePdf(file);
    },
    [handlePdf]
  );

  const handleClear = () => {
    setText("");
    setPdfInfo(null);
    setProgress(0);
    onClear();
  };

  const handleClick = () => {
    if (!text.trim()) {
      setShakeError(true);
      setTimeout(() => setShakeError(false), 600);
      return;
    }
    onAnalyze(text.trim());
  };

  return (
    <section className="max-w-2xl mx-auto space-y-4">
      {/* Drop zone */}
      <div
        onClick={() => !extracting && fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl h-[180px] flex flex-col items-center justify-center cursor-pointer transition-all bg-accent/30 hover:bg-accent/50 ${
          dragging
            ? "border-primary animate-pulse shadow-lg shadow-primary/20"
            : "border-primary/30 hover:border-primary/60"
        }`}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleFileChange}
        />
        {extracting ? (
          <div className="w-3/4 space-y-3 text-center">
            <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto" />
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground">Extracting text… {progress}%</p>
          </div>
        ) : pdfInfo ? (
          <div className="text-center space-y-2">
            <Badge className="bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/30 hover:bg-green-500/15">
              ✅ {pdfInfo.fileName} — {pdfInfo.pages} pages extracted
            </Badge>
            <p className="text-xs text-muted-foreground">
              📄 {pdfInfo.pages} pages • {charCount.toLocaleString()} characters
            </p>
          </div>
        ) : (
          <>
            <Upload className="h-10 w-10 text-primary/60 mb-3" />
            <p className="text-sm font-medium text-foreground">
              Drag & drop your PDF here
            </p>
            <p className="text-xs text-primary mt-1 font-medium">
              or click to browse
            </p>
          </>
        )}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
          OR
        </span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Textarea */}
      <div className="relative">
        <Textarea
          rows={6}
          placeholder="Paste abstract or paper text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className={`resize-none text-sm pr-16 transition-all ${
            shakeError ? "border-destructive animate-[shake_0.4s_ease-in-out]" : ""
          }`}
        />
        {hasContent && (
          <button
            onClick={handleClear}
            className="absolute top-2 right-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors bg-muted/80 rounded-md px-2 py-1"
          >
            <X className="h-3 w-3" /> Clear
          </button>
        )}
      </div>

      {/* Character counter & warnings */}
      <div className="flex items-center justify-between text-xs px-1">
        <div>
          {shakeError && !text.trim() && (
            <span className="text-destructive font-medium">Add paper text first</span>
          )}
          {text.trim().length > 0 && text.trim().length < 150 && (
            <span className="text-yellow-600 dark:text-yellow-400 font-medium">
              Text too short — paste more of the paper for better results
            </span>
          )}
        </div>
        <span className={charCount > 10000 ? "text-orange-500 font-medium" : "text-muted-foreground"}>
          {charCount.toLocaleString()} characters
          {charCount > 10000 && " (will be trimmed to 12,000)"}
        </span>
      </div>

      {/* CTA */}
      <Button
        variant="gradient"
        size="lg"
        className={`w-full text-base font-semibold h-12 rounded-xl min-h-[48px] ${
          isAnalyzing ? "animate-pulse" : ""
        }`}
        onClick={handleClick}
        disabled={isAnalyzing || extracting}
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Analyzing...
          </>
        ) : (
          "✨ Analyze Paper"
        )}
      </Button>

      {/* Error banner */}
      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive text-center">
          {error}
        </div>
      )}

      {/* Sample paper */}
      {!hasContent && (
        <button
          onClick={() => setText(SAMPLE_ABSTRACT)}
          className="flex items-center gap-1.5 mx-auto text-sm text-primary hover:text-primary/80 font-medium transition-colors"
        >
          <Sparkles className="h-4 w-4" />
          Try Sample Paper
        </button>
      )}
    </section>
  );
};

export default UploadZone;
