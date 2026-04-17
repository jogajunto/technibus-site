import config from "@payload-config";
import fs from "fs";
import { getPayload } from "payload";

async function runFinalFix() {
  const payload = await getPayload({ config });
  const auditReport = JSON.parse(fs.readFileSync("auditoria_v2.json", "utf-8"));

  // 1. Mapeamento de Frequência para a Trava de Segurança
  const freqMap: Record<string, number> = {};
  auditReport.forEach((item: any) => {
    freqMap[item.fullNodeText] = (freqMap[item.fullNodeText] || 0) + 1;
  });

  const logs = {
    sucesso: [] as any[],
    ignorado: [] as any[],
    erro: [] as any[],
  };

  console.log(`--- 🚀 Iniciando Limpeza em ${auditReport.length} suspeitos ---`);

  for (const item of auditReport) {
    try {
      const frequencia = freqMap[item.fullNodeText];

      // --- TRAVAS DE SEGURANÇA ---

      // TRAVA 1: Frequência (Ignora o que aparece pouco, ex: Notícia de Recife)
      if (frequencia < 3) {
        logs.ignorado.push({ id: item.id, motivo: `Frequência baixa (${frequencia})`, texto: item.fullNodeText });
        continue;
      }

      // TRAVA 2: Posição (Jamais mexer no primeiro nó do post)
      if (item.nodeIndex === 0) {
        logs.ignorado.push({ id: item.id, motivo: "Detectado no início do post (node 0)", texto: item.fullNodeText });
        continue;
      }

      // --- EXECUÇÃO DA LIMPEZA ---

      const post = await payload.findByID({ collection: "posts", id: item.id });
      if (!post?.content?.root?.children) continue;

      let children = [...post.content.root.children];
      let newChildren = [];

      if (item.type === "isolated") {
        // Remove do nó do gatilho em diante
        newChildren = children.slice(0, item.nodeIndex);
      } else {
        // Split cirúrgico dentro do nó (Preserva o que vem antes do gatilho)
        const targetNode = JSON.parse(JSON.stringify(children[item.nodeIndex]));

        const recursivePodar = (node: any): boolean => {
          if (node.text && node.text.includes(item.gatilho)) {
            node.text = node.text.split(item.gatilho)[0].trimEnd();
            return true;
          }
          if (node.children) {
            for (const child of node.children) {
              if (recursivePodar(child)) return true;
            }
          }
          return false;
        };

        recursivePodar(targetNode);
        newChildren = [...children.slice(0, item.nodeIndex), targetNode];
      }

      // Atualização no Banco (Local)
      await payload.update({
        collection: "posts",
        id: item.id,
        data: {
          content: {
            ...post.content,
            root: { ...post.content.root, children: newChildren },
          },
        },
      });

      logs.sucesso.push({ id: item.id, slug: item.slug });
      console.log(`[✓] ID ${item.id} limpo.`);
    } catch (err: any) {
      logs.erro.push({ id: item.id, erro: err.message });
      console.error(`[X] Erro no ID ${item.id}:`, err.message);
    }
  }

  // --- RELATÓRIOS FINAIS ---
  fs.writeFileSync("logs_fix_final.json", JSON.stringify(logs, null, 2));

  console.log(`\n--- 🏁 PROCESSO CONCLUÍDO ---`);
  console.log(`✅ Sucesso: ${logs.sucesso.length}`);
  console.log(`⚠️ Ignorados (Segurança): ${logs.ignorado.length}`);
  console.log(`❌ Erros: ${logs.erro.length}`);
  console.log(`Consulte 'logs_fix_final.json' para ver os casos ignorados.`);
}

await runFinalFix().catch(console.error);
