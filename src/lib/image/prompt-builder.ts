export const SCENE_TEMPLATES = [
  { category: 'Animals', scenes: ['Colorful parrots in a mango tree', 'Elephants at a river', 'Peacock dancing in rain'] },
  { category: 'Festivals', scenes: ['Kids celebrating Diwali with diyas', 'Holi colors celebration', 'Pongal harvest festival'] },
  { category: 'Nature', scenes: ['Rainbow over rice paddy fields', 'Butterflies in a garden', 'Sunset over mountains'] },
  { category: 'Daily Life', scenes: ['Kids playing cricket', 'Reading under a banyan tree', 'Mother cooking in kitchen'] },
];
export function buildPrompt(scene: string, style: 'cartoon' | 'realistic'): string {
  const base = style === 'cartoon'
    ? `${scene}, cartoon style, bright colors, kid-friendly, cute, no text, high quality illustration`
    : `${scene}, photorealistic, soft lighting, warm colors, safe for kids, high quality photo`;
  return base;
}
