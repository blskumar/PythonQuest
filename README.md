# Python Quest 🐍 — MVP

A personalized, gamified Python learning platform built with Next.js, Node.js and Supabase.

## Stack

- Next.js + React + TypeScript
- Tailwind CSS
- Supabase Auth + PostgreSQL
- Node.js API
- Zod-ready architecture
- Monaco Editor planned for the coding challenges
- Sandboxed Python execution planned for a later MVP phase

## Included in this scaffold

- Landing page
- Email/password registration UI
- Google sign-in button
- Learner onboarding fields:
  - name
  - age
  - email
  - profession
  - grade and school for students
  - learning goal
- Personalized dashboard
- Chapter/lesson cards
- Interactive lesson
- Quiz flow
- XP, streak and badge UI
- Supabase browser client placeholder
- Initial database schema
- Seed curriculum

## Setup

1. Install Node.js 20+.
2. Create a Supabase project.
3. Copy the `apps/web/.env.local` section of `.env.example` to `apps/web/.env.local`.
4. Add your Supabase URL and anon key.
5. Run the SQL in `supabase/schema.sql`.
6. Install dependencies with `npm install`.
7. Start Next.js with `npm run dev`.

Do not put a Supabase service-role key in browser code or commit it to Git.

Note: `apps/api` (the Node API referenced by the second block in `.env.example`) is not implemented yet — see "Next implementation phases" below. There's nothing to start on port 4000 today.

## Google authentication

Enable Google under Supabase Authentication → Providers and configure the OAuth credentials there. The UI already includes a Google sign-in entry point.

## Next implementation phases

1. Wire Supabase authentication and profile persistence.
2. Persist lesson progress, quiz attempts and XP.
3. Add Monaco code editor.
4. Add isolated Python execution service.
5. Add adaptive quiz selection.
6. Add certificate generation and verification.
7. Add teacher/parent views.
