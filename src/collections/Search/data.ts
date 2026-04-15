import config from "@payload-config";
import { getPayload, PaginatedDocs } from "payload";

import { Search } from "@/payload-types";
import { timeIt } from "@/utilities/timer";

const payload = await getPayload({ config });

export const fetchPaginatedSearch = async (page: number = 1, where?: any): Promise<PaginatedDocs<Search>> => {
  const data = await timeIt(`fetchPaginatedSearch(page=${page}, where=${JSON.stringify(where)})`, () =>
    payload.find({
      collection: "search",
      depth: 1,
      limit: 12,
      page: page,
      where: {
        and: [...(where ? [where] : [])],
      },
    }),
  );

  return data;
};
