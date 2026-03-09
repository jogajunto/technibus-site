import { slugify } from "@/utilities/slugify";
import { FieldHook } from "payload";

export function formatSlug(): FieldHook {
  return ({ value, originalDoc, data, operation }) => {
    // 1. Se um valor foi digitado ou passado diretamente, nós o formatamos
    if (typeof value === "string" && value !== "") {
      return slugify(value);
    }

    // 2. Se for uma atualização parcial (ex: recuperar senha) e já existir um slug, mantém ele
    if (operation === "update" && originalDoc?.slug) {
      return originalDoc.slug;
    }

    // 3. Se não tem slug ainda, tentamos gerar a partir do title ou name
    const fallbackData = data?.title || data?.name || originalDoc?.title || originalDoc?.name;
    
    if (fallbackData && typeof fallbackData === "string") {
      return slugify(fallbackData);
    }

    // Retorna o valor original (pode ser undefined) se não houver fallback
    return value;
  };
}