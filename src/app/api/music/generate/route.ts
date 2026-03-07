import { NextRequest, NextResponse } from "next/server";
import { generateMusic, MusicStyle, MUSIC_STYLES } from "@/lib/music/suno-client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { lyrics, style, duration, instrumental } = body;

    if (!lyrics || typeof lyrics !== "string") {
      return NextResponse.json(
        { error: "Lyrics text is required" },
        { status: 400 }
      );
    }

    if (!style || !(style in MUSIC_STYLES)) {
      return NextResponse.json(
        { error: `Invalid style. Must be one of: ${Object.keys(MUSIC_STYLES).join(", ")}` },
        { status: 400 }
      );
    }

    const result = await generateMusic({
      lyrics,
      style: style as MusicStyle,
      duration: typeof duration === "number" ? Math.min(Math.max(duration, 15), 120) : 30,
      instrumental: instrumental ?? false,
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Failed to generate music" },
      { status: 500 }
    );
  }
}
