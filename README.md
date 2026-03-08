# Kids Rhymes Studio Pro

> **v2.0** - Professional UI/UX Upgrade with Dark Mode, Animations, PWA Support & 7 Indian Languages

AI-powered Kids Rhymes, Videos & Games Production Studio built with Next.js 14, Phaser.js, and multilingual Indian language support.

## Overview

A comprehensive production platform for creating educational kids content:
- **Rhymes Engine**: AI-generated lyrics in 6+ Indian languages (Telugu, Tamil, Hindi, Bengali, Gujarati, Kannada)
- **Music Production**: Suno AI integration for music generation from lyrics
- **Visual Studio**: Cartoon & realistic image generation via Replicate/Stable Diffusion
- **Video Mixer**: FFmpeg-based scene composition with audio sync
- **Games Platform**: Phaser.js educational games (alphabet, counting, matching, puzzles)
- **TTS Engine**: Indic TTS via IndicF5/Coqui/Google Cloud for multilingual narration

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router), React 18, Tailwind CSS, shadcn/ui |
| Game Engine | Phaser.js 3.x |
| State | Zustand |
| Backend API | Next.js API Routes |
| Database | Prisma + SQLite (dev) / PostgreSQL (prod) |
| AI/ML | Groq, OpenAI, Claude, Gemini APIs |
| Music | Suno API (unofficial), Web Audio API |
| Image Gen | Replicate (SDXL, Flux), HuggingFace Inference |
| TTS | IndicF5-TTS, Coqui TTS, Google Cloud TTS |
| Video | FFmpeg.wasm, Remotion |
| Deploy | Vercel / Railway |

## Project Structure

```
kids-rhymes-studio-pro/
|-- src/
|   |-- app/                    # Next.js App Router pages
|   |   |-- (dashboard)/         # Main dashboard layout
|   |   |-- rhymes/              # Rhymes creation module
|   |   |-- studio/              # Video production studio
|   |   |-- games/               # Educational games
|   |   |-- api/                 # API routes
|   |       |-- lyrics/          # Lyrics generation
|   |       |-- music/           # Suno music generation
|   |       |-- images/          # Image generation
|   |       |-- tts/             # Text-to-speech
|   |       |-- video/           # Video composition
|   |-- components/
|   |   |-- ui/                  # shadcn/ui components
|   |   |-- rhymes/              # Rhyme-specific components
|   |   |-- studio/              # Studio components
|   |   |-- games/               # Game components
|   |   |-- shared/              # Shared components
|   |-- lib/
|   |   |-- ai/                  # AI provider integrations
|   |   |-- music/               # Music generation utils
|   |   |-- image/               # Image generation utils
|   |   |-- tts/                 # TTS engine utils
|   |   |-- video/               # Video processing utils
|   |   |-- i18n/                # Internationalization
|   |-- games/
|   |   |-- alphabet/            # Alphabet learning game
|   |   |-- counting/            # Number counting game
|   |   |-- matching/            # Memory matching game
|   |   |-- puzzle/              # Jigsaw puzzle game
|   |   |-- rhyme-karaoke/       # Sing-along karaoke
|   |-- store/                   # Zustand state stores
|   |-- types/                   # TypeScript types
|   |-- config/                  # App configuration
|-- prisma/                      # Database schema
|-- public/
|   |-- assets/                  # Static assets
|   |   |-- images/              # Character sprites, backgrounds
|   |   |-- audio/               # Sound effects, samples
|   |   |-- fonts/               # Indian language fonts
|-- CLAUDE.md                    # Claude Code session instructions
|-- package.json
|-- tailwind.config.ts
|-- next.config.mjs
|-- tsconfig.json
```

## Features Roadmap

### Phase 1: Core Platform
- [ ] Next.js 14 project setup with App Router
- [ ] Dashboard UI with kids-friendly theme
- [ ] Multilingual support (i18n) for 6 Indian languages
- [ ] LLM integration for lyrics generation
- [ ] Basic audio player component

### Phase 2: Production Pipeline
- [ ] Suno API integration for music from lyrics
- [ ] Replicate/SDXL image generation (cartoon + realistic)
- [ ] Character sprite system (kids silhouettes, dancing animations)
- [ ] Scene compositor with timeline editor
- [ ] FFmpeg.wasm video export

### Phase 3: Games & Learning
- [ ] Phaser.js game engine integration
- [ ] Alphabet tracing game
- [ ] Number counting with animations
- [ ] Rhyme karaoke mode
- [ ] Progress tracking and rewards

### Phase 4: TTS & Narration
- [ ] IndicF5-TTS integration for Indian languages
- [ ] Voice selection per language
- [ ] Audio sync with video scenes
- [ ] Subtitle generation

## API Keys Required

Create a `.env.local` file:

```env
# AI/LLM Providers
GROQ_API_KEY=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GOOGLE_AI_API_KEY=

# Image Generation
REPLICATE_API_TOKEN=
HF_ACCESS_TOKEN=

# Music
SUNO_COOKIE=

# TTS
GOOGLE_CLOUD_TTS_KEY=
COQUI_API_KEY=

# Database
DATABASE_URL=file:./dev.db
```

## Getting Started

```bash
# Clone the repo
git clone https://github.com/ganeshgowri-ASA/kids-rhymes-studio-pro.git
cd kids-rhymes-studio-pro

# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma db push

# Run development server
npm run dev
```

## External Resources & Libraries

### Datasets
- [Kaggle Nursery Rhymes Dataset](https://www.kaggle.com/datasets) - Lyrics corpus
- [Common Voice](https://commonvoice.mozilla.org/) - Indian language audio

### HuggingFace Models
- [ai4bharat/IndicF5-TTS](https://huggingface.co/ai4bharat/IndicF5-TTS) - Indian language TTS
- [stabilityai/stable-diffusion-xl](https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0) - Image generation
- [coqui/XTTS-v2](https://huggingface.co/coqui/XTTS-v2) - Multilingual TTS

### Key Libraries
- [Phaser.js](https://phaser.io/) - HTML5 game framework
- [Remotion](https://remotion.dev/) - React video creation
- [FFmpeg.wasm](https://ffmpegwasm.netlify.app/) - Browser-based video processing
- [next-intl](https://next-intl-docs.vercel.app/) - i18n for Next.js

## Claude Code Sessions

See [CLAUDE.md](./CLAUDE.md) for structured Claude Code IDE session plans.

## License

MIT License - see [LICENSE](./LICENSE)


## Live Demo

**[kids-rhymes-studio-pro.vercel.app](https://kids-rhymes-studio-pro.vercel.app)**
