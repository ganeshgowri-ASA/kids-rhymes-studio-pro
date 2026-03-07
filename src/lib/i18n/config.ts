export const locales = ['en', 'hi', 'te', 'ta', 'bn', 'gu', 'kn'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export interface LocaleMetadata {
  code: Locale;
  name: string;
  nativeName: string;
  script: string;
  direction: 'ltr' | 'rtl';
}

export const localeMetadata: Record<Locale, LocaleMetadata> = {
  en: { code: 'en', name: 'English', nativeName: 'English', script: 'Latin', direction: 'ltr' },
  hi: { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', script: 'Devanagari', direction: 'ltr' },
  te: { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', script: 'Telugu', direction: 'ltr' },
  ta: { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', script: 'Tamil', direction: 'ltr' },
  bn: { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', script: 'Bengali', direction: 'ltr' },
  gu: { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', script: 'Gujarati', direction: 'ltr' },
  kn: { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', script: 'Kannada', direction: 'ltr' },
};
