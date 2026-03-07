# Parallel Claude Code Sessions - Coding Prompt Plan

## Repo: ganeshgowri-ASA/kids-rhymes-studio-pro

This document contains copy-paste-ready prompts for launching parallel Claude Code IDE sessions. Each session works on an independent branch to avoid merge conflicts.

---

## Pre-requisites (Run ONCE before all sessions)

Open Claude Code IDE, clone the repo, and run:

```bash
git clone https://github.com/ganeshgowri-ASA/kids-rhymes-studio-pro.git
cd kids-rhymes-studio-pro
npm install
cp .env.example .env.local
```

---

## Parallel Session Strategy

| Session | Branch | Focus Area | Dependencies |
|---------|--------|------------|-------------|
| S1 | feat/bootstrap | Project bootstrap + config | None (run first) |
| S2 | feat/ui-dashboard | Dashboard + UI components | S1 |
| S3 | feat/rhymes-engine | Lyrics + LLM integration | S1 |
| S4 | feat/music-studio | Suno + audio player | S1 |
| S5 | feat/image-gen | Image generation pipeline | S1 |
| S6 | feat/tts-engine | Indian TTS integration | S1 |
| S7 | feat/games | Phaser.js games | S1 |
| S8 | feat/video-composer | FFmpeg video pipeline | S1, S5 |
| S9 | feat/i18n | Multilingual Indian langs | S1 |
| S10 | feat/integration | Integration + deploy | All |

**Parallel Groups:**
- **Wave 1**: S1 (must complete first)
- **Wave 2**: S2, S3, S4, S5, S6, S7, S9 (all run in parallel)
- **Wave 3**: S8, S10 (after Wave 2 merges)

---

## SESSION S1: Project Bootstrap (WAVE 1 - Run First)

**Branch**: `feat/bootstrap`

**Copy-paste this prompt into Claude Code IDE:**

```
You are working on the repo: kids-rhymes-studio-pro
GitHub: https://github.com/ganeshgowri-ASA/kids-rhymes-studio-pro

CREATE BRANCH: git checkout -b feat/bootstrap

TASK: Initialize the full Next.js 14 project scaffold.

STEPS:
1. Run: npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --yes
   (If files exist, overwrite selectively - keep README.md, CLAUDE.md, package.json, prisma/)
2. Merge our existing package.json dependencies into the generated one
3. Run: npm install
4. Run: npx shadcn-ui@latest init (use default style, slate base color, CSS variables yes)
5. Add shadcn components: npx shadcn-ui@latest add button card dialog tabs select slider switch dropdown-menu toast
6. Run: npx prisma generate && npx prisma db push
7. Configure tailwind.config.ts with kids-friendly theme:
   - Colors: pastel pink (#FFB6C1), sky blue (#87CEEB), sunny yellow (#FFD700), mint green (#98FB98), lavender (#E6E6FA), peach (#FFDAB9)
   - Font: Inter for UI, Baloo 2 for headings (Google Fonts)
   - Border radius: rounded-2xl default
8. Create src/app/layout.tsx with:
   - Google Fonts (Inter + Baloo 2)
   - Metadata: title "Kids Rhymes Studio Pro", description
   - ThemeProvider wrapper
   - Toaster component
9. Create src/app/page.tsx with placeholder dashboard
10. Create src/lib/utils.ts with cn() helper
11. Create src/store/app-store.ts (Zustand) with: language, theme, sidebarOpen
12. Create src/config/languages.ts with: en, hi, te, ta, bn, gu, kn language configs
13. Create src/config/themes.ts with kids color palette constants
14. Create next.config.mjs with: images domains (replicate, huggingface), webpack config for ffmpeg
15. Create tsconfig.json paths: @/* -> src/*
16. Verify: npm run dev starts without errors
17. Commit: git add . && git commit -m "feat: project bootstrap with Next.js 14, Tailwind, shadcn, Prisma"
18. Push: git push origin feat/bootstrap

IMPORTANT: Every file must have proper TypeScript types. Use 'use client' directive where needed. Ensure zero build errors.
```

---

## SESSION S2: Dashboard & UI Components (WAVE 2)

