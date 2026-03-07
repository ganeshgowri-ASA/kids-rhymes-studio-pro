export type LLMProvider = 'groq' | 'openai' | 'anthropic' | 'gemini';

export interface LyricsRequest {
  theme: string;
  language: string;
  provider: LLMProvider;
  customPrompt?: string;
}

export interface LyricsResponse {
  lyrics: string;
  title: string;
  language: string;
  provider: LLMProvider;
}

const MOCK_LYRICS: Record<string, { title: string; lyrics: string }> = {
  animals: {
    title: 'The Happy Animals',
    lyrics: `The cow goes moo, the duck goes quack,
The dog goes woof, the cat goes mew,
The rooster crows at the break of dawn,
And the little lamb says baa all day long!

The elephant stomps with feet so wide,
The monkey swings from side to side,
The parrot talks in colors bright,
And the owl says hoo-hoo in the night!`,
  },
  colors: {
    title: 'Rainbow Colors',
    lyrics: `Red like apples, red like a rose,
Blue like the sky wherever it goes,
Yellow like sunshine, happy and bright,
Green like the grass in morning light!

Orange like mangoes, sweet and round,
Purple like flowers growing from the ground,
Pink like a flamingo standing tall,
A rainbow of colors for one and all!`,
  },
  numbers: {
    title: 'Counting Fun',
    lyrics: `One little finger, two little toes,
Three little buttons on my clothes,
Four little kittens playing all day,
Five little birds that flew away!

Six little flowers in the garden grow,
Seven little stars that twinkle and glow,
Eight little fishes in the sea,
Nine little cookies just for me,
Ten little children, happy and free!`,
  },
  family: {
    title: 'My Loving Family',
    lyrics: `Mama makes chapati round and sweet,
Papa tells stories that can't be beat,
Dadi sings songs from long ago,
Dada's garden helps flowers grow!

Brother plays cricket in the sun,
Sister draws pictures, oh what fun,
Together we laugh, together we play,
Family love brightens every day!`,
  },
  nature: {
    title: 'Beautiful Nature',
    lyrics: `The sun comes up, the birds all sing,
Flowers bloom in the days of spring,
The river flows through valleys green,
The prettiest sight you've ever seen!

The rain comes down, pitter-patter-pat,
The frog goes jump and the fish goes splat,
The rainbow arcs across the sky,
Nature's magic, oh me oh my!`,
  },
  festivals: {
    title: 'Festival Joy',
    lyrics: `Diwali lights are shining bright,
Diyas glow through the festive night,
Rangoli colors on the floor,
Sweets and laughter at every door!

Holi colors flying in the air,
Pink and yellow everywhere,
Drums are beating, people dance,
Festivals of joy and happy chance!`,
  },
  food: {
    title: 'Yummy Food',
    lyrics: `Roti, roti, round and flat,
Daal is yummy, imagine that!
Rice so white like fluffy snow,
Sambar makes my tummy glow!

Mango lassi, cool and sweet,
Jalebi is a special treat,
Idli, dosa, fresh and hot,
I love everything in the pot!`,
  },
  transport: {
    title: 'Vehicles Go!',
    lyrics: `The bus goes honk, the train goes choo,
The auto rickshaw takes me and you,
The bicycle rings its bell so clear,
The airplane flies without any fear!

The boat sails on the water blue,
The rocket shoots right through and through,
The bullock cart goes slow and steady,
Wherever we go, we're always ready!`,
  },
  body: {
    title: 'My Body Parts',
    lyrics: `Head, shoulders, knees, and toes,
Eyes and ears and mouth and nose,
Hands that clap and feet that tap,
Fingers that snap and arms that flap!

My eyes can see the morning sun,
My legs can jump and skip and run,
My ears can hear the birdsong sweet,
My body's wonderful, head to feet!`,
  },
  seasons: {
    title: 'Four Seasons',
    lyrics: `Summer sun is hot and bright,
Mangoes sweet are pure delight,
Monsoon rain comes pouring down,
Puddles splashing all through town!

Autumn leaves fall red and gold,
Winter nights are crisp and cold,
Spring brings flowers, green, and cheer,
Four sweet seasons every year!`,
  },
};

