import type { NextConfig } from "next";
import path from "node:path";

const workspaceRoot = path.resolve(process.cwd(), "../..");

const nextConfig: NextConfig = {
  output: process.env.NEXT_BUILD_OUTPUT === "standalone" ? "standalone" : undefined,
  reactStrictMode: true,
  outputFileTracingRoot: workspaceRoot
};

export default nextConfig;
