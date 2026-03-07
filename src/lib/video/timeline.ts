export type TrackType = "image" | "audio" | "narration" | "subtitle";

export type TransitionType =
  | "none"
  | "fade"
  | "crossfade"
  | "slide-left"
  | "slide-right"
  | "zoom-in"
  | "zoom-out";

export interface TimelineItem {
  id: string;
  trackType: TrackType;
  start: number; // seconds
  duration: number; // seconds
  source: string; // url or text content for subtitles
  label?: string;
  transition?: TransitionType;
  transitionDuration?: number; // seconds
}

export interface Track {
  id: string;
  type: TrackType;
  label: string;
  items: TimelineItem[];
  muted?: boolean;
  locked?: boolean;
}

export interface Timeline {
  tracks: Track[];
  duration: number; // total duration in seconds
  fps: number;
}

let nextId = 0;
function generateId(): string {
  return `item_${Date.now()}_${nextId++}`;
}

export function createTimeline(fps: number = 24): Timeline {
  return {
    tracks: [
      { id: "track-image", type: "image", label: "Scenes", items: [] },
      { id: "track-audio", type: "audio", label: "Audio", items: [] },
      { id: "track-narration", type: "narration", label: "Narration", items: [] },
      { id: "track-subtitle", type: "subtitle", label: "Subtitles", items: [] },
    ],
    duration: 0,
    fps,
  };
}

export function addItem(
  timeline: Timeline,
  trackType: TrackType,
  item: Omit<TimelineItem, "id" | "trackType">
): Timeline {
  const track = timeline.tracks.find((t) => t.type === trackType);
  if (!track) return timeline;

  const newItem: TimelineItem = {
    ...item,
    id: generateId(),
    trackType,
  };

  const updatedTrack = { ...track, items: [...track.items, newItem] };
  const updatedTracks = timeline.tracks.map((t) =>
    t.id === track.id ? updatedTrack : t
  );

  return {
    ...timeline,
    tracks: updatedTracks,
    duration: recalcDuration(updatedTracks),
  };
}

export function removeItem(timeline: Timeline, itemId: string): Timeline {
  const updatedTracks = timeline.tracks.map((track) => ({
    ...track,
    items: track.items.filter((i) => i.id !== itemId),
  }));

  return {
    ...timeline,
    tracks: updatedTracks,
    duration: recalcDuration(updatedTracks),
  };
}

export function moveItem(
  timeline: Timeline,
  itemId: string,
  newStart: number
): Timeline {
  const clamped = Math.max(0, newStart);
  const updatedTracks = timeline.tracks.map((track) => ({
    ...track,
    items: track.items.map((item) =>
      item.id === itemId ? { ...item, start: clamped } : item
    ),
  }));

  return {
    ...timeline,
    tracks: updatedTracks,
    duration: recalcDuration(updatedTracks),
  };
}

export function resizeItem(
  timeline: Timeline,
  itemId: string,
  newDuration: number
): Timeline {
  const clamped = Math.max(0.1, newDuration);
  const updatedTracks = timeline.tracks.map((track) => ({
    ...track,
    items: track.items.map((item) =>
      item.id === itemId ? { ...item, duration: clamped } : item
    ),
  }));

  return {
    ...timeline,
    tracks: updatedTracks,
    duration: recalcDuration(updatedTracks),
  };
}

export function validateTimeline(timeline: Timeline): string[] {
  const errors: string[] = [];
  const imageTrack = timeline.tracks.find((t) => t.type === "image");

  if (!imageTrack || imageTrack.items.length === 0) {
    errors.push("At least one scene/image is required.");
  }

  for (const track of timeline.tracks) {
    for (const item of track.items) {
      if (item.duration <= 0) {
        errors.push(`Item "${item.label ?? item.id}" has invalid duration.`);
      }
      if (item.start < 0) {
        errors.push(`Item "${item.label ?? item.id}" has negative start time.`);
      }
    }

    // Check overlaps within each track
    const sorted = [...track.items].sort((a, b) => a.start - b.start);
    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1];
      const curr = sorted[i];
      if (prev.start + prev.duration > curr.start) {
        errors.push(
          `Overlapping items in ${track.label}: "${prev.label ?? prev.id}" and "${curr.label ?? curr.id}".`
        );
      }
    }
  }

  return errors;
}

function recalcDuration(tracks: Track[]): number {
  let max = 0;
  for (const track of tracks) {
    for (const item of track.items) {
      const end = item.start + item.duration;
      if (end > max) max = end;
    }
  }
  return max;
}
