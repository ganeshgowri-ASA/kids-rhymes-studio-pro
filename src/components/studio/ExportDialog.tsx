"use client";

import { useCallback, useState } from "react";
import { Download, X, Film } from "lucide-react";
import { useVideoStore } from "@/store/video-store";
import { validateTimeline } from "@/lib/video/timeline";
import type { ExportFormat, ExportResolution } from "@/lib/video/ffmpeg-processor";

const FORMAT_OPTIONS: { value: ExportFormat; label: string; desc: string }[] = [
  { value: "mp4", label: "MP4", desc: "Best compatibility" },
  { value: "webm", label: "WebM", desc: "Smaller file size" },
  { value: "gif", label: "GIF", desc: "Animated image, no audio" },
];

const RESOLUTION_OPTIONS: { value: ExportResolution; label: string }[] = [
  { value: "720p", label: "720p (1280x720)" },
  { value: "1080p", label: "1080p (1920x1080)" },
];

export default function ExportDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const {
    timeline,
    isRendering,
    progress,
    exportedUrl,
    exportFormat,
    exportResolution,
    exportQuality,
    setExportFormat,
    setExportResolution,
    setExportQuality,
    setRendering,
    setProgress,
    setExportedUrl,
  } = useVideoStore();

  const [errors, setErrors] = useState<string[]>([]);

  const handleExport = useCallback(async () => {
    const validationErrors = validateTimeline(timeline);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors([]);
    setRendering(true);
    setProgress(0);
    setExportedUrl(null);

    try {
      const { createVideoFromImages, addAudioToVideo, addSubtitles, exportVideo } =
        await import("@/lib/video/ffmpeg-processor");

      const imageTrack = timeline.tracks.find((t) => t.type === "image");
      const audioTrack = timeline.tracks.find((t) => t.type === "audio");
      const subtitleTrack = timeline.tracks.find((t) => t.type === "subtitle");

      // Step 1: Create video from images
      setProgress(10);
      const images = (imageTrack?.items ?? [])
        .sort((a, b) => a.start - b.start)
        .map((item) => ({ url: item.source, duration: item.duration }));

      let videoData = await createVideoFromImages(images, timeline.fps, (p) =>
        setProgress(10 + p * 0.3)
      );

      // Step 2: Add audio if available
      if (audioTrack && audioTrack.items.length > 0) {
        setProgress(40);
        videoData = await addAudioToVideo(
          videoData,
          audioTrack.items[0].source,
          (p) => setProgress(40 + p * 0.2)
        );
      }

      // Step 3: Add subtitles if available
      if (subtitleTrack && subtitleTrack.items.length > 0) {
        setProgress(60);
        const subs = subtitleTrack.items
          .sort((a, b) => a.start - b.start)
          .map((item) => ({
            start: item.start,
            end: item.start + item.duration,
            text: item.source,
          }));
        videoData = await addSubtitles(videoData, subs, (p) =>
          setProgress(60 + p * 0.2)
        );
      }

      // Step 4: Export to format
      setProgress(80);
      const finalData = await exportVideo(
        videoData,
        exportFormat,
        exportResolution,
        exportQuality,
        (p) => setProgress(80 + p * 0.2)
      );

      const blob = new Blob([finalData as BlobPart], {
        type:
          exportFormat === "mp4"
            ? "video/mp4"
            : exportFormat === "webm"
              ? "video/webm"
              : "image/gif",
      });
      const url = URL.createObjectURL(blob);
      setExportedUrl(url);
      setProgress(100);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Export failed";
      setErrors([message]);
    } finally {
      setRendering(false);
    }
  }, [
    timeline,
    exportFormat,
    exportResolution,
    exportQuality,
    setRendering,
    setProgress,
    setExportedUrl,
  ]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-green-400" />
            <h2 className="text-lg font-bold text-white">Export Video</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-4 space-y-5">
          {/* Format */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Format</label>
            <div className="grid grid-cols-3 gap-2">
              {FORMAT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setExportFormat(opt.value)}
                  disabled={isRendering}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    exportFormat === opt.value
                      ? "border-blue-500 bg-blue-500/10 text-white"
                      : "border-gray-700 text-gray-400 hover:border-gray-500"
                  }`}
                >
                  <div className="text-sm font-bold">{opt.label}</div>
                  <div className="text-[10px] mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Resolution */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Resolution</label>
            <div className="grid grid-cols-2 gap-2">
              {RESOLUTION_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setExportResolution(opt.value)}
                  disabled={isRendering}
                  className={`p-2 rounded-lg border text-sm transition-all ${
                    exportResolution === opt.value
                      ? "border-blue-500 bg-blue-500/10 text-white"
                      : "border-gray-700 text-gray-400 hover:border-gray-500"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quality slider */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Quality (CRF: {exportQuality} — {exportQuality <= 18 ? "High" : exportQuality <= 28 ? "Medium" : "Low"})
            </label>
            <input
              type="range"
              min={15}
              max={40}
              value={exportQuality}
              onChange={(e) => setExportQuality(Number(e.target.value))}
              disabled={isRendering}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-[10px] text-gray-500 mt-1">
              <span>Higher quality</span>
              <span>Smaller file</span>
            </div>
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              {errors.map((err, i) => (
                <p key={i} className="text-xs text-red-400">
                  {err}
                </p>
              ))}
            </div>
          )}

          {/* Progress */}
          {(isRendering || progress > 0) && (
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>{isRendering ? "Rendering..." : "Complete"}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-green-400 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Download */}
          {exportedUrl && (
            <a
              href={exportedUrl}
              download={`kids-rhyme-video.${exportFormat}`}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-green-500 hover:bg-green-400 text-white font-bold transition-colors"
            >
              <Download className="w-4 h-4" />
              Download {exportFormat.toUpperCase()}
            </a>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isRendering}
            className="px-6 py-2 text-sm font-bold rounded-lg bg-blue-500 hover:bg-blue-400 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isRendering ? "Rendering..." : "Export"}
          </button>
        </div>
      </div>
    </div>
  );
}
