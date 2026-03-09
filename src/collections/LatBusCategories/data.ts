import config from "@payload-config";
import { draftMode } from "next/headers";
import { getPayload } from "payload";

const payload = await getPayload({ config });

export const fetchAllLatBusCategories = async () => {
  const { isEnabled: draft } = await draftMode();

  const data = await payload.find({
    collection: "latBusCategories",
    depth: 0,
    draft,
    limit: 100,
    sort: "title",
  });

  return data.docs;
};
