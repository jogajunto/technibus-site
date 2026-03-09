import configPromise from "@payload-config";
import { parse } from "csv-parse/sync";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { getPayload } from "payload";

dotenv.config();

const seedsExpositores = async () => {
  // Requirements:
  // CSV `expositores.csv` in root repository path
  const payload = await getPayload({ config: configPromise });

  // 1. Caminho do arquivo e leitura
  const csvFilePath = path.join(process.cwd(), "expositores.csv");

  if (!fs.existsSync(csvFilePath)) {
    console.error("Arquivo expositores.csv não encontrado na raiz do projeto!");
    process.exit(1);
  }

  const fileContent = fs.readFileSync(csvFilePath, "utf-8");

  // 2. Parse do CSV
  const records: any = parse(fileContent, {
    columns: true, // Usa a primeira linha como chave dos objetos
    skip_empty_lines: true,
    trim: true,
  });

  console.log(`Encontrados ${records.length} registros no CSV. Iniciando importação...`);

  for (const record of records) {
    try {
      // 3. Extraindo dados baseados nos NOVOS cabeçalhos do CSV
      const descricao = record["Descrição"];
      const categoriaNome = record["Categoria"];
      let site = record["Site"];
      const nome = record["Nome"];
      const contato = record["Contato"];
      const email = record["E-mail"];
      let whatsapp = record["Telefone (whatsApp)"];

      // Tratamento 1: Pular linhas vazias indesejadas
      if (!nome) continue;

      // Tratamento 2: Evitar que a validação de URL do Payload trave o script
      if (site && !site.startsWith("http")) {
        site = `https://${site}`;
      }

      // Tratamento 3: Passar undefined para não ativar a validação de telefone se estiver vazio/com erro
      if (!whatsapp || whatsapp === "#ERROR!" || whatsapp.trim() === "") {
        whatsapp = undefined;
      }

      // 4. Lidar com o Relacionamento (Categoria)
      let categoryId: number | string;

      const existingCategory = await payload.find({
        collection: "latBusCategories",
        where: {
          title: {
            equals: categoriaNome,
          },
        },
      });

      if (existingCategory.totalDocs > 0) {
        categoryId = existingCategory.docs[0].id;
      } else {
        console.log(`+ Criando nova categoria: ${categoriaNome}`);
        const newCategory = await payload.create({
          collection: "latBusCategories",
          data: {
            title: categoriaNome,
          },
        });
        categoryId = newCategory.id;
      }

      // 5. Criar o Expositor
      console.log(`-> Importando expositor: ${nome}`);
      await payload.create({
        collection: "latBusExibithors",
        data: {
          title: nome,
          description: descricao,
          category: [categoryId],
          website: site,
          contact: {
            name: contato, // Mapeado para a nova coluna "Contato"
            email: email,
            whatsapp: whatsapp, // Agora entra o undefined corretamente se falhar
          },
        },
      });
    } catch (error) {
      console.error(`❌ Erro ao importar o registro ${record["Nome"]}:`, error);
    }
  }

  console.log("✅ Importação finalizada com sucesso!");
  process.exit(0);
};

await seedsExpositores();
