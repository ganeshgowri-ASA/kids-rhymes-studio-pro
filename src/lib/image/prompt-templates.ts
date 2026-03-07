export interface SceneTemplate {
  id: string;
  title: string;
  prompt: string;
  category: TemplateCategory;
  theme?: string;
}

export type TemplateCategory = "animals" | "festivals" | "nature" | "daily_life" | "learning";

export const CATEGORY_LABELS: Record<TemplateCategory, string> = {
  animals: "Animals",
  festivals: "Festivals",
  nature: "Nature",
  daily_life: "Daily Life",
  learning: "Learning",
};

export const SCENE_TEMPLATES: SceneTemplate[] = [
  // Animals (4)
  {
    id: "animals-1",
    title: "Parrots in Mango Tree",
    prompt: "Colorful Indian parrots sitting on a mango tree with ripe mangoes, lush green leaves",
    category: "animals",
  },
  {
    id: "animals-2",
    title: "Elephants at River",
    prompt: "Baby elephant playing with mother elephant at a peaceful river, splashing water joyfully",
    category: "animals",
  },
  {
    id: "animals-3",
    title: "Peacock Dancing in Rain",
    prompt: "A beautiful peacock with full feathers spread out dancing in gentle monsoon rain, green grass",
    category: "animals",
  },
  {
    id: "animals-4",
    title: "Cows in Village",
    prompt: "Friendly cows with decorated horns in an Indian village with mud houses and green fields",
    category: "animals",
  },

  // Festivals (4)
  {
    id: "festivals-1",
    title: "Diwali Celebrations",
    prompt: "Happy Indian kids lighting diyas and candles during Diwali night, beautiful rangoli on floor",
    category: "festivals",
    theme: "diwali",
  },
  {
    id: "festivals-2",
    title: "Holi Colors",
    prompt: "Joyful children playing Holi, throwing colorful gulal powder in the air, laughing together",
    category: "festivals",
    theme: "holi",
  },
  {
    id: "festivals-3",
    title: "Pongal Harvest",
    prompt: "Family celebrating Pongal with overflowing rice pot, sugarcane, and kolam designs on ground",
    category: "festivals",
    theme: "pongal",
  },
  {
    id: "festivals-4",
    title: "Ganesh Chaturthi",
    prompt: "Kids making a clay Ganesha idol together, flowers and modak sweets around them",
    category: "festivals",
    theme: "ganesh_chaturthi",
  },

  // Nature (4)
  {
    id: "nature-1",
    title: "Rainbow over Rice Fields",
    prompt: "A bright rainbow arching over lush green rice paddy fields, farmers in the distance, blue sky",
    category: "nature",
  },
  {
    id: "nature-2",
    title: "Butterflies in Garden",
    prompt: "Colorful butterflies flying around a beautiful Indian garden with marigolds and jasmine flowers",
    category: "nature",
  },
  {
    id: "nature-3",
    title: "Sunset over Mountains",
    prompt: "Golden sunset over the Himalayan mountains, birds flying across the orange sky, peaceful scene",
    category: "nature",
  },
  {
    id: "nature-4",
    title: "Monsoon Magic",
    prompt: "Kids playing in monsoon rain puddles, paper boats floating, green trees, joy and laughter",
    category: "nature",
  },

  // Daily Life (4)
  {
    id: "daily-1",
    title: "Playing Cricket",
    prompt: "Indian kids playing cricket in a village ground, colorful clothes, trees in background, sunny day",
    category: "daily_life",
  },
  {
    id: "daily-2",
    title: "Reading Under Banyan Tree",
    prompt: "Children sitting under a large banyan tree reading colorful storybooks together",
    category: "daily_life",
  },
  {
    id: "daily-3",
    title: "Kite Flying",
    prompt: "Happy kids flying colorful kites on a rooftop during Makar Sankranti, blue sky full of kites",
    category: "daily_life",
  },
  {
    id: "daily-4",
    title: "Village School",
    prompt: "Children in a cheerful Indian village school, sitting on mats, learning with a kind teacher",
    category: "daily_life",
  },

  // Learning (4)
  {
    id: "learning-1",
    title: "Counting with Fruits",
    prompt: "Cute arrangement of Indian fruits - mangoes, bananas, guavas - arranged for counting 1 to 10",
    category: "learning",
  },
  {
    id: "learning-2",
    title: "Alphabet Animals",
    prompt: "Indian animals arranged with alphabet letters - A for Antelope, B for Bengal Tiger, cute educational poster",
    category: "learning",
  },
  {
    id: "learning-3",
    title: "Colors of India",
    prompt: "A vibrant scene showing different colors through Indian objects - red chili, yellow turmeric, green parrot, blue pottery",
    category: "learning",
  },
  {
    id: "learning-4",
    title: "Musical Instruments",
    prompt: "Collection of Indian musical instruments - tabla, sitar, flute, veena - arranged beautifully for kids",
    category: "learning",
  },
];

export function getTemplatesByCategory(category: TemplateCategory): SceneTemplate[] {
  return SCENE_TEMPLATES.filter((t) => t.category === category);
}

export function getTemplateById(id: string): SceneTemplate | undefined {
  return SCENE_TEMPLATES.find((t) => t.id === id);
}
