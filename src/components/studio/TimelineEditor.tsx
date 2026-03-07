"use client";

import { useCallback, useRef } from "react";
import {
  Layers,
  Music,
  Mic,
  Type,
  Trash2,
  Lock,
  Unlock,
  VolumeX,
  Volume2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useVideoStore } from "@/store/video-store";
import type { Track, TrackType, TimelineItem } from "@/lib/video/timeline";

const TRACK_HEIGHT = 56;
const PIXELS_PER_SECOND_BASE = 80;
const SNAP_THRESHOLD = 0.25; // seconds

const TRACK_ICONS: Record<TrackType, typeof Layers> = {
  image: Layers,
  audio: Music,
  narration: Mic,
  subtitle: Type,
};

const TRACK_COLORS: Record<TrackType, string> = {
  image: "bg-blue-400/80",
  audio: "bg-pink-400/80",
  narration: "bg-purple-400/80",
  subtitle: "bg-amber-400/80",
};

export default function TimelineEditor() {
  const {
    timeline,
    zoom,
    playheadPosition,
    moveTimelineItem,
    resizeTimelineItem,
    removeTimelineItem,
    setPlayheadPosition,
    setZoom,
  } = useVideoStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const pxPerSec = PIXELS_PER_SECOND_BASE * zoom;
  const totalWidth = Math.max(timeline.duration + 10, 30) * pxPerSec;

  const snapToGrid = useCallback(
    (seconds: number) => {
      const gridSize = SNAP_THRESHOLD;
      return Math.round(seconds / gridSize) * gridSize;
    },
    []
  );

  const handleTimelineClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left + (containerRef.current?.scrollLeft ?? 0);
      setPlayheadPosition(Math.max(0, x / pxPerSec));
    },
    [pxPerSec, setPlayheadPosition]
  );

  const handleDragStart = useCallback(
    (e: React.DragEvent, item: TimelineItem) => {
      e.dataTransfer.setData("itemId", item.id);
      e.dataTransfer.setData("offsetX", String(e.nativeEvent.offsetX));
    },
    []
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const itemId = e.dataTransfer.getData("itemId");
      const offsetX = parseFloat(e.dataTransfer.getData("offsetX") || "0");
      if (!itemId) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left + (containerRef.current?.scrollLeft ?? 0) - offsetX;
      const newStart = snapToGrid(Math.max(0, x / pxPerSec));
      moveTimelineItem(itemId, newStart);
    },
    [pxPerSec, snapToGrid, moveTimelineItem]
  );

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700 bg-gray-800">
        <span className="text-sm text-gray-300 font-medium">Timeline</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom(zoom - 0.25)}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs text-gray-400 w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(zoom + 0.25)}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Track labels */}
        <div className="w-36 flex-shrink-0 border-r border-gray-700">
          {/* Time ruler spacer */}
          <div className="h-6 border-b border-gray-700" />
          {timeline.tracks.map((track) => (
            <TrackLabel key={track.id} track={track} />
          ))}
        </div>

        {/* Scrollable timeline area */}
        <div ref={containerRef} className="flex-1 overflow-x-auto overflow-y-hidden">
          {/* Time ruler */}
          <TimeRuler pxPerSec={pxPerSec} totalWidth={totalWidth} />

          {/* Tracks */}
          <div
            className="relative"
            onClick={handleTimelineClick}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            style={{ width: totalWidth }}
          >
            {timeline.tracks.map((track) => (
              <div
                key={track.id}
                className="relative border-b border-gray-700/50"
                style={{ height: TRACK_HEIGHT }}
              >
                {track.items.map((item) => (
                  <TimelineItemBlock
                    key={item.id}
                    item={item}
                    pxPerSec={pxPerSec}
                    trackHeight={TRACK_HEIGHT}
                    onDragStart={handleDragStart}
                    onResize={(newDuration) =>
                      resizeTimelineItem(item.id, newDuration)
                    }
                    onRemove={() => removeTimelineItem(item.id)}
                    locked={track.locked}
                  />
                ))}
              </div>
            ))}

            {/* Playhead */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20 pointer-events-none"
              style={{ left: playheadPosition * pxPerSec }}
            >
              <div className="w-3 h-3 bg-red-500 rounded-full -ml-[5px] -mt-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrackLabel({ track }: { track: Track }) {
  const Icon = TRACK_ICONS[track.type];
  return (
    <div
      className="flex items-center gap-2 px-3 border-b border-gray-700/50"
      style={{ height: TRACK_HEIGHT }}
    >
      <Icon className="w-4 h-4 text-gray-400" />
      <span className="text-xs text-gray-300 flex-1 truncate">{track.label}</span>
      <div className="flex gap-1">
        <button className="text-gray-500 hover:text-gray-300">
          {track.muted ? (
            <VolumeX className="w-3 h-3" />
          ) : (
            <Volume2 className="w-3 h-3" />
          )}
        </button>
        <button className="text-gray-500 hover:text-gray-300">
          {track.locked ? (
            <Lock className="w-3 h-3" />
          ) : (
            <Unlock className="w-3 h-3" />
          )}
        </button>
      </div>
    </div>
  );
}

