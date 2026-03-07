'use client';

import { useCallback, useMemo } from 'react';
import { Download, Plus, Trash2, Captions } from 'lucide-react';
import { useTTSStore, type SubtitleEntry } from '@/store/tts-store';

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
}

function formatVTTTime(seconds: number): string {
  return formatTime(seconds).replace(',', '.');
}

function toSRT(subtitles: SubtitleEntry[]): string {
  return subtitles
    .map((s, i) => `${i + 1}\n${formatTime(s.startTime)} --> ${formatTime(s.endTime)}\n${s.text}\n`)
    .join('\n');
}

function toVTT(subtitles: SubtitleEntry[]): string {
  const cues = subtitles
    .map((s) => `${formatVTTTime(s.startTime)} --> ${formatVTTTime(s.endTime)}\n${s.text}`)
    .join('\n\n');
  return `WEBVTT\n\n${cues}\n`;
}

export default function SubtitleTrack() {
  const { text, subtitles, setSubtitles, updateSubtitle, removeSubtitle } = useTTSStore();

  const handleAutoGenerate = useCallback(() => {
    if (!text.trim()) return;

    const sentences = text
      .split(/[.!?।\n]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    const avgDuration = 3;
    const generated: SubtitleEntry[] = sentences.map((sentence, i) => ({
      id: generateId(),
      text: sentence,
      startTime: i * avgDuration,
      endTime: (i + 1) * avgDuration,
    }));

    setSubtitles(generated);
  }, [text, setSubtitles]);

  const handleAddSubtitle = useCallback(() => {
    const last = subtitles[subtitles.length - 1];
    const startTime = last ? last.endTime : 0;
    const newEntry: SubtitleEntry = {
      id: generateId(),
      text: '',
      startTime,
      endTime: startTime + 3,
    };
    setSubtitles([...subtitles, newEntry]);
  }, [subtitles, setSubtitles]);

  const handleExport = useCallback(
    (format: 'srt' | 'vtt') => {
      if (subtitles.length === 0) return;
      const content = format === 'srt' ? toSRT(subtitles) : toVTT(subtitles);
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `subtitles.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    },
    [subtitles]
  );

  const totalDuration = useMemo(
    () => (subtitles.length > 0 ? subtitles[subtitles.length - 1].endTime : 0),
    [subtitles]
  );

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Captions className="w-5 h-5 text-purple-500" />
          Subtitle Track
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleAutoGenerate}
            disabled={!text.trim()}
            className="text-xs px-3 py-1.5 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 disabled:opacity-50 font-medium transition-colors"
          >
            Auto-generate
          </button>
          <button
            onClick={handleAddSubtitle}
            className="text-xs px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 font-medium transition-colors"
          >
            <Plus className="w-3 h-3 inline mr-1" />
            Add
          </button>
        </div>
      </div>

      {subtitles.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">
          No subtitles yet. Enter narration text and click &quot;Auto-generate&quot; or add manually.
        </p>
      ) : (
        <div className="space-y-2 max-h-72 overflow-y-auto">
          {subtitles.map((sub, index) => (
            <div key={sub.id} className="flex items-start gap-2 p-3 bg-gray-50 rounded-xl group">
              <span className="text-xs text-gray-400 font-mono mt-2 w-5 shrink-0">
                {index + 1}
              </span>
              <div className="flex-1 space-y-1">
                <textarea
                  value={sub.text}
                  onChange={(e) => updateSubtitle(sub.id, { text: e.target.value })}
                  rows={1}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 resize-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={sub.startTime}
                    onChange={(e) =>
                      updateSubtitle(sub.id, { startTime: parseFloat(e.target.value) || 0 })
                    }
                    step="0.1"
                    min="0"
                    className="w-20 text-xs border border-gray-200 rounded-lg px-2 py-1 font-mono"
                    title="Start time (seconds)"
                  />
                  <span className="text-gray-400 text-xs mt-1">to</span>
                  <input
                    type="number"
                    value={sub.endTime}
                    onChange={(e) =>
                      updateSubtitle(sub.id, { endTime: parseFloat(e.target.value) || 0 })
                    }
                    step="0.1"
                    min="0"
                    className="w-20 text-xs border border-gray-200 rounded-lg px-2 py-1 font-mono"
                    title="End time (seconds)"
                  />
                </div>
              </div>
              <button
                onClick={() => removeSubtitle(sub.id)}
                className="opacity-0 group-hover:opacity-100 shrink-0 w-7 h-7 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {subtitles.length > 0 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <p className="text-xs text-gray-500">
            {subtitles.length} subtitle{subtitles.length !== 1 ? 's' : ''} · {totalDuration.toFixed(1)}s total
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handleExport('srt')}
              className="flex items-center gap-1 text-xs px-3 py-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 font-medium transition-colors"
            >
              <Download className="w-3 h-3" /> SRT
            </button>
            <button
              onClick={() => handleExport('vtt')}
              className="flex items-center gap-1 text-xs px-3 py-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 font-medium transition-colors"
            >
              <Download className="w-3 h-3" /> VTT
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
