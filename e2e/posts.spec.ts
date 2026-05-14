import configPromise from "@/payload.config";
import { richTextToPlainText } from "@/utilities/richtext-to-plaintext";
import { expect, test } from "@playwright/test";
import dotenv from "dotenv";
import { getPayload } from "payload";

// Lê o .env local antes de rodar os testes
dotenv.config({ path: ".env" });

// 1. Inicializa o Payload e busca os posts ANTES de gerar os testes
const payload = await getPayload({ config: configPromise });

const { docs: posts } = await payload.find({
  collection: "posts",
  depth: 2, // Aumentado para trazer os objetos completos de author, category e image
  limit: 10,
  where: {
    _status: {
      equals: "published",
    },
  },
});

// 2. Cria a suíte de testes
test.describe("Validação de Conteúdo dos Posts (DB vs Tela)", () => {
  if (posts.length === 0) {
    test("Nenhum post publicado encontrado para testar", () => {
      test.info().annotations.push({ type: "info", description: "Sem posts" });
    });
    return;
  }

  // 3. Itera sobre os posts retornados do banco e gera um teste para cada um
  for (const post of posts) {
    // Usamos o relPermalink direto, pois o playwright baseURL já resolve o domínio
    const postUrl = post.relPermalink as string;

    test(`Deve carregar e validar o post: "${post.title}"`, async ({ page }) => {
      const response = await page.goto(`${process.env.SITE_URL}${postUrl}`);
      expect(response?.status()).toBe(200);

      // ==========================================
      // VALIDAÇÕES BASEADAS NO SEU page.tsx
      // ==========================================

      // 1. TÍTULO (h1)
      const titleLocator = page.locator("h1.text-primary.text-4xl");
      await expect(titleLocator).toHaveText(post.title);

      // 2. RESUMO (Excerpt)
      if (post.excerpt) {
        const excerptLocator = page.locator("p.text-secondary.text-pretty");
        await expect(excerptLocator).toHaveText(post.excerpt);
      }

      // 3. CATEGORIAS (Tags)
      if (post.category && Array.isArray(post.category)) {
        for (const cat of post.category) {
          // Garante que é um objeto e tem título
          if (typeof cat === "object" && cat !== null && "title" in cat) {
            const tagLocator = page.locator(".tag", { hasText: cat.title as string });
            await expect(tagLocator).toBeVisible();
          }
        }
      }

      // 4. DATA E AUTOR ("Publicado em XX/XX/XXXX por Nome")
      if (post.publishedDate) {
        const dateObj = new Date(post.publishedDate);
        const formattedDate = dateObj.toLocaleDateString("pt-BR");

        // Resolve o nome do autor (lidando com caso do autor ser apenas ID ou objeto)
        let authorName = "Autor desconhecido";
        if (post.author && typeof post.author === "object" && "name" in post.author) {
          authorName = post.author.name as string;
        }

        const metaInfoLocator = page.locator("p.text-secondary", { hasText: "Publicado em" });
        await expect(metaInfoLocator).toContainText(`Publicado em ${formattedDate} por`);
        await expect(metaInfoLocator).toContainText(authorName);
      }

      // 5. IMAGEM DE DESTAQUE E CAPTION (PayloadImage)
      if (post.image && typeof post.image === "object" && "url" in post.image) {
        // Verifica se a tag <figure> contendo uma imagem carregou
        const imageFigure = page.locator("figure img").first();
        await expect(imageFigure).toBeVisible();

        // Verifica a legenda (caption)
        if (post.image.caption) {
          const captionLocator = page.locator("figcaption.text-secondary.italic");
          await expect(captionLocator).toHaveText(post.image.caption as string);
        }
      }

      // 6. RICH TEXT (Validação por amostragem)
      if (post.content) {
        // Converte o objeto complexo do Lexical em texto puro usando seu utilitário
        const plainText = richTextToPlainText(post.content);

        if (plainText) {
          // Pega os primeiros 50 caracteres para validar se o texto apareceu na tela
          const sampleText = plainText.substring(0, 50).trim();

          if (sampleText) {
            // Usamos o getByText do Playwright, que é mais seguro caso o texto tenha aspas
            await expect(page.getByText(sampleText).first()).toBeVisible();
          }
        }
      }

      // 7. COMPONENTES VITAIS DA TELA
      // Verifica se a div de compartilhamento social carregou (basta checar um dos ícones/links)
      const socialLinksContainer = page.locator("ul.flex.gap-4");
      await expect(socialLinksContainer).toBeVisible();

      // Verifica se a barra lateral (Sidebar) carregou
      const sidebarLocator = page.locator("aside.space-y-6");
      await expect(sidebarLocator).toBeVisible();
    });
  }
});
