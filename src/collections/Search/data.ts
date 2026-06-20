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
      setweight(to_tsvector('pt_br_unaccent'::regconfig, ${searchTable.title}::text), 'A') || 
      setweight(to_tsvector('pt_br_unaccent'::regconfig, coalesce(${searchTable.content}, '')::text), 'B')
    )`;

    const matchCondition = sql`${ftsVector} @@ websearch_to_tsquery('pt_br_unaccent'::regconfig, ${queryTerm})`;

    // 💡 BÔNUS DE CORRESPONDÊNCIA EXATA (O "Fura-Fila")
    // Checa se o termo exato está no título usando ILIKE (ignorando maiúsculas).
    // Usamos o unaccent() na checagem para garantir que "BusCo" ache "Busco"
    // e "florianópolis" ache "Florianopolis" na mesma lógica.
    const exactMatchBonus = sql`
      CASE 
        WHEN unaccent(${searchTable.title}::text) ILIKE unaccent('%' || ${queryTerm}::text || '%') THEN 0.4 
        ELSE 0.0 
      END
    `;

    // 💡 NOVA ABORDAGEM: Time-Decay + Tier System
    // 1. Calculamos a nota base com penalidade de tempo
    // 2. Somamos os 2.0 pontos de bônus por fora, blindando o match exato contra o decaimento
    const rankCalc = sql`
        (
          ts_rank(${ftsVector}, websearch_to_tsquery('pt_br_unaccent'::regconfig, ${queryTerm})) 
          / (1.0 + (EXTRACT(EPOCH FROM (now() - ${searchTable.publishedDate})) / 86400.0 / 365.0))
        )
        + ${exactMatchBonus}
    `;

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
      .select({
        id: searchTable.id,
        // finalRank: sql<number>`${rankCalc}`,
        // postTitle: searchTable.title,
        // originalRank: sql<number>`ts_rank(${ftsVector}, websearch_to_tsquery('pt_br_unaccent'::regconfig, ${queryTerm}))`,
        // bonus: sql<number>`${exactMatchBonus}`,
        // // 💡 NOVA LINHA: Extraindo o valor exato que sobrou após a penalidade do tempo, antes do bônus
        // decayedRank: sql<number>`
        //   ts_rank(${ftsVector}, websearch_to_tsquery('pt_br_unaccent'::regconfig, ${queryTerm}))
        //   / (1.0 + (EXTRACT(EPOCH FROM (now() - ${searchTable.publishedDate})) / 86400.0 / 365.0))
        // `,
        // publishedDate: searchTable.publishedDate,
        // link: searchTable.relPermalink,
      })
      .from(searchTable)
      .where(matchCondition)
      .orderBy(sql`${rankCalc} DESC`)
      .limit(limit)
      .offset(offset);

    // 🐛 DEBUG: Exibir os 12 primeiros resultados no terminal do Next.js
    // console.log(`\n=== 🔎 DEBUG DE RANKING: Termo "${searchTerm}" ===`);
    // rawResults.slice(0, 12).forEach((result, index) => {
    //   console.log(`[Posição ${index + 1}] ID: ${result.id}`);
    //   console.log(` Titulo do Post: ${result.postTitle}`);
    //   console.log(` 📅 Data do post: ${new Date(result.publishedDate as string).toLocaleDateString("pt-BR")}`);
    //   console.log(` 📝 Nota Textual Pura: ${Number(result.originalRank).toFixed(5)}`);
    //   // 💡 NOVA LINHA: Mostra a nota DEPOIS do tempo, mas ANTES do bônus
    //   console.log(` ⏳ Nota Após Tempo: ${Number(result.decayedRank).toFixed(5)}`);
    //   console.log(` 🎯 Bônus de Título: +${Number(result.bonus).toFixed(5)}`);
    //   console.log(` 📉 Nota Final: ${Number(result.finalRank).toFixed(5)}`);
    //   console.log(` Link: ${process.env.SITE_URL}${result.link}`);
    //   console.log(`-------------------------------------------`);
    // });

    const idsOrderedByRank = rawResults.map((r) => r.id);

    // 5. Hydrate documents with the Payload API (populating images and categories)
    const docsResult = await payload.find({
      collection: "search",
      depth: 1,
      limit: limit,
      where: { id: { in: idsOrderedByRank } },
    });

    // 🐛 DEBUG CRÍTICO: Vamos ver se o Payload API está retornando o post
    // console.log(`\n=== 🔎 DEBUG DE HIDRATAÇÃO ===`);
    // console.log(`IDs que o Drizzle pediu:`, idsOrderedByRank);
    // console.log(`Qtd de posts que o Payload devolveu:`, docsResult.docs.length);
    // console.log(`================================\n`);

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
