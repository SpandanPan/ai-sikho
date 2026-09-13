# Working on this repo

## Current state: private, protection NOT yet enforced

The repo (`github.com/SpandanPan/the-model-desk`) is private. GitHub only
enforces branch protection rules on a private repo with a **paid** plan
(GitHub Pro, $4/mo) — on the Free plan it's available only if the repo is
public. Since staying private mattered more right now, protection is
documented below but not turned on: **nothing technically stops a direct
push to `main` yet.** Treat the PR workflow below as the convention until
one of these changes:

- **Upgrade to GitHub Pro** → I (or you) can flip on the rule below in under
  a minute, same day.
- **Make the repo public** → unlocks it for free, but the pricing, product
  content, and business logic become visible to anyone.

## The rule to apply, once either is true

**GitHub → repo → Settings → Branches → Add branch protection rule**

- Branch name pattern: `main`
- ✅ Require a pull request before merging — required approvals: **1**
- ✅ Require status checks to pass before merging → select **CI / test**
  (only selectable after the first CI run, which has already happened)
- ✅ Require branches to be up to date before merging
- ❌ Leave "Do not allow bypassing" / "include administrators" **off** (see
  below)
- ❌ Do NOT enable "Restrict who can push" — with a solo account this locks
  you out

Or, once it's a paid plan, I can apply it via:

```bash
gh api repos/SpandanPan/the-model-desk/branches/main/protection -X PUT \
  -H "Accept: application/vnd.github+json" \
  -f 'required_status_checks[strict]=true' \
  -f 'required_status_checks[contexts][]=test' \
  -F 'enforce_admins=false' \
  -F 'required_pull_request_reviews[required_approving_review_count]=1' \
  -F 'required_pull_request_reviews[require_code_owner_reviews]=false' \
  -F 'restrictions=null' \
  -F 'allow_force_pushes=false' \
  -F 'allow_deletions=false'
```

## Why "include administrators" is left off even then

GitHub does not allow you to approve your own pull request. If you're the
only account on this repo and you turn on "Require approval" *for
administrators too*, you'd lock yourself out of merging anything — including
your own PRs — since there's no one else to approve them.

Leaving it off means: the CI check (tests + build) is still hard-enforced for
everyone, including you, but as the repo admin you can merge your own PR once
CI is green without waiting on a second reviewer. If you add a collaborator
later, turn "include administrators" on and real review becomes the norm.

## Day-to-day workflow (follow this now, enforced or not)

```bash
git checkout -b feature/whatever
# ... make changes ...
npm run test    # unit + integration tests
npm run build   # type-check + production build
git push origin feature/whatever
gh pr create    # or open the PR on github.com
```

CI runs automatically on the PR (`.github/workflows/ci.yml`) — check it's
green before merging even though nothing forces you to wait for it yet.

## Deploying changes

This repo is meant to deploy through Vercel's GitHub integration, not a
GitHub Actions deploy step — connecting the repo in the Vercel dashboard is
enough. Every merge to `main` would then trigger a new production
deployment automatically, and every open PR gets its own preview URL. This
hasn't been connected yet (no deployment today, per plan) — don't add a
second, competing deploy workflow here when it is, it would race with
Vercel's own.
