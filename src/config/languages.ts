export interface LanguageConfig {
  code: string;
  name: string;
  nativeName: string;
  script: string;
  flag: string;
  font: string;
}

export const LANGUAGES: LanguageConfig[] = [
  { code: 'en', name: 'English', nativeName: 'English', script: 'Latin', flag: '🇬🇧', font: 'Inter' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', script: 'Devanagari', flag: '🇮🇳', font: 'Noto Sans Devanagari' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', script: 'Telugu', flag: '🇮🇳', font: 'Noto Sans Telugu' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', script: 'Tamil', flag: '🇮🇳', font: 'Noto Sans Tamil' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', script: 'Bengali', flag: '🇮🇳', font: 'Noto Sans Bengali' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', script: 'Gujarati', flag: '🇮🇳', font: 'Noto Sans Gujarati' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', script: 'Kannada', flag: '🇮🇳', font: 'Noto Sans Kannada' },
];

export const DEFAULT_LANGUAGE = 'en';

export const getLanguageByCode = (code: string): LanguageConfig | undefined =>
  LANGUAGES.find((lang) => lang.code === code);

export const SUPPORTED_LOCALES = LANGUAGES.map((l) => l.code);
