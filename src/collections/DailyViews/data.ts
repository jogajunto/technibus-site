import { Post } from "@/payload-types";
import configPromise from "@payload-config";
import { getPayload } from "payload";

// TODO: Criar uma global para poder configurar o numero de dias
export async function getTopPosts(daysAgo: number = 15, limit: number = 5) {
  const payload = await getPayload({ config: configPromise });

  // 1. Calcula a data de corte (ex: 15 dias atrás à meia-noite)
  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - daysAgo);
  const pastDateAtMidnight = new Date(Date.UTC(pastDate.getUTCFullYear(), pastDate.getUTCMonth(), pastDate.getUTCDate())).toISOString();

  // 2. Busca todas as visualizações a partir dessa data
  // Usamos pagination: false para pegar todos os registros do período
  const { docs: viewRecords } = await payload.find({
    collection: "daily-views",
    where: {
      date: { greater_than_equal: pastDateAtMidnight },
    },
    limit: 5000,
    pagination: false,
    depth: 2,
  });

  // 3. Agrupa os resultados por Post e soma as views
  const aggregatedViews: Record<string, { post: any; totalViews: number }> = {};

  viewRecords.forEach((record) => {
    // Como usamos depth: 1, record.post é um objeto com a notícia completa
    const postObj = record.post as Post;
    if (!postObj || !postObj.id) return;

    if (!aggregatedViews[postObj.id]) {
      aggregatedViews[postObj.id] = { post: postObj, totalViews: 0 };
    }
    aggregatedViews[postObj.id].totalViews += record.views;
  });

  // 4. Converte o objeto em array, ordena do mais visto para o menos visto e corta no limite (Top 5)
  const topPosts = Object.values(aggregatedViews)
    .sort((a, b) => b.totalViews - a.totalViews)
    .slice(0, limit);

  return topPosts;
}
