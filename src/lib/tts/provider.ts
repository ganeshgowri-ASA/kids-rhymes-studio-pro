export type TTSProviderType = 'indicf5' | 'coqui' | 'google' | 'browser';

export interface TTSRequest {
  text: string;
  language: string;
  voiceId?: string;
  speed?: number;
  pitch?: number;
}

export interface TTSResult {
  audio: ArrayBuffer;
  contentType: string;
  duration?: number;
  wordTimings?: WordTiming[];
}

export interface WordTiming {
  word: string;
  startTime: number;
  endTime: number;
}

export interface TTSProvider {
  readonly name: TTSProviderType;
  readonly supportedLanguages: string[];
  synthesize(request: TTSRequest): Promise<TTSResult>;
  isAvailable(): boolean;
}

export function createTTSProvider(type: TTSProviderType): TTSProvider {
  switch (type) {
    case 'indicf5': {
      const { IndicF5Provider } = require('./indic-f5');
      return new IndicF5Provider();
    }
    case 'coqui': {
      const { CoquiProvider } = require('./coqui-client');
      return new CoquiProvider();
    }
    case 'google': {
      const { GoogleTTSProvider } = require('./google-tts');
      return new GoogleTTSProvider();
    }
    case 'browser': {
      const { BrowserTTSProvider } = require('./browser-tts');
      return new BrowserTTSProvider();
    }
    default:
      throw new Error(`Unknown TTS provider: ${type}`);
  }
}

const PROVIDER_PRIORITY: TTSProviderType[] = ['indicf5', 'coqui', 'google', 'browser'];

export function getAvailableProvider(language?: string): TTSProvider {
  for (const type of PROVIDER_PRIORITY) {
    try {
      const provider = createTTSProvider(type);
      if (!provider.isAvailable()) continue;
      if (language && !provider.supportedLanguages.includes(language)) continue;
      return provider;
    } catch {
      continue;
    }
  }
  throw new Error('No TTS provider available');
}

export async function synthesizeSpeech(request: TTSRequest): Promise<TTSResult> {
  const provider = getAvailableProvider(request.language);
  return provider.synthesize(request);
}
