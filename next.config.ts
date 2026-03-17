import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";
import { Header } from "next/dist/lib/load-custom-routes";

const ONE_DAY = 60 * 60 * 24;
const ONE_WEEK = ONE_DAY * 7;
const ONE_YEAR = ONE_DAY * 365;

const RSCValidate = (): Promise<Header[]> | Header[] => {
  const RSCCacheHeaders = [
    {
      key: "Cache-Control",
      value: "private, no-cache, no-store, max-age=0, must-revalidate",
    },
    {
      key: "Vary",
      value: "RSC, Next-Router-State-Tree, Next-Router-Prefetch",
    },
  ];

  return [
    // ---------------------------------------------------------------
    // REGRA 1: Protege quando tem a QUERY STRING (?_rsc=...)
    // ---------------------------------------------------------------
    {
      source: "/:path*",
      has: [
        {
          type: "query",
          key: "_rsc",
        },
      ],
      headers: RSCCacheHeaders,
    },

    // ---------------------------------------------------------------
    // REGRA 2: Protege quando tem o HEADER 'RSC' (O lance do RSC: 1)
    // (Essencial para redirects e requests onde a query string some)
    // ---------------------------------------------------------------
    {
      source: "/:path*",
      has: [
        {
          type: "header",
          key: "RSC", // O Next.js verifica isso case-insensitive
        },
      ],
      headers: RSCCacheHeaders,
    },

    // ---------------------------------------------------------------
    // REGRA 3: Protege quando tem o HEADER de PREFETCH
    // (Segurança extra para quando o link entra na tela)
    // ---------------------------------------------------------------
    {
      source: "/:path*",
      has: [
        {
          type: "header",
          key: "Next-Router-Prefetch",
        },
      ],
      headers: RSCCacheHeaders,
    },
  ];
};

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
    // TODO: Rever com o Matheus antes de ativar o cache da CloudFlare
    // TODO: Adicionar regras para requisições RSC
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
      ...(RSCValidate() as Header[]),
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