**Branch**: `feat/ui-dashboard`

**Copy-paste this prompt into Claude Code IDE:**

```
You are working on: kids-rhymes-studio-pro
GitHub: https://github.com/ganeshgowri-ASA/kids-rhymes-studio-pro

PREP: git checkout main && git pull && git checkout -b feat/ui-dashboard

TASK: Build the complete dashboard UI and shared components with a professional kids-friendly design.

CREATE THESE FILES:

1. src/components/shared/Sidebar.tsx
   - Vertical sidebar with icons + labels
   - Nav items: Home, Rhymes, Studio, Games, Settings
   - Icons from lucide-react: Home, Music, Film, Gamepad2, Settings
   - Collapsible on mobile, fixed on desktop
   - Active state with pastel highlight
   - Kids silhouette logo at top (SVG inline)

2. src/components/shared/Header.tsx
   - App title "Kids Rhymes Studio Pro" in Baloo 2 font
   - LanguageSwitcher dropdown (7 languages)
   - Theme toggle (light/dark)
   - Animated musical notes decoration

3. src/components/shared/LanguageSwitcher.tsx
   - Dropdown with flags/labels: English, Hindi, Telugu, Tamil, Bengali, Gujarati, Kannada
   - Stores selection in Zustand app-store
   - Shows native script name beside English name

4. src/components/shared/AudioPlayer.tsx
   - Play/Pause button with animated icon
   - Progress bar (Radix Slider)
   - Duration display (current/total)
   - Volume control
   - Track title display
   - Accept src prop for audio URL

5. src/components/shared/KidsSilhouette.tsx
   - 5 SVG silhouettes: dancing kid, singing kid, reading kid, playing kid, jumping kid
   - Accept variant prop
   - CSS animation: gentle bounce, sway
   - Colorizable via className

6. src/components/shared/AnimatedBackground.tsx
   - Floating musical notes (treble clef, quarter note, eighth note)
   - Gentle CSS keyframe animations (float up, rotate, fade)
   - Star sparkles scattered
   - Optional prop to disable for performance

7. src/app/(dashboard)/layout.tsx
   - Dashboard layout with Sidebar + Header + main content area
   - Responsive: sidebar drawer on mobile, fixed on lg+

8. src/app/(dashboard)/page.tsx (Dashboard Home)
   - Welcome banner with animated kids silhouettes
   - 4 feature cards: Create Rhymes, Production Studio, Play Games, My Library
   - Each card: icon, title, description, colorful gradient border
   - Recent activity section (placeholder)
   - Stats row: X Rhymes, X Videos, X Games Played

9. src/components/shared/FeatureCard.tsx
   - Reusable card with: icon, title, description, href, gradient colors
   - Hover animation: scale up, shadow increase
   - framer-motion entrance animation

10. src/components/shared/LoadingSpinner.tsx
    - Animated bouncing dots in pastel colors
    - Full-page and inline variants

STYLING RULES:
- All components use Tailwind CSS + shadcn/ui
- Animations via framer-motion where appropriate
- Mobile-first responsive design
- Accessible: proper ARIA labels, keyboard navigation
- Color palette from tailwind.config.ts kids theme

Commit: git add . && git commit -m "feat: dashboard UI with sidebar, header, audio player, animations"
Push: git push origin feat/ui-dashboard
```

---

## SESSION S3: Rhymes Engine - Lyrics + LLM (WAVE 2)

**Branch**: `feat/rhymes-engine`

**Copy-paste this prompt into Claude Code IDE:**

