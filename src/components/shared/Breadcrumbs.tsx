"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

const labels: Record<string, string> = {
  rhymes: "Rhymes Engine",
  studio: "Production Studio",
  games: "Games",
  library: "My Library",
  wizard: "Create Video",
  music: "Music Studio",
  images: "Image Generator",
  video: "Video Composer",
  tts: "TTS Narration",
  alphabet: "Alphabet Tracing",
  counting: "Number Counting",
  matching: "Memory Match",
  karaoke: "Rhyme Karaoke",
  puzzle: "Jigsaw Puzzle",
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null;

  return (
    <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-6">
      <Link href="/" className="hover:text-pink-500 transition-colors">
        <Home className="w-4 h-4" />
      </Link>
      {segments.map((seg, i) => {
        const href = "/" + segments.slice(0, i + 1).join("/");
        const isLast = i === segments.length - 1;
        return (
          <span key={href} className="flex items-center gap-1.5">
            <ChevronRight className="w-3 h-3" />
            {isLast ? (
              <span className="text-gray-800 font-medium">{labels[seg] || seg}</span>
            ) : (
              <Link href={href} className="hover:text-pink-500 transition-colors">
                {labels[seg] || seg}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
