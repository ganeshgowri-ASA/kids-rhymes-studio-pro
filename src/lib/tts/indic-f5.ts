import type { TTSProvider, TTSRequest, TTSResult } from './provider';

const INDIC_LANGUAGE_MAP: Record<string, string> = {
  hi: 'hindi',
  te: 'telugu',
  ta: 'tamil',
  bn: 'bengali',
  gu: 'gujarati',
  kn: 'kannada',
};

const HF_API_URL = 'https://api-inference.huggingface.co/models/ai4bharat/IndicF5';

export class IndicF5Provider implements TTSProvider {
  readonly name = 'indicf5' as const;
  readonly supportedLanguages = ['hi', 'te', 'ta', 'bn', 'gu', 'kn'];

  private get apiKey(): string | undefined {
    return process.env.HUGGINGFACE_API_KEY;
  }

  isAvailable(): boolean {
    return !!this.apiKey;
  }

  async synthesize(request: TTSRequest): Promise<TTSResult> {
    const apiKey = this.apiKey;
    if (!apiKey) {
      throw new Error('HUGGINGFACE_API_KEY is not configured');
    }

    const indicLang = INDIC_LANGUAGE_MAP[request.language];
    if (!indicLang) {
      throw new Error(`Language ${request.language} is not supported by IndicF5`);
    }

    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: request.text,
        parameters: {
          language: indicLang,
          speaker: request.voiceId || 'default',
          speed: request.speed || 1.0,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`IndicF5 API error (${response.status}): ${error}`);
    }

    const audioBuffer = await response.arrayBuffer();

    return {
      audio: audioBuffer,
      contentType: 'audio/wav',
    };
  }
}
