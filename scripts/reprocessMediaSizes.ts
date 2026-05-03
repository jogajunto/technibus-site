// scripts/reprocessMediaSizes.ts

import configPromise from "@payload-config";
import dotenv from "dotenv";
import { getPayload } from "payload";

dotenv.config();

const BASE_URL = process.env.SITE_URL || "http://localhost:3000";

const REQUIRED_SIZES = ["thumbnail", "medium", "large", "xlarge"] as const;

const EXECUTE = process.env.REPROCESS_EXECUTE === "true" || process.argv.includes("--execute");

const FORCE = process.env.REPROCESS_FORCE === "true" || process.argv.includes("--force");

const ALLOW_PRODUCTION = process.env.ALLOW_PRODUCTION_REPROCESS === "true";

const DRY_RUN = !EXECUTE;

const PAGE_LIMIT = Number(process.env.REPROCESS_PAGE_LIMIT || 25);

type MediaDoc = {
  id: string | number;
  url?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  sizes?: Record<string, { url?: string | null } | null>;
};

function resolveFileUrl(url: string) {
  if (url.startsWith("http")) return url;

  const cleanBase = BASE_URL.replace(/\/$/, "");
  const cleanUrl = url.startsWith("/") ? url : `/${url}`;

  return `${cleanBase}${cleanUrl}`;
}

function needsReprocess(doc: MediaDoc) {
  if (FORCE) return true;

  return REQUIRED_SIZES.some((size) => !doc.sizes?.[size]?.url);
}

async function downloadFile(url: string) {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Erro ao baixar arquivo: ${res.status} ${res.statusText}`);
  }

  const arrayBuffer = await res.arrayBuffer();

  return Buffer.from(arrayBuffer);
}

async function revalidateOnce() {
  if (!process.env.SITE_URL || !process.env.REVALIDATION_SECRET) {
    console.warn("⚠️ SITE_URL ou REVALIDATION_SECRET ausente. Pulando revalidação final.");
    return;
  }

  const res = await fetch(`${process.env.SITE_URL}/api/revalidate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-revalidate-secret": process.env.REVALIDATION_SECRET,
    },
    body: JSON.stringify({
      clearAll: true,
    }),
  });

  if (!res.ok) {
    console.warn(`⚠️ Falha na revalidação final: ${res.status} ${res.statusText}`);
  }
}

async function reprocessMediaSizes() {
  console.log("🛠️ Inicializando Payload para reprocessar mídias...");
  console.log(`Modo: ${DRY_RUN ? "DRY RUN" : "EXECUÇÃO REAL"}`);
  console.log(`Force: ${FORCE ? "sim" : "não"}`);
  console.log(`Args recebidos pelo script: ${process.argv.join(" ")}`);

  if (process.env.NODE_ENV === "production" && !ALLOW_PRODUCTION) {
    throw new Error("Ambiente production detectado. Para executar em produção, defina ALLOW_PRODUCTION_REPROCESS=true.");
  }

  if (!DRY_RUN) {
    console.warn("⚠️ EXECUÇÃO REAL habilitada.");
    console.warn("⚠️ O script irá baixar e re-enviar arquivos para a collection media.");
  }

  const payload = await getPayload({ config: configPromise });

  let page = 1;
  let totalDocs = 0;
  let processed = 0;
  let skipped = 0;
  let failed = 0;

  while (true) {
    const result = await payload.find({
      collection: "media",
      depth: 0,
      page,
      limit: PAGE_LIMIT,
      where: {
        mimeType: {
          like: "image/",
        },
      },
      overrideAccess: true,
    });

    totalDocs = result.totalDocs;

    console.log(`\n📄 Página ${page}/${result.totalPages} — ${result.docs.length} mídias`);

    for (const doc of result.docs as MediaDoc[]) {
      if (!doc.url || !doc.filename || !doc.mimeType) {
        console.warn(`⚠️ Pulando ID ${doc.id}: dados incompletos.`);
        skipped++;
        continue;
      }

      if (!doc.mimeType.startsWith("image/")) {
        skipped++;
        continue;
      }

      if (!needsReprocess(doc)) {
        skipped++;
        continue;
      }

      const fileUrl = resolveFileUrl(doc.url);

      console.log(`🔄 ${DRY_RUN ? "[dry-run]" : "[write]"} ID ${doc.id} | ${doc.filename}`);

      try {
        if (DRY_RUN) {
          console.log(`   ↳ URL: ${fileUrl}`);
          console.log("   ↳ Update não executado.");
          processed++;
          continue;
        }

        const buffer = await downloadFile(fileUrl);

        console.log(`   ↳ Baixado: ${(buffer.length / 1024 / 1024).toFixed(2)} MB`);

        await payload.update({
          collection: "media",
          id: doc.id,
          data: {},
          file: {
            data: buffer,
            name: doc.filename,
            mimetype: doc.mimeType,
            size: buffer.length,
          },
          overwriteExistingFiles: true,
          depth: 0,
          overrideAccess: true,
          context: {
            skipRevalidate: true,
            reprocessMediaSizes: true,
          },
        });

        console.log(`✅ Reprocessado: ${doc.filename}`);
        processed++;
      } catch (err) {
        failed++;
        console.error(`❌ Erro no ID ${doc.id} | ${doc.filename}:`, err);
      }
    }

    if (!result.hasNextPage) break;

    page++;
  }

  if (!DRY_RUN && processed > 0) {
    console.log("\n♻️ Revalidando site uma única vez...");
    await revalidateOnce();
  }

  console.log("\n🏁 Resumo:");
  console.log(`Total encontrado: ${totalDocs}`);
  console.log(`Pulados: ${skipped}`);
  console.log(`${DRY_RUN ? "Seriam processados" : "Processados"}: ${processed}`);
  console.log(`Falhas: ${failed}`);

  process.exit(failed > 0 ? 1 : 0);
}

await reprocessMediaSizes();
