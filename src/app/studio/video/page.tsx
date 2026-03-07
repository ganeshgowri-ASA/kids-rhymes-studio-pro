"use client";

import { useCallback, useRef, useState } from "react";
import {
  ArrowLeft,
  ImagePlus,
  Music,
  Mic,
  Type,
  Film,
  Trash2,
  RotateCcw,
} from "lucide-react";
import { useVideoStore } from "@/store/video-store";
import { TRANSITION_OPTIONS } from "@/lib/video/transitions";
import type { TrackType, TransitionType } from "@/lib/video/timeline";
import TimelineEditor from "@/components/studio/TimelineEditor";
import VideoPreview from "@/components/studio/VideoPreview";
import ExportDialog from "@/components/studio/ExportDialog";

const ADD_BUTTONS: { type: TrackType; icon: typeof ImagePlus; label: string; accept: string }[] = [
  { type: "image", icon: ImagePlus, label: "Add Scene", accept: "image/*" },
  { type: "audio", icon: Music, label: "Add Audio", accept: "audio/*" },
  { type: "narration", icon: Mic, label: "Add Narration", accept: "audio/*" },
];

export default function VideoStudioPage() {
  const { timeline, addTimelineItem, resetTimeline } = useVideoStore();
  const [exportOpen, setExportOpen] = useState(false);
  const [subtitleText, setSubtitleText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingTrackType, setPendingTrackType] = useState<TrackType | null>(null);
  const [selectedTransition, setSelectedTransition] = useState<TransitionType>("fade");

  const handleFileSelect = useCallback(
    (trackType: TrackType, accept: string) => {
      setPendingTrackType(trackType);
      if (fileInputRef.current) {
        fileInputRef.current.accept = accept;
        fileInputRef.current.click();
      }
    },
    []
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !pendingTrackType) return;

      const url = URL.createObjectURL(file);
      const lastItem = timeline.tracks
        .find((t) => t.type === pendingTrackType)
        ?.items.sort((a, b) => a.start + a.duration - (b.start + b.duration))
        .at(-1);

      const start = lastItem ? lastItem.start + lastItem.duration : 0;

      addTimelineItem(pendingTrackType, {
        start,
        duration: pendingTrackType === "image" ? 5 : 10,
        source: url,
        label: file.name,
        transition: pendingTrackType === "image" ? selectedTransition : undefined,
        transitionDuration: 0.5,
      });

      setPendingTrackType(null);
      e.target.value = "";
    },
    [pendingTrackType, timeline, addTimelineItem, selectedTransition]
  );

  const handleAddSubtitle = useCallback(() => {
    if (!subtitleText.trim()) return;

    const lastSub = timeline.tracks
      .find((t) => t.type === "subtitle")
      ?.items.sort((a, b) => a.start + a.duration - (b.start + b.duration))
      .at(-1);

    const start = lastSub ? lastSub.start + lastSub.duration : 0;

    addTimelineItem("subtitle", {
      start,
      duration: 3,
      source: subtitleText.trim(),
      label: subtitleText.trim().slice(0, 30),
    });

    setSubtitleText("");
  }, [subtitleText, timeline, addTimelineItem]);

  const imageCount = timeline.tracks.find((t) => t.type === "image")?.items.length ?? 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />

      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/studio" className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </a>
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-green-400" />
            <h1 className="text-lg font-bold">Video Composer</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={resetTimeline}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-400 hover:text-white border border-gray-700 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
          <button
            onClick={() => setExportOpen(true)}
            disabled={imageCount === 0}
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-bold bg-green-500 hover:bg-green-400 text-white rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Film className="w-3.5 h-3.5" />
            Export Video
          </button>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Top section: Preview + Import panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Preview */}
          <div className="lg:col-span-2">
            <VideoPreview />
          </div>

          {/* Import panel */}
          <div className="bg-gray-900 rounded-xl border border-gray-700 p-4 space-y-4">
            <h2 className="text-sm font-bold text-gray-300">Import Assets</h2>

            {/* File import buttons */}
            {ADD_BUTTONS.map(({ type, icon: Icon, label, accept }) => (
              <button
                key={type}
                onClick={() => handleFileSelect(type, accept)}
                className="flex items-center gap-3 w-full p-3 rounded-lg border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white transition-all text-sm"
              >
                <Icon className="w-5 h-5 text-blue-400" />
                {label}
              </button>
            ))}

            {/* Transition selector for images */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Scene Transition</label>
              <select
                value={selectedTransition}
                onChange={(e) => setSelectedTransition(e.target.value as TransitionType)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300"
              >
                {TRANSITION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Subtitle input */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Add Subtitle</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={subtitleText}
                  onChange={(e) => setSubtitleText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddSubtitle()}
                  placeholder="Enter subtitle text..."
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 placeholder-gray-600"
                />
                <button
                  onClick={handleAddSubtitle}
                  disabled={!subtitleText.trim()}
                  className="p-2 bg-amber-500 hover:bg-amber-400 text-white rounded-lg disabled:opacity-40 transition-colors"
                >
                  <Type className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="pt-3 border-t border-gray-700 space-y-1">
              <p className="text-xs text-gray-500">
                Scenes: <span className="text-gray-300">{imageCount}</span>
              </p>
              <p className="text-xs text-gray-500">
                Duration:{" "}
                <span className="text-gray-300">{timeline.duration.toFixed(1)}s</span>
              </p>
              <p className="text-xs text-gray-500">
                Tracks:{" "}
                <span className="text-gray-300">
                  {timeline.tracks.filter((t) => t.items.length > 0).length} active
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <TimelineEditor />
      </div>

      {/* Export dialog */}
      <ExportDialog open={exportOpen} onClose={() => setExportOpen(false)} />
    </div>
  );
}
