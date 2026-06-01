import { withPayload } from "@payloadcms/next/withPayload";
import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const ONE_DAY = 60 * 60 * 24;
const ONE_WEEK = ONE_DAY * 7;
const ONE_YEAR = ONE_DAY * 365;

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: true,
  poweredByHeader: false,
  experimental: {
    staleTimes: {
      dynamic: 0,
      static: 60,
    },
  },
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
        source: "/((?!_next/static|_next/image|_next/data|assets|api|favicon.ico|admin|pesquisar).*)",
        headers: [
          {
            key: "Cache-Control",
            value: `public, max-age=0, s-maxage=${ONE_DAY}, stale-while-revalidate=${ONE_WEEK}`,
          },
        ],
      },
      {
        source: "/((?!api|_next/static|_next/image|favicon.ico|pesquisar).*)",
        has: [{ type: "cookie", key: "payload-token" }],
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-cache, no-store, must-revalidate, max-age=0, no-transform",
          },
          {
            key: "x-middleware-cache", // Instrução para o Proxy do Next 16 ignorar cache interno
            value: "no-cache",
          },
        ],
      },
      {
        source: "/pesquisar/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, s-maxage=60",
          },
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
            value: `public, max-age=${ONE_DAY}, s-maxage=${ONE_WEEK}, stale-while-revalidate=${ONE_WEEK}`,
          },
        ],
      },
      {
        source: "/_next/data/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: `public, max-age=0, s-maxage=${ONE_DAY}, stale-while-revalidate=${ONE_WEEK}`,
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
        source: "/api/most-read",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, s-maxage=1800, stale-while-revalidate=3600",
          },
        ],
      },
      {
        source: "/api/((?!media|most-read).*)",
        headers: [{ key: "Cache-Control", value: "private, no-cache, no-store, must-revalidate" }],
      },
      {
        source: "/admin(.*)",
        headers: [{ key: "Cache-Control", value: "private, no-cache, no-store, must-revalidate" }],
      },
    ];
  },
};

// 1. Envelopamos primeiro a config com o Payload, que deve rodar sempre
const configWithPayload = withPayload(nextConfig);

// 2. Definimos a regra para habilitar o Sentry
// Geralmente queremos que rode em 'production' E dentro de uma esteira de CI/CD
// Caso não use uma variável 'CI', você pode usar process.env.NODE_ENV === 'production'
// e evitar rodar 'next build' localmente com NODE_ENV=production.
const shouldEnableSentryBuild = process.env.NODE_ENV === "production" && process.env.CI === "true";

// 3. Aplicamos o Sentry condicionalmente
const finalConfig = shouldEnableSentryBuild
  ? withSentryConfig(configWithPayload, {
      org: process.env.GLITCHTIP_ORG,
      project: process.env.GLITCHTIP_PROJECT,
      widenClientFileUpload: false,
      authToken: process.env.GLITCHTIP_AUTH_TOKEN,
      sentryUrl: process.env.GLITCHTIP_URL,
      sourcemaps: {
        deleteSourcemapsAfterUpload: true,
      },
      telemetry: false,
      //   silent: true, // Dica extra: 'true' oculta os logs longos do Sentry durante o build
    })
  : configWithPayload;

export default finalConfig;
