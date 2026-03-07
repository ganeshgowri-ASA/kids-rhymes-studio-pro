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

function isMockMode(): boolean {
  return !process.env.REPLICATE_API_TOKEN || process.env.USE_MOCK_IMAGES === "true";
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

let replicateClient: Replicate | null = null;

function getClient(): Replicate {
  if (!replicateClient) {
    replicateClient = new Replicate({ auth: process.env.REPLICATE_API_TOKEN! });
  }
  return replicateClient;
}

export async function generateImage(req: ImageRequest): Promise<ImageResponse> {
  if (isMockMode()) {
    return getMockResponse(req);
  }

  const client = getClient();
  const model = MODELS[req.style];
  const dim = ASPECT_DIMENSIONS[req.aspectRatio ?? "16:9"];

  try {
    const input: Record<string, unknown> = {
      prompt: req.prompt,
      width: dim.width,
      height: dim.height,
    };

    if (req.style === "cartoon") {
      input.negative_prompt = req.negativePrompt ?? "scary, violent, blood, dark, horror, realistic photo";
      input.num_inference_steps = 30;
      input.guidance_scale = 7.5;
    }

    if (req.style === "realistic") {
      input.aspect_ratio = req.aspectRatio ?? "16:9";
      input.num_inference_steps = 4;
    }

    const createParams = req.style === "realistic"
      ? { model, input }
      : { version: model.split(":")[1], input };

    const prediction = await client.predictions.create(createParams);

    return {
      id: prediction.id,
      status: prediction.status as ImageResponse["status"],
      imageUrl: undefined,
    };
  } catch (error) {
    return {
      id: `err_${Date.now()}`,
      status: "failed",
      error: error instanceof Error ? error.message : "Image generation failed",
    };
  }
}

export async function checkPredictionStatus(predictionId: string): Promise<ImageResponse> {
  if (isMockMode() || predictionId.startsWith("mock_")) {
    return {
      id: predictionId,
      status: "succeeded",
      imageUrl: `https://placehold.co/1024x576/FFB6C1/333?text=Mock+Image`,
    };
  }

  const client = getClient();

  try {
    const prediction = await client.predictions.get(predictionId);
    let imageUrl: string | undefined;

    if (prediction.status === "succeeded" && prediction.output) {
      const output = prediction.output;
      imageUrl = Array.isArray(output) ? output[0] : (output as string);
    }

    return {
      id: prediction.id,
      status: prediction.status as ImageResponse["status"],
      imageUrl,
      error: prediction.error ? String(prediction.error) : undefined,
    };
  } catch (error) {
    return {
      id: predictionId,
      status: "failed",
      error: error instanceof Error ? error.message : "Status check failed",
    };
  }
}