```
You are working on: kids-rhymes-studio-pro
GitHub: https://github.com/ganeshgowri-ASA/kids-rhymes-studio-pro

PREP: git checkout main && git pull && git checkout -b feat/rhymes-engine

TASK: Build the AI-powered lyrics generation engine with multi-LLM support and Indian language rhymes.

CREATE THESE FILES:

1. src/lib/ai/provider.ts
   - Factory pattern: createLLMProvider(type: 'groq'|'openai'|'anthropic'|'gemini')
   - Each provider implements: generateLyrics(prompt, language, theme)
   - Graceful fallback: if one provider fails, try next
   - Rate limiting and error handling

2. src/lib/ai/prompts.ts
   - Prompt templates for rhyme generation:
     * RHYME_GENERATION: "Generate a kids nursery rhyme about {theme} in {language}..."
     * RHYME_TRANSLATION: "Translate this rhyme to {targetLanguage} keeping rhythm..."
     * RHYME_EXTENSION: "Add 2 more verses to this rhyme..."
   - Theme list: animals, colors, numbers, family, nature, festivals, food, transport, body parts, seasons
   - Language-specific instructions for meter and rhyming patterns

3. src/lib/ai/groq-client.ts
   - Groq SDK integration with llama-3.1-70b-versatile model
   - Streaming support for real-time lyrics display

4. src/lib/ai/openai-client.ts
   - OpenAI SDK with gpt-4o-mini model
   - Streaming + structured output

5. src/lib/ai/anthropic-client.ts
   - Anthropic SDK with claude-3-haiku
   - Streaming support

6. src/lib/ai/gemini-client.ts
   - Google Generative AI SDK with gemini-1.5-flash
   - Streaming support

7. src/app/api/lyrics/route.ts
   - POST endpoint: { theme, language, provider, customPrompt? }
   - Returns streaming response with generated lyrics
   - Validates input, handles errors with proper HTTP codes

8. src/app/api/lyrics/translate/route.ts
   - POST: { lyrics, sourceLang, targetLang }
   - Returns translated lyrics maintaining rhythm

9. src/app/rhymes/page.tsx
   - Full rhymes creation page
   - ThemeSelector grid (10 themes with icons)
   - LanguageSelector
   - LLM Provider selector
   - Generate button with loading state
   - Real-time streaming lyrics display
   - Edit/Save/Copy/Download buttons

10. src/components/rhymes/RhymeEditor.tsx
    - Textarea with line numbers
    - Syntax highlighting for verse structure
    - Word count, line count display
    - Undo/redo support

11. src/components/rhymes/ThemeSelector.tsx
    - Grid of theme cards with emoji icons
    - Hover effects, selected state

12. src/components/rhymes/RhymeLibrary.tsx
    - Pre-built rhymes library (10 popular Indian nursery rhymes)
    - Include: Twinkle Twinkle, Machli Jal Ki Rani, Nani Teri Morni
    - Search, filter by language
    - Click to load into editor

13. src/store/rhymes-store.ts
    - Zustand store: currentRhyme, rhymesList, selectedTheme, selectedLanguage, isGenerating

IMPORTANT:
- All API routes must work WITHOUT API keys by returning mock/sample data
- When API key is present, use real provider
- Include proper TypeScript types for all data structures
- Stream responses using ReadableStream for real-time UX

Commit: git add . && git commit -m "feat: rhymes engine with multi-LLM lyrics generation"
Push: git push origin feat/rhymes-engine
```

---

## SESSION S4: Music Production - Suno + Audio (WAVE 2)

**Branch**: `feat/music-studio`

**Copy-paste this prompt into Claude Code IDE:**

