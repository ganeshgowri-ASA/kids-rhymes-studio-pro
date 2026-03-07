import Groq from 'groq-sdk';

let client: Groq | null = null;

function getClient(): Groq {
  if (!client) {
    client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return client;
}

export async function generateWithGroq(prompt: string): Promise<string> {
  const groq = getClient();
  const completion = await groq.chat.completions.create({
    model: 'llama-3.1-70b-versatile',
    messages: [
      { role: 'system', content: 'You are a creative children\'s rhyme writer. Write fun, educational, age-appropriate rhymes.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.8,
    max_tokens: 1024,
  });
  return completion.choices[0]?.message?.content ?? '';
}

export async function* streamWithGroq(prompt: string): AsyncGenerator<string> {
  const groq = getClient();
  const stream = await groq.chat.completions.create({
    model: 'llama-3.1-70b-versatile',
    messages: [
      { role: 'system', content: 'You are a creative children\'s rhyme writer. Write fun, educational, age-appropriate rhymes.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.8,
    max_tokens: 1024,
    stream: true,
  });
  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content;
    if (delta) yield delta;
  }
}
