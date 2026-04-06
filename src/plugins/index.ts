import { searchPlugin } from "@/collections/Search/config";
import { Category } from "@/payload-types";
import { seoPlugin } from "@payloadcms/plugin-seo";
import { s3Storage } from "@payloadcms/storage-s3";
import { Plugin } from "payload";
import { PayloadPluginCloudflarePurge } from "payload-plugin-cloudflare-purge";

const plugins: Plugin[] = [
  seoPlugin({}),
  s3Storage({
    collections: {
      media: true,
    },
    bucket: process.env.CLOUDFLARE_R2_BUCKET!,
    config: {
      endpoint: process.env.CLOUDFLARE_R2_ENDPOINT!,
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
      },
      region: "auto",
    },
  }),
  searchPlugin,
  // TODO: Testar posts agendados para ver se o cache esta sendo limpo normalmente
  PayloadPluginCloudflarePurge({
    enabled: process.env.NODE_ENV === "production",
    zoneId: process.env.CLOUDFLARE_ZONE_ID!,
    apiToken: process.env.CLOUDFLARE_API_TOKEN!,
    baseUrl: process.env.SITE_URL!,
    collections: ["posts", "categories", "latBusExibithors", "latBusCategories"],
    showButtonPurgeEverything: false,
    purgeEverything: false,
    urlBuilder: async ({ doc, req, collectionSlug, baseUrl }) => {
      const urlsToPurge = new Set<string>();

      // ==========================================
      // LÓGICA 1: QUANDO UMA CATEGORIA É ALTERADA
      // ==========================================
      if (collectionSlug === "categories") {
        // TODO: Pensar mais sobre em quais lugares devemos limpar, já que as categorias aparecem em diversos lugares do site (Home, Página da Categoria, Página do Post, etc)
        if (doc.relPermalink) {
          urlsToPurge.add(`${baseUrl}${doc.relPermalink}`);
        }
      }

      // ==========================================
      // LÓGICA 2: QUANDO UM POST É ALTERADO
      // ==========================================
      else if (collectionSlug === "posts") {
        const POSTS_PER_PAGE = 12;

        // Limpa Home, Busca e a própria URL do Post
        urlsToPurge.add(`${baseUrl}/`);

        if (doc.relPermalink) {
          urlsToPurge.add(`${baseUrl}${doc.relPermalink}`);
        }

        // Limpa as categorias vinculadas ao post (Página 1 e Página Específica)
        if (doc.category && Array.isArray(doc.category) && doc.category.length > 0) {
          const categoryPromises = doc.category.map(async (cat: Category) => {
            try {
              // Lida com o caso do relacionamento estar populado ou apenas o ID
              const id = typeof cat === "object" ? cat.id : cat;

              const category = await req.payload.findByID({
                id: Number(id),
                collection: "categories",
                draft: false,
              });

              if (category?.relPermalink) {
                const categoryBaseUrl = `${baseUrl}${category.relPermalink}`;
                urlsToPurge.add(categoryBaseUrl); // Purga a página 1 da categoria

                const newerPostsCount = await req.payload.count({
                  collection: "posts",
                  where: {
                    and: [{ category: { in: [Number(id)] } }, { publishedDate: { greater_than: doc.publishedDate } }, { _status: { equals: "published" } }],
                  },
                });

                const position = newerPostsCount.totalDocs + 1;
                const pageNumber = Math.ceil(position / POSTS_PER_PAGE);

                // Se caiu da página 2 em diante, adiciona o parâmetro
                if (pageNumber > 1) {
                  urlsToPurge.add(`${categoryBaseUrl}/pagina/${pageNumber}`);
                }
              }
            } catch (error) {
              console.error("Erro ao calcular paginação da categoria no purge:", error);
            }
          });

          await Promise.all(categoryPromises);
        }
      }

      // ==========================================
      // LÓGICA 3: QUANDO EXPOSITOR OU CATEGORIA LAT.BUS É ALTERADO
      // ==========================================
      else if (collectionSlug === "latBusExibithors" || collectionSlug === "latBusCategories") {
        urlsToPurge.add(`${baseUrl}/guia-de-expositores-lat-bus-2026`);
      }

      // ==========================================
      // EXECUÇÃO DA TASK (O HACK DO R2)
      // TODO: Após atualização do plugin modificar esse comportamento
      // ==========================================

      // Converte o Set em Array e duplica cada URL para incluir a versão RSC (JSON)
      const finalUrls = Array.from(urlsToPurge).flatMap((url) => {
        const hasQuery = url.includes("?");
        // Reproduz a exata concatenação que a Transform Rule faz na Cloudflare
        const rscUrl = hasQuery ? `${url}&_cf_rsc=1` : `${url}?&_cf_rsc=1`;

        return [url, rscUrl];
      });

      if (finalUrls.length > 0) {
        try {
          // Despacha para a fila do Payload com 5 segundos de atraso
          await req.payload.jobs.queue({
            task: "cloudflarePurgeTask",
            input: {
              urls: finalUrls.map((url) => ({ url })),
              purgeEverything: false,
              delayMs: 5000, // 👈 Tempo essencial para o R2 processar as imagens
            },
            queue: "cloudflarePurgeTask",
          });
          req.payload.logger.info(`Task de purge enfileirada com sucesso para ${finalUrls.length} URLs.`);
        } catch (err) {
          console.error("Erro ao enfileirar a task de purge:", err);
        }
      }

      return [];
    },
  }),
];

export default plugins;