```
You are working on: kids-rhymes-studio-pro
GitHub: https://github.com/ganeshgowri-ASA/kids-rhymes-studio-pro

PREP: git checkout main && git pull && git checkout -b feat/music-studio

TASK: Build music generation and audio playback system with Suno API and Web Audio.

CREATE THESE FILES:

1. src/lib/music/suno-client.ts
   - Unofficial Suno API wrapper (https://github.com/gcui-art/suno-api)
   - Methods: generateMusic(lyrics, style, duration), getStatus(taskId), getAudioUrl(taskId)
   - Style options: lullaby, upbeat_kids, classical_indian, folk_indian, pop_kids
   - Polling mechanism for async generation
   - Mock mode when SUNO_COOKIE not set

2. src/lib/music/audio-utils.ts
   - Web Audio API utilities
   - createAudioContext, loadAudioBuffer, getWaveformData
   - Audio visualization: frequency bars, waveform
   - Time formatting helpers

3. src/lib/music/sample-tracks.ts
   - 5 built-in sample audio tracks (royalty-free kids music URLs)
   - Track metadata: title, duration, style, bpm

4. src/app/api/music/generate/route.ts
   - POST: { lyrics, style, instrumental?, duration }
   - Initiates Suno generation, returns taskId
   - Mock response when no API key

5. src/app/api/music/status/[taskId]/route.ts
   - GET: Check generation status, return audioUrl when ready

6. src/components/studio/MusicGenerator.tsx
   - Lyrics input (auto-fill from rhymes module)
   - Style selector (5 music styles with preview icons)
   - Duration slider (30s - 3min)
   - Instrumental toggle
   - Generate button with progress indicator
   - Status display: queued, generating, complete, error

7. src/components/studio/MusicPlayer.tsx
   - Full-featured audio player
   - Play/Pause/Stop, Seek bar, Volume
   - Waveform visualization (canvas-based)
   - Loop toggle, playback speed (0.5x, 1x, 1.5x)
   - Download button

8. src/components/studio/AudioVisualizer.tsx
   - Canvas-based real-time frequency visualization
   - Color scheme: kids pastel gradient bars
   - Responsive sizing

9. src/components/studio/StyleSelector.tsx
   - 5 music style cards with: icon, name, description, sample preview
   - Styles: Lullaby, Upbeat Kids, Classical Indian, Folk, Pop

10. src/components/studio/MusicLibrary.tsx
    - Grid of generated/saved tracks
    - Play preview, download, delete
    - Filter by style

11. src/store/music-store.ts
    - Zustand: currentTrack, playlist, isPlaying, volume, generationStatus

Commit: git add . && git commit -m "feat: music studio with Suno integration and audio player"
Push: git push origin feat/music-studio
```

---

## SESSION S5: Image Generation Pipeline (WAVE 2)

**Branch**: `feat/image-gen`

**Copy-paste this prompt into Claude Code IDE:**

```
You are working on: kids-rhymes-studio-pro
GitHub: https://github.com/ganeshgowri-ASA/kids-rhymes-studio-pro

PREP: git checkout main && git pull && git checkout -b feat/image-gen

TASK: Build AI image generation for cartoon and realistic kids scenes with Indian cultural themes.

CREATE THESE FILES:

1. src/lib/image/replicate-client.ts
   - Replicate SDK wrapper
   - Models: stability-ai/sdxl (cartoon), black-forest-labs/flux-schnell (realistic)
   - Methods: generateImage(prompt, style, size), getResult(predictionId)
   - Aspect ratios: 16:9 (video), 1:1 (square), 9:16 (portrait)
   - Mock mode with placeholder images when no API key

2. src/lib/image/prompt-builder.ts
   - buildCartoonPrompt(scene, characters, background): adds "cartoon style, bright colors, kid-friendly, no text"
   - buildRealisticPrompt(scene, characters, background): adds "photorealistic, soft lighting, safe for kids"
   - Indian theme prompts: traditional dress, festivals (Diwali, Holi, Pongal), landscapes
   - Negative prompts: "scary, violent, adult content, text, watermark"
   - Character templates: Indian kids (boy/girl), animals, nature elements

3. src/lib/image/prompt-templates.ts
   - 20 pre-built scene templates:
     * Animals: "Colorful parrots in a mango tree", "Elephants at a river"
     * Festivals: "Kids celebrating Diwali with diyas", "Holi colors celebration"
     * Nature: "Rainbow over rice paddy fields", "Peacock dancing in rain"
     * Daily life: "Kids playing cricket", "Mother cooking in kitchen"
     * Learning: "Kids in classroom with teacher", "Reading under a banyan tree"

4. src/app/api/images/generate/route.ts
   - POST: { prompt, style: 'cartoon'|'realistic', aspectRatio, negativePrompt? }
   - Returns predictionId for async polling

5. src/app/api/images/status/[id]/route.ts
   - GET: Check prediction status, return imageUrl

6. src/app/studio/images/page.tsx
   - Image generation page
   - Style toggle: Cartoon vs Realistic
   - Template gallery (click to use)
   - Custom prompt textarea
   - Generate button with progress
   - Result gallery with download

7. src/components/studio/ImageGenerator.tsx
   - Dual-mode UI: templates or custom prompt
   - Style switcher with visual preview
   - Aspect ratio selector
   - Side-by-side comparison: cartoon vs realistic

8. src/components/studio/SceneGallery.tsx
   - Grid of generated images
   - Lightbox view, download, delete, use in video
   - Drag-and-drop reordering

9. src/components/studio/PromptTemplates.tsx
   - Categorized template cards (Animals, Festivals, Nature, etc.)
   - Click to fill prompt, edit before generating

10. src/store/image-store.ts
    - Zustand: generatedImages[], selectedStyle, isGenerating, currentPrompt

Commit: git add . && git commit -m "feat: image generation with Replicate SDXL and Flux"
Push: git push origin feat/image-gen
```

