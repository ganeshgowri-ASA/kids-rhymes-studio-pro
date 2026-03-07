#!/bin/bash
set -e
echo "=== CREATING ALL PROJECT FILES ==="

# Create directory structure
mkdir -p src/app/api/lyrics src/app/api/music/generate src/app/api/music/status
mkdir -p src/app/api/images/generate src/app/api/images/status
mkdir -p src/app/api/tts/synthesize src/app/api/tts/voices
mkdir -p src/app/api/video/render
mkdir -p src/app/\(dashboard\) src/app/rhymes src/app/studio/images src/app/studio/video
mkdir -p src/app/games/\[gameType\]
mkdir -p src/components/shared src/components/rhymes src/components/studio src/components/games src/components/ui
mkdir -p src/lib/ai src/lib/music src/lib/image src/lib/tts src/lib/video src/lib/i18n
mkdir -p src/games/alphabet src/games/counting src/games/matching src/games/rhyme-karaoke src/games/puzzle
mkdir -p src/store src/types src/config
mkdir -p src/messages
mkdir -p public/assets/images public/assets/audio public/assets/fonts
echo "Directories created."

# ============= S1: BOOTSTRAP FILES =============
echo "--- S1: Bootstrap ---"

cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF

cat > next.config.mjs << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'replicate.delivery' },
      { protocol: 'https', hostname: '*.replicate.delivery' },
      { protocol: 'https', hostname: 'huggingface.co' },
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = { ...config.resolve.fallback, fs: false };
    return config;
  },
};
export default nextConfig;
EOF

cat > tailwind.config.ts << 'EOF'
import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        kids: {
          pink: "#FFB6C1",
          blue: "#87CEEB",
          yellow: "#FFD700",
          green: "#98FB98",
          lavender: "#E6E6FA",
          peach: "#FFDAB9",
          orange: "#FFA07A",
        },
      },
      fontFamily: {
        heading: ["Baloo 2", "cursive"],
        body: ["Inter", "sans-serif"],
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        bounce_slow: "bounce 3s ease-in-out infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
EOF

cat > postcss.config.mjs << 'EOF'
const config = { plugins: { tailwindcss: {}, autoprefixer: {} } };
export default config;
EOF

cat > src/app/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap');
:root { --bg-primary: #FFF5F5; --accent: #FF6B9D; }
body { font-family: 'Inter', sans-serif; background: var(--bg-primary); }
.font-heading { font-family: 'Baloo 2', cursive; }
EOF

echo "S1 config files done."
