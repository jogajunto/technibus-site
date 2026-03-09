import type { CollectionConfig } from "payload";

import { relPermalinkField } from "@/fields/relpermalink";
import { slugField } from "@/fields/slug";
import { revalidatePath } from "next/cache";

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
  },
  versions: {
    drafts: {
      autosave: true,
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
  fields: [
    relPermalinkField(),
    slugField(),
    {
      name: "author",
      label: "Autor",
      type: "relationship",
      relationTo: "users",
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
