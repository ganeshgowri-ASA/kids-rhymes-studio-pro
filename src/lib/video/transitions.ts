import type { TransitionType } from "./timeline";

/**
 * Returns FFmpeg filter strings for scene transitions.
 * `idx` is the stream index pair (e.g., between stream idx and idx+1).
 * `duration` is transition length in seconds.
 */
export function getTransitionFilter(
  type: TransitionType,
  fromLabel: string,
  toLabel: string,
  duration: number,
  offset: number
): string {
  switch (type) {
    case "fade":
      return `${fromLabel}${toLabel}xfade=transition=fade:duration=${duration}:offset=${offset}`;

    case "crossfade":
      return `${fromLabel}${toLabel}xfade=transition=dissolve:duration=${duration}:offset=${offset}`;

    case "slide-left":
      return `${fromLabel}${toLabel}xfade=transition=slideleft:duration=${duration}:offset=${offset}`;

    case "slide-right":
      return `${fromLabel}${toLabel}xfade=transition=slideright:duration=${duration}:offset=${offset}`;

    case "zoom-in":
      return `${fromLabel}${toLabel}xfade=transition=circlecrop:duration=${duration}:offset=${offset}`;

    case "zoom-out":
      return `${fromLabel}${toLabel}xfade=transition=circleopen:duration=${duration}:offset=${offset}`;

    case "none":
    default:
      return "";
  }
}

/**
 * Builds a complete FFmpeg filter_complex string for a sequence of
 * images with transitions between them.
 */
export function buildTransitionFilterComplex(
  imageCount: number,
  durations: number[],
  transitions: { type: TransitionType; duration: number }[]
): string {
  if (imageCount <= 1) return "";

  const parts: string[] = [];

  // Scale all inputs
  for (let i = 0; i < imageCount; i++) {
    parts.push(
      `[${i}:v]scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,setsar=1[s${i}]`
    );
  }

  // Chain xfade transitions
  let prevLabel = "[s0]";
  let cumulativeOffset = 0;

  for (let i = 1; i < imageCount; i++) {
    const t = transitions[i - 1] ?? { type: "fade" as TransitionType, duration: 0.5 };
    cumulativeOffset += durations[i - 1] - t.duration;
    const outLabel = i < imageCount - 1 ? `[x${i}]` : `[outv]`;
    const filter = getTransitionFilter(
      t.type,
      prevLabel,
      `[s${i}]`,
      t.duration,
      cumulativeOffset
    );

    if (filter) {
      parts.push(`${filter}${outLabel}`);
    }
    prevLabel = outLabel;
  }

  return parts.join(";");
}

export const TRANSITION_OPTIONS: { value: TransitionType; label: string }[] = [
  { value: "none", label: "None" },
  { value: "fade", label: "Fade" },
  { value: "crossfade", label: "Crossfade" },
  { value: "slide-left", label: "Slide Left" },
  { value: "slide-right", label: "Slide Right" },
  { value: "zoom-in", label: "Zoom In" },
  { value: "zoom-out", label: "Zoom Out" },
];
