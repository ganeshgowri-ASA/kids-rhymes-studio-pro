import {
  Inter,
  Noto_Sans_Devanagari,
  Noto_Sans_Telugu,
  Noto_Sans_Tamil,
  Noto_Sans_Bengali,
  Noto_Sans_Gujarati,
  Noto_Sans_Kannada,
} from 'next/font/google';
import type { Locale } from './config';

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  variable: '--font-devanagari',
  display: 'swap',
});

export const notoSansTelugu = Noto_Sans_Telugu({
  subsets: ['telugu'],
  variable: '--font-telugu',
  display: 'swap',
});

export const notoSansTamil = Noto_Sans_Tamil({
  subsets: ['tamil'],
  variable: '--font-tamil',
  display: 'swap',
});

export const notoSansBengali = Noto_Sans_Bengali({
  subsets: ['bengali'],
  variable: '--font-bengali',
  display: 'swap',
});

export const notoSansGujarati = Noto_Sans_Gujarati({
  subsets: ['gujarati'],
  variable: '--font-gujarati',
  display: 'swap',
});

export const notoSansKannada = Noto_Sans_Kannada({
  subsets: ['kannada'],
  variable: '--font-kannada',
  display: 'swap',
});

export const allFontVariables = [
  inter.variable,
  notoSansDevanagari.variable,
  notoSansTelugu.variable,
  notoSansTamil.variable,
  notoSansBengali.variable,
  notoSansGujarati.variable,
  notoSansKannada.variable,
].join(' ');

export const localeFontClass: Record<Locale, string> = {
  en: inter.className,
  hi: notoSansDevanagari.className,
  te: notoSansTelugu.className,
  ta: notoSansTamil.className,
  bn: notoSansBengali.className,
  gu: notoSansGujarati.className,
  kn: notoSansKannada.className,
};
