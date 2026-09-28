import "server-only";
import sanitizeHtml from "sanitize-html";

/**
 * Product descriptions are rich-text HTML typed into the admin's Quill editor
 * and rendered on public pages. They're sanitised on the way out so that a
 * compromised admin account, or anything else that writes to the database,
 * can't plant a script that runs for every visitor (stored XSS).
 *
 * The allowlist is what Quill produces — formatting, lists, headings, links,
 * images, tables — and nothing else. Inline styles are limited to the colour
 * and alignment Quill sets, with values that can't smuggle in `url()`.
 */

const COLOR = /^(#[0-9a-f]{3,8}|rgba?\(\s*[\d.]+%?\s*(,\s*[\d.]+%?\s*){2,3}\)|[a-z]+)$/i;

const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p", "br", "hr", "span", "strong", "b", "em", "i", "u", "s", "sub", "sup",
    "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "pre", "code",
    "ol", "ul", "li", "a", "img",
    "table", "thead", "tbody", "tr", "th", "td",
  ],
  allowedAttributes: {
    "*": ["class", "style"],
    a: ["href", "target", "rel"],
    img: ["src", "alt", "width", "height"],
    // Quill 2 marks list items `data-list="bullet|ordered"`.
    li: ["data-list"],
    th: ["colspan", "rowspan"],
    td: ["colspan", "rowspan"],
  },
  allowedClasses: { "*": ["ql-*"] },
  allowedStyles: {
    "*": {
      color: [COLOR],
      "background-color": [COLOR],
      "text-align": [/^(left|right|center|justify)$/],
    },
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  // Quill embeds pasted images as data: URIs. An <img> never runs script,
  // even for an SVG, so data: is safe here and nowhere else.
  allowedSchemesByTag: { img: ["http", "https", "data"] },
  allowProtocolRelative: false,
  transformTags: {
    // Never let an admin-authored link hand the storefront's window to the
    // page it opens.
    a: (tagName, attribs) => ({
      tagName,
      attribs: { ...attribs, rel: "noopener noreferrer" },
    }),
  },
};

export function sanitizeProductHtml(html: string | null | undefined): string {
  return html ? sanitizeHtml(html, OPTIONS) : "";
}
