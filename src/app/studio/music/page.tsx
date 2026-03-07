"use client";

import { ArrowLeft } from "lucide-react";
import MusicGenerator from "@/components/studio/MusicGenerator";
import MusicPlayer from "@/components/studio/MusicPlayer";
import MusicLibrary from "@/components/studio/MusicLibrary";

export default function MusicStudioPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <a
          href="/studio"
          className="inline-flex items-center gap-2 text-purple-500 mb-6 hover:text-purple-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Studio
        </a>

        <h1 className="font-heading text-3xl font-bold text-gray-800 mb-8">
          Music Studio
        </h1>

        <div className="space-y-6">
          <MusicGenerator />
          <MusicPlayer />
          <MusicLibrary />
        </div>
      </div>
    </div>
  );
}
