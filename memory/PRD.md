# PAUSE — Product Requirements Document

## Original Problem Statement
User asked to faithfully migrate their existing public GitHub repository app
(https://github.com/micheleiannello7-cyber/PAUSE-4.95) into this Emergent
environment and make the preview ready. Requirement: recreate the same app (UI +
functionality) exactly.

## What PAUSE Is
A calm micro-learning mobile app. In empty moments, users read or listen to short
curiosity stories and 2–3 minute mini-lessons across ~12 categories. Designed to
"leave you something, not keep you hooked" — no infinite feed. Italian is the
primary language with full English translations.

## Architecture
- **Frontend:** Expo (SDK 57) + expo-router, React Native 0.86, React Query,
  react-native-reanimated, expo-audio (TTS player), expo-image, i18n (it/en),
  themeable (light/dark/system + accent). No login — anonymous user_id persisted
  locally via storage util.
- **Backend:** FastAPI + Motor/MongoDB. Auto-seeds 12 categories + 437 stories/
  lessons on startup (`ensure_seed`). OpenAI TTS narration via EMERGENT_LLM_KEY,
  content-hashed audio asset layer, Object Storage for generated covers/art with
  an on-disk media cache, Stripe purchase hooks for category unlocks.
- **Data:** collections `categories`, `stories`, `user_state`, `purchases`,
  `design_assets`. DB_NAME=test_database.

## User Personas
- **The curious commuter** — wants a quick, meaningful thing to learn in 2–3 min.
- **The mindful user** — wants to learn without doom-scrolling; values the session
  limit / "pause" philosophy.

## Core Requirements (static)
- Browse categories, discover deck, explore, bookmarks, profile tabs.
- Open a story → chapter pager reader with hero art + audio narration.
- Personalize interests during onboarding; track completion, streaks, stats.
- Bookmark/like/save stories; premium gating + session pause limit.
- Bilingual content (it/en) with language toggle.

## Implemented (migration — 2026-06)
- [2026-06] Full verbatim code migration from repo into /app (backend + frontend).
- [2026-06] Frontend deps installed (yarn), backend deps installed (pip). SDK 57.
- [2026-06] backend/.env wired: MONGO_URL, DB_NAME, EMERGENT_LLM_KEY, INTEGRATION_PROXY_URL.
- [2026-06] Backend boots and auto-seeds 12 categories + 437 stories. Preview live.
- [2026-06] Testing agent: backend 12/12 pytest pass; frontend core flows 100%
  (onboarding → tabs → deep-dive reader → bookmark → stats → it/en toggle).
- [2026-06] Fixed media endpoints returning 500 → clean 404 for Object Storage
  assets missing in this env (media_cache.cached_object). Frontend SVG fallbacks intact.

## Known Environment Notes
- Some seeded generated covers/category art reference the source repo's Object
  Storage bucket; those bytes aren't in this env, so those images fall back to
  SVG artwork (by design). Curated Unsplash covers load fine.
- TTS audio generation for new story/voice combos depends on EMERGENT_LLM_KEY
  budget; cached combos play, others show "Audio non disponibile".

## Backlog / Remaining
- **P1:** Optional one-time cleanup to null `illustration_generated` /
  `hero_image_generated` for docs whose bytes aren't in this env (removes fallback).
- **P1:** Re-generate covers/category art into this env's Object Storage if user
  wants AI images instead of SVG fallbacks.
- **P2:** Verify Stripe premium/unlock flow with real keys if user provides them.
- **P2:** Warm the TTS cache for top stories once key budget allows.

## Next Tasks
- Await user direction on whether to regenerate media assets or keep SVG fallbacks.
