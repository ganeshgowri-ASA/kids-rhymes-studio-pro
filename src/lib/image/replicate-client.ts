export type ImageStyle = 'cartoon' | 'realistic';
export interface ImageRequest { prompt: string; style: ImageStyle; aspectRatio?: string; }
export interface ImageResponse { id: string; status: string; imageUrl?: string; }
export async function generateImage(req: ImageRequest): Promise<ImageResponse> {
  const placeholder = req.style === 'cartoon'
    ? 'https://placehold.co/1024x576/FFB6C1/333?text=Cartoon+Scene'
    : 'https://placehold.co/1024x576/87CEEB/333?text=Realistic+Scene';
  return { id: `img_${Date.now()}`, status: 'complete', imageUrl: placeholder };
}