---

## SESSION S6: TTS Engine - Indian Languages (WAVE 2)

**Branch**: `feat/tts-engine`

**Copy-paste this prompt into Claude Code IDE:**

```
You are working on: kids-rhymes-studio-pro
GitHub: https://github.com/ganeshgowri-ASA/kids-rhymes-studio-pro

PREP: git checkout main && git pull && git checkout -b feat/tts-engine

TASK: Build Indian language text-to-speech system with multiple TTS providers.

CREATE THESE FILES:

1. src/lib/tts/provider.ts
   - Factory: createTTSProvider(type: 'indicf5'|'coqui'|'google'|'browser')
   - Interface: synthesize(text, language, voiceId, options)
   - Options: speed, pitch, format (mp3/wav)
   - Browser TTS fallback using Web Speech API

2. src/lib/tts/indic-f5.ts
   - HuggingFace Inference API for ai4bharat/IndicF5-TTS
   - Supports: Hindi, Telugu, Tamil, Bengali, Gujarati, Kannada
   - Returns audio blob

3. src/lib/tts/coqui-client.ts
   - Coqui XTTS-v2 API wrapper
   - Multi-language voice cloning support
   - Returns audio stream

4. src/lib/tts/google-tts.ts
   - Google Cloud TTS API
   - WaveNet voices for Indian languages
   - SSML support for expression

5. src/lib/tts/browser-tts.ts
   - Web Speech API wrapper (zero-cost fallback)
   - List available voices per language
   - Works offline

6. src/lib/tts/voice-catalog.ts
   - Voice catalog per language:
     * Hindi: 2 male, 2 female voices
     * Telugu: 1 male, 1 female
     * Tamil: 1 male, 1 female
     * Bengali, Gujarati, Kannada: 1 each
   - Voice metadata: name, gender, style, provider

7. src/app/api/tts/synthesize/route.ts
   - POST: { text, language, voiceId, provider, speed?, pitch? }
   - Returns audio blob or streaming audio
   - Falls back to browser TTS if no API key

8. src/app/api/tts/voices/route.ts
   - GET: Returns available voices per language and provider

9. src/components/studio/VoiceSelector.tsx
   - Language filter dropdown
   - Voice cards with: name, gender icon, provider badge
   - Preview button (plays sample)
   - Selected state highlight

10. src/components/studio/NarrationEditor.tsx
    - Text input with language detection
    - Voice selector
    - Speed/pitch controls (sliders)
    - Generate & preview button
    - Timeline sync markers
    - Download narration audio

11. src/components/studio/SubtitleTrack.tsx
    - Auto-generated subtitles from TTS text
    - Timing editor (drag to adjust)
    - Font/color/position controls
    - Export as SRT/VTT

12. src/store/tts-store.ts
    - Zustand: selectedVoice, selectedLanguage, generatedAudio, isPlaying

Commit: git add . && git commit -m "feat: TTS engine with IndicF5, Coqui, Google, browser fallback"
Push: git push origin feat/tts-engine
```

---

## SESSION S7: Phaser.js Educational Games (WAVE 2)

**Branch**: `feat/games`

**Copy-paste this prompt into Claude Code IDE:**

