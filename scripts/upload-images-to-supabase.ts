// One-time (and re-runnable) migration: uploads every image under
// public/articles/ and public/home/ to a Supabase Storage bucket,
// preserving the same relative path structure, so assetUrl() (see
// src/lib/assetUrl.ts) can serve them from there instead of the repo
// once NEXT_PUBLIC_ASSET_BASE_URL is set. See DEPLOY.md's "Image
// storage" section for the full walkthrough.
//
// Manual/local run: `npm run upload-assets`.
//
// Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (server-only
// secret — get it from Project Settings > API > service_role, NOT the
// anon key, since this needs write access to create objects). Neither
// is prefixed NEXT_PUBLIC_ because this script never runs in the
// browser.
//
// Uses Supabase Storage's plain REST API via fetch rather than pulling
// in @supabase/supabase-js as a project dependency — this is the only
// place in the repo that would use it, and a script-local dependency
// doesn't belong in package.json's always-installed dependencies.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = process.env.SUPABASE_ASSET_BUCKET ?? "assets";

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY first — see DEPLOY.md.");
  process.exit(1);
}

const CONTENT_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

const SOURCE_DIRS = ["public/articles", "public/home"];

function* walk(dir: string): Generator<string> {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      yield* walk(full);
    } else {
      yield full;
    }
  }
}

async function uploadFile(localPath: string, objectPath: string) {
  const ext = objectPath.slice(objectPath.lastIndexOf(".")).toLowerCase();
  const contentType = CONTENT_TYPES[ext];
  if (!contentType) {
    console.log(`  skip (unrecognized extension): ${objectPath}`);
    return "skipped" as const;
  }

  const body = readFileSync(localPath);
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${objectPath}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": contentType,
      "x-upsert": "true", // re-running this script overwrites, doesn't duplicate
    },
    body,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error(`  FAILED: ${objectPath} (${res.status}): ${text.slice(0, 200)}`);
    return "failed" as const;
  }
  console.log(`  ok: ${objectPath} (${(body.length / 1024).toFixed(0)}KB)`);
  return "ok" as const;
}

async function main() {
  console.log(`Uploading to bucket "${BUCKET}" at ${SUPABASE_URL}\n`);
  console.log("Make sure this bucket exists and is set Public in the Supabase dashboard");
  console.log("(Storage > New bucket > check \"Public bucket\") before running this.\n");

  let ok = 0, failed = 0, skipped = 0;

  for (const dir of SOURCE_DIRS) {
    console.log(`${dir}/`);
    for (const localPath of walk(dir)) {
      // public/articles/foo/hero.png -> articles/foo/hero.png
      const objectPath = relative("public", localPath).split(sep).join("/");
      const result = await uploadFile(localPath, objectPath);
      if (result === "ok") ok++;
      else if (result === "failed") failed++;
      else skipped++;
    }
  }

  console.log(`\nDone: ${ok} uploaded, ${skipped} skipped, ${failed} failed.`);
  if (failed > 0) process.exit(1);

  console.log(`\nNext step — set this in Vercel's env vars, then redeploy:`);
  console.log(`  NEXT_PUBLIC_ASSET_BASE_URL=${SUPABASE_URL}/storage/v1/object/public/${BUCKET}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
