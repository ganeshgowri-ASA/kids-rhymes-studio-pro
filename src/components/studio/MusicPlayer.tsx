"use client";

import { useEffect, useRef, useCallback } from "react";
import { useMusicStore, Track } from "@/store/music-store";
import { formatTime } from "@/lib/music/audio-utils";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipBack,
  Download,
} from "lucide-react";

export default function MusicPlayer() {
  const {
    isPlaying,
    currentTrack,
    volume,
    playbackSpeed,
    currentTime,
    setPlaying,
    setVolume,
    setPlaybackSpeed,
    setCurrentTime,
  } = useMusicStore();

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Setup audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      // Don't set crossOrigin to avoid CORS issues with external audio URLs
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  // Load track
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    audio.src = currentTrack.audioUrl;
    audio.load();
    audio.play().then(() => setPlaying(true)).catch((err) => {
      console.warn("Auto-play blocked or failed:", err);
    });
  }, [currentTrack, setPlaying]);

  // Sync volume and speed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [volume, playbackSpeed]);

  // Time update
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onEnded = () => setPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
  }, [setCurrentTime, setPlaying]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (isPlaying) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  }, [isPlaying, currentTrack, setPlaying]);

  const seek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const time = parseFloat(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  }, [setCurrentTime]);

  const restart = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    setCurrentTime(0);
  }, [setCurrentTime]);

  const duration = audioRef.current?.duration || currentTrack?.duration || 0;

  if (!currentTrack) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center text-gray-400">
        <p>Select a track or generate music to start playing</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 space-y-4">
      {/* Track info */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-gray-800">{currentTrack.title}</h3>
          <p className="text-sm text-gray-500">
            {currentTrack.style.replace("_", " ")}
          </p>
        </div>
        <a
          href={currentTrack.audioUrl}
          download
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Download className="w-5 h-5" />
        </a>
      </div>

      {/* Seek bar */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-400 w-10 text-right">
          {formatTime(currentTime)}
        </span>
        <input
          type="range"
          min={0}
          max={duration || 1}
          step={0.1}
          value={currentTime}
          onChange={seek}
          className="flex-1 h-2 rounded-full appearance-none bg-gradient-to-r from-pink-200 to-purple-200 accent-purple-500"
        />
        <span className="text-xs text-gray-400 w-10">
          {formatTime(duration)}
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        {/* Left: Volume */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setVolume(volume === 0 ? 0.8 : 0)}
            className="p-1 text-gray-500 hover:text-gray-700"
          >
            {volume === 0 ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-20 h-1.5 rounded-full appearance-none bg-gray-200 accent-pink-400"
          />
        </div>

        {/* Center: Play controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={restart}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <SkipBack className="w-5 h-5" />
          </button>
          <button
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </button>
        </div>

        {/* Right: Speed */}
        <div className="flex items-center gap-1">
          {[0.5, 1, 1.5, 2].map((speed) => (
            <button
              key={speed}
              onClick={() => setPlaybackSpeed(speed)}
              className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                playbackSpeed === speed
                  ? "bg-purple-100 text-purple-700 font-bold"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
