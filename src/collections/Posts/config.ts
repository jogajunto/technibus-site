import type { CollectionConfig } from "payload";

import { relPermalinkField } from "@/fields/relpermalink";
import { slugField } from "@/fields/slug";
import { convertImage } from "./endpoints/convert-image";
import { sendToSocial } from "./endpoints/send-to-social";

export const Posts: CollectionConfig = {
  slug: "posts",
  labels: {
    singular: "Publicação",
    plural: "Publicações",
  },
  admin: {
    useAsTitle: "title",
    group: "Conteúdo",
    preview: ({ relPermalink }) => `${relPermalink}`,
    livePreview: {
      url: ({ data }) => {
        if (!data.relPermalink || !data.publishedDate || !data.excerpt || data.author.length === 0 || data.category.length === 0) {
          return undefined;
        }
        const baseUrl = `${process.env.SITE_URL || "http://localhost:3000"}`;
        return `${baseUrl}/api/draft?url=${data.relPermalink}`;
      },
    },
  },
  versions: {
    drafts: {
      autosave: true,
    },
  },
  hooks: {
    afterChange: [
      ({ operation, req }) => {
        if (req.context?.isMigration) return;

        if (["create", "update"].includes(operation)) {
          fetch(`${process.env.SITE_URL}/api/revalidate`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-revalidate-secret": process.env.REVALIDATION_SECRET || "",
            },
            body: JSON.stringify({
              clearAll: true,
              tags: ["search-results"],
            }),
          }).catch((err) => console.error("Erro ao chamar API de revalidação:", err));
        }
      },
    ],
    afterDelete: [
      ({ doc }) => {
        if (doc._status === "published") {
          fetch(`${process.env.SITE_URL}/api/revalidate`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-revalidate-secret": process.env.REVALIDATION_SECRET || "",
            },
            body: JSON.stringify({
              clearAll: true,
              tags: ["search-results"],
            }),
          }).catch((err) => console.error("Erro ao chamar API de revalidação:", err));
        }
      },
    ],
    beforeDelete: [
      async ({ req, id }) => {
        try {
          await req.payload.delete({
            collection: "daily-views",
            where: {
              post: {
                equals: id,
              },
            },
          });
        } catch (error) {
          console.error("Erro ao limpar daily-views antes de deletar o post:", error);
        }
      },
    ],
  },
  endpoints: [
    {
      path: "/:id/send-to-social",
      method: "post",
      handler: sendToSocial,
    },
    {
      path: "/convert-image",
      method: "get",
      handler: convertImage,
    },
  ],
  fields: [
    relPermalinkField(),
    slugField(),
    {
      name: "author",
      label: "Autor",
      type: "relationship",
      relationTo: "users",
      required: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "title",
      label: "Título",
      type: "text",
      required: true,
      admin: {
        placeholder: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      },
    },
    {
      name: "excerpt",
      label: "Resumo",
      type: "text",
      required: true,
      admin: {
        placeholder: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis.",
        description: "Breve descrição da publicação, usada para SEO e pré-visualizações. Recomenda-se entre 120-160 caracteres.",
      },
    },
    {
      name: "hat",
      label: "Chapéu",
      type: "text",
      admin: {
        placeholder: "Transporte público",
        description: "Texto curto que aparece junto ao título, indicando o tema da publicação.",
      },
    },
    {
      name: "tag",
      label: "Tag(s)",
      type: "relationship",
      relationTo: "tags",
      hasMany: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "category",
      label: "Categoria",
      type: "relationship",
      relationTo: "categories",
      required: true,
      index: true,
      hasMany: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "socialPublished",
      label: "Publicado nas redes sociais",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description: "Marque esta opção se a publicação já tiver sido compartilhada nas redes sociais. Isso ajuda a evitar compartilhamentos duplicados.",
        readOnly: true,
        hidden: true,
      },
    },
    {
      name: "sendToSocialAction",
      type: "ui",
      admin: {
        position: "sidebar",
        components: {
          Field: "@/components/SendToSocialButton",
        },
      },
    },
    {
      name: "image",
      label: "Imagem",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "publishedDate",
      label: "Data de publicação",
      type: "date",
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        description: "Para agendar uma publicação, escolha uma data posterior à atual.",
        date: {
          pickerAppearance: "dayOnly",
          displayFormat: "dd/MM/yyyy",
        },
      },
    },
    {
      name: "content",
      label: "Conteúdo",
      type: "richText",
      required: true,
    },
  ],
};
