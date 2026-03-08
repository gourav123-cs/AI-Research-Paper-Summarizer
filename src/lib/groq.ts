export interface AnalysisResult {
  problem: string;
  methodology: string;
  results: string;
  limitations: string;
  takeaway: string;
  keywords: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

const EXPERT_PROMPT = `You are an expert ML/AI research analyst. Analyze the given research paper or abstract and return ONLY a valid JSON object with no markdown, no backticks, no extra text. Use exactly these keys:

{
  "problem": "2-3 sentences on the core problem",
  "methodology": "2-3 sentences on methods/approach",
  "results": "2-3 sentences on key findings and metrics",
  "limitations": "2-3 sentences on limitations and future work",
  "takeaway": "1 crisp sentence — the most important thing",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "difficulty": "Beginner" or "Intermediate" or "Advanced"
}

Return ONLY the raw JSON object. Absolutely nothing else.`;

const ELI5_PROMPT = `You are explaining a research paper to a curious 12-year-old who loves science. Return ONLY a valid JSON object with no markdown, no backticks, no extra text. Use exactly these keys:

{
  "problem": "Explain the problem using a fun real-world analogy a kid would understand",
  "methodology": "How did they solve it? Use simple words and a comparison to something familiar",
  "results": "What did they discover? Make it sound exciting!",
  "limitations": "What couldn't they do yet? Keep it simple",
  "takeaway": "One sentence a kid could tell their parents at dinner",
  "keywords": ["simple word 1", "simple word 2", "simple word 3", "simple word 4", "simple word 5"],
  "difficulty": "Beginner"
}

Return ONLY the raw JSON object. Absolutely nothing else.`;

export async function analyzeWithGroq(
  paperText: string,
  mode: "expert" | "eli5"
): Promise<AnalysisResult> {
  const apiKey = localStorage.getItem("groq_api_key");

  const payload = {
    model: "llama-3.3-70b-versatile",
    temperature: 0.3,
    max_tokens: 1500,
    messages: [
      { role: "system", content: mode === "expert" ? EXPERT_PROMPT : ELI5_PROMPT },
      { role: "user", content: paperText },
    ],
  };

  let response: Response;
  try {
    if (apiKey) {
      // BYOK: call Groq directly with user's key
      response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } else {
      // Demo mode: call our Vercel serverless proxy
      response = await fetch("/api/groq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
  } catch {
    throw new Error("API error — check your connection and try again");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const msg = errorData?.error?.message || errorData?.error || "API error — try again";
    throw new Error(typeof msg === "string" ? msg : "API error — try again");
  }

  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content ?? "";

  // Strip markdown fences
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned) as AnalysisResult;
  } catch {
    throw new Error("Couldn't parse response — try again");
  }
}
