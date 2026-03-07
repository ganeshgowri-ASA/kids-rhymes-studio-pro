import type { ImageStyle } from "./replicate-client";

export interface IndianTheme {
  name: string;
  keywords: string[];
  colors: string[];
}

export const INDIAN_THEMES: Record<string, IndianTheme> = {
  diwali: {
    name: "Diwali",
    keywords: ["diyas", "rangoli", "fireworks", "sweets", "lanterns", "oil lamps"],
    colors: ["golden", "orange", "warm yellow", "deep red"],
  },
  holi: {
    name: "Holi",
    keywords: ["colors", "gulal", "pichkari", "water balloons", "celebration"],
    colors: ["vibrant pink", "bright blue", "vivid green", "sunny yellow", "purple"],
  },
  pongal: {
    name: "Pongal",
    keywords: ["harvest", "rice pot", "sugarcane", "kolam", "sun god", "cattle"],
    colors: ["earthy brown", "golden yellow", "green", "terracotta"],
  },
  onam: {
    name: "Onam",
    keywords: ["pookalam", "boat race", "sadya", "Kathakali", "tiger dance"],
    colors: ["white", "golden", "green", "orange"],
  },
  raksha_bandhan: {
    name: "Raksha Bandhan",
    keywords: ["rakhi", "brother sister", "sweets", "thread ceremony"],
    colors: ["red", "gold", "saffron", "pink"],
  },
  ganesh_chaturthi: {
    name: "Ganesh Chaturthi",
    keywords: ["Ganesha idol", "modak", "flowers", "procession", "prayers"],
    colors: ["vermillion", "gold", "green", "white"],
  },
};

const NEGATIVE_PROMPT_CARTOON =
  "scary, violent, blood, dark, horror, realistic photo, photographic, nsfw, weapon, gun, knife, injury, death, skeleton, zombie";

const NEGATIVE_PROMPT_REALISTIC =
  "cartoon, anime, illustration, scary, violent, blood, dark, horror, nsfw, weapon, gun, knife, deformed, ugly, blurry, bad anatomy";

const KIDS_SAFETY_SUFFIX = "safe for children, wholesome, family-friendly, cheerful atmosphere";

export function buildCartoonPrompt(scene: string, theme?: string): string {
  const parts = [scene];

  if (theme && INDIAN_THEMES[theme]) {
    const t = INDIAN_THEMES[theme];
    parts.push(`Indian ${t.name} festival theme`);
    parts.push(t.keywords.slice(0, 3).join(", "));
    parts.push(`${t.colors.slice(0, 2).join(" and ")} color palette`);
  }

  parts.push(
    "cartoon style",
    "bright vivid colors",
    "cute kid-friendly illustration",
    "rounded shapes",
    "no text or watermark",
    "high quality digital art",
    KIDS_SAFETY_SUFFIX
  );

  return parts.join(", ");
}

export function buildRealisticPrompt(scene: string, theme?: string): string {
  const parts = [scene];

  if (theme && INDIAN_THEMES[theme]) {
    const t = INDIAN_THEMES[theme];
    parts.push(`Indian ${t.name} celebration`);
    parts.push(t.keywords.slice(0, 3).join(", "));
    parts.push(`warm ${t.colors.slice(0, 2).join(" and ")} tones`);
  }

  parts.push(
    "photorealistic",
    "soft natural lighting",
    "warm inviting colors",
    "shallow depth of field",
    "high resolution photograph",
    KIDS_SAFETY_SUFFIX
  );

  return parts.join(", ");
}

export function buildPrompt(scene: string, style: ImageStyle, theme?: string): string {
  return style === "cartoon"
    ? buildCartoonPrompt(scene, theme)
    : buildRealisticPrompt(scene, theme);
}

export function getNegativePrompt(style: ImageStyle): string {
  return style === "cartoon" ? NEGATIVE_PROMPT_CARTOON : NEGATIVE_PROMPT_REALISTIC;
}