```
You are working on: kids-rhymes-studio-pro
GitHub: https://github.com/ganeshgowri-ASA/kids-rhymes-studio-pro

PREP: git checkout main && git pull && git checkout -b feat/games

TASK: Build 5 educational Phaser.js games with multilingual support and progress tracking.

CREATE THESE FILES:

1. src/games/config.ts
   - Phaser.AUTO renderer, responsive canvas sizing
   - Physics: arcade (simple)
   - Scale mode: FIT, center both
   - Default scene config

2. src/components/games/GameWrapper.tsx
   - Dynamic import of Phaser (no SSR): next/dynamic with ssr:false
   - Mount Phaser game in React component
   - Pass language and difficulty as game data
   - Cleanup on unmount
   - Full-screen toggle button

3. src/games/alphabet/AlphabetScene.ts
   - Phaser.Scene: "AlphabetGame"
   - Display a letter (A-Z or Hindi/Telugu alphabet)
   - Trace the letter with mouse/touch (drawing on canvas)
   - Accuracy scoring based on path matching
   - Audio pronunciation on completion
   - Next letter on success, encouraging messages
   - Star rewards (1-3 stars based on accuracy)

4. src/games/counting/CountingScene.ts
   - Phaser.Scene: "CountingGame"
   - Display N objects (apples, stars, animals) scattered on screen
   - Player taps each to count, number increments
   - Correct count -> celebration animation (confetti)
   - Levels: 1-5, 1-10, 1-20
   - Multilingual number display

5. src/games/matching/MatchingScene.ts
   - Phaser.Scene: "MatchingGame"
   - Card flip memory game
   - Pairs: animal + name, number + word, color + patch
   - Grid: 2x3 (easy), 3x4 (medium), 4x5 (hard)
   - Flip animation, match celebration
   - Timer and move counter

6. src/games/rhyme-karaoke/KaraokeScene.ts
   - Phaser.Scene: "KaraokeGame"
   - Display lyrics line by line
   - Highlight current word synced with audio playback
   - Bouncing ball indicator
   - Sing-along mode with microphone (optional)
   - Score based on timing

7. src/games/puzzle/PuzzleScene.ts
   - Phaser.Scene: "PuzzleGame"
   - Image split into puzzle pieces (3x3, 4x4)
   - Drag-and-drop pieces to correct position
   - Snap-to-grid when close
   - Preview of complete image
   - Timer and move counter

8. src/app/games/page.tsx
   - Games hub page
   - 5 game cards with: thumbnail, title, description, difficulty stars
   - Language selector affects game content
   - Progress overview per game

9. src/app/games/[gameType]/page.tsx
   - Dynamic route for each game
   - GameWrapper component with game type
   - Difficulty selector
   - Back to hub button

10. src/components/games/ScoreBoard.tsx
    - Stars display (earned/total)
    - Level progress bar
    - High score per game
    - Achievement badges

11. src/components/games/GameMenu.tsx
    - Pause overlay: Resume, Restart, Quit
    - Settings: Sound on/off, Difficulty

12. src/store/game-store.ts
    - Zustand: scores{}, currentGame, difficulty, soundEnabled

IMPORTANT:
- All games must work immediately without external assets
- Use Phaser graphics primitives for shapes/text
- Use emoji as sprite placeholders where needed
- Responsive canvas that works on mobile and desktop
- Each game under 200 lines of code

Commit: git add . && git commit -m "feat: 5 Phaser.js educational games with multilingual support"
Push: git push origin feat/games
```

---

## SESSION S8: Video Composition (WAVE 3)

**Branch**: `feat/video-composer`

**Copy-paste this prompt into Claude Code IDE:**

