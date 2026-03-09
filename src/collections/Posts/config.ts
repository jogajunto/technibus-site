import type { CollectionConfig } from "payload";

import { relPermalinkField } from "@/fields/relpermalink";
import { slugField } from "@/fields/slug";

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
    },
    {
      name: "excerpt",
      label: "Resumo",
      type: "text",
      required: true,
    },
    {
      name: "hat",
      label: "Chapéu",
      type: "text",
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
      //   required: true,
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
