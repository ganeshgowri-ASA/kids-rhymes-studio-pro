"use client";
import { useState } from "react";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { SCENE_TEMPLATES, buildPrompt } from "@/lib/image/prompt-builder";
import { ImageIcon, Wand2 } from "lucide-react";

export default function ImageGeneratorPage() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState<"cartoon" | "realistic">("cartoon");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<Array<{ id: string; imageUrl: string }>>([]);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/images/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: buildPrompt(prompt, style), style }),
      });
      const data = await res.json();
      if (data.imageUrl) {
        setImages((prev) => [{ id: data.id, imageUrl: data.imageUrl }, ...prev]);
      }
    } catch {
      // handled by error boundary
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Breadcrumbs />
      <h1 className="font-heading text-3xl font-bold text-gray-800 mb-6">Image Generator</h1>

      {/* Scene Templates */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">Quick Scene Templates</label>
        <div className="space-y-3">
          {SCENE_TEMPLATES.map((cat) => (
            <div key={cat.category}>
              <div className="text-xs font-bold text-gray-400 uppercase mb-1.5">{cat.category}</div>
              <div className="flex flex-wrap gap-2">
                {cat.scenes.map((scene) => (
                  <button
                    key={scene}
                    onClick={() => setPrompt(scene)}
                    className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${
                      prompt === scene
                        ? "border-blue-400 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-blue-200"
                    }`}
                  >
                    {scene}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Prompt */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Custom Scene Description</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe a scene for image generation..."
          className="w-full h-24 px-4 py-3 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
        />
      </div>

      {/* Style Selector */}
      <div className="flex gap-3 mb-6">
        {(["cartoon", "realistic"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStyle(s)}
            className={`flex-1 py-3 rounded-xl border-2 font-medium transition-all ${
              style === s
                ? "border-blue-400 bg-blue-50 text-blue-700"
                : "border-gray-200 hover:border-blue-200"
            }`}
          >
            {s === "cartoon" ? "🎨 Cartoon" : "📷 Realistic"}
          </button>
        ))}
      </div>

      <button
        onClick={generate}
        disabled={!prompt || loading}
        className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold text-lg hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
      >
        {loading ? "Generating Image..." : (
          <>
            <Wand2 className="w-5 h-5" /> Generate Image
          </>
        )}
      </button>

      {/* Generated Images */}
      {images.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {images.map((img) => (
            <div key={img.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border">
              <img src={img.imageUrl} alt="Generated scene" className="w-full aspect-video object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