```
You are working on: kids-rhymes-studio-pro
GitHub: https://github.com/ganeshgowri-ASA/kids-rhymes-studio-pro

PREP: git checkout main && git pull && git checkout -b feat/video-composer

TASK: Build browser-based video composition using FFmpeg.wasm with timeline editor.

CREATE THESE FILES:

1. src/lib/video/ffmpeg-processor.ts
   - Load FFmpeg.wasm (lazy, on demand)
   - Methods:
     * initFFmpeg(): load and initialize
     * createVideoFromImages(images[], duration, fps): MP4 from image sequence
     * addAudioToVideo(videoBlob, audioBlob): merge audio track
     * addSubtitles(videoBlob, srtContent): burn subtitles
     * concatenateVideos(videos[]): join scenes
     * exportVideo(format: 'mp4'|'webm'|'gif'): final export
   - Progress callback for UI updates

2. src/lib/video/timeline.ts
   - Timeline data model:
     * Track: { id, type: 'image'|'audio'|'narration'|'subtitle', items[] }
     * TimelineItem: { id, start, duration, source, transitions }
   - Methods: addItem, removeItem, moveItem, setDuration
   - Validation: no overlaps on same track

3. src/lib/video/transitions.ts
   - Transition effects: fade, crossfade, slide-left, slide-right, zoom-in, zoom-out
   - Each returns FFmpeg filter string

4. src/app/api/video/render/route.ts
   - POST: { timeline, format, resolution }
   - Server-side render for complex videos
   - Returns download URL

5. src/app/studio/video/page.tsx
   - Full video production page
   - Import scenes from image gallery
   - Import audio from music library
   - Timeline editor
   - Preview player
   - Export dialog

6. src/components/studio/TimelineEditor.tsx
   - Multi-track timeline: Images, Audio, Narration, Subtitles
   - Drag items onto tracks
   - Resize duration by dragging edges
   - Snap-to-grid alignment
   - Zoom in/out on timeline
   - Playhead indicator

7. src/components/studio/VideoPreview.tsx
   - Canvas-based scene preview
   - Play/Pause through timeline
   - Current scene display with transitions
   - Frame counter

8. src/components/studio/ExportDialog.tsx
   - Format selector: MP4, WebM, GIF
   - Resolution: 720p, 1080p
   - Quality slider
   - Progress bar during export
   - Download button when complete

9. src/store/video-store.ts
   - Zustand: timeline, isRendering, progress, exportedUrl

Commit: git add . && git commit -m "feat: video composer with FFmpeg.wasm and timeline editor"
Push: git push origin feat/video-composer
```

---

## SESSION S9: Multilingual i18n (WAVE 2)

**Branch**: `feat/i18n`

**Copy-paste this prompt into Claude Code IDE:**

```
You are working on: kids-rhymes-studio-pro
GitHub: https://github.com/ganeshgowri-ASA/kids-rhymes-studio-pro

PREP: git checkout main && git pull && git checkout -b feat/i18n

TASK: Implement full multilingual support for 7 Indian languages using next-intl.

CREATE THESE FILES:

1. src/lib/i18n/config.ts
   - Supported locales: en, hi, te, ta, bn, gu, kn
   - Default locale: en
   - Language metadata: name, nativeName, script, direction

2. src/lib/i18n/request.ts
   - next-intl getRequestConfig
   - Load messages based on locale

3. src/messages/en.json - English translations (all UI strings)
4. src/messages/hi.json - Hindi translations
5. src/messages/te.json - Telugu translations
6. src/messages/ta.json - Tamil translations
7. src/messages/bn.json - Bengali translations
8. src/messages/gu.json - Gujarati translations
9. src/messages/kn.json - Kannada translations

Each JSON file must include translations for:
- nav: { home, rhymes, studio, games, settings }
- dashboard: { welcome, createRhymes, productionStudio, playGames, myLibrary }
- rhymes: { title, generateLyrics, selectTheme, selectLanguage, themes.* }
- studio: { title, music, images, video, tts }
- games: { title, alphabet, counting, matching, karaoke, puzzle, play, score, stars }
- common: { loading, save, cancel, delete, download, share, back, next, error }

10. src/middleware.ts
    - next-intl middleware for locale detection
    - Cookie-based locale persistence

11. src/app/[locale]/layout.tsx
    - Locale-aware layout
    - next-intl NextIntlClientProvider

12. src/lib/i18n/fonts.ts
    - Google Fonts per script:
      * Devanagari (Hindi): Noto Sans Devanagari
      * Telugu: Noto Sans Telugu
      * Tamil: Noto Sans Tamil
      * Bengali: Noto Sans Bengali
      * Gujarati: Noto Sans Gujarati
      * Kannada: Noto Sans Kannada
    - Font loader helper

Commit: git add . && git commit -m "feat: multilingual i18n with 7 Indian languages"
Push: git push origin feat/i18n
```

