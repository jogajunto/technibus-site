import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

import { postgresAdapter } from "@payloadcms/db-postgres";

import {
  BlockquoteFeature,
  BlocksFeature,
  BoldFeature,
  FixedToolbarFeature,
  HeadingFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  LinkFields,
  OrderedListFeature,
  ParagraphFeature,
  UnderlineFeature,
  UnorderedListFeature,
  UploadFeature,
} from "@payloadcms/richtext-lexical";
import { buildConfig, TextFieldSingleValidation } from "payload";

import { pt } from "@payloadcms/translations/languages/pt";

import { YouTubeEmbedBlock } from "@/blocks/YoutubeEmbed";

import { seoPlugin } from "@payloadcms/plugin-seo";
import { s3Storage } from "@payloadcms/storage-s3";

import { Categories } from "@/collections/Categories/config";
import { LatBusCategories } from "@/collections/LatBusCategories/config";
import { LatBusExibithors } from "@/collections/LatBusExibithors/config";
import { Media } from "@/collections/Media/config";
import { Posts } from "@/collections/Posts/config";
import { searchPlugin } from "@/collections/Search/config";
import { Tags } from "@/collections/Tags/config";
import { Users } from "@/collections/Users/config";
import { SpotifyEmbedBlock } from "./blocks/SpotifyEmbed";

import { Topbar } from "@/globals/Topbar/config";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
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
  editor: lexicalEditor({
    features: () => [
      UploadFeature(),
      FixedToolbarFeature(),
      ParagraphFeature(),
      UnderlineFeature(),
      BoldFeature(),
      ItalicFeature(),
      OrderedListFeature(),
      UnorderedListFeature(),
      BlockquoteFeature(),
      HeadingFeature({ enabledHeadingSizes: ["h2", "h3", "h4", "h5", "h6"] }),
      LinkFeature({
        enabledCollections: ["posts"],
        fields: ({ defaultFields }) => {
          const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
            if ("name" in field && field.name === "url") return false;
            return true;
          });

          return [
            ...defaultFieldsWithoutUrl,
            {
              name: "url",
              type: "text",
              admin: {
                condition: (_data, siblingData) => siblingData?.linkType !== "internal",
              },
              label: ({ t }) => t("fields:enterURL"),
              required: true,
              validate: ((value, options) => {
                if ((options?.siblingData as LinkFields)?.linkType === "internal") {
                  return true;
                }
                return value ? true : "URL is required";
              }) as TextFieldSingleValidation,
            },
          ];
        },
      }),
      BlocksFeature({
        blocks: [YouTubeEmbedBlock, SpotifyEmbedBlock],
      }),
    ],
  }),
  collections: [Users, Posts, Media, Categories, Tags, LatBusExibithors, LatBusCategories],
  globals: [Topbar],
  secret: process.env.PAYLOAD_SECRET || "",
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || "" },
  }),
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  sharp,
  plugins: [
    seoPlugin({}),
    s3Storage({
      collections: {
        media: true,
      },
      bucket: process.env.CLOUDFLARE_R2_BUCKET!,
      config: {
        endpoint: process.env.CLOUDFLARE_R2_ENDPOINT!,
        credentials: {
          accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
          secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
        },
        region: "auto",
      },
    }),
    searchPlugin,
  ],
});
