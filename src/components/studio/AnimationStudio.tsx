"use client";

import { useState, useCallback, useRef } from "react";
import { Loader2, Film, Play, Download, Music, Image } from "lucide-react";

interface SceneData {
  sceneNumber: number;
  description: string;
  subtitle: string;
  imageUrl?: string;
  duration: number;
}

interface AnimationResult {
  id: string;
  status: string;
  scenes: SceneData[];
  musicUrl?: string;
  musicTitle?: string;
  totalDuration: number;
}

const MUSIC_STYLES = [
  { value: "lullaby", label: "Lullaby" },
  { value: "upbeat_kids", label: "Upbeat Kids" },
  { value: "classical_indian", label: "Classical Indian" },
  { value: "folk_indian", label: "Folk Indian" },
  { value: "pop_kids", label: "Pop Kids" },
];

export default function AnimationStudio() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [musicStyle, setMusicStyle] = useState("upbeat_kids");
  const [numScenes, setNumScenes] = useState(4);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<AnimationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!title.trim() || !text.trim()) return;

    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/animation/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          text: text.trim(),
          musicStyle,
          scenes: numScenes,
          aspectRatio: "16:9",
        }),
      });

      if (!response.ok) {
        throw new Error("Generation failed");
      }

      const data = await response.json();
      setResult(data);
      setCurrentScene(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setIsGenerating(false);
    }
  }, [title, text, musicStyle, numScenes]);

  const handlePlay = useCallback(() => {
    if (!result || !result.scenes.length) return;

    if (isPlaying) {
      setIsPlaying(false);
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioRef.current) audioRef.current.pause();
      return;
    }

    setIsPlaying(true);
    setCurrentScene(0);

    // Play music if available
    if (audioRef.current && result.musicUrl) {
      audioRef.current.src = result.musicUrl;
      audioRef.current.play().catch(() => {});
    }

    // Cycle through scenes
    let sceneIdx = 0;
    const sceneDuration = result.scenes[0]?.duration || 5;
    timerRef.current = setInterval(() => {
      sceneIdx++;
      if (sceneIdx >= result.scenes.length) {
        setIsPlaying(false);
        if (timerRef.current) clearInterval(timerRef.current);
        if (audioRef.current) audioRef.current.pause();
        return;
      }
      setCurrentScene(sceneIdx);
    }, sceneDuration * 1000);
  }, [result, isPlaying]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Film className="w-8 h-8 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-800">Animation Studio</h2>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Animation Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Twinkle Twinkle Little Star"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rhyme / Story Text
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your rhyme or story text here...\nEach line or paragraph will become a scene."
            rows={6}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Music Style
            </label>
            <select
              value={musicStyle}
              onChange={(e) => setMusicStyle(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              {MUSIC_STYLES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Scenes
            </label>
            <select
              value={numScenes}
              onChange={(e) => setNumScenes(Number(e.target.value))}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              {[2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n} scenes
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !title.trim() || !text.trim()}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating Animation...
            </>
          ) : (
            <>
              <Film className="w-5 h-5" />
              Generate Animation
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Preview */}
      {result && (
        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Preview</h3>

          {/* Scene Display */}
          <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
            {result.scenes[currentScene]?.imageUrl ? (
              <img
                src={result.scenes[currentScene].imageUrl}
                alt={`Scene ${currentScene + 1}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Image className="w-12 h-12" />
              </div>
            )}

            {/* Subtitle overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <p className="text-white text-center text-lg font-medium">
                {result.scenes[currentScene]?.subtitle}
              </p>
            </div>

            {/* Scene counter */}
            <div className="absolute top-3 right-3 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
              Scene {currentScene + 1} / {result.scenes.length}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePlay}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center gap-2 hover:bg-purple-700"
              >
                <Play className="w-4 h-4" />
                {isPlaying ? "Stop" : "Play"}
              </button>
            </div>

            {result.musicUrl && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Music className="w-4 h-4" />
                {result.musicTitle || "Background Music"}
              </div>
            )}
          </div>

          {/* Scene thumbnails */}
          <div className="grid grid-cols-4 gap-2">
            {result.scenes.map((scene, i) => (
              <button
                key={i}
                onClick={() => setCurrentScene(i)}
                className={`relative aspect-video rounded-lg overflow-hidden border-2 ${
                  i === currentScene
                    ? "border-purple-600"
                    : "border-transparent"
                }`}
              >
                {scene.imageUrl ? (
                  <img
                    src={scene.imageUrl}
                    alt={`Scene ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xs text-gray-500">Scene {i + 1}</span>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Hidden audio element */}
          <audio ref={audioRef} />
        </div>
      )}
    </div>
  );
}
