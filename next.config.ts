import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pages build to plain files in out/; Cloudflare serves them and a Worker handles /api/*.
  output: "export",
  // Static export has no image server; images in public/ are pre-sized WebP instead.
  images: { unoptimized: true },
  allowedDevOrigins: ["*.ngrok-free.app", "*.ngrok.io"],
};

export default nextConfig;