const MOCK_HINDI: Record<string, { title: string; lyrics: string }> = {
  animals: {
    title: '\u091C\u093E\u0928\u0935\u0930\u094B\u0902 \u0915\u0940 \u0926\u0941\u0928\u093F\u092F\u093E',
    lyrics: `\u0917\u093E\u092F \u092C\u094B\u0932\u0947 \u092E\u094D\u092E\u0942, \u092C\u0924\u094D\u0916 \u092C\u094B\u0932\u0947 \u0915\u094D\u0935\u0948\u0915,
\u0915\u0941\u0924\u094D\u0924\u093E \u092C\u094B\u0932\u0947 \u092D\u094C\u0902, \u092C\u093F\u0932\u094D\u0932\u0940 \u092C\u094B\u0932\u0947 \u092E\u094D\u092F\u093E\u0909,
\u092E\u0941\u0930\u094D\u0917\u093E \u092C\u093E\u0902\u0917 \u0915\u0930\u0947 \u0938\u0941\u092C\u0939 \u0938\u0935\u0947\u0930\u0947,
\u0939\u0930 \u091C\u093E\u0928\u0935\u0930 \u0915\u0940 \u092C\u094B\u0932\u0940 \u0939\u0948 \u092A\u094D\u092F\u093E\u0930\u0940!`,
  },
  default: {
    title: '\u092C\u091A\u094D\u091A\u094B\u0902 \u0915\u0940 \u0915\u0935\u093F\u0924\u093E',
    lyrics: `\u091A\u0902\u0926\u093E \u092E\u093E\u092E\u093E \u0926\u0942\u0930 \u0915\u0947,
\u092A\u0941\u0906 \u0939\u094B \u092C\u0921\u093C\u093E \u092E\u091C\u0947\u0926\u093E\u0930,
\u0926\u0942\u0927 \u092E\u0932\u093E\u0908 \u0916\u093E\u0928\u093E \u0916\u0941\u0932\u093E,
\u0938\u093E\u0930\u093E \u091C\u0917 \u0939\u094B \u0909\u091C\u093F\u092F\u093E\u0930\u093E.`,
  },
};

const MOCK_TELUGU: Record<string, { title: string; lyrics: string }> = {
  animals: {
    title: '\u0C1C\u0C02\u0C24\u0C41\u0C35\u0C41\u0C32 \u0C2A\u0C3E\u0C1F',
    lyrics: `\u0C06\u0C35\u0C41 \u0C05\u0C02\u0C2C\u0C3E \u0C05\u0C28\u0C3F \u0C05\u0C30\u0C41\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F,
\u0C2C\u0C3E\u0C24\u0C41 \u0C15\u0C4D\u0C35\u0C3E\u0C15\u0C4D \u0C15\u0C4D\u0C35\u0C3E\u0C15\u0C4D \u0C05\u0C28\u0C3F \u0C05\u0C30\u0C41\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F,
\u0C15\u0C41\u0C15\u0C4D\u0C15 \u0C2D\u0C4C \u0C2D\u0C4C \u0C05\u0C28\u0C3F \u0C05\u0C30\u0C41\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F,
\u0C2A\u0C3F\u0C32\u0C4D\u0C32\u0C3F \u0C2E\u0C3F\u0C2F\u0C3E\u0C35\u0C4D \u0C05\u0C28\u0C3F \u0C05\u0C30\u0C41\u0C38\u0C4D\u0C24\u0C41\u0C02\u0C26\u0C3F!`,
  },
  default: {
    title: '\u0C1A\u0C02\u0C26\u0C2E\u0C3E\u0C2E \u0C2A\u0C3E\u0C1F',
    lyrics: `\u0C1A\u0C02\u0C26\u0C2E\u0C3E\u0C2E \u0C30\u0C3E\u0C35\u0C47,
\u0C1A\u0C15\u0C4D\u0C15\u0C28\u0C3F \u0C2A\u0C3E\u0C32\u0C41 \u0C24\u0C47\u0C35\u0C47,
\u0C1A\u0C41\u0C15\u0C4D\u0C15\u0C32\u0C41 \u0C2E\u0C46\u0C30\u0C3F\u0C38\u0C47,
\u0C2E\u0C41\u0C26\u0C4D\u0C26\u0C41 \u0C2E\u0C41\u0C26\u0C4D\u0C26\u0C41\u0C17\u0C3E \u0C28\u0C35\u0C4D\u0C35\u0C47.`,
  },
};

