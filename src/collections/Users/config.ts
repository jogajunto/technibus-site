import { relPermalinkField } from "@/fields/relpermalink";
import { slugField } from "@/fields/slug";
import { generateRelPeramlinkWithSlug } from "@/utilities/payload/generate-relpermalink";
import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  labels: {
    singular: "Usuário",
    plural: "Usuários",
  },
  admin: {
    useAsTitle: "email",
    group: "Globais",
    preview: ({ relPermalink }) => `${relPermalink}`,
  },
  auth: { useSessions: false },
  fields: [
    slugField(),
    relPermalinkField({
      overrides: {
        hooks: {
          beforeChange: [generateRelPeramlinkWithSlug("/autor")],
        },
      },
    }),
    {
      name: "name",
      type: "text",
      label: "Nome",
      required: true,
    },
    {
      name: "role",
      type: "text",
      label: "Cargo",
    },
    {
      type: "textarea",
      label: "Bioagrafia",
      name: "bio",
    },
    {
      name: "image",
      label: "Imagem",
      type: "upload",
      relationTo: "media",
    },
    {
      label: "Publicações relacionadas",
      type: "group",
      fields: [
        {
          name: "posts",
          label: "Publicações relacionadas",
          type: "join",
          collection: "posts",
          on: "author",
          admin: {
            defaultColumns: ["title", "image"],
          },
        },
      ],
    },
  ],
};
