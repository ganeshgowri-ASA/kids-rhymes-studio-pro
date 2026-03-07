import { NextRequest, NextResponse } from 'next/server';
import { VOICE_CATALOG, getVoicesForLanguage, getVoicesByProvider } from '@/lib/tts/voice-catalog';
import type { TTSProviderType } from '@/lib/tts/provider';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const language = searchParams.get('language');
  const provider = searchParams.get('provider') as TTSProviderType | null;

  let voices = VOICE_CATALOG;

  if (language) {
    voices = getVoicesForLanguage(language);
  }

  if (provider) {
    voices = provider
      ? voices.filter((v) => v.provider === provider)
      : getVoicesByProvider(provider);
  }

  return NextResponse.json({
    voices,
    total: voices.length,
  });
}
