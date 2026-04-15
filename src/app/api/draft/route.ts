import configPromise from "@payload-config";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { getPayload } from "payload";

export async function GET(req: Request) {
  try {
    const payload = await getPayload({ config: configPromise });
    const { searchParams } = new URL(req.url);

    const redirectUrl = searchParams.get("url");

    if (!redirectUrl) {
      return new Response("URL não fornecida", { status: 400 });
    }

    // 🛡️ PROTEÇÃO 1: Evita Open Redirect (garante que é uma URL do próprio site)
    if (!redirectUrl.startsWith("/")) {
      return new Response("URL de redirecionamento inválida", { status: 400 });
    }

    // Verificamos se quem está chamando essa rota está logado no admin do Payload
    const { user } = await payload.auth({ headers: req.headers });

    if (!user) {
      return new Response("Não autorizado. Faça login no Payload.", { status: 401 });
    }

    // Ligamos o Draft Mode do Next.js
    const draft = await draftMode();
    draft.enable();
  } catch (error) {
    // 🛡️ PROTEÇÃO 2: Se o banco falhar, não estoura Erro 500, loga no console e avisa.
    console.error("Erro na rota de draft:", error);
    return new Response("Erro interno ao validar o modo rascunho.", { status: 500 });
  }

  // O redirect DEVE ficar fora do try/catch no Next.js App Router,
  // senão o Next.js interpreta o redirect interno dele como um erro e o try/catch engole.
  // (Pode usar a variável que você validou com segurança).
  const { searchParams } = new URL(req.url);
  redirect(searchParams.get("url") as string);
}
