/** @type {import('next').NextConfig} */
const nextConfig = {
  // Produces a minimal .next/standalone build the Dockerfile copies —
  // needed for any non-Vercel host (AWS, Fly.io, etc.); Vercel ignores this
  // and builds the repo directly.
  output: "standalone",
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};

export default nextConfig;
