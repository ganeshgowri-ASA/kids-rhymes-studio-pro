import Replicate from "replicate";

export type ImageStyle = "cartoon" | "realistic";
export type AspectRatio = "16:9" | "1:1" | "9:16";

export interface ImageRequest {
  prompt: string;
  style: ImageStyle;
  aspectRatio?: AspectRatio;
  negativePrompt?: string;
}

export interface ImageResponse {
  id: string;
  status: "starting" | "processing" | "succeeded" | "failed";
  imageUrl?: string;
  error?: string;
}

const MODELS = {
  cartoon: "stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc",
  realistic: "black-forest-labs/flux-schnell",
} as const;

const ASPECT_DIMENSIONS: Record<AspectRatio, { width: number; height: number }> = {
  "16:9": { width: 1344, height: 768 },
  "1:1": { width: 1024, height: 1024 },
  "9:16": { width: 768, height: 1344 },
};

// Cartoon-specific prompt enhancers
const CARTOON_STYLE_PREFIX =
  "colorful cartoon illustration for children, cute characters, vibrant colors, kid-friendly, storybook style, ";
const CARTOON_NEGATIVE =
  "realistic, photographic, dark, scary, violent, adult content, nsfw";

// Backend detection
type ImageBackend = "replicate" | "huggingface" | "google" | "mock";

function getBackend(): ImageBackend {
  if (process.env.REPLICATE_API_TOKEN) return "replicate";
  if (process.env.HF_TOKEN) return "huggingface";
  if (process.env.GOOGLE_AI_KEY) return "google";
  return "mock";
}

function isMockMode(): boolean {
  return getBackend() === "mock";
}

function getMockResponse(req: ImageRequest): ImageResponse {
  const dim = ASPECT_DIMENSIONS[req.aspectRatio ?? "16:9"];
  const label = req.style === "cartoon" ? "Cartoon+Scene" : "Realistic+Scene";
  const bg = req.style === "cartoon" ? "FFB6C1" : "87CEEB";
  return {
    id: `mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    status: "succeeded",
    imageUrl: `https://placehold.co/${dim.width}x${dim.height}/${bg}/333?text=${label}`,
  };
}

// HuggingFace Stable Diffusion XL integration
async function generateWithHuggingFace(
  req: ImageRequest
): Promise<ImageResponse> {
  const id = `hf_img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const dim = ASPECT_DIMENSIONS[req.aspectRatio ?? "16:9"];

  // Enhance prompt for cartoon style
  const enhancedPrompt =
    req.style === "cartoon"
      ? `${CARTOON_STYLE_PREFIX}${req.prompt}`
      : req.prompt;

  const negativePrompt =
    req.style === "cartoon"
      ? `${CARTOON_NEGATIVE}, ${req.negativePrompt || ""}`
      : req.negativePrompt || "";

  try {
    // Use HF Inference API with Stable Diffusion XL
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: enhancedPrompt,
          parameters: {
            negative_prompt: negativePrompt,
            width: Math.min(dim.width, 1024),
            height: Math.min(dim.height, 1024),
            num_inference_steps: 25,
            guidance_scale: 7.5,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("HF Image generation error:", response.status, errorText);

      if (response.status === 503) {
        return {
          id,
          status: "processing",
          error: "Model is loading, please retry in ~30s",
        };
      }

      // Fallback to mock
      console.warn("Falling back to mock image");
      return getMockResponse(req);
    }

    // Response is raw image bytes
    const imageBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString("base64");
    const imageDataUrl = `data:image/png;base64,${base64Image}`;

    return {
      id,
      status: "succeeded",
      imageUrl: imageDataUrl,
    };
  } catch (error) {
    console.error("HF Image generation failed:", error);
    return getMockResponse(req);
  }
}

let replicateClient: Replicate | null = null;

function getClient(): Replicate {
  if (!replicateClient) {
    replicateClient = new Replicate({ auth: process.env.REPLICATE_API_TOKEN! });
  }
  return replicateClient;
}

export async function generateImage(
  req: ImageRequest
): Promise<ImageResponse> {
  const backend = getBackend();
  console.log(`[ImageGen] Using backend: ${backend}`);

  if (backend === "mock") {
    return getMockResponse(req);
  }

  if (backend === "huggingface") {
    return generateWithHuggingFace(req);
  }

  // Replicate backend
  const client = getClient();
  const dim = ASPECT_DIMENSIONS[req.aspectRatio ?? "16:9"];
  const model = MODELS[req.style];

  const enhancedPrompt =
    req.style === "cartoon"
      ? `${CARTOON_STYLE_PREFIX}${req.prompt}`
      : req.prompt;

  try {
    const id = `rep_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    if (req.style === "cartoon") {
      const output = await client.run(model as `${string}/${string}:${string}`, {
        input: {
          prompt: enhancedPrompt,
          negative_prompt: `${CARTOON_NEGATIVE}, ${req.negativePrompt || ""}`,
          width: dim.width,
          height: dim.height,
          num_inference_steps: 30,
          guidance_scale: 7.5,
        },
      });

      const imageUrl = Array.isArray(output) ? output[0] : output;
      return {
        id,
        status: "succeeded",
        imageUrl: typeof imageUrl === "string" ? imageUrl : undefined,
      };
    } else {
      const output = await client.run(model as `${string}/${string}`, {
        input: {
          prompt: enhancedPrompt,
          num_outputs: 1,
          aspect_ratio: req.aspectRatio || "16:9",
          output_format: "png",
        },
      });

      const imageUrl = Array.isArray(output) ? output[0] : output;
      return {
        id,
        status: "succeeded",
        imageUrl: typeof imageUrl === "string" ? imageUrl : undefined,
      };
    }
  } catch (error) {
    console.error("Replicate generation failed:", error);
    // Try HF fallback if available
    if (process.env.HF_TOKEN) {
      console.log("Trying HuggingFace fallback...");
      return generateWithHuggingFace(req);
    }
    return getMockResponse(req);
  }
}

export async function getImageStatus(id: string): Promise<ImageResponse> {
  if (id.startsWith("mock_") || id.startsWith("hf_img_")) {
    return { id, status: "succeeded" };
  }

  if (!process.env.REPLICATE_API_TOKEN) {
    return { id, status: "succeeded" };
  }

  try {
    const client = getClient();
    const prediction = await client.predictions.get(id);
    return {
      id,
      status: prediction.status as ImageResponse["status"],
      imageUrl: Array.isArray(prediction.output)
        ? prediction.output[0]
        : prediction.output,
      error: prediction.error?.toString(),
    };
  } catch (error) {
    return { id, status: "failed", error: "Status check failed" };
  }
}

// Generate multiple frames for animation sequences
export async function generateAnimationFrames(
  basePrompt: string,
  frameDescriptions: string[],
  style: ImageStyle = "cartoon",
  aspectRatio: AspectRatio = "16:9"
): Promise<ImageResponse[]> {
  const results: ImageResponse[] = [];

  for (const frameDesc of frameDescriptions) {
    const result = await generateImage({
      prompt: `${basePrompt}, ${frameDesc}`,
      style,
      aspectRatio,
      negativePrompt: "blurry, low quality, distorted",
    });
    results.push(result);

    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return results;
}
