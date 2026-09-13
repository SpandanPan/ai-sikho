# The Model Desk

Free AI news + explainers, a ₹100→₹999 interview-prep ladder, paid short courses,
and a business-automation contact page. Next.js 14 (App Router) + TypeScript +
Tailwind + Prisma + NextAuth + Postgres (Supabase).

## Quick start (this repo already has a real database connected)

```bash
git clone https://github.com/SpandanPan/the-model-desk.git
cd the-model-desk
npm install
npx prisma generate
npm run dev
```

Opens at **http://localhost:3000**. This needs `.env.local` to exist first —
see below; without it, the app still runs (news falls back to sample cards,
sign-in/progress/ratings won't work) but that's not the normal state for this
project anymore now that Supabase is wired up.

**Important**: never run `npm run build` while `npm run dev` is running —
they share the `.next` folder and will corrupt each other's build cache
(`Cannot find module './NNN.js'` errors). Stop one before starting the other.

## `.env.local` (not committed — copy `.env.example` and fill in)

The database is Supabase project **AI-Kickstart**
(`nddmkmjckkrzlykeglev`, region **ap-northeast-1 / Tokyo** — not Mumbai,
despite the original plan; that's just where this Supabase project actually
landed). Get the connection strings from the Supabase dashboard → your
project → **Connect** button → **ORM** tab → **Prisma**, which shows both
values already in the right format:

```bash
DATABASE_URL="postgresql://postgres.nddmkmjckkrzlykeglev:[PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.nddmkmjckkrzlykeglev:[PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres"
```

Get `[PASSWORD]` from whoever set up the project (it's the Postgres password
chosen at project creation, not an API key) — it's not written here or
committed anywhere on purpose. If you don't have it, reset it from Supabase
→ Project Settings → Database → Reset database password (this breaks the
old password, so update `.env.local` after).

The direct (non-pooler) host `db.nddmkmjckkrzlykeglev.supabase.co:5432`
**does not work from every network** — it's IPv6-only and failed to resolve
during setup. Always use the pooler hostnames above for both variables; use
port `6543` (transaction mode) for `DATABASE_URL` and `5432` (session mode,
required for migrations) for `DIRECT_URL`.

Also set:

```bash
NEXTAUTH_SECRET="generate with: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
```

Everything else in `.env.example` (Google OAuth, Razorpay, `CRON_SECRET`) is
optional until you wire up that specific feature — the app runs fine without
them (Google sign-in just won't work; OTP sign-in doesn't need them).

**Prisma's CLI only reads `.env`, not `.env.local`** (that's a Next.js-only
convention). Keep both in sync when the database changes:

```bash
cp .env.local .env
```

## Database commands

```bash
npx prisma generate       # regenerate the client after pulling schema changes
npx prisma migrate dev    # apply schema changes to the database (asks for a migration name)
npx prisma studio         # browse every table at http://localhost:5555
npm run fetch-news        # manually pull today's AI news into NewsItem right now
```

You can also browse the data directly in the Supabase dashboard → **Table
Editor**, or run raw SQL in Supabase → **SQL Editor**.

## Testing

```bash
npm run test        # 70 unit + integration tests (vitest)
npm run test:watch  # same, watch mode
npm run build        # type-check + lint + production build
```

CI (`.github/workflows/ci.yml`) runs both on every push/PR to `main`.

## Wiring up what's left

1. **Google sign-in** — OAuth credentials from Google Cloud Console into
   `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`. OTP sign-in (email/phone)
   already works without this.
2. **Real OTP delivery** — right now codes are only logged server-side and
   echoed back to the client in dev (`devCode`). Before launch, wire
   `src/app/api/auth/otp/request/route.ts` up to MSG91/Twilio (phone) or
   Resend (email).
3. **Payments** — Razorpay dashboard keys into `RAZORPAY_*`. The webhook
   route (`src/app/api/webhooks/razorpay/route.ts`) verifies the signature
   before trusting anything — point Razorpay's dashboard at
   `https://yourdomain.com/api/webhooks/razorpay`.
4. **Daily news automation** — `vercel.json` schedules
   `/api/cron/fetch-news` once a day once deployed. Set `CRON_SECRET` in
   Vercel's env vars (same value as `.env.local`).

Deploy to **Vercel** (not a generic static host) — the cron job and
serverless API routes need it. Not connected yet, on purpose (see
`CONTRIBUTING.md`).

