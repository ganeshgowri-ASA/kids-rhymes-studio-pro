"use client";

export default function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dotSize = { sm: "w-2 h-2", md: "w-3 h-3", lg: "w-4 h-4" }[size];
  const gap = { sm: "gap-1", md: "gap-2", lg: "gap-3" }[size];

  return (
    <div className={`flex items-center justify-center ${gap}`} role="status" aria-label="Loading">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`${dotSize} rounded-full bg-gradient-to-r from-pink-400 to-purple-400`}
          style={{
            animation: "bouncing 0.6s ease-in-out infinite alternate",
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes bouncing {
          0% { transform: translateY(0); opacity: 0.5; }
          100% { transform: translateY(-12px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
