"use client";

import { useState } from "react";
import { Paintbrush, Camera, Loader2, Sparkles } from "lucide-react";
import { useImageStore, type GeneratedImage } from "@/store/image-store";
import type { ImageStyle, AspectRatio } from "@/lib/image/replicate-client";

const ASPECT_OPTIONS: { value: AspectRatio; label: string }[] = [
  { value: "16:9", label: "16:9 Landscape" },
  { value: "1:1", label: "1:1 Square" },
  { value: "9:16", label: "9:16 Portrait" },
];

async function pollStatus(predictionId: string, onUpdate: (img: Partial<GeneratedImage>) => void) {
  const maxAttempts = 60;
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const res = await fetch(`/api/images/status/${predictionId}`);
    const data = await res.json();
    if (data.status === "succeeded") {
      onUpdate({ status: "succeeded", imageUrl: data.imageUrl });
      return;
    }
    if (data.status === "failed") {
      onUpdate({ status: "failed", error: data.error ?? "Generation failed" });
      return;
    }
    onUpdate({ status: data.status });
  }
  onUpdate({ status: "failed", error: "Timed out waiting for image" });
}

export default function ImageGenerator() {
  const {
    selectedStyle, setStyle,
    selectedAspectRatio, setAspectRatio,
    customPrompt, setCustomPrompt,
    selectedTheme, setTheme,
    isGenerating, setGenerating,
    addImage, updateImage,
  } = useImageStore();

  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    if (!customPrompt.trim()) return;
    setError(null);
    setGenerating(true);

    try {
      const res = await fetch("/api/images/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: customPrompt,
          style: selectedStyle,
          aspectRatio: selectedAspectRatio,
          theme: selectedTheme || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");

      const newImage: GeneratedImage = {
        id: data.id,
        prompt: customPrompt,
        style: selectedStyle,
        aspectRatio: selectedAspectRatio,
        status: data.status,
        imageUrl: data.imageUrl,
        createdAt: Date.now(),
      };
      addImage(newImage);

      if (data.status !== "succeeded" && data.status !== "failed") {
        pollStatus(data.id, (updates) => updateImage(data.id, updates));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border">
      <h2 className="font-heading text-xl font-bold mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-yellow-500" />
        Image Generator
      </h2>

      {/* Style Toggle */}
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-600 mb-2 block">Style</label>
        <div className="flex gap-2">
          <StyleButton
            active={selectedStyle === "cartoon"}
            onClick={() => setStyle("cartoon")}
            icon={<Paintbrush className="w-4 h-4" />}
            label="Cartoon"
          />
          <StyleButton
            active={selectedStyle === "realistic"}
            onClick={() => setStyle("realistic")}
            icon={<Camera className="w-4 h-4" />}
            label="Realistic"
          />
        </div>
      </div>

      {/* Aspect Ratio */}
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-600 mb-2 block">Aspect Ratio</label>
        <div className="flex gap-2">
          {ASPECT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setAspectRatio(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedAspectRatio === opt.value
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Theme Selector */}
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-600 mb-2 block">Indian Theme (optional)</label>
        <select
          value={selectedTheme}
          onChange={(e) => setTheme(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <option value="">None</option>
          <option value="diwali">Diwali</option>
          <option value="holi">Holi</option>
          <option value="pongal">Pongal</option>
          <option value="onam">Onam</option>
          <option value="raksha_bandhan">Raksha Bandhan</option>
          <option value="ganesh_chaturthi">Ganesh Chaturthi</option>
        </select>
      </div>

      {/* Prompt Input */}
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-600 mb-2 block">Scene Description</label>
        <textarea
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="Describe the scene you want to create..."
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating || !customPrompt.trim()}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-sm hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Generate Image
          </>
        )}
      </button>

      {error && (
        <p className="mt-3 text-sm text-red-500 bg-red-50 p-2 rounded-lg">{error}</p>
      )}
    </div>
  );
}

function StyleButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm transition-all ${
        active
          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
