import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const ONE_DAY = 60 * 60 * 24;
const ONE_WEEK = ONE_DAY * 7;
const ONE_YEAR = ONE_DAY * 365;

const nextConfig: NextConfig = {
  turbopack: {},
  productionBrowserSourceMaps: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [new URL("https://acervodigitalotm.com.br/**")],
  },
  async redirects() {
    return [{ source: "/author/:slug", destination: "/autor/:slug", permanent: true }];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: `public, max-age=${ONE_YEAR}, s-maxage=${ONE_YEAR}, immutable` }],
      },
      {
        source: "/_next/image",
        headers: [
          {
            key: "Cache-Control",
            value: `public, max-age=0, s-maxage=${ONE_WEEK}, stale-while-revalidate=${ONE_WEEK}`,
          },
        ],
      },
      {
        source: "/_next/data/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: `public, max-age=0, s-maxage=${ONE_DAY}, stale-while-revalidate=${ONE_DAY}`,
          },
        ],
      },
      {
        source: "/imagens/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: `public, max-age=${ONE_DAY}, s-maxage=${ONE_WEEK}`,
          },
        ],
      },
      {
        source: "/favicon.ico",
        headers: [{ key: "Cache-Control", value: `public, max-age=${ONE_WEEK}, s-maxage=${ONE_WEEK}, immutable` }],
      },
      {
        source: "/api/media/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: `public, max-age=${ONE_DAY}, s-maxage=${ONE_WEEK}, stale-while-revalidate=${ONE_WEEK}`,
          },
        ],
      },
      {
        source: "/((?!_next/static|_next/image|_next/data|assets|api|favicon.ico|admin).*)",
        headers: [
          {
            key: "Cache-Control",
            value: `public, max-age=0, s-maxage=${ONE_DAY}, stale-while-revalidate=${ONE_DAY}`,
          },
        ],
      },
      {
        source: "/api/((?!media).*)",
        headers: [{ key: "Cache-Control", value: "private, no-cache, no-store, must-revalidate" }],
      },
      {
        source: "/admin(.*)",
        headers: [{ key: "Cache-Control", value: "private, no-cache, no-store, must-revalidate" }],
      },
    ];
  },
};

export default withPayload(nextConfig);
