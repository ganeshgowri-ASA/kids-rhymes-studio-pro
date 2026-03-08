"use client";
import { useState } from "react";
import { useAppStore } from "@/store/app-store";
import { LANGUAGES } from "@/config/languages";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Mic, Play, Volume2, Square } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const voiceSamples = [
  { id: "female-1", name: "Priya (Female)", lang: "Multi", preview: "Hello! Welcome to Kids Rhymes Studio" },
  { id: "male-1", name: "Arjun (Male)", lang: "Multi", preview: "Namaste! Let's learn together" },
  { id: "child-1", name: "Meera (Child)", lang: "Multi", preview: "Come play and learn with me!" },
];

export default function TTSPage() {
  const { language } = useAppStore();
  const [text, setText] = useState("");
  const [speed, setSpeed] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [speaking, setSpeaking] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState("female-1");

  const speak = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const langMap: Record<string, string> = {
      en: "en-US", hi: "hi-IN", te: "te-IN", ta: "ta-IN",
      bn: "bn-IN", gu: "gu-IN", kn: "kn-IN",
    };
    utterance.lang = langMap[language] || "en-US";
    utterance.rate = speed;
    utterance.pitch = pitch;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => { setSpeaking(false); toast.success('Narration complete!'); };
    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  const previewVoice = (sampleText: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(sampleText);
    utterance.rate = speed;
    utterance.pitch = pitch;
    window.speechSynthesis.speak(utterance);
  };

  const currentLang = LANGUAGES.find((l) => l.code === language);

  return (
    <div className="max-w-4xl mx-auto">
      <Breadcrumbs />
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-heading text-3xl font-bold text-gray-800 dark:text-white mb-6"
      >
        TTS Narration
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6"
          >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Text to Speak
              <span className="ml-2 text-pink-500">({currentLang?.nativeName || "English"})</span>
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text for narration..."
              className="w-full h-32 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl resize-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300 bg-white dark:bg-gray-800 dark:text-white"
              aria-label="Text for narration"
            />
            <div className="text-xs text-gray-400 mt-1 text-right">{text.length} characters</div>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-6 space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <Volume2 className="w-4 h-4 inline mr-1" /> Speed: {speed}x
              </label>
              <input type="range" min="0.5" max="2" step="0.1" value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))} className="w-full accent-purple-500" aria-label="Speech speed" />
              <div className="flex justify-between text-xs text-gray-400 mt-1"><span>0.5x (Slow)</span><span>1x</span><span>2x (Fast)</span></div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <Mic className="w-4 h-4 inline mr-1" /> Pitch: {pitch}x
              </label>
              <input type="range" min="0.5" max="2" step="0.1" value={pitch} onChange={(e) => setPitch(parseFloat(e.target.value))} className="w-full accent-pink-500" aria-label="Voice pitch" />
              <div className="flex justify-between text-xs text-gray-400 mt-1"><span>0.5x (Low)</span><span>1x</span><span>2x (High)</span></div>
            </div>
          </motion.div>

          {/* Speak button */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex gap-3">
            <button
              onClick={speaking ? stop : speak}
              disabled={!text && !speaking}
              className={`flex-1 py-3 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                speaking
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-gradient-to-r from-purple-500 to-violet-500 text-white hover:shadow-lg disabled:opacity-50"
              }`}
            >
              {speaking ? (
                <><Square className="w-5 h-5" /> Stop</>
              ) : (
                <><Play className="w-5 h-5" /> Speak Now</>
              )}
            </button>
          </motion.div>

          {/* Waveform visualization during speaking */}
          {speaking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-1 h-12 justify-center glass-card rounded-2xl p-4"
            >
              {Array.from({ length: 30 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-purple-400 dark:bg-purple-500 rounded-full"
                  animate={{ height: [4, 20 + Math.random() * 20, 4] }}
                  transition={{ duration: 0.4 + Math.random() * 0.4, repeat: Infinity, delay: i * 0.03 }}
                />
              ))}
            </motion.div>
          )}
        </div>

        {/* Voice samples sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="glass-card rounded-2xl p-4">
            <h3 className="font-heading text-lg font-bold text-gray-800 dark:text-white mb-3">Voice Samples</h3>
            <div className="space-y-2">
              {voiceSamples.map((v) => (
                <button
                  key={v.id}
                  onClick={() => { setSelectedVoice(v.id); previewVoice(v.preview); }}
                  className={`w-full text-left p-3 rounded-xl transition-all border ${
                    selectedVoice === v.id
                      ? "border-purple-400 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-600"
                      : "border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-200 dark:hover:border-purple-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold">
                      {v.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-white">{v.name}</p>
                      <p className="text-xs text-gray-400">{v.lang}</p>
                    </div>
                    <Play className="w-4 h-4 text-purple-400 ml-auto" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-4">
            <h3 className="font-heading text-lg font-bold text-gray-800 dark:text-white mb-3">Supported Languages</h3>
            <div className="space-y-1.5">
              {LANGUAGES.map((l) => (
                <div key={l.code} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${l.code === language ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-medium" : "text-gray-600 dark:text-gray-400"}`}>
                  <span className="text-lg">{l.flag}</span>
                  <span>{l.nativeName}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
