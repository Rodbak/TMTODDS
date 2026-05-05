import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  // SaaS mode: deploy as a server app (Vercel/Render) with API routes + DB.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
