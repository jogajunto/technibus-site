import type { GlobalConfig } from "payload";

export const SocialMediaSettings: GlobalConfig = {
  slug: "social-media-settings",
  label: "Configurações de Redes Sociais",
  access: {
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
  },
  admin: {
    hidden: true,
  },
  fields: [
    {
      name: "zapierEndpointUrl",
      type: "text",
      label: "Endpoint do Zapier",
      required: true,
      admin: {
        description: "Informe a URL do webhook do Zapier para envio de posts.",
      },
    },
  ],
};
