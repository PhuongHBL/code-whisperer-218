import DOMPurify from "dompurify";

const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "strike",
  "ul",
  "ol",
  "li",
  "a",
  "span",
  "div",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "blockquote",
  "pre",
  "code",
  "hr",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
];

const ALLOWED_ATTR = ["href", "target", "rel", "class", "colspan", "rowspan"];

function looksLikeHtmlMarkup(s: string): boolean {
  return /<[a-z][\s\S]*>/i.test(s);
}

/**
 * Sanitize microFish `response` for `dangerouslySetInnerHTML`.
 * Plain text (no tags) is escaped and newlines become `<br>`.
 */
export function sanitizeInsightHtml(raw: string): string {
  const t = raw.trim();
  if (!t) return "";

  if (looksLikeHtmlMarkup(t)) {
    return DOMPurify.sanitize(t, {
      ALLOWED_TAGS,
      ALLOWED_ATTR,
    });
  }

  const escaped = t
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/\n/g, "<br>");
  return DOMPurify.sanitize(escaped, { ALLOWED_TAGS: ["br"] });
}
