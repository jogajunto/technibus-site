import configPromise from "@payload-config";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { getPayload } from "payload";

export async function GET(req: Request) {
  const payload = await getPayload({ config: configPromise });
  const { searchParams } = new URL(req.url);

  // Pegamos a URL para onde devemos redirecionar o usuário após ligar o modo rascunho
  const redirectUrl = searchParams.get("url");

  if (!redirectUrl) {
    return new Response("URL não fornecida", { status: 400 });
  }

  // Verificamos se quem está chamando essa rota está logado no admin do Payload
  const { user } = await payload.auth({ headers: req.headers });

  if (!user) {
    return new Response("Não autorizado. Faça login no Payload.", { status: 401 });
  }

  // A MÁGICA ACONTECE AQUI: Ligamos o Draft Mode do Next.js!
  // Isso cria um cookie no navegador do editor que bypassa o cache estático.
  const draft = await draftMode();
  draft.enable();

  // Redireciona o editor para a página do post
  redirect(redirectUrl);
}
