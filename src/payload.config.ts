import { sql } from "drizzle-orm";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

import { postgresAdapter } from "@payloadcms/db-postgres";

import * as Sentry from "@sentry/nextjs";

import { AfterErrorHookArgs, buildConfig } from "payload";

import { pt } from "@payloadcms/translations/languages/pt";

import { nodemailerAdapter } from "@payloadcms/email-nodemailer";

import { Categories } from "@/collections/Categories/config";
import { LatBusCategories } from "@/collections/LatBusCategories/config";
import { LatBusExibithors } from "@/collections/LatBusExibithors/config";
import { Media } from "@/collections/Media/config";
import { Posts } from "@/collections/Posts/config";
import { Tags } from "@/collections/Tags/config";
import { Users } from "@/collections/Users/config";

import { Topbar } from "@/globals/Topbar/config";
import plugins from "@/plugins";
import { DailyViews } from "./collections/DailyViews/config";
import editor from "./editor";
import { SocialMediaSettings } from "./globals/SocialMediaSettings/config";
import { tasks } from "./tasks";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
      collections: ["posts"],
      breakpoints: [
        { label: "Desktop", name: "desktop", width: 1440, height: 1080 },
        { label: "Mobile", name: "mobile", width: 375, height: 667 },
      ],
      //   url: ({ data }) => {
      //     const siteURL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
      //     return `${siteURL}${data.relPermalink}`;
      //   },
    },
    meta: {
      titleSuffix: `| ${process.env.SITE_TITLE}`,
      icons: [
        {
          type: "image/png",
          rel: "icon",
          url: "/payload-favicon.svg",
        },
      ],
    },
    components: {
      graphics: {
        Icon: "/components/Payload/DashboardIcon/index.tsx",
        Logo: "/components/Payload/DashboardLogo/index.tsx",
      },
    },
  },
  i18n: {
    supportedLanguages: { pt },
  },
  editor,
  collections: [Users, DailyViews, Posts, Media, Categories, Tags, LatBusExibithors, LatBusCategories],
  globals: [Topbar, SocialMediaSettings],
  jobs: {
    tasks: tasks,
    autoRun: [
      {
        cron: "* * * * *",
        queue: "cloudflarePurgeTask",
      },
    ],
    shouldAutoRun: async (payload) => {
      // Tell Payload if it should run jobs or not. This function is optional and will return true by default.
      // This function will be invoked each time Payload goes to pick up and run jobs.
      // If this function ever returns false, the cron schedule will be stopped.
      return true;
    },
    // jobsCollectionOverrides: ({ defaultJobsCollection }) => {
    //   if (!defaultJobsCollection.admin) {
    //     defaultJobsCollection.admin = {};
    //   }

    //   defaultJobsCollection.admin.hidden = false;
    //   return defaultJobsCollection;
    // },
  },
  onInit: async (payload) => {
    if (process.env.NODE_ENV !== "production" && !process.env.IS_PLAYWRIGHT) {
      try {
        await payload.db.drizzle.execute(sql`
        CREATE INDEX IF NOT EXISTS search_fts_idx ON "search" USING GIN (
          (
            setweight(to_tsvector('portuguese'::regconfig, title::text), 'A') || 
            setweight(to_tsvector('portuguese'::regconfig, coalesce(content, '')::text), 'B')
          )
        );
      `);
        console.log("⚡ Índice de busca FTS garantido!");
      } catch (error) {
        console.error("Erro ao garantir o índice FTS:", error);
      }
    }
  },
  hooks: {
    afterError: [
      (args: AfterErrorHookArgs) => {
        const { error, req, collection } = args;
        // Enviamos o erro original (error) para o Sentry
        Sentry.withScope((scope) => {
          scope.setTag("payload_collection", collection?.slug || "global");

          if (req?.user) {
            scope.setUser({
              email: req.user.email,
              id: req.user.id,
            });
          }

          // Contexto extra para ajudar no debug
          scope.setContext("payload_request", {
            url: req?.url,
            method: req?.method,
          });

          Sentry.captureException(error);
        });
      },
    ],
  },
  secret: process.env.PAYLOAD_SECRET || "",
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || "" },
  }),
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  email: nodemailerAdapter({
    defaultFromAddress: process.env.SMTP_FROM_ADDRESS!,
    defaultFromName: process.env.SMTP_FROM_NAME!,
    transportOptions: {
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
  }),
  sharp,
  plugins,
});
