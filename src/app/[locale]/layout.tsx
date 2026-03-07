import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { locales, type Locale } from '@/lib/i18n/config';
import { allFontVariables, localeFontClass } from '@/lib/i18n/fonts';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Kids Rhymes Studio Pro',
  description: 'AI-powered Kids Rhymes, Videos & Games Production Studio',
};

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params: { locale } }: LocaleLayoutProps) {
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();
  const fontClass = localeFontClass[locale as Locale];

  return (
    <html lang={locale} className={allFontVariables}>
      <body
        className={`${fontClass} min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50`}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
