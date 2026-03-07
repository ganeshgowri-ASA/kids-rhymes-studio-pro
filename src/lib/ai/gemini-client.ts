import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY ?? '');
  }
  return genAI;
}

export async function generateWithGemini(prompt: string): Promise<string> {
  const ai = getClient();
  const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent(
    `You are a creative children's rhyme writer. Write fun, educational, age-appropriate rhymes.\n\n${prompt}`
  );
  return result.response.text();
}

export async function* streamWithGemini(prompt: string): AsyncGenerator<string> {
  const ai = getClient();
  const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContentStream(
    `You are a creative children's rhyme writer. Write fun, educational, age-appropriate rhymes.\n\n${prompt}`
  );
  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) yield text;
  }
}
