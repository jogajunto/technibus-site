import { phoneNumberField } from "@/fields/phoneNumber/field";
import { isValidUrl } from "@/utilities/is-valid-url";
import { revalidatePath } from "next/cache";
import type { CollectionConfig } from "payload";

export const LatBusExibithors: CollectionConfig = {
  slug: "latBusExibithors",
  labels: {
    singular: "Expositor",
    plural: "Expositores",
  },
  admin: {
    useAsTitle: "title",
    group: "LatBus",
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
    {
      name: "logo",
      label: "Logo",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "title",
      label: "Nome ",
      type: "text",
      required: true,
    },
    {
      name: "description",
      label: "Descrição",
      type: "textarea",
      required: true,
    },
    {
      name: "category",
      label: "Categoria",
      type: "relationship",
      relationTo: "latBusCategories",
      hasMany: true,
    },
    {
      name: "website",
      type: "text",
      label: "Site",
      required: true,
      admin: {
        placeholder: "https://www.exemplo.com",
      },
      validate: (value: string | undefined | null) => {
        if (value && !isValidUrl(value)) {
          return "O link informado não é um URL válido. Verifique e tente novamente.";
        }
        return true;
      },
    },
    {
      name: "contact",
      label: "Contato",
      type: "group",
      fields: [
        {
          name: "name",
          label: "Nome do representante",
          type: "text",
          required: true,
          admin: {
            placeholder: "Nome e sobrenome",
          },
        },
        {
          name: "email",
          label: "E-mail",
          type: "email",
          required: true,
          admin: {
            placeholder: "nome@empresa.com.br",
          },
        },
        phoneNumberField("whatsapp", "WhatsApp"),
      ],
    },
  ],
};
