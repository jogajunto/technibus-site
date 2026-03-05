import { Post } from "@/payload-types";
import { richTextToPlainText } from "@/utilities/richtext-to-plaintext";

export function generateMetaDescription(content: Post["content"], limit: number = 120): string {
  const plain = richTextToPlainText(content).replace(/\s+/g, " ").trim();

  if (plain.length <= limit) {
    return plain;
  }

  const truncated = plain.slice(0, limit);
  const lastSpace = truncated.lastIndexOf(" ");

  const safeText = lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated;

  return `${safeText}... Leia mais!`;
}
