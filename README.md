# CampusStudy (demo)

CampusStudy is a **campus-only student collaboration network** for finding **study partners** and **small study groups**. This repository is a **clickable MVP / investor demo** built with **Next.js (App Router), React 19, TypeScript, Tailwind CSS**, and lightweight **Radix-style UI primitives** compatible with the shadcn/ui patterns.

**Positioning:** academic-first (LinkedIn + Discord + productivity vibes), **not** a swipe-based dating product.

## What’s in the demo

- **Landing page** with hero, how it works, and trust-oriented copy.
- **Onboarding** (simulated school email gate + multi-step profile).
- **Dashboard** with recommended matches, class-linked study groups, exam-aligned peers, active students, and quick search.
- **Discover** with working filters over mock classmates.
- **Profile detail** pages with compatibility explanation.
- **Messaging** with inbox + demo threads + composer and quick prompts.
- **Study groups** with join state and a **create group** modal (local success message).
- **Trust & safety** page describing campus-only access, verification, reporting, and guidelines.

University preset: **Pacific Crest University** (~26 mock students).

## Run locally

```bash
cd campus-study-connect
npm install
npm run dev
```

Open `http://localhost:3000`.

## What is mocked

- **No backend**, **no real authentication**, **no email delivery**.
- **Profiles, matches, groups, and messages** are **in-memory / `localStorage`** for persistence across refreshes.
- **Images** load from Unsplash (`next/image` remote pattern configured).

Clear site data in your browser to reset the demo state.

## Suggested next steps for a real MVP

- **Real school SSO / email verification** and **per-tenant** (per university) data isolation.
- **Postgres (or similar)** for users, profiles, courses, groups, messages, and moderation cases.
- **Search index** (e.g. OpenSearch or Postgres full text) for class tags and availability.
- **Push / email digests** for exam windows and group activity.
- **Moderation tooling**: reports, blocks, admin review queues, audit logs.
- **Privacy controls**: hide fields, blurred directory modes, consent for discovery.

## Project structure (high level)

- `src/app/` — routes and pages (see `(app)` route group for main shell).
- `src/components/ui/` — reusable UI primitives (button, card, dialog, etc.).
- `src/lib/mock-data.ts` — demo roster, groups, seeded chats.
- `src/lib/match-utils.ts` — compatibility scoring for the prototype.
- `src/components/providers/demo-context.tsx` — local demo state (profile, DMs, joined groups).

## License

Demo code for evaluation purposes. Add a license before public distribution if needed.
