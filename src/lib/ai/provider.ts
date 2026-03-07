export type LLMProvider = 'groq' | 'openai' | 'anthropic' | 'gemini';
export interface LyricsRequest { theme: string; language: string; provider: LLMProvider; customPrompt?: string; }
export interface LyricsResponse { lyrics: string; title: string; language: string; }

const MOCK_LYRICS: Record<string, string> = {
  en: "Twinkle twinkle little star,\nHow I wonder what you are!\nUp above the world so high,\nLike a diamond in the sky.",
  hi: "\u091a\u0902\u0926\u093e \u092e\u093e\u092e\u093e \u0926\u0942\u0930 \u0915\u0947,\n\u092a\u0941\u0906 \u0939\u094b \u092c\u0921\u093c\u093e \u092e\u091c\u0947\u0926\u093e\u0930,\n\u0926\u0942\u0927 \u092e\u0932\u093e\u0908 \u0916\u093e\u0928\u093e \u0916\u0941\u0932\u093e,\n\u0938\u093e\u0930\u093e \u091c\u0917 \u0939\u094b \u0909\u091c\u093f\u092f\u093e\u0930\u093e.",
  te: "\u0c1a\u0c02\u0c26\u0c2e\u0c3e\u0c2e \u0c30\u0c3e\u0c35\u0c47,\n\u0c1a\u0c15\u0c4d\u0c15\u0c28\u0c3f \u0c2a\u0c3e\u0c32\u0c41 \u0c24\u0c47\u0c35\u0c47,\n\u0c1a\u0c41\u0c15\u0c4d\u0c15\u0c32\u0c41 \u0c2e\u0c46\u0c30\u0c3f\u0c38\u0c47,\n\u0c2e\u0c41\u0c26\u0c4d\u0c26\u0c41 \u0c2e\u0c41\u0c26\u0c4d\u0c26\u0c41\u0c17\u0c3e \u0c28\u0c35\u0c4d\u0c35\u0c47.",
};

export async function generateLyrics(req: LyricsRequest): Promise<LyricsResponse> {
  // Check for API keys, use mock if not available
  const hasKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
  if (!hasKey) {
    return { lyrics: MOCK_LYRICS[req.language] || MOCK_LYRICS.en, title: `${req.theme} Rhyme`, language: req.language };
  }
  // Real API call would go here
  return { lyrics: MOCK_LYRICS[req.language] || MOCK_LYRICS.en, title: `${req.theme} Rhyme`, language: req.language };
}
