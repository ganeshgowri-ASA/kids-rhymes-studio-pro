import type { TTSProvider, TTSRequest, TTSResult } from './provider';

const GOOGLE_LANGUAGE_MAP: Record<string, { code: string; voice: string }> = {
  en: { code: 'en-US', voice: 'en-US-Wavenet-D' },
  hi: { code: 'hi-IN', voice: 'hi-IN-Wavenet-A' },
  te: { code: 'te-IN', voice: 'te-IN-Standard-A' },
  ta: { code: 'ta-IN', voice: 'ta-IN-Wavenet-A' },
  bn: { code: 'bn-IN', voice: 'bn-IN-Wavenet-A' },
  gu: { code: 'gu-IN', voice: 'gu-IN-Wavenet-A' },
  kn: { code: 'kn-IN', voice: 'kn-IN-Wavenet-A' },
};

const GOOGLE_TTS_API = 'https://texttospeech.googleapis.com/v1/text:synthesize';

export class GoogleTTSProvider implements TTSProvider {
  readonly name = 'google' as const;
  readonly supportedLanguages = Object.keys(GOOGLE_LANGUAGE_MAP);

  private get apiKey(): string | undefined {
    return process.env.GOOGLE_TTS_API_KEY;
  }

  isAvailable(): boolean {
    return !!this.apiKey;
  }

  async synthesize(request: TTSRequest): Promise<TTSResult> {
    const apiKey = this.apiKey;
    if (!apiKey) {
      throw new Error('GOOGLE_TTS_API_KEY is not configured');
    }

    const langConfig = GOOGLE_LANGUAGE_MAP[request.language];
    if (!langConfig) {
      throw new Error(`Language ${request.language} is not supported by Google TTS`);
    }

    const voiceName = request.voiceId || langConfig.voice;

    const response = await fetch(`${GOOGLE_TTS_API}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: { text: request.text },
        voice: {
          languageCode: langConfig.code,
          name: voiceName,
        },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: request.speed || 1.0,
          pitch: request.pitch || 0,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Google TTS error (${response.status}): ${error}`);
    }

    const data = await response.json();
    const audioBytes = Uint8Array.from(atob(data.audioContent), (c) => c.charCodeAt(0));

    return {
      audio: audioBytes.buffer,
      contentType: 'audio/mp3',
    };
  }
}
