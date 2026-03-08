"use client";
import Link from "next/link";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Image, Music, Film, Mic } from "lucide-react";
import { motion } from "framer-motion";

const modules = [
  { title: "Music Studio", desc: "Generate music from lyrics with Suno AI", icon: Music, href: "/studio/music", color: "from-pink-400 to-rose-400", glow: "glow-pink" },
  { title: "Image Generator", desc: "Create cartoon & realistic scenes with AI", icon: Image, href: "/studio/images", color: "from-blue-400 to-cyan-400", glow: "glow-blue" },
  { title: "Video Composer", desc: "Compose videos from scenes & audio tracks", icon: Film, href: "/studio/video", color: "from-green-400 to-emerald-400", glow: "glow-green" },
  { title: "TTS Narration", desc: "Indian language text-to-speech narration", icon: Mic, href: "/studio/tts", color: "from-purple-400 to-violet-400", glow: "glow-purple" },
];

export default function StudioPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <Breadcrumbs />
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-heading text-3xl font-bold text-gray-800 dark:text-white mb-2"
      >
        Production Studio
      </motion.h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Create professional kids content with AI-powered tools</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link
              href={m.href}
              className={`block glass-card rounded-2xl p-6 hover:shadow-xl transition-all hover:-translate-y-1 group overflow-hidden relative`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${m.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <m.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-heading text-xl font-bold mb-2 text-gray-800 dark:text-white">{m.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{m.desc}</p>
              <div className="mt-4 text-sm font-medium text-pink-500 dark:text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                Open Studio <span>&rarr;</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
