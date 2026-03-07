"use client";
import { useState } from "react";
import { useAppStore } from "@/store/app-store";
import { THEMES } from "@/lib/ai/prompts";
import { LANGUAGES } from "@/config/languages";
import { SCENE_TEMPLATES } from "@/lib/image/prompt-builder";
import {
  Wand2, Music, ImageIcon, Mic, Film, Download,
  ChevronLeft, ChevronRight, Check, Loader2,
} from "lucide-react";

const MUSIC_STYLES = [
  { id: "lullaby", label: "Lullaby", emoji: "🌙" },
  { id: "upbeat_kids", label: "Upbeat", emoji: "🎉" },
  { id: "classical_indian", label: "Classical", emoji: "🎵" },
  { id: "folk_indian", label: "Folk", emoji: "🪘" },
];

const STEPS = [
  { label: "Theme", icon: Wand2, color: "pink" },
  { label: "Lyrics", icon: Music, color: "rose" },
  { label: "Music", icon: Music, color: "blue" },
  { label: "Images", icon: ImageIcon, color: "cyan" },
  { label: "Narration", icon: Mic, color: "purple" },
  { label: "Export", icon: Film, color: "green" },
];

export default function WizardPage() {
  const { language } = useAppStore();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Wizard state
  const [theme, setTheme] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [title, setTitle] = useState("");
  const [musicStyle, setMusicStyle] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [imageStyle, setImageStyle] = useState<"cartoon" | "realistic">("cartoon");
  const [scenes, setScenes] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [narrationDone, setNarrationDone] = useState(false);

  const generateLyrics = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/lyrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme, language, provider: "groq" }),
      });
      const data = await res.json();
      setLyrics(data.lyrics);
      setTitle(data.title);
    } catch {
      setLyrics("Error generating lyrics.");
    }
    setLoading(false);
  };

  const generateMusic = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/music/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lyrics, style: musicStyle }),
      });
      const data = await res.json();
      setAudioUrl(data.audioUrl || null);
    } catch {
      // mock fallback
    }
    setLoading(false);
  };

  const generateImages = async () => {
    setLoading(true);
    const urls: string[] = [];
    for (const scene of scenes.slice(0, 4)) {
      try {
        const res = await fetch("/api/images/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: scene, style: imageStyle }),
        });
        const data = await res.json();
        if (data.imageUrl) urls.push(data.imageUrl);
      } catch {
        // skip
      }
    }
    setImageUrls(urls);
    setLoading(false);
  };

  const speakNarration = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(lyrics);
    const langMap: Record<string, string> = {
      en: "en-US", hi: "hi-IN", te: "te-IN", ta: "ta-IN",
      bn: "bn-IN", gu: "gu-IN", kn: "kn-IN",
    };
    utterance.lang = langMap[language] || "en-US";
    utterance.onend = () => setNarrationDone(true);
    window.speechSynthesis.speak(utterance);
  };

  const canNext = () => {
    switch (step) {
      case 0: return !!theme;
      case 1: return !!lyrics;
      case 2: return !!audioUrl;
      case 3: return imageUrls.length > 0;
      case 4: return narrationDone;
      default: return true;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl font-bold text-gray-800 mb-2">Create Video from Rhyme</h1>
      <p className="text-gray-500 mb-8">One-click wizard to create a complete rhyme video</p>

      {/* Step Indicator */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center">
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                i === step
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md"
                  : i < step
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-400"
              }`}
            >
              {i < step ? <Check className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
              <span className="hidden sm:inline">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && <ChevronRight className="w-4 h-4 text-gray-300 mx-1" />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border mb-6 min-h-[300px]">
        {step === 0 && (
          <div>
            <h2 className="font-heading text-xl font-bold mb-4">Choose a Theme</h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {THEMES.map((t) => (
                <button key={t.id} onClick={() => setTheme(t.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-center ${
                    theme === t.id ? "border-pink-400 bg-pink-50 shadow-md" : "border-gray-200 bg-white hover:border-pink-200"
                  }`}>
                  <div className="text-3xl mb-1">{t.emoji}</div>
                  <div className="text-sm font-medium">{t.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="font-heading text-xl font-bold mb-4">Generate Lyrics</h2>
            {!lyrics ? (
              <button onClick={generateLyrics} disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                {loading ? "Generating..." : "Generate Lyrics"}
              </button>
            ) : (
              <div>
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl">{lyrics}</pre>
                <textarea value={lyrics} onChange={(e) => setLyrics(e.target.value)}
                  className="w-full h-32 mt-3 px-4 py-3 border rounded-xl resize-none" placeholder="Edit lyrics..." />
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="font-heading text-xl font-bold mb-4">Generate Music</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {MUSIC_STYLES.map((s) => (
                <button key={s.id} onClick={() => setMusicStyle(s.id)}
                  className={`p-3 rounded-xl border-2 transition-all text-center ${
                    musicStyle === s.id ? "border-blue-400 bg-blue-50 shadow-md" : "border-gray-200 hover:border-blue-200"
                  }`}>
                  <div className="text-2xl mb-1">{s.emoji}</div>
                  <div className="text-xs font-medium">{s.label}</div>
                </button>
              ))}
            </div>
            {!audioUrl ? (
              <button onClick={generateMusic} disabled={!musicStyle || loading}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Music className="w-5 h-5" />}
                {loading ? "Generating..." : "Generate Music"}
              </button>
            ) : (
              <div>
                <audio controls src={audioUrl} className="w-full" />
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="font-heading text-xl font-bold mb-4">Generate Scene Images</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select scenes (up to 4)</label>
              <div className="space-y-2">
                {SCENE_TEMPLATES.flatMap((cat) => cat.scenes).slice(0, 8).map((scene) => (
                  <button key={scene} onClick={() => {
                    setScenes((prev) => prev.includes(scene) ? prev.filter((s) => s !== scene) : prev.length < 4 ? [...prev, scene] : prev);
                  }} className={`block w-full text-left px-3 py-2 rounded-lg text-sm border transition-all ${
                    scenes.includes(scene) ? "border-cyan-400 bg-cyan-50" : "border-gray-200 hover:border-cyan-200"
                  }`}>{scenes.includes(scene) ? "✓ " : ""}{scene}</button>
                ))}
              </div>
            </div>
            <div className="flex gap-3 mb-4">
              {(["cartoon", "realistic"] as const).map((s) => (
                <button key={s} onClick={() => setImageStyle(s)}
                  className={`flex-1 py-2 rounded-xl border-2 text-sm font-medium ${
                    imageStyle === s ? "border-cyan-400 bg-cyan-50" : "border-gray-200"
                  }`}>{s === "cartoon" ? "🎨 Cartoon" : "📷 Realistic"}</button>
              ))}
            </div>
            {imageUrls.length === 0 ? (
              <button onClick={generateImages} disabled={scenes.length === 0 || loading}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
                {loading ? "Generating..." : "Generate Images"}
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {imageUrls.map((url, i) => (
                  <img key={i} src={url} alt={`Scene ${i + 1}`} className="rounded-xl w-full aspect-video object-cover" />
                ))}
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="font-heading text-xl font-bold mb-4">Add Narration</h2>
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <pre className="whitespace-pre-wrap text-sm text-gray-700">{lyrics}</pre>
            </div>
            <button onClick={speakNarration} disabled={narrationDone}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50">
              {narrationDone ? <><Check className="w-5 h-5" /> Narration Complete</> : <><Mic className="w-5 h-5" /> Preview Narration</>}
            </button>
          </div>
        )}

        {step === 5 && (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-gray-800 mb-2">Video Ready!</h2>
            <p className="text-gray-500 mb-6">Your rhyme video has been assembled with all components.</p>
            <div className="bg-gray-50 rounded-xl p-4 text-left text-sm space-y-2 max-w-sm mx-auto mb-6">
              <div><span className="font-medium">Theme:</span> {theme}</div>
              <div><span className="font-medium">Title:</span> {title}</div>
              <div><span className="font-medium">Language:</span> {LANGUAGES.find((l) => l.code === language)?.name}</div>
              <div><span className="font-medium">Music:</span> {musicStyle}</div>
              <div><span className="font-medium">Scenes:</span> {imageUrls.length} images</div>
            </div>
            <button className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold text-lg flex items-center gap-2 mx-auto hover:shadow-lg transition-all">
              <Download className="w-5 h-5" /> Export Video
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="px-6 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition-all flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={() => setStep(Math.min(5, step + 1))}
          disabled={step === 5 || !canNext()}
          className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg disabled:opacity-30 transition-all flex items-center gap-2"
        >
          {step === 4 ? "Finish" : "Next"} <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
