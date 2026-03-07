import { NextRequest } from 'next/server';
import { streamLyrics, type LLMProvider } from '@/lib/ai/provider';

interface TranslateRequest {
  lyrics: string;
  targetLanguage: string;
  provider: LLMProvider;
}

export async function POST(req: NextRequest) {
  try {
    const body: TranslateRequest = await req.json();

    if (!body.lyrics || !body.targetLanguage || !body.provider) {
      return new Response(JSON.stringify({ error: 'Missing required fields: lyrics, targetLanguage, provider' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { buildTranslationPrompt } = await import('@/lib/ai/prompts');
    const prompt = buildTranslationPrompt(body.lyrics, body.targetLanguage);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamLyrics({
            theme: 'translation',
            language: body.targetLanguage,
            provider: body.provider,
            customPrompt: prompt,
          })) {
            controller.enqueue(encoder.encode(chunk));
          }
          controller.close();
        } catch {
          controller.enqueue(encoder.encode('\n\n[Error translating. Please try again.]'));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Failed to translate lyrics' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
