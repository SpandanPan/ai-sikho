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
| Quiz drafting | Writes multiple-choice quiz questions for admin review | Admin, manually, via `/admin/generate` (`POST /api/admin/generate`, `type: "QUIZ"`) | **Ollama** (`gemma4:e4b`, self-hosted) | No — becomes free quiz content only after you copy a reviewed draft into `src/data/quizQuestions.ts` | Feeds a free section | **₹0** (self-hosted); ~₹1–3 if you pick Claude/GPT instead |
| Article drafting | Writes a plain-language explainer article for admin review | Admin, manually, same endpoint, `type: "ARTICLE"` | **Ollama** | No — same review-then-copy step, into `src/data/articles.ts` | Feeds a free section | **₹0** self-hosted |
| Roadmap drafting | Writes phases for a learning roadmap for admin review | Admin, manually, same endpoint, `type: "ROADMAP"` | **Ollama** | No — same review-then-copy step | Feeds a free section | **₹0** self-hosted |
| Mock-interview grading | Grades one candidate's written answer — score, strengths, gaps, one concrete suggestion | Automatically, server-side, the instant a `MockAnswerSubmission` payment is captured (`POST /api/webhooks/razorpay`, `payment.captured`) | **Claude Sonnet 5** (Anthropic) — hardcoded in the webhook, not admin-selectable, on purpose | **Yes — live, unreviewed, this is the ₹149 product** | Paid, ₹149 | ~₹2.80 (worked example below) — roughly **50x margin** at ₹149 |
| Free-tier mock-interview grading | Same grading task, for a free monthly attempt | **Not built yet** — see backend punch-list; would need a payment-free trigger path, unlike the paid flow above | Would be **Ollama** per the rule above | Yes, once built | Free (1/month, proposed) | **₹0** self-hosted |

Every successful run of the three drafting agents and the paid grading
agent auto-logs its real cost to the accounting ledger (`LedgerEntry`,
category `ai_generation`) — visible per-day on `/admin/reports` and in the
CA export. An Ollama run logs too, at ₹0, so the job history stays
complete even though there's nothing to bill.

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

**What's running**: `gemma4:e4b` (9.6GB), already pulled and verified
against this project's actual prompts during this build — both quiz
drafting and mock-answer grading were run for real against it (grading
output included below for reference; not used live, since paid grading
stays on Claude per the rule above). Not necessarily the *best* open-weight
model for this — Qwen2.5 and DeepSeek's smaller models are also strong,
sometimes stronger — but there's no reason to spend more disk/bandwidth
pulling alternatives before a concrete quality gap shows up. `OLLAMA_MODEL`
overrides this if you do pull something else later.

**The constraint that actually matters — reachability, not model
quality**: Ollama is a separate always-running service, not something
bundled into this Next.js app. `OLLAMA_BASE_URL` has to be a URL the
*calling* code can reach at the moment it runs:

- **Content drafting** (`/admin/generate`) is triggered by hand, so run it
  from `npm run dev` on the same machine that's running Ollama —
  `OLLAMA_BASE_URL=http://localhost:11434` just works, zero extra infra,
  because your dev server and Ollama are on the same box.
- **Anything triggered from the live Vercel deployment** (the paid grading
  webhook, or a future free-tier grading path) runs in Vercel's cloud, not
  on your laptop — it **cannot** reach `localhost` on your machine. That
  would need Ollama reachable at a real public address: either a small
  always-on VPS (cheap — a few dollars/month, e.g. Hetzner/DigitalOcean)
  or a tunnel (Cloudflare Tunnel, free) from your own machine, kept
  running. This only matters once/if a self-hosted model is wired into a
  live-traffic path — it isn't today (see the table above: paid grading
  stays on Claude).

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

- **Free-tier mock-interview grading** — see the table above. Needs a
  grading trigger that doesn't depend on a Razorpay payment succeeding
  first (today, grading only ever runs from the payment webhook). Real
  scope, not started.
- **"Summarize this topic" / similar lightweight free features** —
  mentioned as a category worth having; not designed or built. Default
  assumption if built: Ollama, per the rule above, unless it turns out to
  need a customer-facing quality bar closer to the paid grading agent.
