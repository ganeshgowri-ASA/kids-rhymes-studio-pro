'use client';

import { useCallback } from 'react';
import { Loader2, Play, Download, RotateCcw, Volume2 } from 'lucide-react';
import { useTTSStore } from '@/store/tts-store';
import VoiceSelector from './VoiceSelector';

export default function NarrationEditor() {
  const {
    text, setText,
    language, selectedVoice,
    speed, setSpeed,
    pitch, setPitch,
    isGenerating, setIsGenerating,
    audioUrl, setAudio,
    error, setError,
    reset,
  } = useTTSStore();

  const handleGenerate = useCallback(async () => {
    if (!text.trim()) {
      setError('Please enter some text to narrate');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/tts/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          language,
          voiceId: selectedVoice?.id,
          provider: selectedVoice?.provider,
          speed,
          pitch,
        }),
      });

      const contentType = response.headers.get('Content-Type') || '';

      if (contentType.includes('application/json')) {
        const data = await response.json();
        if (data.status === 'browser_tts') {
          // Fall back to browser TTS
          if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            const langMap: Record<string, string> = {
              en: 'en-US', hi: 'hi-IN', te: 'te-IN', ta: 'ta-IN',
              bn: 'bn-IN', gu: 'gu-IN', kn: 'kn-IN',
            };
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = langMap[language] || 'en-US';
            utterance.rate = speed;
            utterance.pitch = pitch;
            window.speechSynthesis.speak(utterance);
          }
          return;
        }
        if (data.error) {
          throw new Error(data.error);
        }
      } else {
        const blob = new Blob([await response.arrayBuffer()], { type: contentType });
        const url = URL.createObjectURL(blob);
        setAudio(url, blob);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate narration');
    } finally {
      setIsGenerating(false);
    }
  }, [text, language, selectedVoice, speed, pitch, setIsGenerating, setError, setAudio]);

  const handleDownload = useCallback(() => {
    const blob = useTTSStore.getState().audioBlob;
    if (!blob || !audioUrl) return;
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `narration-${language}-${Date.now()}.mp3`;
    a.click();
  }, [audioUrl, language]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-purple-500" />
          TTS Narration Editor
        </h2>

        <VoiceSelector />

        <div className="mt-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Narration Text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter the text you want to convert to speech..."
            rows={5}
            maxLength={5000}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          />
          <p className="text-xs text-gray-400 mt-1 text-right">{text.length}/5000</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Speed: {speed.toFixed(2)}x
            </label>
            <input
              type="range"
              min="0.25"
              max="4"
              step="0.25"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-full accent-purple-500"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>0.25x</span>
              <span>4x</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Pitch: {pitch.toFixed(1)}
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={pitch}
              onChange={(e) => setPitch(parseFloat(e.target.value))}
              className="w-full accent-purple-500"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !text.trim()}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-violet-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-600 hover:to-violet-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isGenerating ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
            ) : (
              <><Play className="w-4 h-4" /> Generate Narration</>
            )}
          </button>
          <button
            onClick={() => reset()}
            className="px-4 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {audioUrl && (
          <div className="mt-4 space-y-3">
            <audio controls src={audioUrl} className="w-full" />
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              <Download className="w-4 h-4" /> Download Audio
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
