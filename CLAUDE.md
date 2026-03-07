# CLAUDE.md - Claude Code IDE Session Instructions

This file provides structured session plans for building kids-rhymes-studio-pro using Claude Code IDE.

## Project Context

- **Repo**: `ganeshgowri-ASA/kids-rhymes-studio-pro`
- **Stack**: Next.js 14 + Phaser.js + Tailwind + shadcn/ui + Prisma
- **Goal**: AI-powered Kids Rhymes, Videos & Games Production Studio
- **Languages**: Telugu, Tamil, Hindi, Bengali, Gujarati, Kannada + English

## Session 1: Project Bootstrap

**Objective**: Initialize Next.js 14 project with core dependencies

```bash
# Run in Claude Code terminal
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
npm install zustand @prisma/client phaser next-intl
npm install -D prisma @types/node
npx shadcn-ui@latest init
npx prisma init --datasource-provider sqlite
```

**Tasks**:
1. Setup Next.js 14 with App Router and TypeScript
2. Configure Tailwind with kids-friendly color theme (bright pastels)
3. Initialize shadcn/ui components (button, card, dialog, tabs, select)
4. Setup Zustand store structure
5. Configure next-intl for multilingual support
6. Create base layout with responsive sidebar navigation
7. Setup Prisma schema for rhymes, games, and user progress

**Key Files to Create**:
- `src/app/layout.tsx` - Root layout with providers
- `src/app/page.tsx` - Landing/dashboard page
- `src/store/app-store.ts` - Global state
- `src/lib/i18n/config.ts` - Language configuration
- `src/lib/i18n/messages/` - Translation files per language
- `prisma/schema.prisma` - Database schema
- `tailwind.config.ts` - Custom theme with kids colors

## Session 2: Dashboard & UI Components

**Objective**: Build the main dashboard and shared UI

**Tasks**:
1. Create kids-themed dashboard with colorful cards
2. Build navigation: Rhymes | Studio | Games | Settings
3. Create LanguageSwitcher component (dropdown with 7 languages)
4. Build AudioPlayer component with play/pause/progress
5. Create AnimatedBackground with floating musical notes
6. Build kids silhouette SVG components (dancing, singing, playing)
7. Add Lottie/CSS animations for character movements

**Key Files**:
- `src/components/shared/Dashboard.tsx`
- `src/components/shared/Sidebar.tsx`
- `src/components/shared/LanguageSwitcher.tsx`
- `src/components/shared/AudioPlayer.tsx`
- `src/components/shared/KidsSilhouette.tsx`
- `src/components/shared/AnimatedBackground.tsx`

## Session 3: Rhymes Engine (Lyrics + LLM)

**Objective**: Build AI-powered lyrics generation module

**Tasks**:
1. Create LLM provider abstraction (Groq/OpenAI/Claude/Gemini)
2. Build lyrics generation API route with language selection
3. Create rhyme templates for common themes (animals, colors, numbers, festivals)
4. Build RhymeEditor component with real-time preview
5. Add rhyme library with pre-built Indian nursery rhymes
6. Implement lyrics translation across languages
7. Save/load rhymes to database

**Key Files**:
- `src/lib/ai/provider.ts` - LLM provider factory
- `src/lib/ai/prompts.ts` - Prompt templates for lyrics
- `src/app/api/lyrics/route.ts` - Lyrics generation API
- `src/app/rhymes/page.tsx` - Rhymes page
- `src/components/rhymes/RhymeEditor.tsx`
- `src/components/rhymes/RhymeLibrary.tsx`
- `src/components/rhymes/ThemeSelector.tsx`

## Session 4: Music Production (Suno + Audio)

**Objective**: Integrate music generation and audio playback

**Tasks**:
1. Create Suno API wrapper (unofficial API integration)
2. Build music generation from lyrics flow
3. Create Web Audio API visualizer
4. Build music library/playlist component
5. Add tempo/style controls (lullaby, upbeat, classical Indian)
6. Implement audio download and caching

**Key Files**:
- `src/lib/music/suno-client.ts` - Suno API client
- `src/lib/music/audio-utils.ts` - Web Audio utilities
- `src/app/api/music/route.ts` - Music generation API
- `src/components/studio/MusicPlayer.tsx`
- `src/components/studio/AudioVisualizer.tsx`
- `src/components/studio/StyleSelector.tsx`

## Session 5: Visual Studio (Image Generation)

**Objective**: AI image generation for cartoon and realistic scenes

