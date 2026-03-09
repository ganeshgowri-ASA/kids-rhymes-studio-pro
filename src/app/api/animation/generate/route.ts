import { NextRequest, NextResponse } from "next/server";
import { generateImage, generateAnimationFrames } from "@/lib/image/replicate-client";
import { generateMusic } from "@/lib/music/suno-client";
import type { MusicStyle } from "@/lib/music/suno-client";

// Animation generation pipeline:
// 1. Takes a rhyme/story text + style preferences
// 2. Uses AI to generate scene descriptions from the text
// 3. Generates cartoon frames for each scene
// 4. Generates background music
// 5. Returns all assets for client-side video composition

interface AnimationRequest {
  title: string;
  text: string; // The rhyme or story text
  language?: string;
  musicStyle?: MusicStyle;
  scenes?: number; // Number of scenes to generate (default: 4)
  aspectRatio?: "16:9" | "1:1" | "9:16";
}

interface SceneData {
  sceneNumber: number;
  description: string;
  subtitle: string;
  imageUrl?: string;
  duration: number; // seconds
}

interface AnimationResponse {
  id: string;
  status: "generating" | "complete" | "error";
  scenes: SceneData[];
  musicUrl?: string;
  musicTitle?: string;
  totalDuration: number;
  error?: string;
}

// Split text into scenes based on line breaks or punctuation
function splitIntoScenes(text: string, numScenes: number): string[] {
  // Split by double newlines, then single newlines, then sentences
  let parts = text.split(/\n\n+/).filter((p) => p.trim());

  if (parts.length < numScenes) {
    // Try single newlines
    parts = text.split(/\n+/).filter((p) => p.trim());
  }

  if (parts.length < numScenes) {
    // Try sentences
    parts = text.split(/[.!?]+/).filter((p) => p.trim());
  }

  // Group parts into numScenes groups
  if (parts.length <= numScenes) {
    return parts.map((p) => p.trim());
  }

  // Distribute parts evenly across scenes
  const result: string[] = [];
  const perScene = Math.ceil(parts.length / numScenes);
  for (let i = 0; i < numScenes; i++) {
    const start = i * perScene;
    const end = Math.min(start + perScene, parts.length);
    result.push(parts.slice(start, end).join(" ").trim());
  }
  return result.filter((s) => s);
}

// Generate a visual description from text for image generation
function textToSceneDescription(text: string, sceneNum: number, total: number): string {
  // Create a visual scene description from the rhyme text
  const cleanText = text.replace(/[^a-zA-Z0-9\s,.'!?]/g, " ").trim();

  // Add scene-specific context
  let context = "";
  if (sceneNum === 1) context = "opening scene, establishing shot, ";
  else if (sceneNum === total) context = "final scene, happy ending, ";
  else context = `scene ${sceneNum} of ${total}, continuing story, `;

  return `${context}illustrating: ${cleanText.slice(0, 150)}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      text,
      language = "en",
      musicStyle = "upbeat_kids",
      scenes: numScenes = 4,
      aspectRatio = "16:9",
    } = body as AnimationRequest;

    if (!text || !title) {
      return NextResponse.json(
        { error: "Title and text are required" },
        { status: 400 }
      );
    }

    const animationId = `anim_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // Step 1: Split text into scenes
    const sceneTexts = splitIntoScenes(text, numScenes);
    const actualScenes = sceneTexts.length;
    const durationPerScene = Math.max(4, Math.ceil(30 / actualScenes));

    // Step 2: Generate scene descriptions for image generation
    const sceneDescriptions = sceneTexts.map((st, i) =>
      textToSceneDescription(st, i + 1, actualScenes)
    );

    // Step 3: Generate images and music in parallel
    const [frameResults, musicResult] = await Promise.all([
      // Generate cartoon frames
      generateAnimationFrames(
        `kids rhyme about ${title}`,
        sceneDescriptions,
        "cartoon",
        aspectRatio
      ),
      // Generate background music
      generateMusic({
        lyrics: text.slice(0, 500),
        style: musicStyle,
        duration: actualScenes * durationPerScene,
        instrumental: false,
      }),
    ]);

    // Step 4: Compile results
    const scenes: SceneData[] = sceneTexts.map((st, i) => ({
      sceneNumber: i + 1,
      description: sceneDescriptions[i],
      subtitle: st,
      imageUrl: frameResults[i]?.imageUrl,
      duration: durationPerScene,
    }));

    const response: AnimationResponse = {
      id: animationId,
      status: "complete",
      scenes,
      musicUrl: musicResult.audioUrl,
      musicTitle: musicResult.title,
      totalDuration: actualScenes * durationPerScene,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Animation generation error:", error);
    return NextResponse.json(
      {
        error: "Animation generation failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
