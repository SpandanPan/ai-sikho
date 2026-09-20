# Going live — the ~$5–10/mo setup

This is the concrete "flip the switch" runbook: Vercel for the app,
Supabase for Postgres, a small VPS for Ollama. Each piece is independent —
you can set them up in any order, but nothing works end-to-end until all
three are done and the env vars in Vercel point at the real things.

Rough monthly cost at this scale:

| Component | Cost |
|---|---|
| Vercel (Next.js + API routes) | $0 (Hobby tier) |
| Supabase Postgres | $0 (free tier) to start |
| Ollama VPS (Hetzner/DigitalOcean) | $5–10 |
| Domain | — (already owned) |
| **Total** | **~$5–10/mo** |

Each piece scales independently later (Supabase Pro, a bigger VPS, a GPU
box for grading) without a re-architecture — none of this is a dead end,
it's a real starting point.

## 1. Supabase Postgres

1. Create a project at [supabase.com](https://supabase.com) (or use Neon —
   `.env.example` supports either, same Postgres wire protocol).
2. Project Settings → Database → grab the **pooled** connection string
   (`...pooler.supabase.com:6543`) for `DATABASE_URL`, and the **direct**
   string (`...supabase.co:5432`) for `DIRECT_URL`. The pooled one is what
   the deployed app actually uses — Vercel's serverless functions spin up
   many concurrent instances, and a normal Postgres connection doesn't
   handle that without a pooler in front of it.
3. Run migrations against `DIRECT_URL` once, locally:
   ```
   DATABASE_URL="<direct-url>" npx prisma migrate deploy
   ```

## 2. The Ollama VPS

This is the piece `AGENT_COSTS.md` flagged as "real, unresolved deployment
work" — it's resolved now, this section is how to actually run it.

1. Spin up a small Ubuntu 22.04/24.04 box — Hetzner CX22 (2 vCPU/4GB,
   ~€4/mo) or a DigitalOcean Basic Droplet at a similar spec is plenty for
   `gemma4:e4b` + `translategemma` at this traffic.
2. Point a DNS A record at the box's IP — a subdomain like
   `ollama.yourdomain.com` (you already own the domain).
