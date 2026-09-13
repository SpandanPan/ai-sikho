# Working on this repo

## Branch protection (set this up once, right after the repo exists on GitHub)

`gh` (the GitHub CLI) isn't available in the environment this was built in, so
this couldn't be applied automatically. Do it once, by hand:

**GitHub → your repo → Settings → Branches → Add branch protection rule**

- Branch name pattern: `main`
- ✅ Require a pull request before merging
  - Required approvals: **1**
- ✅ Require status checks to pass before merging
  - Search for and select **CI / test** (appears after the first CI run)
- ✅ Require branches to be up to date before merging
- ✅ Do not allow bypassing the above settings — leave **unchecked** for now
  (see the note below on why)
- ❌ Do NOT enable "Restrict who can push" unless you're adding collaborators
  — with a solo account this would lock you out

Save. From then on, `git push origin main` directly is rejected — every
change has to go through a pull request.

## Why "include administrators" is left off

GitHub does not allow you to approve your own pull request. If you're the
only account on this repo and you turn on "Require approval" *for
administrators too*, you'd lock yourself out of merging anything — including
your own PRs — since there's no one else to approve them.

Leaving it off means: the CI check (tests + build) is still hard-enforced for
everyone, including you, but as the repo admin you can merge your own PR once
CI is green without waiting on a second reviewer. If you add a collaborator
later, turn "include administrators" on and real review becomes the norm.

## Day-to-day workflow

```bash
git checkout -b feature/whatever
# ... make changes ...
npm run test    # unit + integration tests
npm run build   # type-check + production build
git push origin feature/whatever
gh pr create    # or open the PR on github.com
```

CI runs automatically on the PR. Once it's green (and approved, if you have a
reviewer), merge — don't use "Update branch" + direct push as a workaround.

## Deploying changes

This repo deploys through Vercel's GitHub integration, not a GitHub Actions
deploy step — connecting the repo in the Vercel dashboard is enough. Every
merge to `main` triggers a new production deployment automatically; every
open PR gets its own preview URL. Don't add a second, competing deploy
workflow here — it would race with Vercel's own.
