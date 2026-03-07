"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { useVideoStore } from "@/store/video-store";

export default function VideoPreview() {
  const {
    timeline,
    playheadPosition,
    isPlaying,
    setPlayheadPosition,
    setIsPlaying,
  } = useVideoStore();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const [loadedImages, setLoadedImages] = useState<Map<string, HTMLImageElement>>(new Map());
  const [frameCount, setFrameCount] = useState(0);

  const imageTrack = timeline.tracks.find((t) => t.type === "image");
  const subtitleTrack = timeline.tracks.find((t) => t.type === "subtitle");

  // Preload images
  useEffect(() => {
    if (!imageTrack) return;
    const map = new Map<string, HTMLImageElement>();
    let cancelled = false;

    const loadAll = async () => {
      for (const item of imageTrack.items) {
        if (cancelled) return;
        if (!item.source) continue;
        try {
          const img = new Image();
          img.crossOrigin = "anonymous";
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = reject;
            img.src = item.source;
          });
          map.set(item.id, img);
        } catch {
          // Skip failed images
        }
      }
      if (!cancelled) setLoadedImages(new Map(map));
    };

    loadAll();
    return () => { cancelled = true; };
  }, [imageTrack]);

  // Get current scene at playhead
  const getCurrentScene = useCallback(() => {
    if (!imageTrack) return null;
    const sorted = [...imageTrack.items].sort((a, b) => a.start - b.start);
    for (let i = sorted.length - 1; i >= 0; i--) {
      const item = sorted[i];
      if (playheadPosition >= item.start && playheadPosition < item.start + item.duration) {
        return item;
      }
    }
    return sorted[0] ?? null;
  }, [imageTrack, playheadPosition]);

  // Get current subtitle
  const getCurrentSubtitle = useCallback(() => {
    if (!subtitleTrack) return null;
    return subtitleTrack.items.find(
      (item) =>
        playheadPosition >= item.start &&
        playheadPosition < item.start + item.duration
    );
  }, [subtitleTrack, playheadPosition]);

  // Render frame
  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Clear
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, w, h);

    // Draw current scene
    const scene = getCurrentScene();
    if (scene) {
      const img = loadedImages.get(scene.id);
      if (img) {
        const scale = Math.min(w / img.width, h / img.height);
        const dw = img.width * scale;
        const dh = img.height * scale;
        ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
      } else {
        // Placeholder
        ctx.fillStyle = "#2a2a4a";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#8888aa";
        ctx.font = "16px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(scene.label ?? "Scene", w / 2, h / 2);
      }
    }

    // Draw subtitle
    const subtitle = getCurrentSubtitle();
    if (subtitle) {
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(0, h - 60, w, 60);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 18px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(subtitle.source, w / 2, h - 28);
    }

    // Frame counter
    setFrameCount((prev) => prev + 1);
  }, [getCurrentScene, getCurrentSubtitle, loadedImages]);

  // Playback loop
  useEffect(() => {
    if (!isPlaying) {
      renderFrame();
      return;
    }

    lastTimeRef.current = performance.now();

    const tick = (now: number) => {
      const delta = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      const newPos = playheadPosition + delta;
      if (newPos >= timeline.duration) {
        setPlayheadPosition(0);
        setIsPlaying(false);
        return;
      }

      setPlayheadPosition(newPos);
      renderFrame();
      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isPlaying, playheadPosition, timeline.duration, renderFrame, setPlayheadPosition, setIsPlaying]);

  // Re-render when playhead moves while paused
  useEffect(() => {
    if (!isPlaying) renderFrame();
  }, [playheadPosition, isPlaying, renderFrame]);

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    const ms = Math.floor((t % 1) * 100);
    return `${m}:${String(s).padStart(2, "0")}.${String(ms).padStart(2, "0")}`;
  };

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
      {/* Canvas */}
      <div className="relative bg-black aspect-video">
        <canvas
          ref={canvasRef}
          width={1280}
          height={720}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPlayheadPosition(0)}
            className="p-1.5 text-gray-400 hover:text-white transition-colors"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-full bg-blue-500 hover:bg-blue-400 text-white transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4 ml-0.5" />
            )}
          </button>
          <button
            onClick={() =>
              setPlayheadPosition(Math.min(playheadPosition + 5, timeline.duration))
            }
            className="p-1.5 text-gray-400 hover:text-white transition-colors"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span>{formatTime(playheadPosition)} / {formatTime(timeline.duration)}</span>
          <span>Frame: {frameCount}</span>
        </div>
      </div>
    </div>
  );
}
