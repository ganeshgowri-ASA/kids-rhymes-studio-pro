"use client";

import { useState, useCallback } from "react";
import { useMusicStore, Track } from "@/store/music-store";
import StyleSelector from "./StyleSelector";
import { Loader2, Wand2 } from "lucide-react";

export default function MusicGenerator() {
  const {
    selectedStyle,
    isGenerating,
    generationError,
    setGenerating,
    setGenerationError,
    setCurrentTrack,
    addTrack,
  } = useMusicStore();

  const [lyrics, setLyrics] = useState("");
  const [duration, setDuration] = useState(30);
  const [instrumental, setInstrumental] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (!lyrics.trim() && !instrumental) return;

    setGenerating(true);
    setGenerationError(null);

    try {
      // Start generation
      const genResponse = await fetch("/api/music/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lyrics: lyrics.trim() || "Instrumental track",
          style: selectedStyle,
          duration,
          instrumental,
        }),
      });

      if (!genResponse.ok) {
        throw new Error("Generation request failed");
      }

      const genData = await genResponse.json();
      const taskId = genData.taskId;

      // Check if generation is already complete (mock mode returns immediately)
      if (genData.status === "complete" && genData.audioUrl) {
        const newTrack: Track = {
          id: taskId,
          title: genData.title || `${selectedStyle} - ${new Date().toLocaleTimeString()}`,
          style: selectedStyle,
          audioUrl: genData.audioUrl,
          duration: genData.duration || duration,
          lyrics: instrumental ? undefined : lyrics,
          createdAt: Date.now(),
        };
        addTrack(newTrack);
        setCurrentTrack(newTrack);
        setGenerating(false);
        return;
      }

      // Poll for completion (for real API calls)
      let attempts = 0;
      const maxAttempts = 30;

      while (attempts < maxAttempts) {
        await new Promise((r) => setTimeout(r, 2000));
        attempts++;

        const statusResponse = await fetch(`/api/music/status/${taskId}`);
        if (!statusResponse.ok) continue;

        const statusData = await statusResponse.json();

        if (statusData.status === "complete" && statusData.audioUrl) {
          const newTrack: Track = {
            id: taskId,
            title:
              statusData.title ||
              `${selectedStyle} - ${new Date().toLocaleTimeString()}`,
            style: selectedStyle,
            audioUrl: statusData.audioUrl,
            duration: statusData.duration || duration,
            lyrics: instrumental ? undefined : lyrics,
            createdAt: Date.now(),
          };
          addTrack(newTrack);
          setCurrentTrack(newTrack);
          setGenerating(false);
          return;
        }

        if (statusData.status === "error") {
          throw new Error(statusData.errorMessage || "Generation failed");
        }
      }

      throw new Error("Generation timed out");
    } catch (err) {
      setGenerationError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setGenerating(false);
    }
  }, [
    lyrics,
    selectedStyle,
    duration,
    instrumental,
    setGenerating,
    setGenerationError,
    addTrack,
    setCurrentTrack,
  ]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Generate Music</h2>

      {/* Style selector */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Music Style
        </label>
        <StyleSelector />
      </div>

      {/* Lyrics input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-600">
            Lyrics
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
            <input
              type="checkbox"
              checked={instrumental}
              onChange={(e) => setInstrumental(e.target.checked)}
              className="rounded accent-purple-500"
            />
            Instrumental only
          </label>
        </div>
        <textarea
          value={lyrics}
          onChange={(e) => setLyrics(e.target.value)}
          disabled={instrumental}
          placeholder="Enter your rhyme lyrics here..."
          rows={4}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent resize-none disabled:opacity-50 disabled:bg-gray-50"
        />
      </div>

      {/* Duration slider */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Duration: {duration}s
        </label>
        <input
          type="range"
          min={15}
          max={120}
          step={5}
          value={duration}
          onChange={(e) => setDuration(parseInt(e.target.value))}
          className="w-full h-2 rounded-full appearance-none bg-gradient-to-r from-pink-200 to-purple-200 accent-purple-500"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>15s</span>
          <span>120s</span>
        </div>
      </div>

      {/* Error message */}
      {generationError && (
        <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3">
          {generationError}
        </div>
      )}

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating || (!lyrics.trim() && !instrumental)}
        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink-400 to-purple-500 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Wand2 className="w-5 h-5" />
            Generate Music
          </>
        )}
      </button>
    </div>
  );
}
