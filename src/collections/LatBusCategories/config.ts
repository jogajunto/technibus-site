import type { CollectionConfig } from "payload";

export const LatBusCategories: CollectionConfig = {
  slug: "latBusCategories",
  labels: {
    singular: "Categoria",
    plural: "Categorias",
  },
  admin: {
    useAsTitle: "title",
    group: "LatBus",
  },
  versions: {
    drafts: {
      autosave: true,
    },
  },
  hooks: {
    afterChange: [
      ({ operation }) => {
        if (operation === "update" || operation === "create") {
          fetch(`${process.env.SITE_URL}/api/revalidate`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-revalidate-secret": process.env.REVALIDATION_SECRET || "",
            },
            body: JSON.stringify({
              clearAll: true,
            }),
          }).catch((err) => console.error("Erro ao chamar API de revalidação:", err));
        }
      },
    ],
  },
  fields: [
    {
      name: "title",
      label: "Título",
      type: "text",
      required: true,
    },
    {
      label: "Expositores relacionados",
      type: "group",
      fields: [
        {
          name: "exibithors",
          label: "Expositores relacionados",
          type: "join",
          collection: "latBusExibithors",
          on: "category",
          admin: {
            defaultColumns: ["title", "image"],
          },
        },
      ],
    },
  ],
};
