"use client";
import { ArrowLeft, Image, Music, Film, Mic } from "lucide-react";
const modules = [
  { title: "Music Studio", desc: "Generate music from lyrics with Suno AI", icon: Music, href: "/studio/music", color: "from-pink-400 to-rose-400" },
  { title: "Image Generator", desc: "Create cartoon & realistic scenes", icon: Image, href: "/studio/images", color: "from-blue-400 to-cyan-400" },
  { title: "Video Composer", desc: "Compose videos from scenes & audio", icon: Film, href: "/studio/video", color: "from-green-400 to-emerald-400" },
  { title: "TTS Narration", desc: "Indian language text-to-speech", icon: Mic, href: "/studio/tts", color: "from-purple-400 to-violet-400" },
];
export default function StudioPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <a href="/" className="inline-flex items-center gap-2 text-blue-500 mb-6"><ArrowLeft className="w-4 h-4" /> Back</a>
        <h1 className="font-heading text-3xl font-bold text-gray-800 mb-8">Production Studio</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((m, i) => (
            <a key={i} href={m.href} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 border">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center mb-4`}>
                <m.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-heading text-xl font-bold mb-2">{m.title}</h3>
              <p className="text-gray-500 text-sm">{m.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
