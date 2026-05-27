import { generateBlurHash } from "@/utilities/payload/generate-blur-hash";
import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  labels: {
    singular: "Mídia",
    plural: "Mídias",
  },
  admin: {
    group: "Globais",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "alt",
      type: "text",
    },
    {
      name: "caption",
      type: "text",
    },
    {
      name: "blurhash",
      type: "text",
      admin: {
        disabled: true,
        disableListColumn: true,
        disableListFilter: true,
      },
    },
  ],
  hooks: {
    beforeValidate: [generateBlurHash],
    beforeChange: [generateBlurHash],
    afterChange: [
      ({ operation, req }) => {
        if (operation === "update" && !req.context?.skipRevalidate) {
          fetch(`${process.env.SITE_URL}/api/revalidate`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-revalidate-secret": process.env.REVALIDATION_SECRET || "",
            },
            body: JSON.stringify({
              clearAll: true,
            }),
          }).catch((err) => console.error("Erro ao revalidar Next.js via Media Hook:", err));
        }
      },
    ],
  },
  upload: {
    formatOptions: {
      format: "webp",
    },
    imageSizes: [
      {
        name: "thumbnail",
        width: 300,
        height: 300,
        fit: "cover",
        position: "centre",
        formatOptions: {
          format: "webp",
        },
      },
      {
        name: "ogImageSmall",
        formatOptions: {
          format: "jpeg",
        },
      },
      {
        name: "medium",
        width: 768,
        height: undefined,
        fit: "inside",
        formatOptions: {
          format: "webp",
        },
      },
      {
        name: "large",
        width: 1024,
        height: undefined,
        fit: "inside",
        formatOptions: {
          format: "webp",
        },
      },
      {
        name: "ogImage",
        width: 1024,
        height: undefined,
        fit: "inside",
        formatOptions: {
          format: "jpeg",
        },
      },
      {
        name: "xlarge",
        width: 1536,
        height: undefined,
        fit: "inside",
        formatOptions: {
          format: "webp",
        },
      },
    ],
  },
};
