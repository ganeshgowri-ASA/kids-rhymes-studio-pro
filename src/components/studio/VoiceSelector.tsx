'use client';

import { useEffect, useState } from 'react';
import { Mic, Play, Square } from 'lucide-react';
import { LANGUAGES } from '@/config/languages';
import type { VoiceEntry } from '@/lib/tts/voice-catalog';
import { useTTSStore } from '@/store/tts-store';

const PROVIDER_LABELS: Record<string, string> = {
  indicf5: 'IndicF5',
  coqui: 'Coqui XTTS',
  google: 'Google WaveNet',
  browser: 'Browser',
};

const GENDER_EMOJI: Record<string, string> = {
  female: 'F',
  male: 'M',
  neutral: 'N',
};

export default function VoiceSelector() {
  const { language, setLanguage, selectedVoice, setSelectedVoice } = useTTSStore();
  const [voices, setVoices] = useState<VoiceEntry[]>([]);
  const [previewingId, setPreviewingId] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/tts/voices?language=${language}`)
      .then((r) => r.json())
      .then((data) => setVoices(data.voices || []))
      .catch(() => setVoices([]));
  }, [language]);

  const handlePreview = async (voice: VoiceEntry) => {
    if (previewingId === voice.id) {
      window.speechSynthesis?.cancel();
      setPreviewingId(null);
      return;
    }

    setPreviewingId(voice.id);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const langMap: Record<string, string> = {
        en: 'en-US', hi: 'hi-IN', te: 'te-IN', ta: 'ta-IN',
        bn: 'bn-IN', gu: 'gu-IN', kn: 'kn-IN',
      };
      const utterance = new SpeechSynthesisUtterance('Hello, this is a voice preview.');
      utterance.lang = langMap[voice.language] || 'en-US';
      utterance.onend = () => setPreviewingId(null);
      utterance.onerror = () => setPreviewingId(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setPreviewingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Language</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm bg-white focus:ring-2 focus:ring-purple-400 focus:border-transparent"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.name} ({lang.nativeName})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          <Mic className="w-4 h-4 inline mr-1" />
          Select Voice ({voices.length} available)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
          {voices.map((voice) => (
            <div
              key={voice.id}
              onClick={() => setSelectedVoice(voice)}
              className={`relative flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                selectedVoice?.id === voice.id
                  ? 'border-purple-500 bg-purple-50 shadow-md'
                  : 'border-gray-100 bg-white hover:border-purple-200 hover:shadow-sm'
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-800 truncate">{voice.name}</p>
                <p className="text-xs text-gray-500">
                  {PROVIDER_LABELS[voice.provider]} · {GENDER_EMOJI[voice.gender]} · {voice.style}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePreview(voice);
                }}
                className="shrink-0 w-8 h-8 rounded-full bg-purple-100 hover:bg-purple-200 flex items-center justify-center transition-colors"
              >
                {previewingId === voice.id ? (
                  <Square className="w-3 h-3 text-purple-600" />
                ) : (
                  <Play className="w-3 h-3 text-purple-600 ml-0.5" />
                )}
              </button>
            </div>
          ))}
          {voices.length === 0 && (
            <p className="text-sm text-gray-400 col-span-2 text-center py-4">
              No voices available for this language
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
