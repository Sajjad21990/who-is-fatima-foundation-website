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

- **Firestore** (via Firebase Admin SDK): Blog posts, contact submissions, volunteer applications, quiz submissions, user profiles
- **JSON files** in `/content/events/`: Event/quiz definitions — versioned in git, loaded at build/request time via `lib/events.ts`
- **MDX files** in `/content/blog/`: Some blog content uses MDX with frontmatter (gray-matter), rendered with next-mdx-remote
- **Server Actions** in `app/actions/`: `contact.ts`, `admin.ts`, `blog.ts` — handle mutations server-side

### Image Pipeline

Firebase Storage → ImageKit proxy (`ik.imagekit.io/whoisfatima`) for on-the-fly transformations. Cloudinary used for uploads. Utilities in `lib/storage.ts`.

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
