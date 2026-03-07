import { create } from "zustand";
import {
  type Timeline,
  type TrackType,
  type TimelineItem,
  createTimeline,
  addItem,
  removeItem,
  moveItem,
  resizeItem,
} from "@/lib/video/timeline";
import type { ExportFormat, ExportResolution } from "@/lib/video/ffmpeg-processor";

interface VideoState {
  timeline: Timeline;
  isRendering: boolean;
  progress: number;
  exportedUrl: string | null;
  playheadPosition: number;
  isPlaying: boolean;
  zoom: number;

  // Export settings
  exportFormat: ExportFormat;
  exportResolution: ExportResolution;
  exportQuality: number;

  // Actions
  resetTimeline: () => void;
  addTimelineItem: (
    trackType: TrackType,
    item: Omit<TimelineItem, "id" | "trackType">
  ) => void;
  removeTimelineItem: (itemId: string) => void;
  moveTimelineItem: (itemId: string, newStart: number) => void;
  resizeTimelineItem: (itemId: string, newDuration: number) => void;
  setRendering: (rendering: boolean) => void;
  setProgress: (progress: number) => void;
  setExportedUrl: (url: string | null) => void;
  setPlayheadPosition: (pos: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setZoom: (zoom: number) => void;
  setExportFormat: (format: ExportFormat) => void;
  setExportResolution: (resolution: ExportResolution) => void;
  setExportQuality: (quality: number) => void;
}

export const useVideoStore = create<VideoState>((set) => ({
  timeline: createTimeline(),
  isRendering: false,
  progress: 0,
  exportedUrl: null,
  playheadPosition: 0,
  isPlaying: false,
  zoom: 1,
  exportFormat: "mp4",
  exportResolution: "720p",
  exportQuality: 23,

  resetTimeline: () =>
    set({ timeline: createTimeline(), exportedUrl: null, progress: 0 }),

  addTimelineItem: (trackType, item) =>
    set((s) => ({ timeline: addItem(s.timeline, trackType, item) })),

  removeTimelineItem: (itemId) =>
    set((s) => ({ timeline: removeItem(s.timeline, itemId) })),

  moveTimelineItem: (itemId, newStart) =>
    set((s) => ({ timeline: moveItem(s.timeline, itemId, newStart) })),

  resizeTimelineItem: (itemId, newDuration) =>
    set((s) => ({ timeline: resizeItem(s.timeline, itemId, newDuration) })),

  setRendering: (isRendering) => set({ isRendering }),
  setProgress: (progress) => set({ progress }),
  setExportedUrl: (exportedUrl) => set({ exportedUrl }),
  setPlayheadPosition: (playheadPosition) => set({ playheadPosition }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setZoom: (zoom) => set({ zoom: Math.max(0.25, Math.min(4, zoom)) }),
  setExportFormat: (exportFormat) => set({ exportFormat }),
  setExportResolution: (exportResolution) => set({ exportResolution }),
  setExportQuality: (exportQuality) => set({ exportQuality }),
}));
