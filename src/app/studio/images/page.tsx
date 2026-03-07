"use client";

import { ArrowLeft } from "lucide-react";
import ImageGenerator from "@/components/studio/ImageGenerator";
import SceneGallery from "@/components/studio/SceneGallery";
import PromptTemplates from "@/components/studio/PromptTemplates";

export default function StudioImagesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <a
          href="/studio"
          className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Studio
        </a>

        <h1 className="font-heading text-3xl font-bold text-gray-800 mb-2">
          Image Generator
        </h1>
        <p className="text-gray-500 mb-8">
          Create beautiful cartoon and realistic scenes with Indian cultural themes
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Generator + Templates */}
          <div className="lg:col-span-1 space-y-6">
            <ImageGenerator />
            <PromptTemplates />
          </div>

          {/* Right: Gallery */}
          <div className="lg:col-span-2">
            <SceneGallery />
          </div>
        </div>
      </div>
    </div>
  );
}
