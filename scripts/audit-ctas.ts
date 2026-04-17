import config from "@payload-config";
import fs from "fs";
import { getPayload } from "payload";
import { richTextToPlainText } from "../src/utilities/richtext-to-plaintext";

async function auditCTAs() {
  const payload = await getPayload({ config });

  // Lista de frases que isoladamente já condenam o nó como início de CTA
  const gatilhosFortes = [
    "Fique por dentro das principais notícias",
    "Acompanhe o Canal Technibus no WhatsApp",
    "Acesse o Acervo Digital OTM Editora",
    "Acompanhe as nossas redes sociais",
  ];

  // Palavras que, se aparecerem juntas no mesmo nó, indicam um CTA
  const keywordsSuspeitas = ["whatsapp", "instagram", "facebook", "linkedin", "technibus"];

  const { docs: posts } = await payload.find({
    collection: "posts",
    limit: 0,
    select: { title: true, slug: true, content: true },
  });

  const report = [];

  for (const post of posts) {
    const content = post.content as any;
    if (!content?.root?.children) continue;

    const children = content.root.children;
    let foundIndex = -1;
    let gatilhoEncontrado = "";
    let motivo = "";

    // Varre os nós (focando nos últimos, onde os CTAs costumam estar)
    for (let i = 0; i < children.length; i++) {
      const nodeText = richTextToPlainText({ root: { children: [children[i]], type: "root" } } as any).trim();
      if (!nodeText) continue;

      // Teste 1: Gatilhos Fortes
      const gatilhoForte = gatilhosFortes.find((g) => nodeText.includes(g));

      // Teste 2: Combo de Keywords (mínimo 3 keywords no mesmo nó)
      const kwsEncontradas = keywordsSuspeitas.filter((kw) => nodeText.toLowerCase().includes(kw));
      const hasCombo = kwsEncontradas.length >= 3;

      if (gatilhoForte || hasCombo) {
        foundIndex = i;
        gatilhoEncontrado = gatilhoForte || kwsEncontradas.join(", ");
        motivo = gatilhoForte ? "Gatilho Direto" : "Combo de Keywords";
        break;
      }
    }

    if (foundIndex !== -1) {
      const fullTextNoNo = richTextToPlainText({ root: { children: [children[foundIndex]], type: "root" } } as any);

      // Identifica se o gatilho está no meio do texto (merged) ou no início (isolated)
      const isStartOfNode = gatilhoEncontrado && fullTextNoNo.trim().startsWith(gatilhoEncontrado);

      report.push({
        id: post.id,
        title: post.title,
        type: isStartOfNode ? "isolated" : "merged",
        motivo,
        nodeIndex: foundIndex,
        totalNodes: children.length,
        gatilho: gatilhoEncontrado,
        textBefore: isStartOfNode ? "" : fullTextNoNo.split(gatilhoEncontrado)[0],
        fullNodeText: fullTextNoNo,
      });
    }
  }

  const stats = {
    total: report.length,
    isolated: report.filter((r) => r.type === "isolated").length,
    merged: report.filter((r) => r.type === "merged").length,
  };

  console.table(stats);
  fs.writeFileSync("auditoria_v2.json", JSON.stringify(report, null, 2));
}

await auditCTAs().catch(console.error);
