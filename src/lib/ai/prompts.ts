export const THEMES = [
  { id: 'animals', label: 'Animals', emoji: '\uD83D\uDC3B' },
  { id: 'colors', label: 'Colors', emoji: '\uD83C\uDF08' },
  { id: 'numbers', label: 'Numbers', emoji: '\uD83D\uDD22' },
  { id: 'family', label: 'Family', emoji: '\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67\u200D\uD83D\uDC66' },
  { id: 'nature', label: 'Nature', emoji: '\uD83C\uDF33' },
  { id: 'festivals', label: 'Festivals', emoji: '\uD83C\uDF86' },
  { id: 'food', label: 'Food', emoji: '\uD83C\uDF5B' },
  { id: 'transport', label: 'Transport', emoji: '\uD83D\uDE8C' },
  { id: 'body', label: 'Body Parts', emoji: '\uD83D\uDC4B' },
  { id: 'seasons', label: 'Seasons', emoji: '\u2600\uFE0F' },
] as const;

export type ThemeId = (typeof THEMES)[number]['id'];

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  hi: 'Hindi',
  te: 'Telugu',
  ta: 'Tamil',
  bn: 'Bengali',
  gu: 'Gujarati',
  kn: 'Kannada',
};

export function buildRhymePrompt(theme: string, language: string): string {
  const langName = LANGUAGE_NAMES[language] ?? 'English';
  return RHYME_GENERATION
    .replace('{theme}', theme)
    .replace('{language}', langName);
}

export function buildTranslationPrompt(lyrics: string, targetLanguage: string): string {
  const langName = LANGUAGE_NAMES[targetLanguage] ?? 'English';
  return TRANSLATION
    .replace('{lyrics}', lyrics)
    .replace('{targetLanguage}', langName);
}

export function buildExtensionPrompt(lyrics: string, theme: string): string {
  return EXTENSION
    .replace('{lyrics}', lyrics)
    .replace('{theme}', theme);
}

export const RHYME_GENERATION = `Write a fun, educational nursery rhyme for young children (ages 2-8) about "{theme}" in {language}.

Requirements:
- 8-12 lines total, split into 2-3 stanzas
- Simple vocabulary appropriate for children
- Strong rhythm and rhyming pattern (AABB or ABAB)
- Include repetition for easy memorization
- Positive, cheerful message
- Culturally appropriate references (Indian context when applicable)
- Educational elements woven into the rhyme

Output ONLY the rhyme text, no titles or explanations.`;

export const TRANSLATION = `Translate the following children's rhyme into {targetLanguage}.

Important:
- Keep the same rhythm and rhyming pattern as much as possible
- Use simple, child-friendly vocabulary
- Maintain the educational content and positive message
- Use culturally appropriate equivalents where needed
- Output ONLY the translated rhyme, no explanations

Original rhyme:
{lyrics}`;

export const EXTENSION = `Continue this children's rhyme about "{theme}" with 4-6 more lines.

Important:
- Match the same rhythm, meter, and rhyming pattern
- Keep the same tone and vocabulary level
- Add new educational content related to the theme
- Output ONLY the new lines, no explanations

Existing rhyme:
{lyrics}`;
