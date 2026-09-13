# The Model Desk

Free AI news + explainers, a ₹100→₹999 interview-prep ladder, paid short courses,
and a business-automation contact page. Next.js 14 (App Router) + TypeScript +
Tailwind + Prisma + NextAuth + Postgres.

## Local development

```bash
npm install
npx prisma generate
npm run dev
```

Opens at http://localhost:3000. Works fully offline with zero setup — the news
feed falls back to sample cards and the quiz just won't persist attempts until
Postgres is connected (see `.env.example`).

## Wiring up the real backend

1. **Database** — create a free Postgres on [neon.tech](https://neon.tech), copy
   the *pooled* connection string into `DATABASE_URL` and the direct one into
   `DIRECT_URL` in `.env.local`, then `npm run prisma:migrate`.
2. **Login** — Google OAuth credentials from Google Cloud Console into
   `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`.
3. **Payments** — Razorpay dashboard keys into `RAZORPAY_*`. The webhook route
   (`src/app/api/webhooks/razorpay/route.ts`) verifies the signature before
   trusting anything — point Razorpay's dashboard at
   `https://yourdomain.com/api/webhooks/razorpay`.
4. **Daily news** — `vercel.json` schedules `/api/cron/fetch-news` once a day.
   Set `CRON_SECRET` in Vercel's env vars (same value as `.env.local`).

Deploy to **Vercel** (not a generic static host) — the cron job and API routes
need it.

## Content & copyright

Read this before adding real content, not after something goes wrong.

- **News feed** (`src/lib/fetchNews.ts`): only reads each source's own public
  RSS feed — feeds they publish specifically to be syndicated — and keeps just
  the title, an excerpt of their own description capped at 180 characters, and
  a link back to them. It never fetches the article page itself or stores full
  body text. This is the same headline + snippet + outbound-link pattern
  Google News, Apple News, and Feedly use. **Do not** change this to scrape
  full article bodies — that's a real copyright problem the current design
  avoids.
- **Interview questions / course material**: everything shipped so far was
  written fresh, not copied from an existing paid course, book, or question
  bank. Keep it that way — paraphrasing a specific competitor's proprietary
  question set is a real risk; writing your own questions about the same
  well-known concepts (RAG, attention, agents) is not.
- **Articles about papers**: explain findings in your own words and link to
  the paper. Don't reproduce a paper's figures or substantial passages of text
  verbatim without permission — commentary and explanation is fine, copying
  isn't.
- **Images**: currently hotlinked from Unsplash, which is licensed for free
  commercial use with no attribution required. Before public launch, either
  download and self-host the images you keep, or credit the photographer —
  both are better practice than permanent hotlinking to another service's CDN.

## Project shape

- `src/app/page.tsx` — homepage (hero, Pulse, costs, free tools, personas, pack)
- `src/app/quiz`, `/courses`, `/articles` — free/paid content surfaces
- `src/components/PulseFeed.tsx` — the auto-scrolling news ticker, DB-backed
  with a static fallback
- `src/components/RagDemo.tsx` — the retrieve-then-generate mini demo on the
  RAG Basics course
- `prisma/schema.prisma` — the whole data model (users, quiz attempts, courses,
  purchases, news items)
- `scripts/fetch-news.ts` / `src/app/api/cron/fetch-news` — the same fetch
  logic, callable manually or on Vercel's schedule
