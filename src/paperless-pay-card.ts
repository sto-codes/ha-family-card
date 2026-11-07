/* ------------------------------------------------------------------ */
/*  paperless-pay-card: documents in Paperless-ngx that still need to  */
/*  be paid, with thumbnail, a big "paid" button and tag chips.        */
/*  Reads straight from Paperless with a read-only token (needs CORS); */
/*  writes go through a Home Assistant service so the write token      */
/*  stays on the server.                                               */
/* ------------------------------------------------------------------ */

import { LitElement, html, css, nothing, PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import type { HomeAssistant, LovelaceCard } from "custom-card-helpers";
import {
  PaperlessCardConfig,
  PaperlessDoc,
  NamedItem,
  normalizeConfig,
  listUrl,
  idsUrl,
  toggleTag,
  splitService,
  formatDate,
  ageDays,
  sameTags,
} from "./paperless";

export class PaperlessPayCard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: PaperlessCardConfig;
  @state() private _docs: PaperlessDoc[] = [];
  @state() private _tags = new Map<number, NamedItem>();
  @state() private _correspondents = new Map<number, string>();
  @state() private _thumbs = new Map<number, string>();
  @state() private _busy = new Set<number>();
  @state() private _error = "";
  @state() private _loading = true;
  @state() private _zoom: PaperlessDoc | null = null;

  private _timer?: number;
  private _entityState?: string;

  public setConfig(config: Partial<PaperlessCardConfig>): void {
    this._config = normalizeConfig(config);
  }

  public getCardSize(): number {
    return 3 + this._docs.length * 2;
  }

  public connectedCallback(): void {
    super.connectedCallback();
    this._load();
    this._timer = window.setInterval(() => this._load(), this._config.refresh! * 1000);
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    window.clearInterval(this._timer);
    this._thumbs.forEach((u) => URL.revokeObjectURL(u));
    this._thumbs = new Map();
  }

  protected updated(changed: PropertyValues): void {
    if (!changed.has("hass") || !this._config.entity) return;
    const s = this.hass?.states[this._config.entity]?.state;
    if (this._entityState !== undefined && s !== this._entityState) this._load();
    this._entityState = s;
  }

  private async _get<T>(url: string, blob = false): Promise<T> {
    const r = await fetch(url, { headers: { Authorization: `Token ${this._config.token}` } });
    if (!r.ok) throw new Error(`Paperless antwortet ${r.status}`);
    return (blob ? r.blob() : r.json()) as Promise<T>;
  }

  private async _load(): Promise<void> {
    const c = this._config;
    try {
      const page = await this._get<{ results: PaperlessDoc[] }>(listUrl(c.url, c.tag));
      this._docs = page.results;
      this._error = "";
      const tagIds = [...c.tags!, ...page.results.flatMap((d) => d.tags)];
      const corrIds = page.results.map((d) => d.correspondent).filter((x): x is number => !!x);
      await Promise.all([
        this._names("tags", tagIds),
        this._names("correspondents", corrIds),
        ...page.results.map((d) => this._thumb(d.id)),
      ]);
    } catch (e) {
      this._error = `Paperless nicht erreichbar (${(e as Error).message})`;
    } finally {
      this._loading = false;
    }
  }

  /** Names are a nice-to-have: an object without view permission just stays unnamed. */
  private async _names(kind: "tags" | "correspondents", ids: number[]): Promise<void> {
    if (!ids.length) return;
    try {
      const page = await this._get<{ results: NamedItem[] }>(idsUrl(this._config.url, kind, ids));
      if (kind === "tags") {
        const m = new Map(this._tags);
        page.results.forEach((t) => m.set(t.id, t));
        this._tags = m;
      } else {
        const m = new Map(this._correspondents);
        page.results.forEach((t) => m.set(t.id, t.name));
        this._correspondents = m;
      }
    } catch {
      /* ignore */
    }
  }

  private async _thumb(id: number): Promise<void> {
    if (this._thumbs.has(id)) return;
    try {
      const b = await this._get<Blob>(`${this._config.url}/api/documents/${id}/thumb/`, true);
      this._thumbs = new Map(this._thumbs).set(id, URL.createObjectURL(b));
    } catch {
      /* no thumbnail: card shows a placeholder */
    }
  }

  private async _setTags(doc: PaperlessDoc, tags: number[]): Promise<void> {
    if (this._busy.has(doc.id)) return;
    this._busy = new Set(this._busy).add(doc.id);
    const c = this._config;
    try {
      const [domain, service] = splitService(c.service!);
      await this.hass.callService(domain, service, { id: doc.id, tags });
      const fresh = await this._get<PaperlessDoc>(
        `${c.url}/api/documents/${doc.id}/?fields=id,title,correspondent,created,tags`,
      ).catch(() => null);
      // Document may no longer be visible to the read token once untagged: that is success.
      if (fresh && !sameTags(fresh.tags, tags)) throw new Error("Tags wurden nicht übernommen");
      if (c.entity) {
        this.hass
          .callService("homeassistant", "update_entity", { entity_id: c.entity })
          .catch(() => undefined);
      }
      await this._load();
    } catch (e) {
      this._error = `Ändern fehlgeschlagen: ${(e as Error).message}`;
    } finally {
      const b = new Set(this._busy);
      b.delete(doc.id);
      this._busy = b;
    }
  }

  private _tagName(id: number): string {
    return this._tags.get(id)?.name ?? `#${id}`;
  }

  protected render() {
    const c = this._config;
    return html`
      <ha-card>
        <div class="head">
          <ha-icon icon="mdi:cash-clock"></ha-icon>
          <span class="title">${c.title ?? "Noch zu zahlen"}</span>
          <span class="count">${this._loading ? "…" : this._docs.length}</span>
          <ha-icon-button class="reload" @click=${() => this._load()} label="Neu laden">
            <ha-icon icon="mdi:refresh"></ha-icon>
          </ha-icon-button>
        </div>
        ${this._error ? html`<div class="error">${this._error}</div>` : nothing}
        ${!this._loading && !this._docs.length && !this._error
          ? html`<div class="empty">
              <ha-icon icon="mdi:check-circle-outline"></ha-icon>Alles bezahlt
            </div>`
          : nothing}
        <div class="list">${this._docs.map((d) => this._renderDoc(d))}</div>
        ${this._zoom ? this._renderZoom(this._zoom) : nothing}
      </ha-card>
    `;
  }

  private _renderDoc(d: PaperlessDoc) {
    const c = this._config;
    const busy = this._busy.has(d.id);
    const thumb = this._thumbs.get(d.id);
    const age = ageDays(d.created);
    return html`
      <div class="doc ${busy ? "busy" : ""}">
        <button class="thumb" @click=${() => (this._zoom = d)} aria-label="Vorschau vergrößern">
          ${thumb
            ? html`<img src=${thumb} alt="" />`
            : html`<ha-icon icon="mdi:file-document-outline"></ha-icon>`}
        </button>
        <div class="info">
          <div class="doc-title">${d.title}</div>
          <div class="meta">
            ${d.correspondent ? (this._correspondents.get(d.correspondent) ?? "") : ""}
            <span>${formatDate(d.created)}</span>
            ${age >= 14 ? html`<span class="old">seit ${age} Tagen</span>` : nothing}
          </div>
          <div class="chips">
            ${c.tags!.map((t) => {
              const on = d.tags.includes(t);
              const tag = this._tags.get(t);
              return html`<button
                class="chip ${on ? "on" : ""}"
                style=${on && tag?.color
                  ? `--chip:${tag.color};--chip-text:${tag.text_color ?? "#fff"}`
                  : ""}
                ?disabled=${busy}
                @click=${() => this._setTags(d, toggleTag(d.tags, t))}
              >
                ${this._tagName(t)}
              </button>`;
            })}
          </div>
        </div>
        <button
          class="paid"
          ?disabled=${busy || !d.tags.includes(c.paid_tag!)}
          @click=${() =>
            this._setTags(
              d,
              d.tags.filter((t) => t !== c.paid_tag),
            )}
        >
          <ha-icon icon=${busy ? "mdi:timer-sand" : "mdi:check-bold"}></ha-icon>
          Bezahlt
        </button>
      </div>
    `;
  }

  private _renderZoom(d: PaperlessDoc) {
    const thumb = this._thumbs.get(d.id);
    return html`
      <div class="zoom" @click=${() => (this._zoom = null)}>
        ${thumb ? html`<img src=${thumb} alt="" />` : nothing}
        <div class="zoom-title">${d.title}</div>
      </div>
    `;
  }

  static styles = css`
    ha-card {
      padding: 12px 16px 16px;
      position: relative;
    }
    .head {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 1.3rem;
      font-weight: 600;
    }
    .head .title {
      flex: 1;
    }
    .count {
      min-width: 32px;
      text-align: center;
      border-radius: 16px;
      padding: 2px 10px;
      background: var(--warning-color, #f4a100);
      color: #fff;
    }
    .error {
      margin: 8px 0;
      color: var(--error-color, #db4437);
    }
    .empty {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 24px 0 8px;
      color: var(--success-color, #43a047);
      font-size: 1.1rem;
    }
    .list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 12px;
    }
    .doc {
      display: grid;
      grid-template-columns: 96px 1fr auto;
      gap: 14px;
      align-items: center;
      padding: 10px;
      border-radius: 12px;
      background: var(--secondary-background-color);
    }
    .doc.busy {
      opacity: 0.55;
    }
    .thumb {
      width: 96px;
      height: 128px;
      padding: 0;
      border: none;
      border-radius: 8px;
      overflow: hidden;
      background: var(--card-background-color);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: zoom-in;
      --mdc-icon-size: 40px;
      color: var(--secondary-text-color);
    }
    .thumb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top;
    }
    .doc-title {
      font-size: 1.05rem;
      font-weight: 600;
      line-height: 1.3;
    }
    .meta {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 4px;
      color: var(--secondary-text-color);
    }
    .meta .old {
      color: var(--error-color, #db4437);
      font-weight: 600;
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 10px;
    }
    .chip {
      --chip: var(--primary-color);
      min-height: 40px;
      padding: 0 14px;
      border-radius: 20px;
      border: 2px solid var(--divider-color);
      background: transparent;
      color: var(--primary-text-color);
      font: inherit;
      cursor: pointer;
    }
    .chip.on {
      background: var(--chip);
      border-color: var(--chip);
      color: var(--chip-text, #fff);
    }
    .paid {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      min-width: 96px;
      min-height: 96px;
      border: none;
      border-radius: 14px;
      background: #2e7d32;
      color: #fff;
      font: inherit;
      font-weight: 600;
      cursor: pointer;
      --mdc-icon-size: 36px;
    }
    .paid:disabled,
    .chip:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .zoom {
      position: fixed;
      inset: 0;
      z-index: 10;
      background: rgba(0, 0, 0, 0.85);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 24px;
      color: #fff;
    }
    .zoom img {
      max-width: 100%;
      max-height: 85vh;
      border-radius: 8px;
      background: #fff;
    }
    @media (max-width: 600px) {
      .doc {
        grid-template-columns: 72px 1fr;
      }
      .thumb {
        width: 72px;
        height: 96px;
      }
      .paid {
        grid-column: 1 / -1;
        flex-direction: row;
        justify-content: center;
        min-height: 48px;
      }
    }
  `;
}

if (!customElements.get("paperless-pay-card")) {
  customElements.define("paperless-pay-card", PaperlessPayCard);
}

(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: "paperless-pay-card",
  name: "Paperless: noch zu zahlen",
  description: "Dokumente aus Paperless-ngx mit Zahl-Tag, Vorschau, Bezahlt-Knopf und Tag-Chips.",
});