function getMockLyrics(theme: string, language: string): { title: string; lyrics: string } {
  if (language === 'hi') {
    return MOCK_HINDI[theme] ?? MOCK_HINDI.default;
  }
  if (language === 'te') {
    return MOCK_TELUGU[theme] ?? MOCK_TELUGU.default;
  }
  return MOCK_LYRICS[theme] ?? MOCK_LYRICS.animals;
}

function getAvailableProvider(): LLMProvider | null {
  if (process.env.GROQ_API_KEY) return 'groq';
  if (process.env.OPENAI_API_KEY) return 'openai';
  if (process.env.ANTHROPIC_API_KEY) return 'anthropic';
  if (process.env.GOOGLE_AI_API_KEY) return 'gemini';
  return null;
}

function hasApiKey(provider: LLMProvider): boolean {
  switch (provider) {
    case 'groq': return !!process.env.GROQ_API_KEY;
    case 'openai': return !!process.env.OPENAI_API_KEY;
    case 'anthropic': return !!process.env.ANTHROPIC_API_KEY;
    case 'gemini': return !!process.env.GOOGLE_AI_API_KEY;
  }
}

export async function generateLyrics(req: LyricsRequest): Promise<LyricsResponse> {
  const provider = hasApiKey(req.provider) ? req.provider : getAvailableProvider();

  if (!provider) {
    const mock = getMockLyrics(req.theme, req.language);
    return { ...mock, language: req.language, provider: req.provider };
  }

  const { buildRhymePrompt } = await import('./prompts');
  const prompt = req.customPrompt || buildRhymePrompt(req.theme, req.language);

  try {
    let lyrics: string;
    switch (provider) {
      case 'groq': {
        const { generateWithGroq } = await import('./groq-client');
        lyrics = await generateWithGroq(prompt);
        break;
      }
      case 'openai': {
        const { generateWithOpenAI } = await import('./openai-client');
        lyrics = await generateWithOpenAI(prompt);
        break;
      }
      case 'anthropic': {
        const { generateWithAnthropic } = await import('./anthropic-client');
        lyrics = await generateWithAnthropic(prompt);
        break;
      }
      case 'gemini': {
        const { generateWithGemini } = await import('./gemini-client');
        lyrics = await generateWithGemini(prompt);
        break;
      }
    }
    const titleMatch = lyrics.match(/^#?\s*(.+)/);
    const title = titleMatch ? titleMatch[1].replace(/^#+\s*/, '') : `${req.theme} Rhyme`;
    return { lyrics, title, language: req.language, provider };
  } catch {
    const mock = getMockLyrics(req.theme, req.language);
    return { ...mock, language: req.language, provider: req.provider };
  }
}

export async function* streamLyrics(req: LyricsRequest): AsyncGenerator<string> {
  const provider = hasApiKey(req.provider) ? req.provider : getAvailableProvider();

  if (!provider) {
    const mock = getMockLyrics(req.theme, req.language);
    const words = mock.lyrics.split(' ');
    for (const word of words) {
      yield word + ' ';
      await new Promise((r) => setTimeout(r, 50));
    }
    return;
  }

  const { buildRhymePrompt } = await import('./prompts');
  const prompt = req.customPrompt || buildRhymePrompt(req.theme, req.language);

  try {
    switch (provider) {
      case 'groq': {
        const { streamWithGroq } = await import('./groq-client');
        yield* streamWithGroq(prompt);
        break;
      }
      case 'openai': {
        const { streamWithOpenAI } = await import('./openai-client');
        yield* streamWithOpenAI(prompt);
        break;
      }
      case 'anthropic': {
        const { streamWithAnthropic } = await import('./anthropic-client');
        yield* streamWithAnthropic(prompt);
        break;
      }
      case 'gemini': {
        const { streamWithGemini } = await import('./gemini-client');
        yield* streamWithGemini(prompt);
        break;
      }
    }
  } catch {
    const mock = getMockLyrics(req.theme, req.language);
    yield mock.lyrics;
  }
}
