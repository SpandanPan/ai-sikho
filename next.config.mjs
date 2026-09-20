/** @type {import('next').NextConfig} */
const nextConfig = {
  // Produces a minimal .next/standalone build the Dockerfile copies —
  // needed for any non-Vercel host (AWS, Fly.io, etc.); Vercel ignores this
  // and builds the repo directly.
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      // Article/homepage images once migrated to Supabase Storage — see
      // scripts/upload-images-to-supabase.ts and DEPLOY.md. Wildcarded
      // rather than one specific project ref so this doesn't need
      // editing again if the project is ever re-provisioned.
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default nextConfig;
