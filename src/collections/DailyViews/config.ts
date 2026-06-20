import { CollectionConfig } from "payload";
import { trackView } from "./endpoints/track-view";

// collections/DailyViews.ts
export const DailyViews: CollectionConfig = {
  slug: "daily-views",
  admin: {
    // hidden: true,
  },
  access: {
    read: ({ req: { user } }) => {
      if (user?.email.includes("@technibus.com.br") || user?.email.includes("@otmeditora.com")) {
        return false;
      }
      return true;
    },
  },
  endpoints: [
    {
      path: "/track", // /api/daily-views/track
      method: "post",
      handler: trackView,
    },
  ],
  fields: [
    {
      name: "post",
      type: "relationship",
      relationTo: "posts",
      required: true,
      index: true,
    },
    {
      name: "date",
      label: "Data da Visualização",
      type: "date",
      required: true,
      index: true,
      admin: {
        date: {
          pickerAppearance: "dayOnly",
          displayFormat: "dd/MM/yyyy",
        },
      },
    },
    {
      name: "views",
      type: "number",
      defaultValue: 1,
      required: true,
    },
  ],
};
