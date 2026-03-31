import { PayloadRequest, TaskConfig } from "payload";

const cloudflarePurgeTaskHandler: any = async ({ req, input }: { input: { urls: any; purgeEverything: boolean; delayMs: number }; job: any; req: PayloadRequest }) => {
  const { urls, purgeEverything, delayMs } = input;

  // O respiro salvador para o R2 propagar as imagens
  if (delayMs && delayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  const zoneId = process.env.CLOUDFLARE_ZONE_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!zoneId || !apiToken) {
    req.payload.logger.error("Credenciais do Cloudflare ausentes na Task.");
    return { output: { success: false } };
  }

  // Extrai as URLs do formato de array do Payload
  const files = urls ? urls.map((u: any) => u.url) : [];
  const body = purgeEverything ? { purge_everything: true } : { files };

  // Se não for purge everything e não tiver arquivos, aborta para não dar erro na API
  if (!purgeEverything && files.length === 0) {
    return { output: { success: true, message: "Nenhuma URL para purgar." } };
  }

  try {
    const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Cloudflare API Error: ${await response.text()}`);
    }

    req.payload.logger.info(`✅ CF Purge Task executada. (Tudo: ${purgeEverything}, URLs: ${files.length})`);
    return { output: { success: true } };
  } catch (error) {
    req.payload.logger.error(`❌ Erro no Purge via Task: ${error}`);
    throw error; // Lança para a fila tentar novamente, se configurado
  }
};

export const cloudflarePurgeTask: TaskConfig<"cloudflarePurgeTask"> = {
  slug: "cloudflarePurgeTask",
  inputSchema: [
    {
      name: "urls",
      type: "array",
      fields: [{ name: "url", type: "text" }],
    },
    {
      name: "purgeEverything",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "delayMs",
      type: "number",
    },
  ],
  handler: cloudflarePurgeTaskHandler,
};
