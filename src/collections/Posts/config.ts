import type { CollectionConfig } from "payload";

import { relPermalinkField } from "@/fields/relpermalink";
import { slugField } from "@/fields/slug";
import { revalidatePath } from "next/cache";
import { convertImage } from "./endpoints/convert-image";
import { sendToSocial } from "./endpoints/send-to-social";

export const Posts: CollectionConfig = {
  slug: "posts",
  labels: {
    singular: "Publicação",
    plural: "Publicações",
  },
  access: {
    read: ({ req }) => {
      if (req.user && req.user?.collection === "users") return true;
      return {
        _status: { equals: "published" },
        publishedDate: { less_than_equal: new Date().toISOString() },
      };
    },
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
        const baseUrl = process.env.SITE_URL || "http://localhost:3000";
        return `${baseUrl}${data.relPermalink}`;
      },
    },
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
    },
  },
  hooks: {
    afterChange: [
      ({ operation }) => {
        if (operation === "update") {
          revalidatePath("/", "layout");
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
