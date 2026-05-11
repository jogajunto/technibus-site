import config from "@payload-config";
import { getPayload } from "payload";

const payload = await getPayload({ config });

export const fetchCTA = async (draft: boolean = false) => {
  return await payload.findGlobal({ slug: "cta", draft: draft });
};
