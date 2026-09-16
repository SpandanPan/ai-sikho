# Agent map: what runs, on what model, triggered how, at what cost

Every place in this product that calls an LLM — what it does, how it gets
triggered, which model it runs on and why, whether the customer ever sees
its raw output, and what one use ("one ticket") actually costs. This is
the pricing-planning document: it exists so a price point is set from a
real number, not a guess, and so a free feature's agent cost is visibly
recovered somewhere else rather than silently eating margin.

## The model-choice rule

**Reviewed before it goes live → open-source, self-hosted (Ollama). Ships straight to a paying customer, unreviewed → a frontier model (Claude/GPT).**

The reasoning: a human being the safety net (you, reviewing a draft before
it becomes a quiz question) is what makes a weaker free model safe to use.
Nothing reviews an AI grading a candidate's mock-interview answer in real
time except the AI itself — that's the one place quality *is* the paid
product, so it keeps the expensive model. This also turns the free/paid
split into an actual upsell argument later, not just a cost hack: "the free
feedback is decent, the paid feedback is sharper" is a fine thing to be
true.

## Agents

| Agent | What it does | Triggered by | Model (default) | Customer sees raw output? | Free or paid | Cost / ticket |
|---|---|---|---|---|---|---|
| Quiz/Article/Roadmap drafting | Writes draft content for admin review | Admin, manually, via `/admin/generate` (`POST /api/admin/generate`) | **Ollama** (`gemma4:e4b`) | No — becomes free content only after you copy a reviewed draft into `src/data/*.ts` | Feeds a free section | **₹0** self-hosted |
| **Daily "getting started" quiz** | Writes a fresh set of exactly 10 quiz questions, once a day | **Automatically**, `/api/cron/daily-content`, once a day (`vercel.json`) | **Ollama** | **Yes — live, unreviewed** (see below for why this is still safe) | Free | **₹0** self-hosted |
| **AI Pulse takeaway** | One independent sentence on why a fetched headline matters | **Automatically**, `/api/cron/fetch-news`, hourly, for any item without one yet | **Ollama** | Yes — live, unreviewed | Free | **₹0** self-hosted |
| **Term of the day** | One AI/ML term + a plain-language definition, once a day | **Automatically**, `/api/cron/daily-content`, once a day | **Ollama** | Yes — live, unreviewed | Free | **₹0** self-hosted |
| Mock-interview grading, paid | Grades one candidate's written answer — score, strengths, gaps, one concrete suggestion | Automatically, the instant a `MockAnswerSubmission` payment is captured (`POST /api/webhooks/razorpay`) | **Claude Sonnet 5** (Anthropic) — hardcoded, not admin-selectable, on purpose | **Yes — live, unreviewed, this is the ₹149 product** | Paid, ₹149 | ~₹2.80 (worked example below) — roughly **50x margin** |
| Mock-interview grading, free | Same grading task, once a month, free | **User's click**, `POST /api/mock-feedback/free` | **Ollama** | Yes — live, unreviewed | Free, 1/month | **₹0** self-hosted |
| **Indic-language translation** | Translates a short passage into Hindi/Telugu/Bengali/Marathi/Tamil/Kannada/Gujarati/Malayalam | **User's click**, homepage demo, `POST /api/translate` | **`translategemma`** — a different local model than the default, chosen because it's built specifically for translation (see below) | Yes — live, unreviewed, but it's a translation demo, not a scored answer | Free | **₹0** self-hosted |

Every successful run auto-logs its real cost to the accounting ledger
(`LedgerEntry`, category `ai_generation`) — visible per-day on
`/admin/reports` and in the CA export. An Ollama run logs too, at ₹0, so
the job history stays complete even though there's nothing to bill.

### The three fully-automatic agents — how "unreviewed" stays safe anyway

The daily quiz, the Pulse takeaway, and the term of the day are the first
agents in this app that publish straight to every visitor with **no human
in the loop at all** — a real departure from the "a human reviews before
it goes live" rule above, made deliberately, because "changes every day"
and "someone reviews it every day" can't both be true. What makes it safe
instead:

- **Strict validation, not trust.** `src/lib/dailyQuiz.ts` rejects
  anything that isn't exactly 10 well-formed questions (right field types,
  exactly 4 options, `correctIdx` in range) — a scored "correct" answer
  being wrong is a real credibility problem, worse than mediocre free
  feedback, so a malformed generation is treated as a failure, not
  patched or partially accepted. `src/lib/termOfDay.ts` similarly caps
  definition length to catch a model that rambled past its instructions.
- **Fail to reviewed content, never to nothing (or garbage).** If
  generation or validation fails, the cron simply writes nothing for that
  day — `GET /api/quiz` and `GET /api/term-of-day` both fall back to a
  hand-written set on their own read path (the original curated quiz
  questions, now 10 of them; a small evergreen term list) rather than
  showing broken or unvalidated content.
- **This actually happened during this build, not hypothetically:** the
  very first live cron run's quiz generation failed JSON validation
  (`gemma4:e4b` on 10 full questions in one response is measurably less
  reliable than on a single short takeaway or term) — the system correctly
  fell back to the curated set, logged the failure, and the retry
  succeeded and wrote a real, good set the second time. That's the
  validate-and-fall-back design working exactly as intended, caught by
  testing against the real model rather than assumed.
