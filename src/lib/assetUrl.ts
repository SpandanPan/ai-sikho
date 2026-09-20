// Resolves an image path against wherever it actually lives — locally
// under public/ (default, zero setup) or a Supabase Storage bucket once
// NEXT_PUBLIC_ASSET_BASE_URL is set (see scripts/upload-images-to-supabase.ts
// and DEPLOY.md's "Image storage" section).
//
// Every article/lesson image reference goes through this instead of a
// hardcoded "/articles/..." string, so migrating storage later is a env
// var + one script run, not a find-and-replace across every data file.
const ASSET_BASE_URL = process.env.NEXT_PUBLIC_ASSET_BASE_URL ?? "";

export function assetUrl(path: string): string {
  if (!path.startsWith("/")) {
    throw new Error(`assetUrl: path must start with "/" (got "${path}")`);
  }
  return `${ASSET_BASE_URL}${path}`;
}
