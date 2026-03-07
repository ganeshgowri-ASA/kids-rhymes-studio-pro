"use client";

import { useMusicStore, Track } from "@/store/music-store";
import { SAMPLE_TRACKS } from "@/lib/music/sample-tracks";
import { MUSIC_STYLES } from "@/lib/music/suno-client";
import { Play, Trash2, Music } from "lucide-react";

const STYLE_DOT_COLORS: Record<string, string> = {
  lullaby: "bg-indigo-400",
  upbeat_kids: "bg-yellow-400",
  classical_indian: "bg-rose-400",
  folk_indian: "bg-green-400",
  pop_kids: "bg-cyan-400",
};

export default function MusicLibrary() {
  const { tracks, currentTrack, setCurrentTrack, removeTrack } =
    useMusicStore();

  const sampleTracks: Track[] = SAMPLE_TRACKS.map((s) => ({
    id: s.id,
    title: s.title,
    style: s.style,
    audioUrl: s.audioUrl,
    duration: s.duration,
    createdAt: 0,
  }));

  const allTracks = [...tracks, ...sampleTracks];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border">
      <h2 className="font-bold text-xl text-gray-800 mb-4">Music Library</h2>

      {allTracks.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <Music className="w-10 h-10 mx-auto mb-2 opacity-50" />
          <p>No tracks yet. Generate some music!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {allTracks.map((track) => {
            const isActive = currentTrack?.id === track.id;
            const isSample = track.createdAt === 0;

            return (
              <div
                key={track.id}
                className={`rounded-xl p-4 border transition-all cursor-pointer hover:shadow-md ${
                  isActive
                    ? "border-purple-300 bg-purple-50 shadow-md"
                    : "border-gray-100 bg-gray-50 hover:border-gray-200"
                }`}
                onClick={() => setCurrentTrack(track)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        STYLE_DOT_COLORS[track.style] || "bg-gray-400"
                      }`}
                    />
                    <h4 className="font-semibold text-sm text-gray-800 truncate">
                      {track.title}
                    </h4>
                  </div>
                  {isActive && (
                    <Play className="w-4 h-4 text-purple-500 flex-shrink-0" />
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {MUSIC_STYLES[track.style]?.label || track.style}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">
                      {track.duration}s
                    </span>
                    {!isSample && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTrack(track.id);
                        }}
                        className="p-1 text-gray-300 hover:text-red-400 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {isSample && (
                  <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-500 font-medium">
                    Sample
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
