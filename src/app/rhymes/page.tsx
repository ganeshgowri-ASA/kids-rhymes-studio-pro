'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useAppStore } from '@/store/app-store';
import { useRhymesStore } from '@/store/rhymes-store';
import { LANGUAGES } from '@/config/languages';
import type { LLMProvider } from '@/lib/ai/provider';
import ThemeSelector from '@/components/rhymes/ThemeSelector';
import RhymeEditor from '@/components/rhymes/RhymeEditor';
import RhymeLibrary from '@/components/rhymes/RhymeLibrary';
import { Sparkles, Copy, Save, Trash2, Languages, Download, FileText, Share2, History, ChevronRight, Play, Pause, Square, Loader2, Volume2 } from 'lucide-react';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const LANGUAGE_TO_SPEECH_LANG: Record<string, string> = {
  en: 'en-US',
  hi: 'hi-IN',
  te: 'te-IN',
  ta: 'ta-IN',
  bn: 'bn-IN',
  gu: 'gu-IN',
  kn: 'kn-IN',
};

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
    setGenerating, saveRhyme, clearCurrent, savedRhymes,
  } = useRhymesStore();
  const [showHistory, setShowHistory] = useState(false);
  const [speechState, setSpeechState] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [isTTSLoading, setIsTTSLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [usingBrowserTTS, setUsingBrowserTTS] = useState(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Clear audio when lyrics change
  useEffect(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
      setAudioBlob(null);
    }
    if (speechState !== 'idle') {
      handleStop();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLyrics]);

  const playBrowserTTS = useCallback(() => {
    const synth = window.speechSynthesis;
    if (!synth) {
      toast.error('Speech synthesis not supported in this browser');
      return;
    }

    setUsingBrowserTTS(true);

    const doSpeak = () => {
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(currentLyrics);
      const speechLang = LANGUAGE_TO_SPEECH_LANG[language] || 'en-US';
      utterance.lang = speechLang;
      utterance.rate = 0.9;

      const voices = synth.getVoices();
      const matchingVoice = voices.find(v => v.lang === speechLang) ||
        voices.find(v => v.lang.startsWith(language));
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }

      utterance.onend = () => { setSpeechState('idle'); setUsingBrowserTTS(false); };
      utterance.onerror = () => { setSpeechState('idle'); setUsingBrowserTTS(false); };

      utteranceRef.current = utterance;
      synth.speak(utterance);
      setSpeechState('playing');
    };

    // Wait for voices to load if empty
    const voices = synth.getVoices();
    if (voices.length === 0) {
      const handleVoicesChanged = () => {
        synth.removeEventListener('voiceschanged', handleVoicesChanged);
        doSpeak();
      };
      synth.addEventListener('voiceschanged', handleVoicesChanged);
      // Timeout fallback in case voiceschanged never fires
      setTimeout(() => {
        synth.removeEventListener('voiceschanged', handleVoicesChanged);
        doSpeak();
      }, 1000);
    } else {
      doSpeak();
    }
  }, [currentLyrics, language]);

  const handlePlay = useCallback(async () => {
    if (!currentLyrics.trim()) return;

    // If browser TTS is paused, resume it
    if (usingBrowserTTS && speechState === 'paused') {
      window.speechSynthesis?.resume();
      setSpeechState('playing');
      return;
    }

    // If we already have audio, replay it
    if (audioUrl && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setSpeechState('playing');
      return;
    }

    // Generate TTS audio from API
    setIsTTSLoading(true);
    try {
      const res = await fetch('/api/tts/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: currentLyrics, language }),
      });

      const contentType = res.headers.get('Content-Type') || '';

      // Check if server returned JSON (browser_tts fallback or error)
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (data.status === 'browser_tts') {
          toast.info('Using browser speech synthesis');
          setIsTTSLoading(false);
          playBrowserTTS();
          return;
        }
        if (data.error) {
          throw new Error(data.error);
        }
      }

      // We got audio binary back
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      // Clean up previous audio URL
      if (audioUrl) URL.revokeObjectURL(audioUrl);

      setAudioBlob(blob);
      setAudioUrl(url);
      setUsingBrowserTTS(false);

      // Play via the audio element after state update
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play();
          setSpeechState('playing');
        }
      }, 100);

      toast.success('Audio generated!');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'TTS failed';
      toast.error(`TTS failed: ${msg}. Falling back to browser speech.`);
      playBrowserTTS();
    }
    setIsTTSLoading(false);
  }, [currentLyrics, language, speechState, audioUrl, usingBrowserTTS, playBrowserTTS]);

  const handlePause = useCallback(() => {
    if (usingBrowserTTS) {
      window.speechSynthesis?.pause();
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
    setSpeechState('paused');
  }, [usingBrowserTTS]);

  const handleStop = useCallback(() => {
    if (usingBrowserTTS) {
      window.speechSynthesis?.cancel();
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setSpeechState('idle');
    setUsingBrowserTTS(false);
  }, [usingBrowserTTS]);

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
      toast.success('Rhyme generated successfully!');
    } catch {
      setLyrics('Error generating lyrics. Please try again.');
      toast.error('Failed to generate rhyme');
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
      toast.success('Translation complete!');
    } catch {
      setLyrics(originalLyrics);
      toast.error('Translation failed');
    }
    setGenerating(false);
  }, [currentLyrics, provider, isGenerating, setGenerating, setLyrics, appendLyrics, setLanguage]);

  const handleLibrarySelect = useCallback((lyrics: string, title: string) => {
    setLyrics(lyrics);
    setTitle(title);
  }, [setLyrics, setTitle]);

  const handleDownloadAudio = () => {
    if (!audioBlob) return;
    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(currentTitle || 'rhyme').replace(/[^a-zA-Z0-9\s]/g, '').trim()}.mp3`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Audio downloaded!');
  };

  const handleDownloadLyrics = () => {
    if (!currentLyrics) return;
    const langName = LANGUAGES.find(l => l.code === language)?.name || 'English';
    const content = `${currentTitle || 'Untitled Rhyme'}\nLanguage: ${langName}\n\n${currentLyrics}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(currentTitle || 'rhyme').replace(/[^a-zA-Z0-9\s]/g, '').trim()}.txt`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Lyrics downloaded!');
  };

  const handleShare = async () => {
    if (!currentLyrics) return;
    if (navigator.share) {
      await navigator.share({ title: currentTitle, text: currentLyrics });
    } else {
      await navigator.clipboard.writeText(`${currentTitle}\n\n${currentLyrics}`);
      toast.success('Copied to clipboard!');
    }
  };

  const currentLang = LANGUAGES.find(l => l.code === language);

  return (
    <div className="max-w-5xl mx-auto">
      <Breadcrumbs />

      <div className="flex items-start gap-6">
        {/* Main content */}
        <div className="flex-1">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-heading text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Rhymes Engine
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Generate fun, educational rhymes for kids in multiple Indian languages
            </p>
          </motion.div>

          {/* Language selector with flag prominently */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-wrap gap-3 mb-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-pink-200 dark:border-pink-800 bg-white dark:bg-gray-800 shadow-sm">
              <span className="text-2xl">{currentLang?.flag}</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-sm font-medium focus:outline-none dark:text-white cursor-pointer"
                aria-label="Select language"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {l.name} ({l.nativeName})
                  </option>
                ))}
              </select>
            </div>

            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value as LLMProvider)}
              className="px-3 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium focus:border-purple-400 focus:outline-none dark:text-white"
              aria-label="Select AI provider"
            >
              {PROVIDERS.map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>

            <RhymeLibrary onSelect={handleLibrarySelect} languageFilter={language} />

            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium hover:border-pink-300 transition-colors dark:text-white"
              aria-label="Show history"
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">History ({savedRhymes.length})</span>
            </button>
          </motion.div>

          {/* Theme Selector */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-6">
            <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wider">
              Choose a Theme
            </h2>
            <ThemeSelector selected={theme} onSelect={setTheme} />
          </motion.div>

          {/* Generate Button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={generate}
            disabled={!theme || isGenerating}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
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
          </motion.button>

          {/* Lyrics Editor with typewriter effect */}
          <AnimatePresence>
            {(currentLyrics || isGenerating) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {currentTitle && (
                  <h2 className="font-heading text-2xl font-bold text-gray-800 dark:text-white">
                    {currentTitle}
                  </h2>
                )}

                <div className={isGenerating ? "typewriter-cursor" : ""}>
                  <RhymeEditor value={currentLyrics} onChange={setLyrics} readOnly={isGenerating} />
                </div>

                {/* Waveform visualization placeholder */}
                {isGenerating && (
                  <div className="flex items-center gap-1 h-8 justify-center">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-pink-400 dark:bg-pink-500 rounded-full"
                        animate={{ height: [4, 16 + Math.random() * 16, 4] }}
                        transition={{ duration: 0.5 + Math.random() * 0.5, repeat: Infinity, delay: i * 0.05 }}
                      />
                    ))}
                  </div>
                )}

                {/* Play & Download Action Bar */}
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 border-2 border-pink-200 dark:border-pink-800">
                  {isTTSLoading ? (
                    <button
                      disabled
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-bold text-sm opacity-75"
                    >
                      <Loader2 className="w-5 h-5 animate-spin" /> Generating Audio...
                    </button>
                  ) : speechState === 'idle' ? (
                    <button
                      onClick={handlePlay}
                      disabled={isGenerating || !currentLyrics.trim()}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-bold text-sm hover:shadow-lg disabled:opacity-50 transition-all"
                      aria-label="Play rhyme"
                    >
                      <Play className="w-5 h-5" /> Play Rhyme
                    </button>
                  ) : (
                    <>
                      {speechState === 'playing' ? (
                        <button
                          onClick={handlePause}
                          className="flex items-center gap-2 px-5 py-2.5 bg-yellow-500 text-white rounded-xl font-bold text-sm hover:bg-yellow-600 transition-colors"
                          aria-label="Pause"
                        >
                          <Pause className="w-5 h-5" /> Pause
                        </button>
                      ) : (
                        <button
                          onClick={handlePlay}
                          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all"
                          aria-label="Resume"
                        >
                          <Play className="w-5 h-5" /> Resume
                        </button>
                      )}
                      <button
                        onClick={handleStop}
                        className="flex items-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-xl font-bold text-sm hover:bg-red-600 transition-colors"
                        aria-label="Stop"
                      >
                        <Square className="w-4 h-4" /> Stop
                      </button>
                    </>
                  )}

                  <div className="h-8 w-px bg-gray-300 dark:bg-gray-600 mx-1" />

                  {audioBlob ? (
                    <button
                      onClick={handleDownloadAudio}
                      className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 text-white rounded-xl font-bold text-sm hover:bg-blue-600 transition-colors"
                      aria-label="Download audio"
                    >
                      <Download className="w-5 h-5" /> Download Audio
                    </button>
                  ) : null}

                  <button
                    onClick={handleDownloadLyrics}
                    disabled={isGenerating || !currentLyrics.trim()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-500 text-white rounded-xl font-bold text-sm hover:bg-gray-600 disabled:opacity-50 transition-colors"
                    aria-label="Download lyrics"
                  >
                    <FileText className="w-5 h-5" /> Download Lyrics
                  </button>

                  {speechState !== 'idle' && (
                    <span className="ml-auto text-xs text-pink-600 dark:text-pink-400 font-medium flex items-center gap-1">
                      <span className="inline-block w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                      {speechState === 'playing' ? 'Playing...' : 'Paused'}
                    </span>
                  )}
                </div>

                {/* HTML5 Audio Player */}
                {audioUrl && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <Volume2 className="w-5 h-5 text-pink-500 flex-shrink-0" />
                    <audio
                      ref={audioRef}
                      src={audioUrl}
                      controls
                      className="w-full h-10"
                      onPlay={() => setSpeechState('playing')}
                      onPause={() => { if (audioRef.current && !audioRef.current.ended) setSpeechState('paused'); }}
                      onEnded={() => setSpeechState('idle')}
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => { navigator.clipboard.writeText(currentLyrics); toast.success('Copied!'); }}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors dark:text-white"
                    disabled={isGenerating}
                    aria-label="Copy lyrics"
                  >
                    <Copy className="w-4 h-4" /> Copy
                  </button>
                  <button
                    onClick={() => { saveRhyme(language); toast.success('Saved!'); }}
                    className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                    disabled={isGenerating}
                    aria-label="Save rhyme"
                  >
                    <Save className="w-4 h-4" /> Save
                  </button>
                  <button
                    onClick={handleShare}
                    className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                    disabled={isGenerating}
                    aria-label="Share rhyme"
                  >
                    <Share2 className="w-4 h-4" /> Share
                  </button>
                  <button
                    onClick={clearCurrent}
                    className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    disabled={isGenerating}
                    aria-label="Clear lyrics"
                  >
                    <Trash2 className="w-4 h-4" /> Clear
                  </button>

                  {/* Translate Buttons */}
                  <div className="flex items-center gap-2 ml-auto flex-wrap">
                    <Languages className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-400">Translate:</span>
                    {LANGUAGES.filter((l) => l.code !== language).slice(0, 3).map((l) => (
                      <button
                        key={l.code}
                        onClick={() => translate(l.code)}
                        disabled={isGenerating}
                        className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors disabled:opacity-50"
                      >
                        {l.flag} {l.name}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* History Sidebar */}
        <AnimatePresence>
          {showHistory && (
            <motion.aside
              initial={{ opacity: 0, x: 20, width: 0 }}
              animate={{ opacity: 1, x: 0, width: 280 }}
              exit={{ opacity: 0, x: 20, width: 0 }}
              className="hidden lg:block flex-shrink-0 overflow-hidden"
            >
              <div className="glass-card rounded-2xl p-4 sticky top-24">
                <h3 className="font-heading text-lg font-bold text-gray-800 dark:text-white mb-3">History</h3>
                {savedRhymes.length === 0 ? (
                  <p className="text-sm text-gray-400">No saved rhymes yet</p>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {savedRhymes.slice(0, 10).map((r) => (
                      <button
                        key={r.id}
                        onClick={() => { setLyrics(r.lyrics); setTitle(r.title); }}
                        className="w-full text-left p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors border border-gray-100 dark:border-gray-700"
                      >
                        <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{r.title}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                          <span>{LANGUAGES.find(l => l.code === r.language)?.flag}</span>
                          {r.theme}
                          <ChevronRight className="w-3 h-3 ml-auto" />
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