---

## SESSION S10: Integration + Deployment (WAVE 3)

**Branch**: `feat/integration`

**Copy-paste this prompt into Claude Code IDE:**

```
You are working on: kids-rhymes-studio-pro
GitHub: https://github.com/ganeshgowri-ASA/kids-rhymes-studio-pro

PREP:
git checkout main && git pull
git merge feat/bootstrap
git merge feat/ui-dashboard
git merge feat/rhymes-engine
git merge feat/music-studio
git merge feat/image-gen
git merge feat/tts-engine
git merge feat/games
git merge feat/video-composer
git merge feat/i18n
git checkout -b feat/integration

TASK: Integrate all modules, resolve conflicts, build end-to-end flow, and deploy.

STEPS:

1. RESOLVE MERGE CONFLICTS
   - Fix any import conflicts across modules
   - Ensure all stores are properly combined
   - Verify all API routes don't conflict

2. END-TO-END FLOW
   - Wire up: Rhyme creation -> Music generation -> Image generation -> TTS narration -> Video export
   - Add "Create Video from Rhyme" one-click wizard:
     * Step 1: Select/generate rhyme
     * Step 2: Generate music from lyrics
     * Step 3: Generate scene images (1 per verse)
     * Step 4: Generate narration audio
     * Step 5: Compose video with all assets
     * Step 6: Preview and export

3. NAVIGATION & ROUTING
   - Ensure all pages linked in Sidebar
   - Breadcrumb navigation
   - 404 page with kids illustration

4. ERROR HANDLING
   - Global error boundary
   - Toast notifications for all async operations
   - Retry logic for failed API calls
   - Offline detection and message

5. PERFORMANCE
   - Lazy load heavy components (Phaser, FFmpeg)
   - Image optimization with next/image
   - Code splitting per route
   - Loading skeletons for all async content

6. TESTING
   - Verify all pages render without errors
   - Test each API route with mock data
   - Test each game loads and runs
   - Test language switching works across all pages
   - Test audio player on multiple browsers

7. DEPLOYMENT
   - Create vercel.json with build config
   - Set environment variables template
   - Run: npm run build (fix any build errors)
   - Deploy to Vercel: npx vercel --prod
   - OR Railway: railway up

8. FINAL CLEANUP
   - Remove console.logs
   - Add proper meta tags and OG images
   - Create favicon (kids music icon)
   - Update README with live URL

Commit: git add . && git commit -m "feat: full integration, E2E flow, and deployment"
Push: git push origin feat/integration
Merge: Create PR to main
```

---

## Quick Launch Commands

Open 7 terminal tabs in Claude Code IDE and run these simultaneously:

```bash
# Terminal 1 (WAVE 1 - must finish first)
cd kids-rhymes-studio-pro && git checkout -b feat/bootstrap
# Paste S1 prompt

# After S1 completes, push to main:
git checkout main && git merge feat/bootstrap && git push

# Then launch WAVE 2 in parallel terminals:

# Terminal 2
git checkout main && git pull && git checkout -b feat/ui-dashboard
# Paste S2 prompt

# Terminal 3
git checkout main && git pull && git checkout -b feat/rhymes-engine
# Paste S3 prompt

# Terminal 4
git checkout main && git pull && git checkout -b feat/music-studio
# Paste S4 prompt

# Terminal 5
git checkout main && git pull && git checkout -b feat/image-gen
# Paste S5 prompt

# Terminal 6
git checkout main && git pull && git checkout -b feat/tts-engine
# Paste S6 prompt

# Terminal 7
git checkout main && git pull && git checkout -b feat/games
# Paste S7 prompt

# Terminal 8
git checkout main && git pull && git checkout -b feat/i18n
# Paste S9 prompt
```

After all WAVE 2 branches merge to main, launch WAVE 3:
```bash
# Terminal 9
git checkout main && git pull && git checkout -b feat/video-composer
# Paste S8 prompt

# Terminal 10 (final)
# Paste S10 prompt after all merges complete
```
