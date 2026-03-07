'use client';

import { useCallback } from 'react';
import { useAppStore } from '@/store/app-store';
import { useRhymesStore } from '@/store/rhymes-store';
import { LANGUAGES } from '@/config/languages';
import type { LLMProvider } from '@/lib/ai/provider';
import ThemeSelector from '@/components/rhymes/ThemeSelector';
import RhymeEditor from '@/components/rhymes/RhymeEditor';
import RhymeLibrary from '@/components/rhymes/RhymeLibrary';
import { Sparkles, Copy, Save, Trash2, ArrowLeft, Languages } from 'lucide-react';

const PROVIDERS: { id: LLMProvider; label: string }[] = [
  { id: 'groq', label: 'Groq (Llama 3.1)' },
  { id: 'openai', label: 'OpenAI (GPT-4o-mini)' },
  { id: 'anthropic', label: 'Anthropic (Claude Haiku)' },
  { id: 'gemini', label: 'Google (Gemini Flash)' },
];

export default function RhymesPage() {
  const { language, setLanguage } = useAppStore();
  const {
    currentLyrics, currentTitle, theme, provider, isGenerating,
    setLyrics, appendLyrics, setTitle, setTheme, setProvider,
    setGenerating, saveRhyme, clearCurrent,
  } = useRhymesStore();

  const generate = useCallback(async () => {
    if (!theme || isGenerating) return;
    setGenerating(true);
    setLyrics('');
    setTitle('');

    try {
      const res = await fetch('/api/lyrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme, language, provider }),
      });

      if (!res.ok || !res.body) {
        setLyrics('Error generating lyrics. Please try again.');
        setGenerating(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        appendLyrics(chunk);
      }

      const firstLine = fullText.split('\n')[0]?.trim() || '';
      setTitle(firstLine.replace(/^#+\s*/, '') || `${theme} Rhyme`);
    } catch {
      setLyrics('Error generating lyrics. Please try again.');
    }
    setGenerating(false);
  }, [theme, language, provider, isGenerating, setGenerating, setLyrics, setTitle, appendLyrics]);

  const translate = useCallback(async (targetLang: string) => {
    if (!currentLyrics.trim() || isGenerating) return;
    setGenerating(true);
    const originalLyrics = currentLyrics;
    setLyrics('');

    try {
      const res = await fetch('/api/lyrics/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lyrics: originalLyrics, targetLanguage: targetLang, provider }),
      });

      if (!res.ok || !res.body) {
        setLyrics(originalLyrics);
        setGenerating(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        appendLyrics(decoder.decode(value, { stream: true }));
      }

      setLanguage(targetLang);
    } catch {
      setLyrics(originalLyrics);
    }
    setGenerating(false);
  }, [currentLyrics, provider, isGenerating, setGenerating, setLyrics, appendLyrics, setLanguage]);

  const handleLibrarySelect = useCallback((lyrics: string, title: string) => {
    setLyrics(lyrics);
    setTitle(title);
  }, [setLyrics, setTitle]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-pink-500 hover:text-pink-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </a>

        <h1 className="font-heading text-3xl font-bold text-gray-800 mb-2">
          Rhymes Engine
        </h1>
        <p className="text-gray-500 mb-8">
          Generate fun, educational rhymes for kids in multiple Indian languages
        </p>

        {/* Controls Row */}
        <div className="flex flex-wrap gap-3 mb-6">
          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-2 rounded-xl border-2 border-gray-200 bg-white text-sm font-medium focus:border-pink-400 focus:outline-none"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.flag} {l.name} ({l.nativeName})
              </option>
            ))}
          </select>

          {/* Provider Selector */}
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value as LLMProvider)}
            className="px-3 py-2 rounded-xl border-2 border-gray-200 bg-white text-sm font-medium focus:border-purple-400 focus:outline-none"
          >
            {PROVIDERS.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>

          {/* Rhyme Library */}
          <RhymeLibrary onSelect={handleLibrarySelect} languageFilter={language} />
        </div>

        {/* Theme Selector */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wider">
            Choose a Theme
          </h2>
          <ThemeSelector selected={theme} onSelect={setTheme} />
        </div>

        {/* Generate Button */}
        <button
          onClick={generate}
          disabled={!theme || isGenerating}
          className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-bold text-lg hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2 mb-8"
        >
          {isGenerating ? (
            <>
              <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" /> Generate Rhyme
            </>
          )}
        </button>

        {/* Lyrics Editor */}
        {(currentLyrics || isGenerating) && (
          <div className="space-y-4">
            {currentTitle && (
              <h2 className="font-heading text-2xl font-bold text-gray-800">
                {currentTitle}
              </h2>
            )}

            <RhymeEditor
              value={currentLyrics}
              onChange={setLyrics}
              readOnly={isGenerating}
            />

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigator.clipboard.writeText(currentLyrics)}
                className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-gray-200 transition-colors"
                disabled={isGenerating}
              >
                <Copy className="w-4 h-4" /> Copy
              </button>
              <button
                onClick={() => saveRhyme(language)}
                className="px-4 py-2 bg-green-100 text-green-700 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-green-200 transition-colors"
                disabled={isGenerating}
              >
                <Save className="w-4 h-4" /> Save
              </button>
              <button
                onClick={clearCurrent}
                className="px-4 py-2 bg-red-50 text-red-500 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-red-100 transition-colors"
                disabled={isGenerating}
              >
                <Trash2 className="w-4 h-4" /> Clear
              </button>

              {/* Translate Buttons */}
              <div className="flex items-center gap-2 ml-auto">
                <Languages className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-400">Translate to:</span>
                {LANGUAGES.filter((l) => l.code !== language).slice(0, 3).map((l) => (
                  <button
                    key={l.code}
                    onClick={() => translate(l.code)}
                    disabled={isGenerating}
                    className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors disabled:opacity-50"
                  >
                    {l.flag} {l.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
