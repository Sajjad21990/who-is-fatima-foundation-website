# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Who is Fatima Foundation website — a Next.js 16 charity foundation site with public pages, admin dashboard, quiz/event system, and blog CMS. Built with React 19, TypeScript, and Firebase backend.

## Commands

```bash
npm run dev      # Dev server on localhost:3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```

Utility scripts in `/scripts/`:
```bash
node scripts/seed-admin.mjs      # Seed initial admin user
node scripts/bump-scores.mjs     # Score management utility
node scripts/fix-q4-scores.mjs   # Q4 score correction
```

## Architecture

### Routing (App Router)

- **Public pages:** `/`, `/about`, `/blog`, `/events`, `/gallery`, `/projects`, `/contact`, `/donate`, `/volunteer`
- **Admin dashboard:** `/admin/login` and `/admin/(dashboard)/*` — admin routes skip the public header/footer via `LayoutWrapper.tsx`
- Dynamic routes: `/blog/[slug]`, `/events/[slug]`

### Data Layer — Hybrid Storage

- **Firestore** (via Firebase Admin SDK): Blog posts, contact submissions, volunteer applications, quiz submissions, user profiles, newsletter subscribers
- **JSON files** in `/content/events/`: Event/quiz definitions — versioned in git, loaded at build/request time via `lib/events.ts`. Validated with a Zod schema (`lib/validations/event.ts`) that rejects out-of-range MCQ answer indices at load time.
- **Server Actions** in `app/actions/`: `contact.ts`, `admin.ts`, `blog.ts`, `events.ts`, `volunteer.ts`, `newsletter.ts` — handle mutations server-side. Every admin/mutation action calls a role guard from `lib/auth.ts` first.

### Auth (server-enforced)

Admin auth uses **Firebase session cookies**. On login, the client exchanges its ID token at `POST /api/auth/session` for an httpOnly `session` cookie. `lib/auth.ts` (`getCurrentUser`, `requireRole`/`requireAdmin`/`requireEditor`/`requireStaff`) verifies the cookie + loads the Firestore role on the server. `middleware.ts` bounces unauthenticated `/admin/*` requests to login; the dashboard layout and every protected server action re-verify. Firestore/Storage rules (`firestore.rules`, `storage.rules`) lock client access down — deploy via the Firebase CLI (`firebase.json`, `firestore.indexes.json`).

### Quiz scoring

`lib/grade.ts` `gradeQuiz()` is the single grader used by both `submitQuiz` and the admin **Recalculate Scores** action (`recalculateEventScores` in `admin.ts`). After correcting an answer key in `content/events/*.json`, run recalculate from the admin event page to re-grade all stored submissions — no more one-off `fix-*.mjs` scripts.

### Image Pipeline

Firebase Storage → ImageKit proxy (`ik.imagekit.io/whoisfatima`) for on-the-fly transformations. Uploads go through the Firebase client SDK (`lib/storage.ts` `uploadImage`, admin only). The pure optimizer lives in `lib/image.ts` (`getOptimizedUrl`); the gallery is server-rendered via `lib/gallery.ts` (Admin SDK bucket listing) and displayed by `components/gallery/GalleryView.tsx`.

### Key Libraries

- **UI:** Radix UI primitives + shadcn pattern (`components/ui/`)
- **Forms:** react-hook-form + Zod validation (`lib/validations/`)
- **Rich text:** TipTap editor (admin blog editing)
- **PDF:** react-pdf for document viewing
- **Animations:** Framer Motion, canvas-confetti
- **Fonts:** Poppins (English) + Amiri (Arabic) loaded in root layout

### Component Organization

- `components/ui/` — Radix/shadcn primitives
- `components/admin/` — Admin dashboard components
- `components/blog/`, `components/events/` — Feature-specific components
- `components/auth/` — Authentication components
- Top-level components (`Hero.tsx`, `Header.tsx`, `Footer.tsx`, etc.) — public page sections

### Type Definitions (`lib/types.ts`)

- **Events:** Union type `QuizEvent | WebinarEvent` with question types (`MCQQuestion`, `TextQuestion`, `BooleanQuestion`)
- **Blog:** `BlogPost` with formats (rich-text, pdf) and types (blog, news, event)
- **Users:** `UserProfile` with roles (admin, editor, viewer)
- **Submissions:** Quiz answers with scoring

## Environment

Firebase config (both client `NEXT_PUBLIC_FIREBASE_*` and admin `FIREBASE_ADMIN_*`), Cloudinary, ImageKit, and notification email are configured via `.env`. The Firebase Admin private key is a server-only secret.
