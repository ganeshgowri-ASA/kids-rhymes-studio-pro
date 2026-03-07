"use client";

type Pose = "dancing" | "singing" | "playing" | "jumping" | "reading";

const poses: Record<Pose, { path: string; animation: string }> = {
  dancing: {
    path: "M24 8a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-4 4l-6 14h4l3-7 3 7h4l-6-14h-2zm-8 22l4-8h-3l-5 10h8v-2h-4zm16 0l-4-8h3l5 10h-8v-2h4z",
    animation: "dance 1.5s ease-in-out infinite",
  },
  singing: {
    path: "M24 8a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-3 4l-5 16h4l2-6h4l2 6h4l-5-16h-6zm9-2c1 0 3 1 4 3l-2 1c-1-1-2-2-3-2l1-2z",
    animation: "sing 2s ease-in-out infinite",
  },
  playing: {
    path: "M24 8a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-6 6l2 8-4 6h4l3-5 3 5h4l-4-6 2-8h-10zm14 4a6 6 0 0 1 6 6h-4a2 2 0 0 0-2-2v-4z",
    animation: "play 1.8s ease-in-out infinite",
  },
  jumping: {
    path: "M24 8a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-4 4l-4 10h3l2-5 3 5h3l-4-10h-3zm-6 16l6-4v-2l-8 5 2 1zm16 0l-6-4v-2l8 5-2 1z",
    animation: "jump 1s ease-in-out infinite",
  },
  reading: {
    path: "M24 8a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-4 4v12h8V12h-8zm-6 8h4v-4h-4v4zm16 0h-4v-4h4v4z",
    animation: "read 3s ease-in-out infinite",
  },
};

export default function KidsSilhouette({
  pose = "dancing",
  color = "currentColor",
  size = 48,
  className = "",
}: {
  pose?: Pose;
  color?: string;
  size?: number;
  className?: string;
}) {
  const { path, animation } = poses[pose];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill={color}
      className={className}
      style={{ animation }}
      aria-hidden="true"
    >
      <path d={path} />
      <style jsx>{`
        @keyframes dance {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        @keyframes sing {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes play {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(4px); }
        }
        @keyframes jump {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes read {
          0%, 100% { transform: rotate(0); }
          25% { transform: rotate(-2deg); }
          75% { transform: rotate(2deg); }
        }
      `}</style>
    </svg>
  );
}
