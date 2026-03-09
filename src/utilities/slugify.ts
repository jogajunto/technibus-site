export function slugify(value: string) {
    // Retorna vazio se o valor for nulo, undefined ou não for string
  if (!value || typeof value !== "string") {
    return "";
  }
  
  const convertedValue = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return convertedValue;
}
