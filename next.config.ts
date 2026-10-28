import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Options de configuration sécurisées */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
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
