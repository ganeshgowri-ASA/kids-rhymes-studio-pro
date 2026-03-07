import { MusicStyle } from "./suno-client";

export interface SampleTrack {
  id: string;
  title: string;
  style: MusicStyle;
  duration: number;
  audioUrl: string;
  description: string;
}

export const SAMPLE_TRACKS: SampleTrack[] = [
  {
    id: "sample_lullaby_01",
    title: "Twinkle Little Star",
    style: "lullaby",
    duration: 45,
    audioUrl: "https://cdn.pixabay.com/audio/2024/02/14/audio_8e2a50c527.mp3",
    description: "A gentle lullaby with soft piano and strings",
  },
  {
    id: "sample_upbeat_01",
    title: "Happy Clap Along",
    style: "upbeat_kids",
    duration: 38,
    audioUrl: "https://cdn.pixabay.com/audio/2022/10/18/audio_29e6e4a475.mp3",
    description: "Energetic kids tune with clapping and percussion",
  },
  {
    id: "sample_classical_01",
    title: "Little Raga",
    style: "classical_indian",
    duration: 52,
    audioUrl: "https://cdn.pixabay.com/audio/2024/08/27/audio_e0767fccb5.mp3",
    description: "Child-friendly classical Indian melody with sitar",
  },
  {
    id: "sample_folk_01",
    title: "Festival Dance",
    style: "folk_indian",
    duration: 40,
    audioUrl: "https://cdn.pixabay.com/audio/2024/02/14/audio_8e2a50c527.mp3",
    description: "Festive folk tune with dholak and flute",
  },
  {
    id: "sample_pop_01",
    title: "ABC Pop Song",
    style: "pop_kids",
    duration: 35,
    audioUrl: "https://cdn.pixabay.com/audio/2022/10/18/audio_29e6e4a475.mp3",
    description: "Catchy modern pop tune for learning alphabets",
  },
];
