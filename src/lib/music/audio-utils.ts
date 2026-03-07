export interface WaveformData {
  peaks: number[];
  duration: number;
}

export interface FrequencyData {
  frequencies: Uint8Array;
  waveform: Uint8Array;
}

let audioContext: AudioContext | null = null;

export function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
  return audioContext;
}

export async function extractWaveform(
  audioBuffer: AudioBuffer,
  numPeaks: number = 200
): Promise<WaveformData> {
  const channelData = audioBuffer.getChannelData(0);
  const samplesPerPeak = Math.floor(channelData.length / numPeaks);
  const peaks: number[] = [];

  for (let i = 0; i < numPeaks; i++) {
    const start = i * samplesPerPeak;
    const end = Math.min(start + samplesPerPeak, channelData.length);
    let max = 0;
    for (let j = start; j < end; j++) {
      const abs = Math.abs(channelData[j]);
      if (abs > max) max = abs;
    }
    peaks.push(max);
  }

  return { peaks, duration: audioBuffer.duration };
}

export async function loadAudioBuffer(url: string): Promise<AudioBuffer> {
  const ctx = getAudioContext();
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return ctx.decodeAudioData(arrayBuffer);
}

export function createAnalyser(
  source: MediaElementAudioSourceNode
): AnalyserNode {
  const ctx = getAudioContext();
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 256;
  analyser.smoothingTimeConstant = 0.8;
  source.connect(analyser);
  analyser.connect(ctx.destination);
  return analyser;
}

export function getFrequencyData(analyser: AnalyserNode): FrequencyData {
  const frequencies = new Uint8Array(analyser.frequencyBinCount);
  const waveform = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(frequencies);
  analyser.getByteTimeDomainData(waveform);
  return { frequencies, waveform };
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export const PASTEL_COLORS = [
  "#FFB6C1", // pink
  "#87CEEB", // sky blue
  "#DDA0DD", // plum
  "#98FB98", // pale green
  "#FFD700", // gold
  "#FFA07A", // light salmon
  "#E6E6FA", // lavender
  "#FFDAB9", // peach
];
