import type { TTSProvider, TTSRequest, TTSResult } from './provider';

const BROWSER_LANGUAGE_MAP: Record<string, string> = {
  en: 'en-US',
  hi: 'hi-IN',
  te: 'te-IN',
  ta: 'ta-IN',
  bn: 'bn-IN',
  gu: 'gu-IN',
  kn: 'kn-IN',
};

export class BrowserTTSProvider implements TTSProvider {
  readonly name = 'browser' as const;
  readonly supportedLanguages = Object.keys(BROWSER_LANGUAGE_MAP);

  isAvailable(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  async synthesize(request: TTSRequest): Promise<TTSResult> {
    if (!this.isAvailable()) {
      throw new Error('Web Speech API is not available');
    }

    const lang = BROWSER_LANGUAGE_MAP[request.language] || 'en-US';

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(request.text);
      utterance.lang = lang;
      utterance.rate = request.speed || 1.0;
      utterance.pitch = request.pitch || 1.0;

      if (request.voiceId) {
        const voices = window.speechSynthesis.getVoices();
        const voice = voices.find((v) => v.voiceURI === request.voiceId);
        if (voice) utterance.voice = voice;
      }

      utterance.onend = () => {
        resolve({
          audio: new ArrayBuffer(0),
          contentType: 'audio/browser',
        });
      };

      utterance.onerror = (event) => {
        reject(new Error(`Browser TTS error: ${event.error}`));
      };

      window.speechSynthesis.speak(utterance);
    });
  }
}

export function getBrowserVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return [];
  }
  return window.speechSynthesis.getVoices();
}

export function getBrowserVoicesForLanguage(langCode: string): SpeechSynthesisVoice[] {
  const bcp47 = BROWSER_LANGUAGE_MAP[langCode];
  if (!bcp47) return [];
  return getBrowserVoices().filter((v) => v.lang.startsWith(bcp47.split('-')[0]));
}
