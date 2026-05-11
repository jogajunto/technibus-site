import { GlobalConfig } from "payload";

export const CTA: GlobalConfig = {
  slug: "cta",
  label: "CTA Global",
  admin: {
    group: "Conteúdo",
  },
  access: {
    update: ({ req: { user } }) => Boolean(user),
  },
  versions: {
    drafts: {
      autosave: true,
    },
  },
  fields: [
    {
      name: "content",
      label: "Conteúdo",
      type: "richText",
      required: true,
    },
  ],
};
