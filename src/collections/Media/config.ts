import { generateBlurHash } from "@/utilities/payload/generate-blur-hash";
import { APIError, type CollectionConfig } from "payload";

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
      name: "uploadInfo",
      type: "ui",
      admin: {
        components: {
          Field: "@/components/UploadInfo",
        },
      },
    },
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
    beforeValidate: [
      (args) => {
        const { data, req, operation } = args;
        if ((operation === "create" || operation === "update") && req.file && data) {
          const width = data.width || 0;
          const height = data.height || 0;

          if (width < 480 || height < 480) {
            throw new APIError("A imagem é muito pequena. O tamanho mínimo exigido é de 480px de largura e altura.", 400);
          }
        }
        return data;
      },
      generateBlurHash,
    ],
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
    resizeOptions: {
      width: 1920,
      height: 1920,
      fit: "inside",
      withoutEnlargement: true,
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
