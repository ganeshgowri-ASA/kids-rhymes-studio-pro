import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

type ProgressCallback = (progress: number) => void;

let ffmpegInstance: FFmpeg | null = null;

export async function initFFmpeg(
  onProgress?: ProgressCallback
): Promise<FFmpeg> {
  if (ffmpegInstance && ffmpegInstance.loaded) return ffmpegInstance;

  const ffmpeg = new FFmpeg();

  ffmpeg.on("progress", ({ progress }) => {
    onProgress?.(Math.round(progress * 100));
  });

  const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
  });

  ffmpegInstance = ffmpeg;
  return ffmpeg;
}

export async function createVideoFromImages(
  images: { url: string; duration: number }[],
  fps: number = 24,
  onProgress?: ProgressCallback
): Promise<Uint8Array> {
  const ffmpeg = await initFFmpeg(onProgress);

  for (let i = 0; i < images.length; i++) {
    const data = await fetchFile(images[i].url);
    await ffmpeg.writeFile(`img${i}.png`, data);
  }

  // Build concat filter with per-image duration
  const inputs: string[] = [];
  const filterParts: string[] = [];
  for (let i = 0; i < images.length; i++) {
    inputs.push("-loop", "1", "-t", String(images[i].duration), "-i", `img${i}.png`);
    filterParts.push(`[${i}:v]scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,setsar=1[v${i}]`);
  }

  const concatInputs = images.map((_, i) => `[v${i}]`).join("");
  const filter = `${filterParts.join(";")};${concatInputs}concat=n=${images.length}:v=1:a=0[outv]`;

  await ffmpeg.exec([
    ...inputs,
    "-filter_complex", filter,
    "-map", "[outv]",
    "-r", String(fps),
    "-pix_fmt", "yuv420p",
    "-c:v", "libx264",
    "-preset", "fast",
    "output_video.mp4",
  ]);

  const data = await ffmpeg.readFile("output_video.mp4");
  return data as Uint8Array;
}

export async function addAudioToVideo(
  videoData: Uint8Array,
  audioUrl: string,
  onProgress?: ProgressCallback
): Promise<Uint8Array> {
  const ffmpeg = await initFFmpeg(onProgress);

  await ffmpeg.writeFile("input_video.mp4", videoData);
  const audioData = await fetchFile(audioUrl);
  await ffmpeg.writeFile("input_audio.mp3", audioData);

  await ffmpeg.exec([
    "-i", "input_video.mp4",
    "-i", "input_audio.mp3",
    "-c:v", "copy",
    "-c:a", "aac",
    "-shortest",
    "-map", "0:v:0",
    "-map", "1:a:0",
    "video_with_audio.mp4",
  ]);

  const data = await ffmpeg.readFile("video_with_audio.mp4");
  return data as Uint8Array;
}

export async function addSubtitles(
  videoData: Uint8Array,
  subtitles: { start: number; end: number; text: string }[],
  onProgress?: ProgressCallback
): Promise<Uint8Array> {
  const ffmpeg = await initFFmpeg(onProgress);

  await ffmpeg.writeFile("sub_input.mp4", videoData);

  const srt = subtitles
    .map((s, i) => {
      const fmt = (t: number) => {
        const h = Math.floor(t / 3600);
        const m = Math.floor((t % 3600) / 60);
        const sec = Math.floor(t % 60);
        const ms = Math.round((t % 1) * 1000);
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
      };
      return `${i + 1}\n${fmt(s.start)} --> ${fmt(s.end)}\n${s.text}\n`;
    })
    .join("\n");

  await ffmpeg.writeFile("subs.srt", new TextEncoder().encode(srt));

  await ffmpeg.exec([
    "-i", "sub_input.mp4",
    "-vf", "subtitles=subs.srt:force_style='FontSize=24,PrimaryColour=&HFFFFFF&'",
    "-c:a", "copy",
    "video_with_subs.mp4",
  ]);

  const data = await ffmpeg.readFile("video_with_subs.mp4");
  return data as Uint8Array;
}

export async function concatenateVideos(
  videos: Uint8Array[],
  onProgress?: ProgressCallback
): Promise<Uint8Array> {
  const ffmpeg = await initFFmpeg(onProgress);

  const listLines: string[] = [];
  for (let i = 0; i < videos.length; i++) {
    const name = `segment${i}.mp4`;
    await ffmpeg.writeFile(name, videos[i]);
    listLines.push(`file '${name}'`);
  }

  await ffmpeg.writeFile("concat_list.txt", new TextEncoder().encode(listLines.join("\n")));

  await ffmpeg.exec([
    "-f", "concat",
    "-safe", "0",
    "-i", "concat_list.txt",
    "-c", "copy",
    "concatenated.mp4",
  ]);

  const data = await ffmpeg.readFile("concatenated.mp4");
  return data as Uint8Array;
}

export type ExportFormat = "mp4" | "webm" | "gif";
export type ExportResolution = "720p" | "1080p";

export async function exportVideo(
  videoData: Uint8Array,
  format: ExportFormat = "mp4",
  resolution: ExportResolution = "720p",
  quality: number = 23,
  onProgress?: ProgressCallback
): Promise<Uint8Array> {
  const ffmpeg = await initFFmpeg(onProgress);

  await ffmpeg.writeFile("export_input.mp4", videoData);

  const scale = resolution === "1080p" ? "1920:1080" : "1280:720";
  const outputName = `exported.${format}`;

  const args: string[] = ["-i", "export_input.mp4", "-vf", `scale=${scale}`];

  switch (format) {
    case "mp4":
      args.push("-c:v", "libx264", "-crf", String(quality), "-preset", "fast", "-c:a", "aac");
      break;
    case "webm":
      args.push("-c:v", "libvpx-vp9", "-crf", String(quality), "-b:v", "0", "-c:a", "libopus");
      break;
    case "gif":
      args.push("-vf", `scale=${scale},fps=10`, "-loop", "0");
      break;
  }

  args.push(outputName);
  await ffmpeg.exec(args);

  const data = await ffmpeg.readFile(outputName);
  return data as Uint8Array;
}
