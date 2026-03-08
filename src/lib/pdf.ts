declare global {
  interface Window {
    pdfjsLib: any;
  }
}

export async function loadPdfJs(): Promise<void> {
  if (window.pdfjsLib) return;
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      resolve();
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export interface PdfResult {
  text: string;
  pages: number;
  fileName: string;
}

export async function extractPdfText(
  file: File,
  onProgress?: (pct: number) => void
): Promise<PdfResult> {
  await loadPdfJs();
  const buffer = await file.arrayBuffer();
  const pdf = await window.pdfjsLib.getDocument({ data: buffer }).promise;
  const totalPages = pdf.numPages;
  const parts: string[] = [];

  for (let i = 1; i <= totalPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map((item: any) => item.str).join(" ");
    parts.push(text);
    onProgress?.(Math.round((i / totalPages) * 100));
  }

  let fullText = parts.join("\n");
  if (fullText.length > 12000) {
    fullText = fullText.slice(0, 12000);
  }

  return { text: fullText, pages: totalPages, fileName: file.name };
}
