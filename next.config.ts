import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/early-access",
        permanent: true
      }
    ]
  }
};

export default nextConfig;
