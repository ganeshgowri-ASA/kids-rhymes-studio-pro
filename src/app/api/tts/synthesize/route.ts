import { NextRequest, NextResponse } from 'next/server';
import { createTTSProvider, getAvailableProvider } from '@/lib/tts/provider';
import type { TTSProviderType, TTSRequest } from '@/lib/tts/provider';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, language, voiceId, speed, pitch, provider } = body as TTSRequest & {
      provider?: TTSProviderType;
    };

    if (!text || !language) {
      return NextResponse.json(
        { error: 'Missing required fields: text, language' },
        { status: 400 }
      );
    }

    if (text.length > 5000) {
      return NextResponse.json(
        { error: 'Text exceeds maximum length of 5000 characters' },
        { status: 400 }
      );
    }

    let ttsProvider;
    try {
      ttsProvider = provider
        ? createTTSProvider(provider)
        : getAvailableProvider(language);
    } catch {
      return NextResponse.json(
        {
          status: 'browser_tts',
          message: 'No server-side TTS provider available. Use browser TTS as fallback.',
        },
        { status: 200 }
      );
    }

    if (!ttsProvider.isAvailable()) {
      return NextResponse.json(
        {
          status: 'browser_tts',
          message: `Provider ${ttsProvider.name} is not configured. Use browser TTS as fallback.`,
        },
        { status: 200 }
      );
    }

    const result = await ttsProvider.synthesize({ text, language, voiceId, speed, pitch });

    return new NextResponse(result.audio, {
      status: 200,
      headers: {
        'Content-Type': result.contentType,
        'X-TTS-Provider': ttsProvider.name,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'TTS synthesis failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
