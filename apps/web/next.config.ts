import type { NextConfig } from "next";
import path from "node:path";

// In apps/web, process.cwd() is apps/web.
// The repository workspace root is 1 level up ("..").
const workspaceRoot = path.resolve(process.cwd(), "..");

const nextConfig: NextConfig = {
  output: process.env.NEXT_BUILD_OUTPUT === "standalone" ? "standalone" : undefined,
  reactStrictMode: true,
  outputFileTracingRoot: workspaceRoot,
};

export default nextConfig;
