/**
 * A product's catalog ID shown the way a reader displays a tag: uppercase hex
 * in groups of four. Catalog IDs are 24-hex-digit ObjectIds — 96 bits, the
 * same width as an EPC-96 — so the scan visuals read a real identifier rather
 * than an invented one. Anything else is shown uppercased as-is.
 *
 * @param groups How many groups to keep; the rest becomes "…".
 */
export function tagId(id: string, groups?: number): string {
  const hex = id.trim().toUpperCase();
  if (!/^[0-9A-F]{24}$/.test(hex)) return hex;
  const parts = hex.match(/.{4}/g)!;
  if (groups === undefined || groups >= parts.length) return parts.join(" ");
  return `${parts.slice(0, groups).join(" ")} …`;
}
