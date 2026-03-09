export type MusicStyle =
  | "lullaby"
  | "upbeat_kids"
  | "classical_indian"
  | "folk_indian"
  | "pop_kids";

export interface MusicRequest {
  lyrics: string;
  style: MusicStyle;
  duration?: number;
  instrumental?: boolean;
}

export interface MusicResponse {
  taskId: string;
  status: "pending" | "processing" | "complete" | "error";
  audioUrl?: string;
  title?: string;
  duration?: number;
  errorMessage?: string;
}

export const MUSIC_STYLES: Record<
  MusicStyle,
  { label: string; description: string; sunoTag: string; hfPrompt: string }
> = {
  lullaby: {
    label: "Lullaby",
    description: "Soft, soothing melodies for bedtime",
    sunoTag: "gentle lullaby, soft piano, soothing, children",
    hfPrompt: "gentle lullaby with soft piano and soothing melody for children bedtime",
  },
  upbeat_kids: {
    label: "Upbeat Kids",
    description: "Fun, energetic tunes for playtime",
    sunoTag: "upbeat children song, happy, playful, clapping",
    hfPrompt: "upbeat happy children song with clapping and playful melody",
  },
  classical_indian: {
    label: "Classical Indian",
    description: "Traditional ragas adapted for children",
    sunoTag: "indian classical, sitar, tabla, melodic, children friendly",
    hfPrompt: "indian classical music with sitar and tabla, melodic and children friendly",
  },
  folk_indian: {
    label: "Folk Indian",
    description: "Regional folk music styles",
    sunoTag: "indian folk, dholak, flute, festive, kids",
    hfPrompt: "indian folk music with dholak and flute, festive and joyful for kids",
  },
  pop_kids: {
    label: "Pop Kids",
    description: "Modern pop for young audiences",
    sunoTag: "kids pop, catchy, modern, synthesizer, fun",
    hfPrompt: "catchy modern kids pop song with synthesizer and fun beat",
  },
};

// Free kids music samples organized by style (fallback)
const STYLE_AUDIO_URLS: Record<MusicStyle, string[]> = {
  lullaby: [
    "https://cdn.pixabay.com/audio/2024/02/14/audio_8e2a50c527.mp3",
    "https://cdn.pixabay.com/audio/2022/10/18/audio_29e6e4a475.mp3",
  ],
  upbeat_kids: [
    "https://cdn.pixabay.com/audio/2024/08/27/audio_e0767fccb5.mp3",
    "https://cdn.pixabay.com/audio/2022/10/18/audio_29e6e4a475.mp3",
  ],
  classical_indian: [
    "https://cdn.pixabay.com/audio/2024/02/14/audio_8e2a50c527.mp3",
    "https://cdn.pixabay.com/audio/2024/08/27/audio_e0767fccb5.mp3",
  ],
  folk_indian: [
    "https://cdn.pixabay.com/audio/2022/10/18/audio_29e6e4a475.mp3",
    "https://cdn.pixabay.com/audio/2024/08/27/audio_e0767fccb5.mp3",
  ],
  pop_kids: [
    "https://cdn.pixabay.com/audio/2024/08/27/audio_e0767fccb5.mp3",
    "https://cdn.pixabay.com/audio/2024/02/14/audio_8e2a50c527.mp3",
  ],
};

// Determine which generation backend to use
type MusicBackend = "huggingface" | "suno" | "mock";

function getBackend(): MusicBackend {
  if (process.env.HF_TOKEN) return "huggingface";
  if (process.env.SUNO_API_KEY) return "suno";
  return "mock";
}

