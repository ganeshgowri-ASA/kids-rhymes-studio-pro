import type { TTSProvider, TTSRequest, TTSResult } from './provider';

const COQUI_LANGUAGE_MAP: Record<string, string> = {
  en: 'en',
  hi: 'hi',
  te: 'te',
  ta: 'ta',
  bn: 'bn',
  gu: 'gu',
  kn: 'kn',
};

export class CoquiProvider implements TTSProvider {
  readonly name = 'coqui' as const;
  readonly supportedLanguages = Object.keys(COQUI_LANGUAGE_MAP);

  private get apiUrl(): string {
    return process.env.COQUI_API_URL || 'http://localhost:5002';
  }

  private get apiKey(): string | undefined {
    return process.env.COQUI_API_KEY;
  }

  isAvailable(): boolean {
    return !!process.env.COQUI_API_URL || !!this.apiKey;
  }

  async synthesize(request: TTSRequest): Promise<TTSResult> {
    const lang = COQUI_LANGUAGE_MAP[request.language];
    if (!lang) {
      throw new Error(`Language ${request.language} is not supported by Coqui XTTS`);
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const response = await fetch(`${this.apiUrl}/api/tts`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        text: request.text,
        language: lang,
        speaker_wav: request.voiceId || undefined,
        speed: request.speed || 1.0,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Coqui XTTS error (${response.status}): ${error}`);
    }

    const audioBuffer = await response.arrayBuffer();

    return {
      audio: audioBuffer,
      contentType: 'audio/wav',
    };
  }
}