function TimeRuler({
  pxPerSec,
  totalWidth,
}: {
  pxPerSec: number;
  totalWidth: number;
}) {
  const marks: { pos: number; label: string }[] = [];
  const interval = pxPerSec >= 60 ? 1 : pxPerSec >= 30 ? 2 : 5;

  for (let t = 0; t * pxPerSec < totalWidth; t += interval) {
    const m = Math.floor(t / 60);
    const s = t % 60;
    marks.push({
      pos: t * pxPerSec,
      label: `${m}:${String(s).padStart(2, "0")}`,
    });
  }

  return (
    <div
      className="h-6 relative border-b border-gray-700 bg-gray-800/50"
      style={{ width: totalWidth }}
    >
      {marks.map((mark) => (
        <div
          key={mark.pos}
          className="absolute top-0 bottom-0 flex flex-col items-start"
          style={{ left: mark.pos }}
        >
          <span className="text-[10px] text-gray-500 pl-1">{mark.label}</span>
          <div className="w-px h-full bg-gray-700/50" />
        </div>
      ))}
    </div>
  );
}

function TimelineItemBlock({
  item,
  pxPerSec,
  trackHeight,
  onDragStart,
  onResize,
  onRemove,
  locked,
}: {
  item: TimelineItem;
  pxPerSec: number;
  trackHeight: number;
  onDragStart: (e: React.DragEvent, item: TimelineItem) => void;
  onResize: (newDuration: number) => void;
  onRemove: () => void;
  locked?: boolean;
}) {
  const width = item.duration * pxPerSec;
  const left = item.start * pxPerSec;
  const colorClass = TRACK_COLORS[item.trackType];

  const handleResizeEnd = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (locked) return;

      const startX = e.clientX;
      const startDuration = item.duration;

      const onMouseMove = (ev: MouseEvent) => {
        const delta = (ev.clientX - startX) / pxPerSec;
        onResize(Math.max(0.1, startDuration + delta));
      };

      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [item.duration, pxPerSec, onResize, locked]
  );

  return (
    <div
      draggable={!locked}
      onDragStart={(e) => onDragStart(e, item)}
      className={`absolute top-1 bottom-1 rounded-md ${colorClass} cursor-grab active:cursor-grabbing group flex items-center overflow-hidden select-none`}
      style={{ left, width: Math.max(width, 4) }}
      title={item.label ?? item.source}
    >
      <span className="text-[10px] text-white font-medium px-2 truncate flex-1">
        {item.label ?? item.trackType}
      </span>
      {!locked && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="hidden group-hover:flex items-center justify-center w-5 h-5 mr-1 rounded bg-black/30 text-white/80 hover:text-white"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
      {/* Resize handle */}
      {!locked && (
        <div
          onMouseDown={handleResizeEnd}
          className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-white/20"
        />
      )}
    </div>
  );
}
