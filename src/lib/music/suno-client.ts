export interface MusicRequest { lyrics: string; style: string; duration?: number; instrumental?: boolean; }
export interface MusicResponse { taskId: string; status: string; audioUrl?: string; }
const STYLES = ['lullaby', 'upbeat_kids', 'classical_indian', 'folk_indian', 'pop_kids'];
export async function generateMusic(req: MusicRequest): Promise<MusicResponse> {
  return { taskId: `mock_${Date.now()}`, status: 'complete', audioUrl: 'https://cdn.pixabay.com/audio/2024/02/14/audio_8e2a50c527.mp3' };
}
