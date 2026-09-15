# The Model Desk

Free AI news + explainers, a ₹100→₹999 interview-prep ladder, paid short courses,
1:1 mentoring, paid AI-graded mock-interview feedback, a signed-in profile with
personal revision notes, and a real business-automation lead-capture flow.
Next.js 14 (App Router) + TypeScript + Tailwind + Prisma + NextAuth + Postgres
(Supabase).

## Requirements

- **Node.js 20+** (built and tested on Node 22) — [nodejs.org](https://nodejs.org)
- **npm** (comes with Node) — this project's dependency manifest is
  `package.json` + `package-lock.json`, npm's equivalent of a Python
  `requirements.txt`. No separate file needed; `npm install` reads it.
- Access to the project's `.env.local` values (ask whoever set up Supabase —
  see below). The app will start without it, but sign-in, the database, and
  most features won't work.

No Postgres, Redis, or anything else to install locally — the database is
hosted (Supabase), not local.

## Run it — one command

Once `.env.local` exists (see next section):

```bash
npm install && npx prisma generate && npm run dev
```

Opens at **http://localhost:3000**. That's genuinely the whole setup —
homepage, quiz, courses, articles, mentoring, and settings all work
immediately once that command finishes.

**Important**: never run `npm run build` while `npm run dev` is running —
they share the `.next` folder and will corrupt each other's build cache
(`Cannot find module './NNN.js'` errors). Stop one before starting the other.

## `.env.local` (not committed — ask for the real values)

Copy `.env.example` to `.env.local` and fill in:

The database is Supabase project **AI-Kickstart**
(`nddmkmjckkrzlykeglev`, region **ap-northeast-1 / Tokyo**). Get the
connection strings from the Supabase dashboard → the project → **Connect**
button → **ORM** tab → **Prisma**, which shows both values in the right
format:

```bash
DATABASE_URL="postgresql://postgres.nddmkmjckkrzlykeglev:[PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.nddmkmjckkrzlykeglev:[PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres"
```

