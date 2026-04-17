import fs from "fs";

async function auditPatterns() {
  const auditReport = JSON.parse(fs.readFileSync("auditoria_v2.json", "utf-8"));

  // Objeto para contar ocorrências
  const patternCounts: Record<string, { count: number; ids: number[] }> = {};

  auditReport.forEach((item: any) => {
    // Normalizamos um pouco o texto para agrupar variações que são apenas espaços/newlines
    const pattern = item.fullNodeText.trim();

    if (!patternCounts[pattern]) {
      patternCounts[pattern] = { count: 0, ids: [] };
    }
    patternCounts[pattern].count++;
    if (patternCounts[pattern].ids.length < 5) {
      // Guardamos só alguns IDs de exemplo
      patternCounts[pattern].ids.push(item.id);
    }
  });

  // Transformar em array e ordenar pelo mais frequente
  const sortedPatterns = Object.entries(patternCounts)
    .map(([text, data]) => ({ text, ...data }))
    .sort((a, b) => b.count - a.count);

  // 1. Output no Terminal (Resumo)
  console.log("\n--- TOP 10 VARIAÇÕES DE CTA ---");
  sortedPatterns.slice(0, 10).forEach((p, i) => {
    console.log(`${i + 1}. [${p.count} posts] -> "${p.text.substring(0, 80)}..."`);
  });

  // 2. Output em Arquivo (Relatório Completo)
  let reportMd = `# Relatório de Variações de CTA Encontradas\n\n`;
  reportMd += `Total de variações distintas: ${sortedPatterns.length}\n\n`;
  reportMd += `| Ocorrências | Texto do CTA (Nó Inteiro) | Exemplos (IDs) |\n`;
  reportMd += `| :--- | :--- | :--- |\n`;

  sortedPatterns.forEach((p) => {
    // Limpar quebras de linha para a tabela não quebrar
    const cleanText = p.text.replace(/\n/g, " <br> ");
    reportMd += `| ${p.count} | ${cleanText} | ${p.ids.join(", ")}${p.count > 5 ? "..." : ""} |\n`;
  });

  fs.writeFileSync("relatorio_padroes_cta.md", reportMd);
  console.log(`\n✅ Relatório completo gerado em 'relatorio_padroes_cta.md'`);
}

auditPatterns().catch(console.error);
