# Working on this repo

## Current state: public, protection enforced

The repo (`github.com/SpandanPan/ai-sikho`) is **public** and branch
protection on `main` is **live** — applied and verified working (see below).
Before flipping to public, the entire git history was scanned for secrets
(`git log --all -p` against the known credential strings) and came back
clean; nothing sensitive was ever committed.

What's enforced on `main`:
- Pull request required before merging (1 approval)
- The `test` CI check must pass and be up to date
- No force-pushes, no branch deletion

**Verified by actually testing it** (not just applying the API call and
assuming): a direct `git push origin main` was attempted and GitHub flagged
both rule violations. It went through anyway because the pushing account is
the repo owner/admin and `enforce_admins` is deliberately `false` — see the
reasoning below. A non-admin collaborator's direct push would be hard-blocked.

The command that applied this, kept here in case it ever needs re-applying
(e.g. after transferring ownership):

```bash
gh api repos/SpandanPan/ai-sikho/branches/main/protection -X PUT \
  -H "Accept: application/vnd.github+json" \
  -F 'required_status_checks[strict]=true' \
  -f 'required_status_checks[contexts][]=test' \
  -F 'enforce_admins=false' \
  -F 'required_pull_request_reviews[required_approving_review_count]=1' \
  -F 'required_pull_request_reviews[require_code_owner_reviews]=false' \
  -F 'restrictions=null' \
  -F 'allow_force_pushes=false' \
  -F 'allow_deletions=false'
```

Note the boolean fields need `-F` (typed), not `-f` (string) — `-f` for
`required_status_checks[strict]` was tried first and GitHub's API rejected
it with a schema error before this version worked.

## Why "include administrators" is left off

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
