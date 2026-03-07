import type { TTSProviderType } from './provider';

export interface VoiceEntry {
  id: string;
  name: string;
  language: string;
  provider: TTSProviderType;
  gender: 'male' | 'female' | 'neutral';
  style: 'child' | 'adult' | 'narrator';
  sampleUrl?: string;
}

export const VOICE_CATALOG: VoiceEntry[] = [
  // Hindi voices
  { id: 'hi-indicf5-female', name: 'Ananya', language: 'hi', provider: 'indicf5', gender: 'female', style: 'narrator' },
  { id: 'hi-indicf5-male', name: 'Arjun', language: 'hi', provider: 'indicf5', gender: 'male', style: 'narrator' },
  { id: 'hi-IN-Wavenet-A', name: 'Priya (Google)', language: 'hi', provider: 'google', gender: 'female', style: 'adult' },
  { id: 'hi-IN-Wavenet-B', name: 'Rahul (Google)', language: 'hi', provider: 'google', gender: 'male', style: 'adult' },
  { id: 'hi-coqui-female', name: 'Kavya (Coqui)', language: 'hi', provider: 'coqui', gender: 'female', style: 'narrator' },

  // Telugu voices
  { id: 'te-indicf5-female', name: 'Lakshmi', language: 'te', provider: 'indicf5', gender: 'female', style: 'narrator' },
  { id: 'te-indicf5-male', name: 'Venkat', language: 'te', provider: 'indicf5', gender: 'male', style: 'narrator' },
  { id: 'te-IN-Standard-A', name: 'Sravya (Google)', language: 'te', provider: 'google', gender: 'female', style: 'adult' },
  { id: 'te-coqui-female', name: 'Padma (Coqui)', language: 'te', provider: 'coqui', gender: 'female', style: 'narrator' },

  // Tamil voices
  { id: 'ta-indicf5-female', name: 'Meena', language: 'ta', provider: 'indicf5', gender: 'female', style: 'narrator' },
  { id: 'ta-indicf5-male', name: 'Karthik', language: 'ta', provider: 'indicf5', gender: 'male', style: 'narrator' },
  { id: 'ta-IN-Wavenet-A', name: 'Divya (Google)', language: 'ta', provider: 'google', gender: 'female', style: 'adult' },
  { id: 'ta-coqui-female', name: 'Selvi (Coqui)', language: 'ta', provider: 'coqui', gender: 'female', style: 'narrator' },

  // Bengali voices
  { id: 'bn-indicf5-female', name: 'Arundhati', language: 'bn', provider: 'indicf5', gender: 'female', style: 'narrator' },
  { id: 'bn-indicf5-male', name: 'Sourav', language: 'bn', provider: 'indicf5', gender: 'male', style: 'narrator' },
  { id: 'bn-IN-Wavenet-A', name: 'Riya (Google)', language: 'bn', provider: 'google', gender: 'female', style: 'adult' },
  { id: 'bn-coqui-female', name: 'Moumita (Coqui)', language: 'bn', provider: 'coqui', gender: 'female', style: 'narrator' },

  // Gujarati voices
  { id: 'gu-indicf5-female', name: 'Hetal', language: 'gu', provider: 'indicf5', gender: 'female', style: 'narrator' },
  { id: 'gu-indicf5-male', name: 'Jay', language: 'gu', provider: 'indicf5', gender: 'male', style: 'narrator' },
  { id: 'gu-IN-Wavenet-A', name: 'Krisha (Google)', language: 'gu', provider: 'google', gender: 'female', style: 'adult' },
  { id: 'gu-coqui-female', name: 'Nisha (Coqui)', language: 'gu', provider: 'coqui', gender: 'female', style: 'narrator' },

  // Kannada voices
  { id: 'kn-indicf5-female', name: 'Suma', language: 'kn', provider: 'indicf5', gender: 'female', style: 'narrator' },
  { id: 'kn-indicf5-male', name: 'Ganesh', language: 'kn', provider: 'indicf5', gender: 'male', style: 'narrator' },
  { id: 'kn-IN-Wavenet-A', name: 'Deepa (Google)', language: 'kn', provider: 'google', gender: 'female', style: 'adult' },
  { id: 'kn-coqui-female', name: 'Vidya (Coqui)', language: 'kn', provider: 'coqui', gender: 'female', style: 'narrator' },

  // English voices
  { id: 'en-US-Wavenet-D', name: 'Emily (Google)', language: 'en', provider: 'google', gender: 'female', style: 'narrator' },
  { id: 'en-US-Wavenet-B', name: 'James (Google)', language: 'en', provider: 'google', gender: 'male', style: 'adult' },
  { id: 'en-coqui-female', name: 'Sarah (Coqui)', language: 'en', provider: 'coqui', gender: 'female', style: 'narrator' },
  { id: 'en-coqui-male', name: 'Oliver (Coqui)', language: 'en', provider: 'coqui', gender: 'male', style: 'narrator' },
];

export function getVoicesForLanguage(language: string): VoiceEntry[] {
  return VOICE_CATALOG.filter((v) => v.language === language);
}

export function getVoicesByProvider(provider: TTSProviderType): VoiceEntry[] {
  return VOICE_CATALOG.filter((v) => v.provider === provider);
}

export function getVoiceById(id: string): VoiceEntry | undefined {
  return VOICE_CATALOG.find((v) => v.id === id);
}

export function getAvailableLanguages(): string[] {
  return [...new Set(VOICE_CATALOG.map((v) => v.language))];
}
