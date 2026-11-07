/* ------------------------------------------------------------------ */
/*  Pure helpers for the Paperless "to pay" card. Kept free of Lit/HA  */
/*  so they can be unit-tested.                                         */
/* ------------------------------------------------------------------ */

export interface PaperlessCardConfig {
  type: string;
  /** Paperless base URL as seen from the tablet, e.g. http://192.168.10.164:8000 */
  url: string;
  /** Read-only API token (thumbnails, list, names). */
  token: string;
  /** Documents carrying this tag are listed. */
  tag: number;
  /** Tags offered as toggle chips. Defaults to [tag]. */
  tags?: number[];
  /** Tag removed by the big "paid" button. Defaults to `tag`. */
  paid_tag?: number;
  /** Service that writes tags: called with { id, tags }. */
  service?: string;
  /** Optional sensor (e.g. sensor.topay): refetch when it changes, refresh after writes. */
  entity?: string;
  title?: string;
  /** Refetch interval in seconds. */
  refresh?: number;
}

export interface PaperlessDoc {
  id: number;
  title: string;
  correspondent: number | null;
  created: string;
  tags: number[];
}

export interface NamedItem {
  id: number;
  name: string;
  color?: string;
  text_color?: string;
}

export const DEFAULT_SERVICE = "rest_command.paperless_tags_setzen";

export function normalizeConfig(raw: Partial<PaperlessCardConfig>): PaperlessCardConfig {
  if (!raw || !raw.url) throw new Error("paperless-pay-card: 'url' fehlt");
  if (!raw.token) throw new Error("paperless-pay-card: 'token' fehlt");
  const tag = Number(raw.tag);
  if (!Number.isInteger(tag) || tag <= 0) throw new Error("paperless-pay-card: 'tag' fehlt");
  const tags = (raw.tags && raw.tags.length ? raw.tags : [tag]).map(Number);
  return {
    ...raw,
    type: raw.type || "custom:paperless-pay-card",
    url: raw.url.replace(/\/+$/, ""),
    token: raw.token,
    tag,
    tags,
    paid_tag: Number(raw.paid_tag ?? tag),
    service: raw.service || DEFAULT_SERVICE,
    refresh: Math.max(30, Number(raw.refresh ?? 300)),
  };
}

/** API URL listing all documents with `tag`, oldest first (pay those first). */
export function listUrl(base: string, tag: number): string {
  return (
    `${base}/api/documents/?tags__id__all=${tag}&ordering=created&page_size=50` +
    `&fields=id,title,correspondent,created,tags`
  );
}

export function idsUrl(base: string, kind: "tags" | "correspondents", ids: number[]): string {
  return `${base}/api/${kind}/?id__in=${[...new Set(ids)].join(",")}&page_size=100`;
}

/** Add or remove `tag`; keeps the remaining order, never duplicates. */
export function toggleTag(tags: number[], tag: number): number[] {
  return tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag];
}

/** "service.name" -> ["service", "name"]. */
export function splitService(service: string): [string, string] {
  const i = service.indexOf(".");
  if (i <= 0 || i === service.length - 1) throw new Error(`Ungültiger Dienst: ${service}`);
  return [service.slice(0, i), service.slice(i + 1)];
}

/** "2026-10-28" -> "28.10.2026"; unknown formats pass through. */
export function formatDate(created: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(created || "");
  return m ? `${m[3]}.${m[2]}.${m[1]}` : created || "";
}

/** Whole days since `created` (0 = today). */
export function ageDays(created: string, now: Date = new Date()): number {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(created || "");
  if (!m) return 0;
  const start = Date.UTC(+m[1], +m[2] - 1, +m[3]);
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.max(0, Math.round((today - start) / 86400000));
}

/** Same tag set, order ignored. Used to confirm a write went through. */
export function sameTags(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  const s = new Set(a);
  return b.every((t) => s.has(t));
}

/* ---------- PDF preview (pdf.js, loaded from the CDN on first use) ---------- */

export const PDFJS_VERSION = "4.10.38";

export function pdfjsUrls(version: string = PDFJS_VERSION): { lib: string; worker: string } {
  const base = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/build`;
  return { lib: `${base}/pdf.min.mjs`, worker: `${base}/pdf.worker.min.mjs` };
}

/**
 * Render scale so a page `pageWidth` points wide fills `targetWidth` CSS pixels
 * sharply on a `dpr` screen. Capped so huge pages do not exhaust tablet memory.
 */
export function renderScale(pageWidth: number, targetWidth: number, dpr: number): number {
  if (!(pageWidth > 0) || !(targetWidth > 0)) return 1;
  return Math.min(4, (targetWidth * Math.max(1, dpr || 1)) / pageWidth);
}

/** Zoom steps for the preview, in percent of the available width. */
export const ZOOM_STEPS = [100, 150, 200, 300];

export function nextZoom(current: number, dir: 1 | -1): number {
  const i = ZOOM_STEPS.indexOf(current);
  const j = Math.min(ZOOM_STEPS.length - 1, Math.max(0, (i < 0 ? 0 : i) + dir));
  return ZOOM_STEPS[j];
}