Get `[PASSWORD]` from whoever set up the project — it's the Postgres
password chosen at project creation, not an API key, and isn't written here
on purpose. If you don't have it, reset it from Supabase → Project Settings
→ Database → Reset database password (this invalidates the old password —
update everyone's `.env.local` after).

The direct (non-pooler) host `db.nddmkmjckkrzlykeglev.supabase.co:5432`
**does not work from every network** — it's IPv6-only and failed to resolve
during setup. Always use the pooler hostnames above; port `6543`
(transaction mode) for `DATABASE_URL`, `5432` (session mode, required for
migrations) for `DIRECT_URL`.

Also set:

```bash
NEXTAUTH_SECRET="generate with: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
```

Everything else in `.env.example` (`GOOGLE_CLIENT_ID`/`SECRET`,
`RAZORPAY_*`, `ADMIN_EMAILS`, `CRON_SECRET`) is optional until you're
testing that specific feature:

- Without Google credentials, Google sign-in just won't work — OTP
  sign-in (email/phone) needs nothing extra and works out of the box.
- Without `ADMIN_EMAILS` set to your email, `/admin/mentors` will 403 —
  everything else works regardless.
- Without Razorpay keys, purchases/bookings stay `PENDING` — nothing
  breaks, there's just no real payment capture yet (see "Wiring up what's
  left" below).

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

**If `migrate dev` hangs indefinitely**: it happened repeatedly building this
project, and the root cause turned out to be that `migrate dev` requires an
interactive terminal — in a non-interactive shell it just hangs instead of
failing with a clear error (it errors immediately once it gets far enough to
detect this, but a flaky connection can make it hang on an earlier step
first, silently, for a long time). If it's stuck: kill it, then use
`npx prisma db push` instead — no shadow database, no interactivity, applies
the schema directly. The cost is that `db push` doesn't write a migration
file, so periodically reconcile history with:
```bash
npx prisma migrate diff --from-empty --to-schema-datamodel ./prisma/schema.prisma --script > prisma/migrations/<timestamp>_baseline/migration.sql
npx prisma migrate resolve --applied <timestamp>_baseline
```
This is the actual recovery this project's migration history went through —
`prisma/migrations/` is a single rebaselined migration for exactly that
reason, not a step-by-step history of every schema change made along the way.

You can also browse the data directly in the Supabase dashboard → **Table
Editor**, or run raw SQL in Supabase → **SQL Editor**.

## Testing

```bash
npm run test        # 136 unit + integration tests (vitest)
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
4. **News + daily content automation** — `vercel.json` schedules
   `/api/cron/fetch-news` hourly and `/api/cron/daily-content` (the daily
   quiz + term of the day, see below) once a day, once deployed. Set
   `CRON_SECRET` in Vercel's env vars (same value as `.env.local`).
   **Vercel's Hobby (free) tier has historically only supported daily cron
   — hourly needs Pro.** This isn't a new cost here specifically: Pro was
   already the recommended tier for real launch regardless (see
   `COSTS.md`), for the ToS/commercial-use reason, not this. Confirm
   current limits in Vercel's docs before relying on this — their cron
   tiering has changed before and can again.

**Deployment target: Vercel** (decided — not a generic static host and not
AWS; see the note below for why). Not connected yet, on purpose, since
we're not deploying today (see `CONTRIBUTING.md`). See `COSTS.md` for the
full monthly cost estimate to go to production.

<details>
<summary>If you deploy to AWS instead, later (not the current plan)</summary>

Don't, unless there's a specific reason (compliance, existing AWS credits,
wanting the experience) — Vercel already bundles serverless functions +
cron + edge network for ~$20/mo Pro; replicating that on AWS means
assembling App Runner/ECS + RDS or Supabase + EventBridge + Secrets Manager
yourself, more time and money at this stage.

The plumbing exists if you change your mind: `Dockerfile` builds a
standalone Next.js image (`output: "standalone"` in `next.config.mjs`) that
runs anywhere Docker does — AWS App Runner is the simplest fit. **Not
tested against a real Docker daemon** (unavailable in the environment this
was built in) — the Next.js side is verified (`npm run build` does produce
`.next/standalone/server.js`), but build and run the image once before
trusting it in production. `.dockerignore` keeps `.env`/`.env.local` out of
the build context on purpose — inject secrets at container runtime, never
bake them into the image. The Vercel Cron in `vercel.json` would need to
become an EventBridge Scheduler rule hitting `/api/cron/fetch-news` with
the `CRON_SECRET` bearer token instead.

</details>

## Sign-in, and what requires it

**Where everything lives**: one Postgres database (Supabase, project
`AI-Kickstart`), read and written entirely through Prisma
(`prisma/schema.prisma`). Users, OTP codes, active device sessions, quiz
attempts, course progress, ratings, mentor bookings, and purchases are all
tables in that same database — there's no separate store per feature.

**How sign-in works**: email or phone number + a 6-digit OTP
(`src/app/api/auth/otp/*`, wired into NextAuth as a Credentials provider in
`src/lib/auth.ts`), plus Google as a fallback. The OTP is generated
server-side, only its SHA-256 hash is stored (`OtpCode.codeHash`), and it
expires after 10 minutes with a 5-attempt cap.

**Rate limited** (`src/lib/rateLimit.ts`, unit-tested): max 3 OTP requests
per identifier per 15 minutes with a 30-second cooldown between them, and a
looser 10-per-15-minutes cap per IP address with **no** cooldown (a
cooldown at the IP level would incorrectly block strangers sharing a
network, e.g. mobile carrier NAT — verified this was a real bug during
testing and fixed it before it shipped).

There's no separate "create account" step — entering the same email/phone
again always signs you back into the same account (enforced by a database
unique constraint), so a duplicate account is structurally impossible. The
sign-in response includes `isNewUser` so the UI can say "Account created"
vs. "Welcome back."

**Max 2 signed-in devices per account** — enforced in `src/lib/auth.ts`'s
`signIn` callback via the `DeviceSession` table (`src/lib/deviceLimit.ts`
holds the pure cap logic, unit-tested). A 3rd device is **rejected
outright** (a clear "already signed in on 2 devices" message, both on the
OTP form and after a Google redirect) rather than silently bumping an
older device. A legitimate user who hits the cap can self-serve their way
out via **Settings → Devices** (`/api/devices`).

**The homepage's soft 60-second gate** (`src/components/SoftGate.tsx`) —
the hero, the Interview Pack pitch, and the "who this is for" section are
always free, no limit, since that's the actual sales pitch. The
exploratory content below it (Run It Free, AI Pulse) blurs with a "sign in
to keep exploring" prompt after 60 seconds on the page for a signed-out
visitor — never for a signed-in one. The timer is per page load (resets on
refresh), not cumulative across visits. Deliberately not applied to the
quiz, courses catalog, or articles list — those exist specifically to be
freely shareable/indexable top-of-funnel content, and gating them would
work against the point of having them.

## Profile (`/profile`)

Once signed in: current streak (consecutive days visited, computed from
real page-view history — `src/lib/streak.ts`, unit-tested and verified
against seeded multi-day data during this build), every course with its
real status (not started / in progress at X% / completed), quiz attempt
history (score + date), and the last few distinct pages visited. All read
from data that already existed for other reasons (`CourseProgress`,
`QuizAttempt`, `AnalyticsEvent`) — no new write path needed, `/api/profile`
just aggregates. The streak specifically only counts a day as "active" if
that user had at least one tracked page view that calendar day (UTC), and
breaks (shows 0) if the most recent active day is more than 1 day ago —
verified end-to-end with real backdated rows, not just the pure function
in isolation.

**Editable name** (`EditableName`, `PATCH /api/account`) — the one editable
identity field; email/phone aren't, since they're the sign-in identity
itself, not a detail. Wired through NextAuth's `useSession().update()`
properly, including a real subtlety fixed along the way: `update()` alone
doesn't refresh JWT-cached fields unless the `jwt` callback explicitly
handles `trigger === "update"`, which `src/lib/auth.ts` now does.

**Personal revision board** (`RevisionBoard`, `Note` + `Bookmark` models,
`/api/notes`, `/api/bookmarks`) — private notes and bookmarked resources
for interview revision, entirely per-user (every route checks ownership
before reading or writing, verified end-to-end including a bookmark URL
validation test that rejects malformed links).

**What's free without signing in**: the homepage (news, free tools), the
quiz, the articles list, browsing the course catalog and mentor list
(titles, summaries, prices) — including trying the RAG demo.

**What requires signing in**: tracking progress on any course (free or
paid), rating a course, booking a mentor slot, and anything involving a
purchase. Enforced server-side in the relevant API routes — never only in
the UI.

**Account deletion** — self-service from Settings → Danger Zone
(`DELETE /api/account`). Deletes everything genuinely personal (cascades:
accounts, device sessions, course progress, ratings, purchases, mentor
bookings). Quiz attempts are anonymized (`userId` set to null) rather than
deleted, to preserve aggregate stats without a personal link — see
`/privacy` for the stated policy this code actually implements.

## Mentoring (`/mentoring`, mentor dashboard at `/mentor`, admin at `/admin/mentors`)

Onboarding a mentor (creating the record at all) stays admin-only, via
`ADMIN_EMAILS` — no self-service mentor signup. Everything past that point
is self-service from the mentor's own dashboard.

- **Mentor sign-in**: no separate mentor auth system — a mentor signs in
  through the site's normal email/phone OTP flow (`src/lib/auth.ts`).
  Onboarding a mentor at `/admin/mentors` now takes their email and links
  it (find-or-create, same upsert `src/lib/auth.ts` does on first sign-in)
  to a `Mentor` row via `Mentor.userId`. Once linked, that login sees a
  "Mentor dashboard →" link on `/profile` and can reach `/mentor`;
  anyone else signed in gets a clean "not linked to a mentor profile" on
  that route rather than a raw 403 page.
- **Mentor dashboard (`/mentor`)**: a mentor can see their upcoming paid
  bookings (with the call link), see and add their own open availability
  slots, remove an open (unbooked) slot, and edit their own bio,
  credentials, price per session, and personal meeting link — all via
  `src/app/api/mentor/*`, scoped to whichever `Mentor` row their session is
  linked to. The admin slot/mentor routes still work too, unchanged — a
  fallback if you're setting things up on a mentor's behalf.
- **Booking window**: always the next 15 days from the moment someone is
  actually looking (`src/lib/mentorSlots.ts`, unit-tested) — rolls forward
  daily, not a fixed range.
- **Race safety**: two people can't book the same slot — verified under
  actual concurrent requests during this build; exactly one wins, the
  other gets a clean "someone else just booked this" error.
- **Payment**: bookings land as `PENDING`, same flow as course purchases —
  flip to `PAID` via the Razorpay webhook once wired up.
- **Video call link**: created the moment a booking flips to `PAID`
  (`src/app/api/webhooks/razorpay`, using `src/lib/zoom.ts`). Two paths,
  both genuinely free:
  - If `ZOOM_ACCOUNT_ID`/`ZOOM_CLIENT_ID`/`ZOOM_CLIENT_SECRET` are set (a
    Server-to-Server OAuth app under your own Zoom account — see
    `.env.example`), a unique Zoom meeting is created per booking. Zoom's
    free Basic tier has no time limit on 1:1 calls (the 40-minute cap only
    applies to meetings with 3+ participants), so this costs $0. **Not
    wired up in this environment** — no live Zoom credentials to test
    against, same situation as Razorpay/the LLM keys elsewhere in this
    repo.
  - Otherwise, the mentor's own `personalMeetingUrl` (set from `/mentor` —
    paste any permanent Zoom/Google Meet/Teams link) is used instead. Zero
    setup, works from day one, same link reused across their sessions
    rather than a unique one per booking.
  - Either way, there's no automated email invite yet — no email provider
    is wired up (same `TODO` as OTP delivery, see `.env.example`). The
    link is surfaced in-app instead: the customer sees "Join call →" on
    `/profile`, the mentor sees "Start call →" on `/mentor`. If the meeting
    creation step itself fails (e.g. a misconfigured Zoom app), the
    booking still stays `PAID` — money already changed hands — and the UI
    shows "Link pending" rather than erroring.

## Work With Me (business automation leads)

A real lead-capture flow, not a static mailto link. A visitor picks from a
curated list of automation services (`src/data/automationServices.ts` —
support chatbot, internal search, lead triage, workflow automation, an AI
readiness audit, or "something else" as a catch-all), then fills in a
short form (name + email or phone, optional message) that submits to
`POST /api/inquiries`. Public and unauthenticated on purpose — a business
reaching out isn't necessarily an existing site user — and rate-limited by
IP (same `checkIpRateLimit` pattern as OTP requests, `src/lib/rateLimit.ts`)
so it can't be spammed. Submissions land in `ServiceInquiry` and show up on
`/admin/reports`, admin-only, newest first.

## Newsletter (`NewsletterSubscriber`)

The actual asset, per the original strategy plan — worth more long-term
than site traffic, and until now completely missing from the homepage
despite that. `NewsletterSignup` (homepage, above the footer) posts to
`POST /api/newsletter` — public, no account needed, upserts on email so
re-submitting or re-subscribing after unsubscribing never errors. Rate
limited by IP, same pattern as everywhere else public input is accepted.
Admin-only list + CSV export at `GET /api/admin/newsletter` (add
`?format=csv`) — nothing here is customer-visible.

## Homepage cross-promotion

The homepage used to only feature the Interview Pack — Courses, Mentoring,
and Mock Feedback existed but were only discoverable through the Nav. A
**"More ways to prep"** section now sits right after the Pack pitch,
teasing all three with a price and a link, so a visitor who isn't ready to
buy the Kit still sees the other paths in. The footer (`Footer.tsx`) was
also expanded from a single copyright line into a real sitemap — Explore /
Prep / Company columns linking to every page on the site, not just the
three legal ones.

## Interview Pack tracks (`src/data/interviewPacks.ts`)

The Pack used to be one hardcoded GenAI Engineer Starter/Kit pair. It's now
data-driven (`InterviewPackSection.tsx`, a small client component for the
track picker) across four tracks — GenAI Engineer, Agentic AI, Data
Scientist, Data Engineering — each with its own Starter (₹100) and Kit
(₹999). Pricing is deliberately uniform across tracks rather than charging
more for a "hotter" track like Agentic AI: there's no actual difference in
content depth between tracks yet to justify a different price, and pricing
by hype without substance behind it is the kind of thing that reads as a
bait-and-switch once someone actually buys it. `Purchase.packTrack` records
which track a real purchase was for — added now, ahead of the checkout flow
itself, so that plumbing doesn't need a second migration once checkout is
built.

## Analytics & reporting (`/admin/reports`)

Self-hosted, minimal-PII traffic tracking — one table (`AnalyticsEvent`),
one public write endpoint (`/api/analytics/event`), no third-party
analytics service. `AnalyticsBeacon` (mounted once in the root layout)
fires a page view on every route change and a time-on-page beacon
(`navigator.sendBeacon`, so it actually delivers on tab close) right before
leaving each page; `trackClick()` is wired into a couple of real CTAs
(the homepage's quiz button, each Work With Me service card) as the
pattern to follow for tracking more. Visitors are identified by a random
`anonId` in `localStorage`, not tied to their account unless they happen
to be signed in — `src/lib/analytics.ts` (unit-tested) does the actual
aggregation (page views, unique visitors, top pages, top clicks, average
time on page) separately from the database query, so the math is testable
without a database.

**Traffic by day/hour** (`/api/admin/reports/traffic/timeseries?granularity=hour|day&days=N`)
— internal-only, same admin gate as everything else under `/api/admin/*`,
never surfaced anywhere a customer can see it. `bucketByTime()` in
`src/lib/analytics.ts` (unit-tested) does the actual bucketing, shown as a
simple bar chart on `/admin/reports`.

The same admin page also shows the accounting summary and business
inquiries (see below) — traffic, leads, and money, one screen.

## Content-generation agents

See `AGENT_COSTS.md` for the full map: every agent in this app, what it
does, how it's triggered, which model it runs on and why, and what one use
costs. Short version:

**Three providers** (`src/lib/contentAgent.ts`, `src/lib/agentPricing.ts`):
Claude (Anthropic), GPT (OpenAI), and Ollama — a self-hosted, open-weight
model, $0 per token because it's your own hardware, not a metered API.
Ollama was actually run against this project's real prompts during this
build (`gemma4:e4b`, already pulled) — genuinely verified, not just written
against a spec, unlike the Claude/GPT paths (no API key in this
environment). The rule for which agent gets which tier: **anything a human
reviews before it goes live can safely use the free model; anything that
ships straight to a paying customer, unreviewed, keeps the frontier
model** — see AGENT_COSTS.md for why.

**Drafting agents** (`/admin/generate`, admin-only) — QUIZ, ARTICLE, or
ROADMAP drafts, any of the three providers, Ollama the recommended default.
Never auto-published: a human reviews `resultJson` and copies what's good
into the real content files by hand, same standard as everything else here
("written fresh, not copied," now applying to AI-written drafts too).

**Grading agent** (`/mock-feedback`) — the one genuinely agent-native
customer-facing feature, and the one place the free-vs-paid tiering
actually matters: someone submits a real written interview answer, and an
LLM grades it against what a strong answer to *that specific question*
would cover — not a generic rubric. Two tiers:
- **Free, 1/month** (`POST /api/mock-feedback/free`) — graded immediately,
  live, on Ollama. This is the one agent in the app actually triggered by
  a user's click rather than by an admin or a payment webhook, and it was
  run for real end-to-end during this build (quota-blocked on a second
  attempt in the same month, verified against the live DB).
- **Paid, ₹149, unlimited** (`/mock-feedback` → `POST /api/webhooks/razorpay`)
  — graded on Claude Sonnet 5 once payment is confirmed, same webhook
  pattern as everything else that costs money.

The mock-feedback page itself states this tiering openly — which model
graded you, and why the paid tier costs anything — as a deliberate,
differentiated bit of positioning: most AI interview-prep tools don't
disclose which model is grading you at all.

**Three fully-automatic agents, no human review at all** — a real
departure from the rule above, made deliberately because "publishes
automatically every day/hour" and "a human reviews it first" can't both
be true:
- **Daily "getting started" quiz** (`/quiz`, `/api/cron/daily-content`,
  daily) — a fresh set of exactly 10 questions, `src/lib/dailyQuiz.ts`
  strictly validating the shape before anything is written. Falls back to
  the hand-curated 10-question set if generation or validation fails —
  which genuinely happened on the first live cron run during this build
  (see AGENT_COSTS.md for what happened and why the fallback is what kept
  it safe).
- **AI Pulse takeaway** (`/api/cron/fetch-news`, hourly) — still does
  **not** summarize or rewrite an article; it writes one independent
  sentence from only the headline + one-line summary already used
  elsewhere on the page, never the full article text. That's what keeps
  it clear of the "republishing third-party content" risk the
  headline+excerpt+link design was built to avoid (see Content &
  copyright below) — there's no substantial source text here to derive
  from in the first place.
- **Term of the day** (homepage, `/api/cron/daily-content`, daily) — one
  AI/ML term + a plain-language definition, falls back to a small
  hand-written evergreen list if generation fails.

`/api/quiz`, `/api/news`, `/api/mentors`, and `/api/term-of-day` all use
`export const dynamic = "force-dynamic"` — without it, Next.js statically
freezes a route with no dynamic segment at build time and serves that one
response to every request in production forever after. This was a real,
live bug on `/api/news`/`/api/mentors` (caught while building the
analogous `/api/quiz` route, not by inspection) — the hourly/daily content
these routes exist to serve would have silently never updated once
deployed.

Every successful generation or grading run — including the free,
$0-per-token Ollama ones — auto-logs its exact spend to the accounting
ledger under category `ai_generation`, visible in `/admin/reports`.
`src/lib/agentPricing.ts` (unit-tested) computes cost from the actual token
usage each provider returns, and a suggested retail price at 3x cost,
rounded to a clean ₹10, for the two paid providers. See `COSTS.md` for the
worked example and how to get Anthropic/OpenAI API keys; see
`AGENT_COSTS.md` for the Ollama setup and — importantly — the one real
constraint on it: Ollama has to be reachable from wherever the calling
code actually runs, and "wherever the calling code runs" is your own
machine only for the admin drafting flow, not for anything triggered from
the deployed Vercel site.

## Refunds

`src/lib/refunds.ts` (unit-tested) enforces exactly the two rules stated in
`/refund-policy`: a purchase can't be refunded twice (status must be
`PAID`, not already `REFUNDED`), and it can't be refunded past the 7-day
window from purchase, or after its content has been accessed
(`Purchase.contentAccessed`). `GET /api/admin/purchases/[id]/refund` checks
eligibility without changing anything; `POST` on the same route actually
refunds (admin-only — the refund policy tells buyers to email support, so
this is the check-then-act step once you've read that email). Razorpay's
actual refund API call is a TODO in that route, marked clearly, until real
payments are live.

## Cart, checkout, and coupons

The Interview Pack tracks and paid courses are now actually buyable —
this closes the "no live checkout UI anywhere" gap flagged repeatedly
earlier in this project's history. "Add to cart" on any track's
Starter/Kit card or a paid course (`AddToCartButton.tsx`) adds to a
localStorage-backed cart (`CartContext.tsx` — per-browser, not account
state; real prices are always re-resolved server-side at checkout, never
trusted from the client). `/cart` shows the items, an optional coupon
code, and a Checkout button.

**`POST /api/checkout`**: resolves every cart item against the real data
files (`src/lib/cart.ts`'s `resolveCartItem` — a client could send any
price it wants, this is what makes that irrelevant), creates one Razorpay
order for the whole cart, and one `Purchase` row per item, all sharing
that order. This needed a real schema change: `Purchase.razorpayOrderId`
was `@unique` (one purchase per order) and is now just indexed, since a
multi-item cart is exactly "several purchases, one order." The webhook
(`src/app/api/webhooks/razorpay`) was updated to match —
`findMany`+flip-all-together instead of `findUnique`.

**Coupons** (`src/lib/coupons.ts`, admin-created via `POST
/api/admin/coupons`, capped at 10% by the code itself, not just
convention): `POST /api/coupons/validate` is a public, validate-only
check a checkout can price against without redeeming anything.
Redemption is only counted in the webhook, on confirmed payment, not at
checkout — an abandoned checkout must never burn a redemption of a
limited coupon. A cart's discount is split proportionally across its
Purchase rows (`distributeDiscount`), with the last item absorbing
rounding drift so the parts always sum to exactly the discount.

**Verified end-to-end** during this build: a real 2-item cart (a pack
Starter + a course) with a real 10%-off coupon, a correctly-signed
webhook call against the actual running route, confirmed both purchases
flip to `PAID` together, exactly 4 ledger entries land (revenue + fee ×
2), the coupon's redemption count increments by exactly 1 (not 2, despite
2 purchases), and both a receipt email and a course-welcome email fire
with the right addresses and post-discount amounts. **Not verified**: an
actual live Razorpay payment — `RAZORPAY_KEY_ID/SECRET` aren't set in
this environment, so `POST /api/checkout` will return a clear 502
("Razorpay isn't configured") until they are.

## Invoices (`/invoice/[purchaseId]`)

Signed-in, owner-or-admin only (same purchase ID returns 404 either way to
a stranger, rather than leaking that it exists). An invoice number is
assigned lazily — the first time anyone actually opens it — atomically via
a single-row counter (`InvoiceCounter`, incremented inside a transaction;
verified concurrent requests can't collide on the same number). No PDF
library is wired up; the page is print-styled and the "Print / Save as
PDF" button is just `window.print()` — a real, working way to get a PDF
with zero new dependencies, though a proper PDF generator (for emailing
one as an attachment) is a natural upgrade later.

**On GST**: the invoice shows **no tax line at all** unless `GST_NUMBER`
is set in env — displaying or collecting GST without being registered
isn't just wrong, it isn't allowed. Registration is mandatory only past
₹20 lakh/year turnover for services (₹10 lakh in a few special-category
states); below that it's optional. Once `GST_NUMBER` is set,
`src/lib/invoice.ts` derives the GST amount from the total paid (treated
as GST-inclusive, the normal convention for consumer pricing in India) at
`GST_RATE_PERCENT` (default 18%). It shows one combined GST line, not a
CGST+SGST vs. IGST split — that split depends on buyer vs. seller state,
which this app doesn't collect anywhere today. Confirm your actual
registration status and invoice format with a CA before this matters for
real money; this is deliberately built to default to correct for "not
registered yet" rather than to "looks more official."

## Email (`src/lib/email.ts`)

Three purpose-separated sender addresses on one domain
(`receipts@`/`courses@`/`support@`, derived from `EMAIL_DOMAIN`) — kept
separate so a receipt (transactional, must-deliver) never shares sending
reputation with a support reply or a course-welcome message. **Not wired
to a live provider** — same honest pattern as OTP delivery: until
`RESEND_API_KEY` is set, every send is logged server-side
(`[email] NOT SENT (no RESEND_API_KEY) — ...`) instead of delivered,
verified for real during this build via the checkout/help flows above. A
receipt + invoice link fires on every paid purchase; a course-welcome
email fires additionally when the product is a course; a support
acknowledgment fires on every `/help` submission.

## Help (`/help`)

A real contact form, public and unauthenticated (someone needing help may
not be signed in — that could be the actual problem), rate-limited by IP
same as `/api/inquiries`. Saves a `SupportRequest` row (visible to you at
`/admin/reports`) and best-effort emails both you and the sender — the
saved row is the source of truth if the email never wired up.

## Accounting ledger (for your CA)

One table, `LedgerEntry`, is the single source of truth — every sale,
refund, Razorpay fee, and expense (AI generation cost, mentor payouts,
hosting, whatever you log manually) is a signed line item in it. Auto-logged
by the Razorpay webhook on every payment (revenue + platform fee, together,
in one transaction) and by the content agents on every generation (the real
API cost). `src/lib/ledger.ts` (unit-tested) does the actual profit math —
revenue minus refunds, fees, and expenses — kept separate from the database
query so it's auditable on its own.

`/admin/reports` shows the summary plus a per-customer breakdown (what they
paid, what it cost to serve them, the resulting profit) and a **Download
CSV for CA** button (`/api/admin/reports/accounting?format=csv`) —
importable straight into Excel or Tally. `POST
/api/admin/ledger/expense` logs a manual expense (hosting, domain renewal,
anything not tied to a specific sale).

Verified against the real database during this build: a test purchase run
through the full webhook → refund cycle correctly showed a small net loss
(the Razorpay fee isn't refunded when you refund a customer, so refunding
a ₹999 sale nets **-₹19.98**, not ₹0) — that's not a bug, it's genuinely how
refunds work, and it's exactly the kind of thing your CA needs the ledger
to get right.

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
  bank. Keep it that way.
- **Articles about papers**: explain findings in your own words and link to
  the paper. Don't reproduce a paper's figures or substantial passages of text
  verbatim without permission.
- **Images**: currently hotlinked from Unsplash, licensed for free commercial
  use with no attribution required. Before public launch, either download and
  self-host the images you keep, or credit the photographer.

## Legal pages

`/privacy`, `/terms`, and `/refund-policy` describe this product's actual,
current behavior — not filler template text. None have been reviewed by a
lawyer; have that done before relying on them with real paying customers,
especially regarding India's DPDP Act and any GST obligations.

## Project shape

- `src/app/page.tsx` — homepage (hero, Interview Pack track picker, "more
  ways to prep" cross-promo, personas, myth-vs-fact strip, Run It Free +
  Pulse behind the soft gate, newsletter signup, Work With Me)
- `src/components/InterviewPackSection.tsx` / `src/data/interviewPacks.ts`
  — the four Interview Pack tracks (GenAI Engineer, Agentic AI, Data
  Scientist, Data Engineering) and their pricing
- `src/app/quiz`, `/courses`, `/articles`, `/mentoring`, `/mock-feedback`,
  `/profile`, `/signin`, `/settings`, `/privacy`, `/terms`,
  `/refund-policy` — the rest of the pages
- `src/app/mentor` — self-service mentor dashboard (availability, price,
  bookings, personal meeting link); gated on `Mentor.userId`, not admin
- `src/app/admin/mentors`, `/admin/generate`, `/admin/reports` — admin-only:
  mentor onboarding (name + email + rate, linking their login), content-drafting
  agents, traffic + accounting reports + business inquiries
- `src/components/PulseFeed.tsx` — the auto-scrolling news ticker, DB-backed
  with a static fallback
- `src/components/RagDemo.tsx` — the retrieve-then-generate mini demo on the
  RAG Basics course
- `src/components/CourseTracker.tsx` — the animated per-course progress bar
  + 5-star rating widget
- `src/components/WorkWithMe.tsx` — the automation-services picker + lead
  form, `src/data/automationServices.ts` for the curated list
- `src/components/RevisionBoard.tsx` / `EditableName.tsx` — the personal
  notes/bookmarks board and editable display name on `/profile`
- `src/components/NewsletterSignup.tsx` — the email capture form on the
  homepage
- `src/components/SoftGate.tsx` — the 60-second sign-in nudge wrapper
- `src/components/AnalyticsBeacon.tsx` / `src/lib/trackEvent.ts` — the
  site-wide page-view/click/time-on-page tracker, feeding `/admin/reports`
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
  Database → Reset database password) once initial setup is done.
- This repo is **public** (as of the branch-protection setup — see
  `CONTRIBUTING.md`). Its entire git history was scanned for secrets before
  the switch and came back clean. Being public means branch protection is
  enforced for free and reviewers don't need an explicit invite to read the
  code — but it also means never committing anything sensitive here again.
  `COSTS.md` is intentionally tracked and public too — it's cost estimates
  and pricing math, not credentials; nothing in it is a secret.
