import { draftMode } from "next/headers";

import config from "@payload-config";
import { getPayload } from "payload";

import { User } from "@/payload-types";

const payload = await getPayload({ config });

export const fetchAllUsers = async (): Promise<User[]> => {
  const { isEnabled: draft } = await draftMode();

  const { docs: categories } = await payload.find({
    collection: "users",
    depth: 2,
    draft,
    limit: 0,
    where: {
      and: [...(draft ? [] : [{ _status: { equals: "published" } }])],
    },
  });

  const filtered = categories.filter((user: User) => {
    const posts = user?.posts?.docs ?? [];
    return posts.length > 0;
  });

  return filtered;
};

export const fetchUserBySlug = async (slug: string): Promise<User> => {
  const { isEnabled: draft } = await draftMode();
  const data = await payload.find({
    collection: "users",
    depth: 1,
    draft,
    limit: 1,
    where: {
      and: [{ slug: { equals: slug } }],
    },
  });

  return data.docs[0];
};
