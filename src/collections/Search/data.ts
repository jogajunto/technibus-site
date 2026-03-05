import config from "@payload-config";
import { getPayload, PaginatedDocs } from "payload";

import { Search } from "@/payload-types";

const payload = await getPayload({ config });

export const fetchPaginatedSearch = async (page: number = 1, where?: any): Promise<PaginatedDocs<Search>> => {
  const data = await payload.find({
    collection: "search",
    depth: 1,
    limit: 12,
    page: page,
    where: {
      and: [...(where ? [where] : [])],
    },
  });

  return data;
};
