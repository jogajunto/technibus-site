import { Search } from "@/payload-types";
import { timeIt } from "@/utilities/timer";
import config from "@payload-config";
import { sql } from "drizzle-orm";
import { getPayload, PaginatedDocs } from "payload";

const payload = await getPayload({ config });

export const fetchPaginatedSearch = async (page: number = 1, searchTerm?: string): Promise<PaginatedDocs<Search>> => {
  return await timeIt(`fetchPaginatedSearch_FTS(page=${page}, term=${searchTerm})`, async () => {
    const limit = 12;

    // 1. Default search when there is no search term
    if (!searchTerm || searchTerm.trim() === "") {
      return payload.find({ collection: "search", limit, page, sort: "-createdAt" });
    }

    const db = payload.db.drizzle;
    const searchTable = payload.db.tables["search"];
    const queryTerm = sql`${searchTerm}`;

    // 2. The Exact Expression (With Type Casts to match the GIN Index)
    const ftsVector = sql`(
      setweight(to_tsvector('portuguese'::regconfig, ${searchTable.title}::text), 'A') || 
      setweight(to_tsvector('portuguese'::regconfig, coalesce(${searchTable.content}, '')::text), 'B')
    )`;

    const matchCondition = sql`${ftsVector} @@ websearch_to_tsquery('portuguese'::regconfig, ${queryTerm})`;
    const rankCalc = sql`ts_rank(${ftsVector}, websearch_to_tsquery('portuguese'::regconfig, ${queryTerm}))`;

    // 3. Super fast count query (Using the Index)
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(searchTable)
      .where(matchCondition);

    const totalDocs = Number(countResult[0]?.count || 0);

    // If nothing is found, return empty structure
    if (totalDocs === 0) {
      return {
        docs: [],
        totalDocs: 0,
        limit,
        totalPages: 0,
        page,
        pagingCounter: 1,
        hasPrevPage: false,
        hasNextPage: false,
        prevPage: null,
        nextPage: null,
      };
    }

    // 4. Fetch IDs (Using the Index and Ordering by Rank)
    const offset = (page - 1) * limit;
    const rawResults = await db
      .select({ id: searchTable.id })
      .from(searchTable)
      .where(matchCondition)
      .orderBy(sql`${rankCalc} DESC`)
      .limit(limit)
      .offset(offset);

    const idsOrderedByRank = rawResults.map((r) => r.id);

    // 5. Hydrate documents with the Payload API (populating images and categories)
    const docsResult = await payload.find({
      collection: "search",
      depth: 1,
      limit: limit,
      where: { id: { in: idsOrderedByRank } },
    });

    // 6. Restore the perfect relevance order
    const sortedDocs = docsResult.docs.sort((a, b) => idsOrderedByRank.indexOf(a.id) - idsOrderedByRank.indexOf(b.id));

    // 7. Return mathematically perfect pagination
    const totalPages = Math.ceil(totalDocs / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      docs: sortedDocs,
      totalDocs,
      limit,
      totalPages,
      page,
      pagingCounter: offset + 1,
      hasPrevPage,
      hasNextPage,
      prevPage: hasPrevPage ? page - 1 : null,
      nextPage: hasNextPage ? page + 1 : null,
    };
  });
};
