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
  { label: string; description: string; sunoTag: string }
> = {
  lullaby: {
    label: "Lullaby",
    description: "Soft, soothing melodies for bedtime",
    sunoTag: "gentle lullaby, soft piano, soothing, children",
  },
  upbeat_kids: {
    label: "Upbeat Kids",
    description: "Fun, energetic tunes for playtime",
    sunoTag: "upbeat children song, happy, playful, clapping",
  },
  classical_indian: {
    label: "Classical Indian",
    description: "Traditional ragas adapted for children",
    sunoTag: "indian classical, sitar, tabla, melodic, children friendly",
  },
  folk_indian: {
    label: "Folk Indian",
    description: "Regional folk music styles",
    sunoTag: "indian folk, dholak, flute, festive, kids",
  },
  pop_kids: {
    label: "Pop Kids",
    description: "Modern pop for young audiences",
    sunoTag: "kids pop, catchy, modern, synthesizer, fun",
  },
};

const MOCK_AUDIO_URLS = [
  "https://cdn.pixabay.com/audio/2024/02/14/audio_8e2a50c527.mp3",
  "https://cdn.pixabay.com/audio/2022/10/18/audio_29e6e4a475.mp3",
  "https://cdn.pixabay.com/audio/2024/08/27/audio_e0767fccb5.mp3",
];

const pendingTasks = new Map<string, MusicResponse>();

function isMockMode(): boolean {
  return !process.env.SUNO_API_KEY;
}

export async function generateMusic(
  req: MusicRequest
): Promise<MusicResponse> {
  const taskId = `task_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  if (isMockMode()) {
    const mockResponse: MusicResponse = {
      taskId,
      status: "processing",
      title: `${MUSIC_STYLES[req.style].label} - Generated`,
    };
    pendingTasks.set(taskId, mockResponse);

    // Simulate async generation completing after a delay
    setTimeout(() => {
      const stored = pendingTasks.get(taskId);
      if (stored) {
        stored.status = "complete";
        stored.audioUrl =
          MOCK_AUDIO_URLS[Math.floor(Math.random() * MOCK_AUDIO_URLS.length)];
        stored.duration = req.duration || 30;
      }
    }, 3000);

    return mockResponse;
  }

  // Real Suno API call
  const styleInfo = MUSIC_STYLES[req.style];
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
  const result: MusicResponse = {
    taskId: sunoId,
    status: "processing",
    title: data[0]?.title || `${styleInfo.label} Track`,
  };
  pendingTasks.set(sunoId, result);
  return result;
}

export async function getStatus(taskId: string): Promise<MusicResponse> {
  // Check in-memory cache first
  const cached = pendingTasks.get(taskId);

  if (isMockMode()) {
    return cached || { taskId, status: "error", errorMessage: "Task not found" };
  }

  // Real Suno API status check
  const response = await fetch(
    `${process.env.SUNO_API_URL}/api/get?ids=${taskId}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.SUNO_API_KEY}`,
      },
    }
  );

  if (!response.ok) {
    return cached || { taskId, status: "error", errorMessage: "Status check failed" };
  }

  const data = await response.json();
  const track = data[0];

  if (!track) {
    return { taskId, status: "error", errorMessage: "Track not found" };
  }

  const result: MusicResponse = {
    taskId,
    status: track.status === "complete" ? "complete" : "processing",
    audioUrl: track.audio_url,
    title: track.title,
    duration: track.duration,
  };
  pendingTasks.set(taskId, result);
  return result;
}

export function getAudioUrl(taskId: string): string | undefined {
  return pendingTasks.get(taskId)?.audioUrl;
}
