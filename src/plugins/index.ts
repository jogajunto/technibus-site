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
      media: {
        generateFileURL: ({ filename }) => {
          const domain = "https://storage.technibus.com.br";
          return `${domain}/${filename}`;
        },
      },
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
    collections: ["posts", "categories", "latBusExibithors", "latBusCategories", "media"],
    globals: ["topbar", "cta"],
    showButtonPurgeEverything: false,
    purgeEverything: (args) => {
      const { globalSlug } = args;
      if (globalSlug === "topbar" || globalSlug === "cta") {
        return true;
      }
      return false;
    },
    urlBuilder: async ({ doc, req, collectionSlug, baseUrl }) => {
      const urlsToPurge = new Set<string>();

      // TODO: Adicionar a collection de Users e fazer como na limpeza da página de categoria dos posts, pois as views dos users contém as listagens que cada um fez,
      // e quando um usuário é atualizado ou deletado, essas listagens ficam desatualizadas.
      // Pensar também se tem mais algum lugar que precisa ser limpo quando um user é alterado.

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
      // LÓGICA 4: QUANDO UMA IMAGEM É ALTERADA
      // ==========================================
      else if (collectionSlug === "media") {
        const POSTS_PER_PAGE = 12;

        // 1. Adiciona a URL original da imagem e seus tamanhos redimensionados
        // relPermalink de imagens contém o dominio https://storage.technibus.com.br/, então não podemos concatenar com o baseUrl, pois ficaria https://www.technibus.com.br/https://storage.technibus.com.br/uploads/...
        if (doc.url) urlsToPurge.add(`${doc.url}`);
        if (doc.sizes) {
          Object.values(doc.sizes).forEach((size: any) => {
            if (size.url) urlsToPurge.add(`${size.url}`);
          });
        }

        // 2. Limpa a Home (já que imagens costumam aparecer em banners ou listagens)
        urlsToPurge.add(`${baseUrl}/`);

        // 3. Busca reversa: Encontrar posts que usam esta imagem
        try {
          const relatedPosts = await req.payload.find({
            collection: "posts",
            where: {
              image: { equals: doc.id },
            },
            depth: 1, // Depth 1 para trazer os dados da categoria populados (relPermalink)
            limit: 50,
          });

          const categoryPromises: Promise<void>[] = [];

          relatedPosts.docs.forEach((post: any) => {
            // Limpa a URL do próprio post
            if (post.relPermalink) {
              urlsToPurge.add(`${baseUrl}${post.relPermalink}`);
            }

            // Identifica e limpa as categorias vinculadas ao post onde a imagem aparece
            if (post.category && Array.isArray(post.category) && post.category.length > 0) {
              post.category.forEach((cat: any) => {
                categoryPromises.push(
                  (async () => {
                    try {
                      // Com depth: 1, cat deve ser um objeto populado. Falback seguro para ID.
                      const categoryId = typeof cat === "object" ? cat.id : cat;
                      let relPermalink = typeof cat === "object" ? cat.relPermalink : null;

                      // Se por algum motivo o relPermalink não veio, busca a categoria
                      if (!relPermalink) {
                        const fetchedCategory = await req.payload.findByID({
                          id: Number(categoryId),
                          collection: "categories",
                          draft: false,
                        });
                        relPermalink = fetchedCategory?.relPermalink;
                      }

                      if (relPermalink) {
                        const categoryBaseUrl = `${baseUrl}${relPermalink}`;
                        urlsToPurge.add(categoryBaseUrl); // Purga a página 1 da categoria

                        // Recalcula a paginação para descobrir onde o post afetado está
                        if (post.publishedDate) {
                          const newerPostsCount = await req.payload.count({
                            collection: "posts",
                            where: {
                              and: [{ category: { in: [Number(categoryId)] } }, { publishedDate: { greater_than: post.publishedDate } }, { _status: { equals: "published" } }],
                            },
                          });

                          const position = newerPostsCount.totalDocs + 1;
                          const pageNumber = Math.ceil(position / POSTS_PER_PAGE) + 1;

                          // Se o post caiu da página 2 em diante na listagem da categoria, adiciona à lista
                          if (pageNumber > 1) {
                            urlsToPurge.add(`${categoryBaseUrl}/pagina/${pageNumber}`);
                          }
                        }
                      }
                    } catch (error) {
                      console.error(`Erro ao processar paginação da categoria para a imagem ${doc.id}:`, error);
                    }
                  })(),
                );
              });
            }
          });

          // Aguarda o processamento paralelo de todas as categorias atreladas aos posts afetados
          await Promise.all(categoryPromises);
        } catch (error) {
          console.error("Erro ao buscar posts e categorias relacionados à imagem para purge:", error);
        }
      }

      // ==========================================
      // EXECUÇÃO DA TASK (O HACK DO R2)
      // TODO: Após atualização do plugin modificar esse comportamento
      // ==========================================

      // Retorna apenas a lista pura de URLs estáticas (Home, Posts, Categorias)
      // Sem nenhuma duplicação ou sufixo artificial de RSC
      const finalUrls = Array.from(urlsToPurge);

      if (finalUrls.length > 0) {
        try {
          // 1. Verifica se estamos lidando com um post e se a data de publicação é no futuro
          const isFuturePublish = doc.publishedDate && new Date(doc.publishedDate) > new Date();

          // 2. Define os parâmetros da task base
          const jobOptions: Parameters<typeof req.payload.jobs.queue>[0] = {
            task: "cloudflarePurgeTask",
            input: {
              urls: finalUrls.map((url) => ({ url })),
              purgeEverything: false,
              // Se for no futuro, o waitUntil já dita o tempo, zeramos o delay do R2.
              // Se for imediato, mantemos seus 5s para dar tempo do R2 processar imagens.
              delayMs: isFuturePublish ? 0 : 5000,
            },
            queue: "cloudflarePurgeTask",
          };

          // 🌟 3. O Pulo do Gato: Agendamento Nativo
          if (isFuturePublish) {
            jobOptions.waitUntil = new Date(doc.publishedDate);
          }

          // 4. Despacha para a fila do Payload
          await req.payload.jobs.queue(jobOptions);

          // Logs informativos no painel
          if (isFuturePublish) {
            // Forçamos o fuso horário de Brasília para a exibição no log
            const dataFormatada = new Date(doc.publishedDate).toLocaleString("pt-BR", {
              timeZone: "America/Sao_Paulo",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            });

            req.payload.logger.info(`Task de purge AGENDADA para ${dataFormatada} (${finalUrls.length} URLs).`);
          } else {
            req.payload.logger.info(`Task de purge enfileirada com sucesso para ${finalUrls.length} URLs.`);
          }
        } catch (err) {
          console.error("Erro ao enfileirar a task de purge:", err);
        }
      }

      return [];
    },
  }),
];

export default plugins;