// HuggingFace MusicGen integration
async function generateWithHuggingFace(
  req: MusicRequest
): Promise<MusicResponse> {
  const taskId = `hf_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const styleInfo = MUSIC_STYLES[req.style];

  // Build prompt combining style and lyrics
  const prompt = req.instrumental
    ? styleInfo.hfPrompt
    : `${styleInfo.hfPrompt}, with vocals singing: ${req.lyrics.slice(0, 200)}`;

  try {
    // Use HuggingFace Inference API with facebook/musicgen-small
    const response = await fetch(
      "https://api-inference.huggingface.co/models/facebook/musicgen-small",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: Math.min((req.duration || 30) * 50, 1500),
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("HuggingFace MusicGen error:", response.status, errorText);

      // If model is loading, return processing status
      if (response.status === 503) {
        return {
          taskId,
          status: "processing",
          title: `${styleInfo.label} - Generating (model loading)`,
          errorMessage: "Model is loading, please retry in ~30s",
        };
      }

      // Fallback to mock on error
      console.warn("Falling back to mock audio");
      return getMockResponse(req, taskId);
    }

    // Response is raw audio bytes (WAV/FLAC)
    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString("base64");
    const audioDataUrl = `data:audio/wav;base64,${base64Audio}`;

    return {
      taskId,
      status: "complete",
      audioUrl: audioDataUrl,
      title: `${styleInfo.label} - AI Generated`,
      duration: req.duration || 30,
    };
  } catch (error) {
    console.error("HuggingFace MusicGen failed:", error);
    // Fallback to mock
    return getMockResponse(req, taskId);
  }
}

function getMockResponse(req: MusicRequest, taskId?: string): MusicResponse {
  const id = taskId || `mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const styleUrls = STYLE_AUDIO_URLS[req.style] || STYLE_AUDIO_URLS.lullaby;
  const audioUrl = styleUrls[Math.floor(Math.random() * styleUrls.length)];
  return {
    taskId: id,
    status: "complete",
    audioUrl,
    title: `${MUSIC_STYLES[req.style].label} - Sample Track`,
    duration: req.duration || 30,
  };
}

export async function generateMusic(
  req: MusicRequest
): Promise<MusicResponse> {
  const backend = getBackend();
  console.log(`[MusicGen] Using backend: ${backend}`);

  if (backend === "huggingface") {
    return generateWithHuggingFace(req);
  }

  if (backend === "suno") {
    // Real Suno API call
    const taskId = `suno_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const styleInfo = MUSIC_STYLES[req.style];
    try {
      const response = await fetch(`${process.env.SUNO_API_URL}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SUNO_API_KEY}`,
        },
        body: JSON.stringify({
          prompt: req.lyrics,
          tags: styleInfo.sunoTag,
          make_instrumental: req.instrumental ?? false,
          wait_audio: false,
        }),
      });

      if (!response.ok) {
        return { taskId, status: "error", errorMessage: "Failed to start generation" };
      }

      const data = await response.json();
      const sunoId = data[0]?.id || taskId;
      return {
        taskId: sunoId,
        status: "processing",
        title: data[0]?.title || `${styleInfo.label} Track`,
      };
    } catch (error) {
      console.error("Suno API failed:", error);
      return getMockResponse(req, taskId);
    }
  }

  // Mock mode
  return getMockResponse(req);
}

export async function getStatus(taskId: string): Promise<MusicResponse> {
  const backend = getBackend();

  // HuggingFace generates synchronously, so if we get here it means
  // the task was already completed or needs retry
  if (backend === "huggingface" || taskId.startsWith("hf_") || taskId.startsWith("mock_")) {
    return {
      taskId,
      status: "complete",
      audioUrl: STYLE_AUDIO_URLS.lullaby[0],
      title: "Generated Track",
      duration: 30,
    };
  }

  if (backend === "suno" && process.env.SUNO_API_KEY) {
    // Real Suno API status check
    try {
      const response = await fetch(
        `${process.env.SUNO_API_URL}/api/get?ids=${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.SUNO_API_KEY}`,
          },
        }
      );

      if (!response.ok) {
        return { taskId, status: "error", errorMessage: "Status check failed" };
      }

      const data = await response.json();
      const track = data[0];
      if (!track) {
        return { taskId, status: "error", errorMessage: "Track not found" };
      }

      return {
        taskId,
        status: track.status === "complete" ? "complete" : "processing",
        audioUrl: track.audio_url,
        title: track.title,
        duration: track.duration,
      };
    } catch (error) {
      return { taskId, status: "error", errorMessage: "Status check failed" };
    }
  }

  // Mock fallback
  return {
    taskId,
    status: "complete",
    audioUrl: STYLE_AUDIO_URLS.lullaby[0],
    title: "Generated Track",
    duration: 30,
  };
}

export function getAudioUrl(taskId: string): string | undefined {
  return STYLE_AUDIO_URLS.lullaby[0];
}
