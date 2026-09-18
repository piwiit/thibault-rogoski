import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
    async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "thibeault-rogoski.vercel.app" }],
        destination: "https://thibault-rogoski.vercel.app/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
