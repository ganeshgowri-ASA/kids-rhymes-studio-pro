import OpenAI from 'openai';

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
}

export async function generateWithOpenAI(prompt: string): Promise<string> {
  const openai = getClient();
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are a creative children\'s rhyme writer. Write fun, educational, age-appropriate rhymes.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.8,
    max_tokens: 1024,
  });
  return completion.choices[0]?.message?.content ?? '';
}

export async function* streamWithOpenAI(prompt: string): AsyncGenerator<string> {
  const openai = getClient();
  const stream = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
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