- **The Pulse takeaway carries the lowest risk of the three** even without
  a "correct answer" concept, because it only ever sees a headline +
  one-line summary, never the full article — there's no substantial
  source text to misrepresent, and a bad takeaway is an opinion being
  wrong, not a fact being wrong.

## Worked cost example (paid grading, the one real per-ticket number that matters for pricing)

~2,000 input + 3,000 output tokens on Claude Sonnet 5:

```
(2,000 / 1,000,000 × $2) + (3,000 / 1,000,000 × $10) = $0.034 ≈ ₹2.82 at ₹83/USD
```

Sold at ₹149, that's **~53x** cost, before Razorpay's ~2% cut (see
COSTS.md). There's real room in that price — it isn't cost-constrained,
it's positioned against what a human mock-interview session costs
elsewhere (₹500–2,000+).

## Self-hosted (Ollama) — what it actually costs, and the one real constraint

**Cost**: $0 per token — it's your own already-owned hardware, not a
metered API. Not the same as free: the real cost is electricity (a few
paise per run, immaterial) and your own machine's compute time.

**What's running — two models, not one, on purpose**: `gemma4:e4b`
(9.6GB) is the general default for the drafting/grading/daily-content
agents above. **It is not used for Indic-language translation** —
`translategemma` (3.3GB) is pulled specifically for that, because it's a
model actually built for translation rather than a general chat model
asked to translate as a side skill. This is the concrete case of "use a
task-specific model where one clearly fits, don't force the general
default onto everything" — verified for real: Hindi, Telugu, Bengali, and
Marathi translations all came back correct and natural during this build
(`POST /api/translate`, homepage demo).

Neither model is necessarily the *single best* open-weight option for its
job — Qwen2.5/DeepSeek are also strong general choices, and other
translation-specialist models exist — but there's no reason to spend more
disk/bandwidth pulling alternatives before a concrete quality gap shows
up. `OLLAMA_MODEL`/`TRANSLATE_MODEL` override either if you do pull
something else later.

**Pulling a model isn't always a one-shot success — real, observed
during this build**: `ollama pull translategemma` (3.3GB) failed twice
with a TLS/connection timeout partway through, on an otherwise fine
network (a direct request to the same CDN host connected instantly) —
almost certainly instability on one sustained large transfer, not a
blocked host. The third attempt succeeded outright. `ollama list`
afterward is the only trustworthy way to confirm a pull actually landed —
the command can report success-shaped output, or fail outright, and
either way you should verify directly rather than assume.

**The constraint that actually matters — reachability, not model
quality**: Ollama is a separate always-running service, not something
bundled into this Next.js app. `OLLAMA_BASE_URL` has to be a URL the
*calling* code can reach at the moment it runs:

- **Content drafting** (`/admin/generate`) is triggered by hand, so run it
  from `npm run dev` on the same machine that's running Ollama —
  `OLLAMA_BASE_URL=http://localhost:11434` just works, zero extra infra,
  because your dev server and Ollama are on the same box.
- **Everything else in the table above — the free grading tier, the daily
  quiz, Pulse takeaways, term of the day, Indic translation — is
  triggered from the live deployed site**, either by a real visitor's
  click or by Vercel Cron.
  Once this is actually deployed to Vercel, `OLLAMA_BASE_URL` **cannot**
  be `localhost` — Vercel's serverless functions run in Vercel's cloud,
  not on your laptop, and cannot reach it. Before deploying any of these
  live-traffic agents to production, Ollama needs to be reachable at a
  real public address: either a small always-on VPS (cheap — a few
  dollars/month, e.g. Hetzner/DigitalOcean) or a tunnel (Cloudflare
  Tunnel, free) from your own machine, kept running. **This is real,
  unresolved deployment work, not yet done** — everything above was
  verified against `localhost` in local dev, which is honest about what
  was actually tested, but is not the same as working from your real,
  deployed domain. Do this before relying on any of these in production.

Model weights themselves live in Ollama's own store
(`~/.ollama/models`), **not inside this repo** — a 9.6GB model file has no
business in a public git repository (GitHub caps individual files at
100MB anyway). `ollama pull <model>` on whichever machine runs inference
is the right way to get a model, not committing weights to source control.

## Not agents (mentioned here only to head off confusion)

- **`RagDemo.tsx` / `src/lib/ragScore.ts`** — the homepage's
  retrieve-then-generate demo. Deliberately simple keyword-overlap scoring,
  no LLM call at all — teaches the *shape* of retrieval, costs nothing,
  isn't in the table above because there's nothing to price.
- **`src/lib/quizFeedback.ts`** — the "how did you do" text after the quiz.
  Deterministic score-band logic, no model call.

## Planned, not built

- Nothing currently planned beyond what's in the table above. The next
  candidate for a local-model agent, if one comes up, should get the same
  treatment as the three fully-automatic ones: strict validation of its
  output shape, and a defined fallback to reviewed/static content if that
  validation fails — don't skip that step just because Ollama is free.