3. SSH in as root and run:
   ```bash
   export OLLAMA_PUBLIC_DOMAIN="ollama.yourdomain.com"
   export OLLAMA_AUTH_TOKEN="$(openssl rand -hex 32)"
   echo "SAVE THIS TOKEN: $OLLAMA_AUTH_TOKEN"
   ```
   Then copy this repo's `deploy/` folder onto the box (`scp -r deploy
   root@<ip>:~/`) and run `bash deploy/setup-vps.sh`.

   The script (`deploy/setup-vps.sh`):
   - Installs Ollama, pulls `gemma4:e4b` and `translategemma`
   - Pins Ollama to `127.0.0.1:11434` only — never reachable from the
     public internet directly, token gate or not (`deploy/ollama.env`)
   - Installs Caddy as a token-gated reverse proxy in front of it, with
     automatic HTTPS for your domain (`deploy/Caddyfile`) — any request
     missing the exact `Authorization: Bearer <token>` header gets a 401
     before it ever reaches Ollama
   - Configures `ufw` so only SSH/HTTP/HTTPS reach the box at all

4. Verify the token gate actually works (the script prints these two
   commands with your real values at the end):
   ```bash
   # Should succeed:
   curl -H "Authorization: Bearer <token>" https://ollama.yourdomain.com/v1/models
   # Should 401:
   curl https://ollama.yourdomain.com/v1/models
   ```
   If the second one doesn't 401, stop and fix it before going further —
   an open Ollama endpoint is free compute for anyone who finds it.

## 3. Vercel

1. Import this repo at [vercel.com/new](https://vercel.com/new). Framework
   preset auto-detects Next.js — no build config changes needed.
2. Project Settings → Environment Variables — set every variable from
   `.env.example` that you actually have a real value for. At minimum for
   a working launch:
   - `DATABASE_URL`, `DIRECT_URL` (from step 1)
   - `NEXTAUTH_SECRET` (`openssl rand -base64 32`), `NEXTAUTH_URL` (your
     real production URL, e.g. `https://aisikho.com`)
   - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (for sign-in)
   - `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`
     (for checkout — see Razorpay's dashboard for the webhook URL to
     register: `https://yourdomain.com/api/webhooks/razorpay`)
   - `CRON_SECRET` (`openssl rand -base64 32` — must match what
     `vercel.json`'s cron config sends)
   - `ADMIN_EMAILS` (your own email, comma-separated if more than one)
   - **`OLLAMA_BASE_URL`** = `https://ollama.yourdomain.com` (step 2's
     domain — NOT `localhost`, which only ever worked from your own laptop)
   - **`OLLAMA_AUTH_TOKEN`** = the exact token generated in step 2
3. Deploy. First deploy runs `prisma generate` automatically via
   `package.json`'s `postinstall` script, so Vercel's build always has a
   fresh Prisma client instead of depending on one already sitting in
   `node_modules` (which it won't, on a clean Vercel checkout).
4. Point your domain's DNS at Vercel (Project Settings → Domains — Vercel
   gives you the exact records to add).

## Go-live checklist

Before calling this actually live:

- [ ] `curl` the Ollama VPS from *outside* your own network and confirm
      the 401-without-token / success-with-token behavior from step 2.4
- [ ] Trigger the free mock-feedback grading flow on the deployed site
      (not localhost) and confirm it actually returns a graded response —
      this is the one live end-to-end proof that Vercel → Ollama VPS
      actually works, not just individually reachable
- [ ] Make one real ₹1 test purchase (or use Razorpay test mode) through
      the deployed checkout and confirm the webhook fires, a `Purchase`
      row is created, and the receipt email path runs (logs if
      `RESEND_API_KEY` isn't set yet)
- [ ] Confirm `vercel.json`'s cron jobs (`daily-content`, `fetch-news`)
      are showing successful runs in Vercel's dashboard, not silently
      failing against a stale `OLLAMA_BASE_URL`
- [ ] Rotate `OLLAMA_AUTH_TOKEN` if it was ever typed into a terminal you
      don't fully trust (shared VPS, screen-shared session, etc.) — it's
      a bearer token, whoever has it has full access to your Ollama box

## Image storage (optional — do this when repo size actually bothers you)

Article/homepage images currently ship as files under `public/` committed
to the repo. That's fine to launch with, but it doesn't scale — every
image added grows the repo forever (git never shrinks on its own), and
`public/` files are served from Vercel's origin, not a CDN. Every image
reference in the codebase already goes through `assetUrl()`
(`src/lib/assetUrl.ts`) instead of a hardcoded path, specifically so this
migration is an env var + one script run, not a find-and-replace.

1. In the Supabase dashboard: **Storage → New bucket**, name it `assets`,
   check **Public bucket** (these are article illustrations, not private
   data — no reason to gate reads behind auth).
2. Get a service role key: **Project Settings → API → service_role**
   (not the `anon` key — this needs write access to create objects).
3. Run the upload, locally, once:
   ```bash
   SUPABASE_URL="https://<project-ref>.supabase.co" \
   SUPABASE_SERVICE_ROLE_KEY="<service-role-key>" \
   npm run upload-assets
   ```
   It walks `public/articles/` and `public/home/`, uploads every image to
   the bucket at the same relative path, and prints the
   `NEXT_PUBLIC_ASSET_BASE_URL` value to set next. Re-running it later
   (new images added) is safe — it overwrites by path, doesn't duplicate.
4. Set `NEXT_PUBLIC_ASSET_BASE_URL` in Vercel's env vars to the URL the
   script printed, and redeploy. Every `assetUrl()` call now resolves to
   the CDN instead of `public/`.
5. **Only once you've verified the deployed site actually renders those
   images from the new URL** — `git rm` the files under `public/articles/`
   and `public/home/` and commit. Don't do this before verifying; if the
   env var is wrong or unset, this would 404 every image with nothing to
   fall back to.

Local dev is unaffected either way — `NEXT_PUBLIC_ASSET_BASE_URL` unset
means `assetUrl()` returns the same local path it always did, so nothing
here needs to be set up just to run `npm run dev`.

## Not covered here (deliberately out of scope for this pass)

- **OTP delivery, Zoom meetings, GST invoicing** — each has its own
  "NOT wired up yet" note in `.env.example` with what's needed to turn it
  on. None of them block a launch; they degrade to a logged/manual
  fallback until configured.
