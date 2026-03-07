import { NextRequest } from 'next/server';
import { streamLyrics, type LyricsRequest } from '@/lib/ai/provider';

export async function POST(req: NextRequest) {
  try {
    const body: LyricsRequest = await req.json();

    if (!body.theme || !body.language || !body.provider) {
      return new Response(JSON.stringify({ error: 'Missing required fields: theme, language, provider' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamLyrics(body)) {
            controller.enqueue(encoder.encode(chunk));
          }
          controller.close();
        } catch {
          controller.enqueue(encoder.encode('\n\n[Error generating lyrics. Please try again.]'));
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
    return new Response(JSON.stringify({ error: 'Failed to generate lyrics' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
