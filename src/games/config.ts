import Phaser from 'phaser';

export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;

export function createGameConfig(scene: typeof Phaser.Scene): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent: 'phaser-game',
    backgroundColor: '#f0f9ff',
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false,
      },
    },
    scene: [scene],
  };
}

// Multilingual number words
export const NUMBER_WORDS: Record<string, string[]> = {
  en: ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
    'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'],
  hi: ['शून्य', 'एक', 'दो', 'तीन', 'चार', 'पाँच', 'छह', 'सात', 'आठ', 'नौ', 'दस',
    'ग्यारह', 'बारह', 'तेरह', 'चौदह', 'पंद्रह', 'सोलह', 'सत्रह', 'अठारह', 'उन्नीस', 'बीस'],
  te: ['సున్న', 'ఒకటి', 'రెండు', 'మూడు', 'నాలుగు', 'ఐదు', 'ఆరు', 'ఏడు', 'ఎనిమిది', 'తొమ్మిది', 'పది',
    'పదకొండు', 'పన్నెండు', 'పదమూడు', 'పధ్నాలుగు', 'పదిహేను', 'పదహారు', 'పదిహేడు', 'పధ్ధెనిమిది', 'పంతొమ్మిది', 'ఇరవై'],
  ta: ['பூஜ்யம்', 'ஒன்று', 'இரண்டு', 'மூன்று', 'நான்கு', 'ஐந்து', 'ஆறு', 'ஏழு', 'எட்டு', 'ஒன்பது', 'பத்து',
    'பதினொன்று', 'பன்னிரண்டு', 'பதிமூன்று', 'பதினான்கு', 'பதினைந்து', 'பதினாறு', 'பதினேழு', 'பதினெட்டு', 'பத்தொன்பது', 'இருபது'],
  bn: ['শূন্য', 'এক', 'দুই', 'তিন', 'চার', 'পাঁচ', 'ছয়', 'সাত', 'আট', 'নয়', 'দশ',
    'এগারো', 'বারো', 'তেরো', 'চৌদ্দ', 'পনেরো', 'ষোলো', 'সতেরো', 'আঠারো', 'উনিশ', 'কুড়ি'],
  gu: ['શૂન્ય', 'એક', 'બે', 'ત્રણ', 'ચાર', 'પાંચ', 'છ', 'સાત', 'આઠ', 'નવ', 'દસ',
    'અગિયાર', 'બાર', 'તેર', 'ચૌદ', 'પંદર', 'સોળ', 'સત્તર', 'અઢાર', 'ઓગણીસ', 'વીસ'],
  kn: ['ಸೊನ್ನೆ', 'ಒಂದು', 'ಎರಡು', 'ಮೂರು', 'ನಾಲ್ಕು', 'ಐದು', 'ಆರು', 'ಏಳು', 'ಎಂಟು', 'ಒಂಬತ್ತು', 'ಹತ್ತು',
    'ಹನ್ನೊಂದು', 'ಹನ್ನೆರಡು', 'ಹದಿಮೂರು', 'ಹದಿನಾಲ್ಕು', 'ಹದಿನೈದು', 'ಹದಿನಾರು', 'ಹದಿನೇಳು', 'ಹದಿನೆಂಟು', 'ಹತ್ತೊಂಬತ್ತು', 'ಇಪ್ಪತ್ತು'],
};

// Multilingual labels
export const LABELS: Record<string, Record<string, string>> = {
  en: { score: 'Score', level: 'Level', time: 'Time', stars: 'Stars', great: 'Great!', perfect: 'Perfect!', tryAgain: 'Try Again', next: 'Next', done: 'Done!', tap: 'Tap to start' },
  hi: { score: 'अंक', level: 'स्तर', time: 'समय', stars: 'सितारे', great: 'बहुत अच्छे!', perfect: 'परफेक्ट!', tryAgain: 'फिर कोशिश करो', next: 'अगला', done: 'हो गया!', tap: 'शुरू करने के लिए टैप करें' },
  te: { score: 'స్కోరు', level: 'స్థాయి', time: 'సమయం', stars: 'నక్షత్రాలు', great: 'భలే!', perfect: 'అద్భుతం!', tryAgain: 'మళ్ళీ ప్రయత్నించు', next: 'తదుపరి', done: 'అయింది!', tap: 'ప్రారంభించడానికి నొక్కండి' },
  ta: { score: 'மதிப்பெண்', level: 'நிலை', time: 'நேரம்', stars: 'நட்சத்திரங்கள்', great: 'நன்று!', perfect: 'சிறப்பு!', tryAgain: 'மீண்டும் முயற்சி', next: 'அடுத்து', done: 'முடிந்தது!', tap: 'தொடங்க தட்டவும்' },
  bn: { score: 'স্কোর', level: 'স্তর', time: 'সময়', stars: 'তারা', great: 'দারুণ!', perfect: 'নিখুঁত!', tryAgain: 'আবার চেষ্টা কর', next: 'পরবর্তী', done: 'হয়ে গেছে!', tap: 'শুরু করতে ট্যাপ করুন' },
  gu: { score: 'સ્કોર', level: 'સ્તર', time: 'સમય', stars: 'તારા', great: 'શાબાશ!', perfect: 'ઉત્તમ!', tryAgain: 'ફરી પ્રયાસ કરો', next: 'આગળ', done: 'થઈ ગયું!', tap: 'શરૂ કરવા ટેપ કરો' },
  kn: { score: 'ಅಂಕ', level: 'ಹಂತ', time: 'ಸಮಯ', stars: 'ನಕ್ಷತ್ರ', great: 'ಭಲೇ!', perfect: 'ಅದ್ಭುತ!', tryAgain: 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ', next: 'ಮುಂದೆ', done: 'ಆಯಿತು!', tap: 'ಪ್ರಾರಂಭಿಸಲು ಟ್ಯಾಪ್ ಮಾಡಿ' },
};

export function getLabel(lang: string, key: string): string {
  return LABELS[lang]?.[key] || LABELS['en'][key] || key;
}

export function getNumberWord(lang: string, n: number): string {
  return NUMBER_WORDS[lang]?.[n] || NUMBER_WORDS['en'][n] || String(n);
}

// Emoji sets for games
export const ANIMAL_EMOJIS = ['🐶', '🐱', '🐰', '🐻', '🦁', '🐸', '🐵', '🦊', '🐼', '🐨', '🐯', '🦋'];
export const FRUIT_EMOJIS = ['🍎', '🍌', '🍇', '🍊', '🍓', '🍑', '🍒', '🥭', '🍍', '🍉'];
export const OBJECT_EMOJIS = ['⭐', '🌙', '☀️', '🌈', '🎈', '🎀', '🎁', '🏀', '⚽', '🎵'];
