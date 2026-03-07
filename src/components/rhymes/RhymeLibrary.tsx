'use client';

import { useState } from 'react';
import { BookOpen } from 'lucide-react';

interface LibraryRhyme {
  id: string;
  title: string;
  titleNative: string;
  language: string;
  lyrics: string;
  theme: string;
}

const LIBRARY: LibraryRhyme[] = [
  {
    id: 'machli',
    title: 'Machli Jal Ki Rani Hai',
    titleNative: '\u092E\u091B\u0932\u0940 \u091C\u0932 \u0915\u0940 \u0930\u093E\u0928\u0940 \u0939\u0948',
    language: 'hi',
    theme: 'animals',
    lyrics: `\u092E\u091B\u0932\u0940 \u091C\u0932 \u0915\u0940 \u0930\u093E\u0928\u0940 \u0939\u0948,
\u091C\u0940\u0935\u0928 \u0909\u0938\u0915\u093E \u092A\u093E\u0928\u0940 \u0939\u0948,
\u0939\u093E\u0925 \u0932\u0917\u093E\u0913 \u0924\u094B \u0921\u0930 \u091C\u093E\u092F\u0947\u0917\u0940,
\u092C\u093E\u0939\u0930 \u0928\u093F\u0915\u093E\u0932\u094B \u0924\u094B \u092E\u0930 \u091C\u093E\u092F\u0947\u0917\u0940!`,
  },
  {
    id: 'chanda-mama',
    title: 'Chanda Mama Door Ke',
    titleNative: '\u091A\u0902\u0926\u093E \u092E\u093E\u092E\u093E \u0926\u0942\u0930 \u0915\u0947',
    language: 'hi',
    theme: 'nature',
    lyrics: `\u091A\u0902\u0926\u093E \u092E\u093E\u092E\u093E \u0926\u0942\u0930 \u0915\u0947,
\u092A\u0941\u0906 \u0939\u094B \u092C\u0921\u093C\u093E \u092E\u091C\u0947\u0926\u093E\u0930,
\u0926\u0942\u0927 \u092E\u0932\u093E\u0908 \u0916\u093E\u0928\u093E \u0916\u0941\u0932\u093E,
\u0938\u093E\u0930\u093E \u091C\u0917 \u0939\u094B \u0909\u091C\u093F\u092F\u093E\u0930\u093E!`,
  },
  {
    id: 'nani-teri',
    title: 'Nani Teri Morni Ko Mor Le Gaye',
    titleNative: '\u0928\u093E\u0928\u0940 \u0924\u0947\u0930\u0940 \u092E\u094B\u0930\u0928\u0940 \u0915\u094B \u092E\u094B\u0930 \u0932\u0947 \u0917\u092F\u0947',
    language: 'hi',
    theme: 'family',
    lyrics: `\u0928\u093E\u0928\u0940 \u0924\u0947\u0930\u0940 \u092E\u094B\u0930\u0928\u0940 \u0915\u094B \u092E\u094B\u0930 \u0932\u0947 \u0917\u092F\u0947,
\u092C\u093E\u0915\u0940 \u091C\u094B \u092C\u091A\u093E \u0925\u093E \u0935\u094B \u092D\u0940 \u091A\u094B\u0930 \u0932\u0947 \u0917\u092F\u0947,
\u091A\u0932\u094B \u0928\u093E\u0928\u0940 \u0924\u0941\u092E\u0915\u094B \u0932\u0947 \u091A\u0932\u0947\u0902,
\u0928\u093E\u0928\u0940 \u0915\u0947 \u0918\u0930 \u092E\u0947\u0902 \u092E\u094B\u0930 \u0939\u0948 \u092C\u0939\u0941\u0924!`,
  },
  {
    id: 'lakdi-ki-kathi',
    title: 'Lakdi Ki Kathi',
    titleNative: '\u0932\u0915\u0921\u093C\u0940 \u0915\u0940 \u0915\u093E\u0920\u0940',
    language: 'hi',
    theme: 'transport',
    lyrics: `\u0932\u0915\u0921\u093C\u0940 \u0915\u0940 \u0915\u093E\u0920\u0940, \u0915\u093E\u0920\u0940 \u092A\u0947 \u0918\u094B\u0921\u093C\u093E,
\u0918\u094B\u0921\u093C\u0947 \u0915\u0940 \u0926\u0941\u092E, \u0926\u0941\u092E \u092A\u0947 \u0930\u093E\u091C\u093E,
\u0930\u093E\u091C\u093E \u0930\u093E\u0928\u0940 \u0915\u094B \u0932\u0947\u0915\u0930 \u091A\u0932\u0947,
\u0930\u093E\u091C\u093E \u0930\u093E\u0928\u0940 \u0915\u094B \u0932\u0947\u0915\u0930 \u091A\u0932\u0947!`,
  },
  {
    id: 'chandamama-te',
    title: 'Chandamama Raave',
    titleNative: '\u0C1A\u0C02\u0C26\u0C2E\u0C3E\u0C2E \u0C30\u0C3E\u0C35\u0C47',
    language: 'te',
    theme: 'nature',
    lyrics: `\u0C1A\u0C02\u0C26\u0C2E\u0C3E\u0C2E \u0C30\u0C3E\u0C35\u0C47,
\u0C1C\u0C3E\u0C2C\u0C3F\u0C32\u0C4D\u0C32\u0C3F \u0C24\u0C47\u0C35\u0C47,
\u0C1A\u0C15\u0C4D\u0C15\u0C28\u0C3F \u0C2A\u0C3E\u0C32\u0C41 \u0C24\u0C47\u0C35\u0C47,
\u0C1A\u0C41\u0C15\u0C4D\u0C15\u0C32\u0C41 \u0C2E\u0C46\u0C30\u0C3F\u0C38\u0C47!`,
  },
  {
    id: 'bujji-meka',
    title: 'Bujji Meka Bujji Meka',
    titleNative: '\u0C2C\u0C41\u0C1C\u0C4D\u0C1C\u0C3F \u0C2E\u0C47\u0C15 \u0C2C\u0C41\u0C1C\u0C4D\u0C1C\u0C3F \u0C2E\u0C47\u0C15',
    language: 'te',
    theme: 'animals',
    lyrics: `\u0C2C\u0C41\u0C1C\u0C4D\u0C1C\u0C3F \u0C2E\u0C47\u0C15 \u0C2C\u0C41\u0C1C\u0C4D\u0C1C\u0C3F \u0C2E\u0C47\u0C15,
\u0C0E\u0C15\u0C4D\u0C15\u0C21\u0C3F\u0C15\u0C3F \u0C2A\u0C4B\u0C24\u0C41\u0C28\u0C4D\u0C28\u0C3E\u0C35\u0C41,
\u0C15\u0C4A\u0C02\u0C21 \u0C2E\u0C40\u0C26\u0C3F\u0C15\u0C3F \u0C2A\u0C4B\u0C24\u0C41\u0C28\u0C4D\u0C28\u0C3E\u0C35\u0C41,
\u0C17\u0C21\u0C4D\u0C21\u0C3F \u0C2E\u0C47\u0C38\u0C4D\u0C24\u0C41\u0C28\u0C4D\u0C28\u0C3E\u0C35\u0C41!`,
  },
  {
    id: 'aatat-kadhi',
    title: 'Aat Aat Kadhi Paani De',
    titleNative: '\u0906\u091F \u0906\u091F \u0915\u0922\u0940 \u092A\u093E\u0923\u0940 \u0926\u0947',
    language: 'hi',
    theme: 'nature',
    lyrics: `\u092C\u093E\u0930\u093F\u0936 \u0906\u092F\u0947 \u091B\u092E \u091B\u092E \u091B\u092E,
\u092A\u093E\u0928\u0940 \u092C\u0930\u0938\u0947 \u0925\u092E \u0925\u092E \u0925\u092E,
\u0928\u0926\u0940 \u092E\u0947\u0902 \u0906\u092F\u0940 \u092C\u093E\u0922\u093C,
\u092E\u091B\u0932\u0940 \u0915\u0930\u0947\u0902 \u0924\u0948\u0930\u093E\u0915!`,
  },
  {
    id: 'aana-avanna',
    title: 'Aana Avanna',
    titleNative: '\u0B86\u0BA9\u0BBE \u0B85\u0BB5\u0BA9\u0BCD\u0BA9\u0BBE',
    language: 'ta',
    theme: 'animals',
    lyrics: `\u0B86\u0BA9\u0BBE \u0B85\u0BB5\u0BA9\u0BCD\u0BA9\u0BBE,
\u0B85\u0BB4\u0B95\u0BBE\u0BA9 \u0B86\u0BA9\u0BBE,
\u0BA8\u0BC0\u0BB3\u0BAE\u0BBE\u0BA9 \u0B86\u0BA9\u0BBE,
\u0BA8\u0BBF\u0BB1\u0BAE\u0BBE\u0BA9 \u0B86\u0BA9\u0BBE,
\u0BAE\u0BB0\u0BAE\u0BCD \u0BA4\u0BBF\u0BA9\u0BCD\u0BA9\u0BC1\u0BAE\u0BCD \u0B86\u0BA9\u0BBE!`,
  },
  {
    id: 'twinkle-en',
    title: 'Twinkle Twinkle Little Star',
    titleNative: 'Twinkle Twinkle Little Star',
    language: 'en',
    theme: 'nature',
    lyrics: `Twinkle, twinkle, little star,
How I wonder what you are!
Up above the world so high,
Like a diamond in the sky!

When the blazing sun is gone,
When he nothing shines upon,
Then you show your little light,
Twinkle, twinkle, through the night!`,
  },
  {
    id: 'johny-en',
    title: 'Johny Johny Yes Papa',
    titleNative: 'Johny Johny Yes Papa',
    language: 'en',
    theme: 'family',
    lyrics: `Johny, Johny, yes, Papa?
Eating sugar? No, Papa!
Telling lies? No, Papa!
Open your mouth, ha ha ha!`,
  },
];