## Sign-in, and what requires it

**Where everything lives**: one Postgres database (Supabase, project
`AI-Kickstart`), read and written entirely through Prisma
(`prisma/schema.prisma`). Users, OTP codes, active device sessions, quiz
attempts, course progress, ratings, and purchases are all tables in that
same database — there's no separate store per feature.

**How sign-in works**: email or phone number + a 6-digit OTP
(`src/app/api/auth/otp/*`, wired into NextAuth as a Credentials provider in
`src/lib/auth.ts`), plus Google as a fallback. The OTP is generated
server-side, only its SHA-256 hash is stored (`OtpCode.codeHash`), and it
expires after 10 minutes with a 5-attempt cap.

There's no separate "create account" step — entering the same email/phone
again always signs you back into the same account (enforced by a database
unique constraint), so a duplicate account is structurally impossible. The
sign-in response includes `isNewUser` so the UI can say "Account created"
vs. "Welcome back."

**Max 2 signed-in devices per account** — enforced in `src/lib/auth.ts`'s
`signIn` callback via the `DeviceSession` table (`src/lib/deviceLimit.ts`
holds the pure cap logic, unit-tested). A 3rd device is **rejected outright**
(shown a clear "already signed in on 2 devices" message, both on the OTP
form and after a Google redirect) rather than silently bumping an older
device — silent eviction doesn't actually deter sharing, since whoever gets
kicked just signs back in and displaces someone else. A legitimate user who
hits the cap (new phone, cleared cookies) can self-serve their way out via
**Settings → Devices** (`/api/devices`), which lists active devices and lets
them sign one out — no support ticket needed.

**What's free without signing in**: the homepage (news, model costs, free
tools), the quiz, the articles list, and browsing the course catalog
(titles, summaries, prices) — including trying the RAG demo.

**What requires signing in**: tracking progress on any course (free or
paid — it's per-user state, so there's nothing to show an anonymous
visitor), rating a course, and anything involving a purchase. These are
enforced server-side in the relevant API routes
(`src/app/api/courses/[slug]/progress`, `.../ratings`) — never only in the
UI.

## Mentoring (`/mentoring`, admin at `/admin/mentors`)

A placeholder exactly as scoped: you (and only you) onboard mentors and
their availability by hand; there's no self-service mentor signup.

- **Who can onboard mentors**: whoever's email is in `ADMIN_EMAILS` (see
  `.env.example`) — checked server-side in every `/api/admin/*` route via
  `src/lib/admin.ts`, not just hidden in the UI. Add yours to `.env.local`.
- **Booking window**: always the next 15 days from the moment someone is
  actually looking (`src/lib/mentorSlots.ts`, unit-tested) — not a fixed
  calendar range, so it rolls forward every day automatically.
- **Race safety**: two people can't book the same slot. The claim is one
  atomic conditional `UPDATE ... WHERE booked = false` inside a transaction
  (`src/app/api/mentors/[id]/book/route.ts`) — verified under this session by
  firing two simultaneous booking requests at the same slot; exactly one won,
  the other got a clean "someone else just booked this" error.
- **Payment**: bookings land as `PENDING`, same status flow as course
  purchases — flip them to `PAID` via the same Razorpay webhook pattern once
  `RAZORPAY_*` is wired up.

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
- `src/app/quiz`, `/courses`, `/articles`, `/signin`, `/settings` — the rest
  of the pages
- `src/components/PulseFeed.tsx` — the auto-scrolling news ticker, DB-backed
  with a static fallback
- `src/components/RagDemo.tsx` — the retrieve-then-generate mini demo on the
  RAG Basics course
- `src/components/CourseTracker.tsx` — the animated per-course progress bar
  + 5-star rating widget
- `prisma/schema.prisma` — the whole data model
- `scripts/fetch-news.ts` / `src/app/api/cron/fetch-news` — the same fetch
  logic, callable manually or on Vercel's schedule
- `src/lib/*.ts` — pure, unit-tested business logic, kept separate from
  React components and route handlers on purpose

## Security notes

- The Postgres password and any other secret only ever belongs in
  `.env`/`.env.local` (both gitignored) — never in a committed file, never in
  a GitHub issue/PR description.
- If a database password has ever been pasted into a chat log or anywhere
  outside a password manager, rotate it (Supabase → Project Settings →
  Database → Reset database password) once you're done with initial setup.
