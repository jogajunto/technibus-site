import { draftMode } from "next/headers";

import config from "@payload-config";
import { getPayload, PaginatedDocs } from "payload";

import { LatBusExibithor } from "@/payload-types";

const payload = await getPayload({ config });

export const fetchPaginatedExibithors = async (page: number = 1): Promise<PaginatedDocs<LatBusExibithor>> => {
  const { isEnabled: draft } = await draftMode();
  const data = await payload.find({
    collection: "latBusExibithors",
    depth: 1,
    draft,
    limit: 12,
    page: page,
    where: {
      and: [...(draft ? [] : [{ _status: { equals: "published" } }])],
    },
  });

  return data;
};

export const fetchAllExibithors = async (): Promise<LatBusExibithor[]> => {
  const { isEnabled: draft } = await draftMode();
  const data = await payload.find({
    collection: "latBusExibithors",
    depth: 1,
    draft,
    limit: 0,
    where: {
      and: [...(draft ? [] : [{ _status: { equals: "published" } }])],
    },
  });

  return data.docs;
};

export const fetchExibithorsSearch = async (where?: any): Promise<PaginatedDocs<LatBusExibithor>> => {
  const data = await payload.find({
    collection: "latBusExibithors",
    depth: 1,
    limit: 0,
    where: {
      and: [...(where ? [where] : [])],
    },
  });

  return data;
};
