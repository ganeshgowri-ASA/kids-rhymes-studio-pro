import Anthropic from '@anthropic-ai/sdk';

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

export async function generateWithAnthropic(prompt: string): Promise<string> {
  const anthropic = getClient();
  const message = await anthropic.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: 1024,
    system: 'You are a creative children\'s rhyme writer. Write fun, educational, age-appropriate rhymes.',
    messages: [{ role: 'user', content: prompt }],
  });
  const block = message.content[0];
  return block.type === 'text' ? block.text : '';
}

export async function* streamWithAnthropic(prompt: string): AsyncGenerator<string> {
  const anthropic = getClient();
  const stream = anthropic.messages.stream({
    model: 'claude-3-haiku-20240307',
    max_tokens: 1024,
    system: 'You are a creative children\'s rhyme writer. Write fun, educational, age-appropriate rhymes.',
    messages: [{ role: 'user', content: prompt }],
  });
  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      yield event.delta.text;
    }
  }
}
