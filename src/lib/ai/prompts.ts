export const THEMES = [
  { id: 'animals', label: 'Animals', emoji: '\ud83d\udc3b' },
  { id: 'colors', label: 'Colors', emoji: '\ud83c\udf08' },
  { id: 'numbers', label: 'Numbers', emoji: '\ud83d\udd22' },
  { id: 'family', label: 'Family', emoji: '\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d\udc66' },
  { id: 'nature', label: 'Nature', emoji: '\ud83c\udf33' },
  { id: 'festivals', label: 'Festivals', emoji: '\ud83c\udf86' },
  { id: 'food', label: 'Food', emoji: '\ud83c\udf5b' },
  { id: 'transport', label: 'Transport', emoji: '\ud83d\ude8c' },
  { id: 'body', label: 'Body Parts', emoji: '\ud83d\udc4b' },
  { id: 'seasons', label: 'Seasons', emoji: '\u2600\ufe0f' },
];
export const RHYME_PROMPT = (theme: string, lang: string) =>
  `Generate a fun, educational nursery rhyme for kids about "${theme}" in ${lang}. Make it 4-8 lines, with simple words, good rhythm, and a positive message. Include repetition for easy memorization.`;
