import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

/** Markdown sederhana Humas → HTML aman (allowlist ketat, tanpa script). */
export async function renderMarkdown(dirty: string): Promise<string> {
  const raw = await marked.parse(dirty, { breaks: true });
  return sanitizeHtml(raw, {
    allowedTags: [
      "h2",
      "h3",
      "p",
      "ul",
      "ol",
      "li",
      "strong",
      "em",
      "a",
      "img",
      "blockquote",
      "br",
      "hr",
    ],
    allowedAttributes: {
      a: ["href", "title"],
      img: ["src", "alt"],
    },
    allowedSchemes: ["http", "https", "mailto"],
  });
}