**Tasks**:
1. Create Replicate API wrapper for SDXL/Flux
2. Build image prompt templates (Indian themes, festivals, nature)
3. Create dual-mode generator: Cartoon vs Realistic
4. Build scene gallery with drag-and-drop
5. Create character pose library (kids in various activities)
6. Implement background/foreground layer system
7. Add Indian cultural elements (rangoli, diyas, traditional dress)

**Key Files**:
- `src/lib/image/replicate-client.ts` - Replicate wrapper
- `src/lib/image/prompt-builder.ts` - Image prompt templates
- `src/app/api/images/route.ts` - Image generation API
- `src/app/studio/page.tsx` - Studio page
- `src/components/studio/ImageGenerator.tsx`
- `src/components/studio/SceneGallery.tsx`
- `src/components/studio/LayerEditor.tsx`

## Session 6: TTS & Narration

**Objective**: Indian language text-to-speech integration

**Tasks**:
1. Create TTS provider abstraction (IndicF5/Coqui/Google)
2. Build voice selection per language with preview
3. Create narration timing editor (sync text with audio)
4. Implement SSML support for expression control
5. Build subtitle/caption generator from TTS timing
6. Add pronunciation guide for Indian words

**Key Files**:
- `src/lib/tts/provider.ts` - TTS provider factory
- `src/lib/tts/indic-f5.ts` - IndicF5-TTS client
- `src/app/api/tts/route.ts` - TTS API
- `src/components/studio/VoiceSelector.tsx`
- `src/components/studio/NarrationEditor.tsx`
- `src/components/studio/SubtitleTrack.tsx`

## Session 7: Video Composition

**Objective**: Video creation from scenes, audio, and narration

**Tasks**:
1. Integrate FFmpeg.wasm for browser-based video processing
2. Build timeline editor (scenes + audio + narration tracks)
3. Create transition effects (fade, slide, zoom)
4. Implement scene-to-video renderer
5. Add export options (MP4, WebM, GIF)
6. Build video preview player

**Key Files**:
- `src/lib/video/ffmpeg-processor.ts` - FFmpeg wrapper
- `src/lib/video/timeline.ts` - Timeline data model
- `src/app/api/video/route.ts` - Video processing API
- `src/components/studio/TimelineEditor.tsx`
- `src/components/studio/VideoPreview.tsx`
- `src/components/studio/ExportDialog.tsx`

## Session 8: Phaser.js Games

**Objective**: Educational games platform

**Tasks**:
1. Setup Phaser.js with Next.js (dynamic import, no SSR)
2. Build AlphabetGame - trace letters with finger/mouse
3. Build CountingGame - count objects with animations
4. Build MatchingGame - memory card flip game
5. Build RhymeKaraoke - sing along with highlighted lyrics
6. Build PuzzleGame - drag jigsaw pieces
7. Add score tracking and star rewards
8. Implement multilingual game content

**Key Files**:
- `src/games/config.ts` - Phaser game config
- `src/games/alphabet/AlphabetScene.ts`
- `src/games/counting/CountingScene.ts`
- `src/games/matching/MatchingScene.ts`
- `src/games/rhyme-karaoke/KaraokeScene.ts`
- `src/games/puzzle/PuzzleScene.ts`
- `src/app/games/page.tsx` - Games hub
- `src/components/games/GameWrapper.tsx` - Phaser-React bridge
- `src/components/games/ScoreBoard.tsx`

## Session 9: Integration & Polish

**Objective**: Connect all modules and polish UX

**Tasks**:
1. End-to-end flow: Lyrics > Music > Images > Video
2. Add loading states, error handling, toast notifications
3. Implement responsive design (mobile + tablet + desktop)
4. Add keyboard shortcuts and accessibility
5. Performance optimization (lazy loading, code splitting)
6. Add PWA support for offline access
7. Final UI polish with animations and micro-interactions

## Session 10: Testing & Deployment

**Objective**: QA testing and production deployment

**Tasks**:
1. Unit tests for API routes and utilities
2. Component tests with React Testing Library
3. E2E tests for critical flows
4. Deploy to Vercel (or Railway for full-stack)
5. Configure environment variables
6. Performance audit (Lighthouse)
7. Final QA testing across browsers

## Environment Variables

Each session should check `.env.local` has required keys. Use placeholder/mock responses when keys are not yet configured.

## Coding Standards

- TypeScript strict mode
- ESLint + Prettier
- Component naming: PascalCase
- File naming: kebab-case
- API routes: RESTful conventions
- State management: Zustand stores per module
- Error handling: try/catch with user-friendly messages
- Comments: JSDoc for public APIs, inline for complex logic
