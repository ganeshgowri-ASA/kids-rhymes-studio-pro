import { NextRequest, NextResponse } from "next/server";
import type { Timeline } from "@/lib/video/timeline";
import { validateTimeline } from "@/lib/video/timeline";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { timeline, format = "mp4", resolution = "720p", quality = 23 } = body as {
      timeline: Timeline;
      format?: string;
      resolution?: string;
      quality?: number;
    };

    const errors = validateTimeline(timeline);
    if (errors.length > 0) {
      return NextResponse.json({ error: "Invalid timeline", details: errors }, { status: 400 });
    }

    // Server-side rendering is limited — FFmpeg.wasm runs in the browser.
    // This endpoint validates the timeline and returns a render manifest
    // that the client uses for browser-based rendering.
    // For true server-side rendering, a Node.js FFmpeg binary would be needed.

    const imageTrack = timeline.tracks.find((t) => t.type === "image");
    const audioTrack = timeline.tracks.find((t) => t.type === "audio");
    const subtitleTrack = timeline.tracks.find((t) => t.type === "subtitle");

    const manifest = {
      images: (imageTrack?.items ?? []).map((item) => ({
        url: item.source,
        start: item.start,
        duration: item.duration,
        transition: item.transition ?? "none",
        transitionDuration: item.transitionDuration ?? 0.5,
      })),
      audio: (audioTrack?.items ?? []).map((item) => ({
        url: item.source,
        start: item.start,
        duration: item.duration,
      })),
      subtitles: (subtitleTrack?.items ?? []).map((item) => ({
        text: item.source,
        start: item.start,
        duration: item.duration,
      })),
      settings: { format, resolution, quality },
      totalDuration: timeline.duration,
      fps: timeline.fps,
    };

    return NextResponse.json({ manifest });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Render failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
