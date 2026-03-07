"use client";

import { useEffect, useRef } from "react";
import { PASTEL_COLORS } from "@/lib/music/audio-utils";

interface AudioVisualizerProps {
  analyser: AnalyserNode | null;
  isPlaying: boolean;
}

export default function AudioVisualizer({
  analyser,
  isPlaying,
}: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function draw() {
      if (!ctx || !canvas) return;
      animationRef.current = requestAnimationFrame(draw);

      const width = canvas.width;
      const height = canvas.height;

      analyser!.getByteFrequencyData(dataArray);

      // Clear with slight fade for trail effect
      ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
      ctx.fillRect(0, 0, width, height);

      const barCount = 64;
      const barWidth = width / barCount;
      const step = Math.floor(bufferLength / barCount);

      for (let i = 0; i < barCount; i++) {
        const value = dataArray[i * step];
        const barHeight = (value / 255) * height * 0.85;
        const x = i * barWidth;
        const y = height - barHeight;

        const color = PASTEL_COLORS[i % PASTEL_COLORS.length];
        ctx.fillStyle = color;

        // Rounded bars
        const radius = Math.min(barWidth * 0.4, 6);
        ctx.beginPath();
        ctx.moveTo(x + 1, height);
        ctx.lineTo(x + 1, y + radius);
        ctx.quadraticCurveTo(x + 1, y, x + 1 + radius, y);
        ctx.lineTo(x + barWidth - 2 - radius, y);
        ctx.quadraticCurveTo(x + barWidth - 2, y, x + barWidth - 2, y + radius);
        ctx.lineTo(x + barWidth - 2, height);
        ctx.fill();
      }
    }

    if (isPlaying) {
      draw();
    } else {
      // Draw idle state
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barCount = 64;
      const barWidth = canvas.width / barCount;
      for (let i = 0; i < barCount; i++) {
        const barHeight = 4 + Math.sin(i * 0.3) * 8;
        ctx.fillStyle = PASTEL_COLORS[i % PASTEL_COLORS.length];
        ctx.fillRect(
          i * barWidth + 1,
          canvas.height - barHeight,
          barWidth - 2,
          barHeight
        );
      }
    }

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [analyser, isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      width={640}
      height={120}
      className="w-full h-24 rounded-xl bg-white"
    />
  );
}
