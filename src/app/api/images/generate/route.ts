import { NextRequest, NextResponse } from "next/server";
import { generateImage, type ImageStyle, type AspectRatio } from "@/lib/image/replicate-client";
import { buildPrompt, getNegativePrompt } from "@/lib/image/prompt-builder";

interface GenerateRequestBody {
  prompt: string;
  style: ImageStyle;
  aspectRatio?: AspectRatio;
  theme?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequestBody = await req.json();

    if (!body.prompt || !body.style) {
      return NextResponse.json(
        { error: "prompt and style are required" },
        { status: 400 }
      );
    }

    if (!["cartoon", "realistic"].includes(body.style)) {
      return NextResponse.json(
        { error: "style must be 'cartoon' or 'realistic'" },
        { status: 400 }
      );
    }

    const fullPrompt = buildPrompt(body.prompt, body.style, body.theme);
    const negativePrompt = getNegativePrompt(body.style);

    const result = await generateImage({
      prompt: fullPrompt,
      style: body.style,
      aspectRatio: body.aspectRatio ?? "16:9",
      negativePrompt,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Generation failed" },
      { status: 500 }
    );
  }
}
