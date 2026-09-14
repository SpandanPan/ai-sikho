# Cost estimate to go to production

A working estimate of every real cost involved in running this product,
fixed and variable. Figures are current best estimates, not quotes — every
provider's pricing can change, so re-check before budgeting hard against
these numbers, and treat the totals below as directional planning, not a
committed P&L.

## Fixed monthly costs

| Item | Bare minimum | Recommended for real launch | Why |
|---|---|---|---|
| **Vercel** | $0 (Hobby) | **$20/mo** (Pro) | Hobby's ToS restricts it to non-commercial use — this is a commercial product. Pro also raises cron/function limits. |
| **GitHub** | **$0** | **$0** | Repo is public, so branch protection is enforced for free — no Pro upgrade needed for this anymore (was a $4/mo line item while private). |
| **Supabase (Postgres)** | $0 (Free tier: 500MB DB, no point-in-time recovery, pauses after 1 week idle) | **$25/mo** (Pro) | Free tier is fine for dev/beta with a handful of users; Pro adds backups and removes the idle-pause risk once real customer data exists. |
| **Domain** | — | **~$1/mo** (~$10–15/yr) | Registrar-dependent (Cloudflare/Namecheap, sold near cost). |
| **Email (Resend, for OTP + receipts)** | $0 (free tier: 3,000 emails/mo, 100/day) | $0 until you outgrow it, then **$20/mo** | Free tier likely covers early-stage volume entirely. |
| **Error tracking (Sentry)** | $0 (free tier: ~5k events/mo) | $0 until you outgrow it, then **~$26/mo** | Not wired up yet — see backend punch-list. Worth adding before real users, not before. |
| **Google OAuth** | $0 | $0 | Free at this usage level, no tier to worry about. |

**Fixed monthly total**: **$0** to start (everything on free tiers) → **~$46/mo** once running with backups and a real domain (branch protection is already free, being public).

## Variable / usage-based costs

| Item | Rate | Notes |
|---|---|---|
| **Razorpay** | ~2% + GST per transaction (domestic cards/UPI), ~3%+ for international cards | No monthly fee — scales with revenue, not a fixed cost. Confirm current rates in your Razorpay dashboard; they vary by payment method and can change. |
| **SMS OTP (MSG91, once wired up)** | ~₹0.15–0.25 per SMS (~$0.002–0.003) | At 500 sign-ins/month ≈ ₹75–125 (~$1–1.50/month). Scales with signups, not revenue — worth rate-limiting (already done, see `src/lib/rateLimit.ts`) so this can't be abused into a real cost. |
| **SMS OTP (Twilio, alternative)** | Meaningfully higher for Indian numbers (~$0.03–0.05/SMS due to carrier surcharges) | MSG91 is the cheaper choice for an India-first product — mentioned in `.env.example` for this reason. |
| **Content-generation agents (Claude / GPT)** | $0 until you actually generate something | Pay-per-use, see below | Only costs money when you click "Generate draft" in `/admin/generate`. |

## LLM API costs (content-generation agents) — and how to get access

Two providers wired up (`src/lib/contentAgent.ts`), pick either per job in
`/admin/generate`. Same per-token prices as the planned "What Models
Actually Cost" article, for consistency:

| Provider | Model (configurable via env) | Input $/1M tokens | Output $/1M tokens |
|---|---|---|---|
| **Anthropic (Claude)** | `claude-sonnet-5` | $2 | $10 |
| **OpenAI (GPT)** | `gpt-6` | $5 | $30 |

**How to get a key:**

- **Anthropic**: console.anthropic.com → sign up → **API Keys** → Create Key. Add billing (Settings → Billing) — pay-as-you-go, no monthly minimum. Put the key in `ANTHROPIC_API_KEY`.
- **OpenAI**: platform.openai.com → sign up → **API keys** → Create new secret key. Add billing (Settings → Billing) — same pay-as-you-go model. Put the key in `OPENAI_API_KEY`.

Neither has a monthly fee by itself — you're billed only for tokens actually used. A single quiz-question-set generation (a few thousand tokens in, a few thousand out) costs a few rupees, not more.

**What it actually costs per job, worked example:** generating ~2,000 input + 3,000 output tokens on Claude Sonnet 5 ≈ (2,000/1M × $2) + (3,000/1M × $10) = $0.034 ≈ **₹2.82** at ₹83/USD. `src/lib/agentPricing.ts` computes this exactly from the real token counts returned by each API (not an estimate) and logs it to the accounting ledger automatically under category `ai_generation` — visible in `/admin/reports`.

**Suggested retail pricing**: `suggestedPriceInPaise()` applies a 3x margin over actual cost, rounded up to a clean ₹10 — so that ₹2.82 job suggests a **₹10** price point if this ever becomes a customer-facing "generate custom content" feature (not built yet — right now these are admin-only drafting tools that feed the existing paid Kit/courses, not sold separately).

## What this actually means

- **To keep testing/building**: $0/month. Everything currently runs on free tiers.
- **To go live to real paying customers responsibly**: budget **~$46/month fixed** (see the total above) + a small, revenue-proportional Razorpay cut + a few dollars a month in SMS costs once OTP delivery is wired up + whatever content-agent generation you actually run (pennies per job, see above). This is a low bar — the app doesn't need meaningful revenue to sustain its own hosting costs.
- **AWS was considered and deliberately not chosen** (see README) — assembling equivalent services there (App Runner/ECS + RDS + EventBridge + Secrets Manager) costs more in both money and setup time at this stage.
