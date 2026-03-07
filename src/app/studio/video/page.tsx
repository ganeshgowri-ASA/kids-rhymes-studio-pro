"use client";
import { useState } from "react";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Film, Plus, Trash2, Play, Download } from "lucide-react";

interface TimelineScene {
  id: string;
  imageUrl: string;
  duration: number;
  label: string;
}

export default function VideoComposerPage() {
  const [scenes, setScenes] = useState<TimelineScene[]>([]);
  const [rendering, setRendering] = useState(false);
  const [progress, setProgress] = useState(0);

  const addScene = () => {
    const newScene: TimelineScene = {
      id: `scene_${Date.now()}`,
      imageUrl: `https://placehold.co/1024x576/FFB6C1/333?text=Scene+${scenes.length + 1}`,
      duration: 3,
      label: `Scene ${scenes.length + 1}`,
    };
    setScenes((prev) => [...prev, newScene]);
  };

  const removeScene = (id: string) => {
    setScenes((prev) => prev.filter((s) => s.id !== id));
  };

  const renderVideo = async () => {
    setRendering(true);
    setProgress(0);
    // Simulate rendering progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((r) => setTimeout(r, 300));
      setProgress(i);
    }
    setRendering(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Breadcrumbs />
      <h1 className="font-heading text-3xl font-bold text-gray-800 mb-6">Video Composer</h1>

      {/* Timeline */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-lg font-bold">Timeline</h3>
          <button
            onClick={addScene}
            className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm flex items-center gap-1 hover:bg-green-600 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Scene
          </button>
        </div>

        {scenes.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Film className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No scenes added yet. Add scenes to start composing.</p>
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-3">
            {scenes.map((scene) => (
              <div key={scene.id} className="flex-shrink-0 w-48 bg-gray-50 rounded-xl overflow-hidden border">
                <img src={scene.imageUrl} alt={scene.label} className="w-full h-28 object-cover" />
                <div className="p-2 flex items-center justify-between">
                  <span className="text-xs font-medium">{scene.label}</span>
                  <button onClick={() => removeScene(scene.id)} className="text-red-400 hover:text-red-600">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Render */}
      {rendering && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Rendering video...</span>
            <span className="text-sm text-gray-500">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <button
        onClick={renderVideo}
        disabled={scenes.length === 0 || rendering}
        className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold text-lg hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
      >
        {rendering ? "Rendering..." : (
          <>
            <Play className="w-5 h-5" /> Render Video
          </>
        )}
      </button>
    </div>
  );
}