interface RhymeLibraryProps {
  onSelect: (lyrics: string, title: string) => void;
  languageFilter?: string;
}

export default function RhymeLibrary({ onSelect, languageFilter }: RhymeLibraryProps) {
  const [isOpen, setIsOpen] = useState(false);

  const filtered = languageFilter
    ? LIBRARY.filter((r) => r.language === languageFilter)
    : LIBRARY;

  const displayList = filtered.length > 0 ? filtered : LIBRARY;

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-amber-50 border-2 border-amber-200 rounded-xl text-amber-700 font-medium hover:bg-amber-100 transition-colors"
      >
        <BookOpen className="w-4 h-4" />
        Rhyme Library ({displayList.length})
      </button>

      {isOpen && (
        <div className="mt-3 bg-white rounded-2xl border-2 border-amber-100 shadow-md overflow-hidden">
          <div className="p-3 bg-amber-50 border-b border-amber-100">
            <h3 className="font-heading text-lg font-bold text-amber-800">
              Pre-built Indian Nursery Rhymes
            </h3>
          </div>
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
            {displayList.map((rhyme) => (
              <button
                key={rhyme.id}
                onClick={() => {
                  onSelect(rhyme.lyrics, rhyme.title);
                  setIsOpen(false);
                }}
                className="w-full text-left p-4 hover:bg-amber-50 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono px-2 py-0.5 bg-gray-100 rounded text-gray-500 uppercase">
                    {rhyme.language}
                  </span>
                  <span className="font-semibold text-gray-800">{rhyme.title}</span>
                </div>
                {rhyme.titleNative !== rhyme.title && (
                  <div className="text-sm text-gray-500 mb-1">{rhyme.titleNative}</div>
                )}
                <div className="text-xs text-gray-400 line-clamp-2 whitespace-pre-line">
                  {rhyme.lyrics.slice(0, 80)}...
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
