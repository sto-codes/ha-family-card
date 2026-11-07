/* ------------------------------------------------------------------ */
/*  Full-screen PDF view for paperless-pay-card. The card appends this  */
/*  element to <body>; it opens a native modal <dialog> (top layer), so */
/*  it sits above Home Assistant and browser_mod popups, and removes    */
/*  itself when closed.                                                 */
/* ------------------------------------------------------------------ */

import { LitElement, html, css, nothing } from "lit";
import { property, state, query } from "lit/decorators.js";
import { nextZoom } from "./paperless";
import { renderPdf } from "./paperless-pdf";

export class PaperlessPdfViewer extends LitElement {
  @property() public heading = "";
  /** Object URL of the first-page thumbnail, shown until the PDF is rendered. */
  @property() public thumb?: string;
  /** Fetches the PDF. */
  @property({ attribute: false }) public load?: () => Promise<ArrayBuffer>;

  @state() private _pages: HTMLCanvasElement[] = [];
  @state() private _total = 0;
  @state() private _state: "loading" | "done" | "error" = "loading";
  @state() private _zoom = 100;
  @query("dialog") private _dialog!: HTMLDialogElement;
  private _closed = false;

  protected firstUpdated(): void {
    this._dialog.showModal();
    // iPad/iOS: a pull that the page list cannot scroll would reach the web view
    // and trigger its pull-to-refresh (reloads the whole dashboard)
    this._dialog.addEventListener("touchmove", this._guardPull, { passive: false });
    this._render();
  }

  private _guardPull = (e: TouchEvent): void => {
    const pages = this.renderRoot.querySelector<HTMLElement>(".pages");
    const inPages = !!pages && e.composedPath().includes(pages);
    if (!inPages || pages!.scrollHeight <= pages!.clientHeight) e.preventDefault();
  };

  private async _render(): Promise<void> {
    try {
      if (!this.load) throw new Error("no loader");
      await renderPdf(
        await this.load(),
        Math.min(window.innerWidth, 1400),
        (canvas, _i, total) => {
          this._total = total;
          this._pages = [...this._pages, canvas];
        },
        () => this._closed,
      );
      if (!this._closed) this._state = "done";
    } catch {
      // offline or pdf.js unavailable: the first-page thumbnail stays visible
      if (!this._closed) this._state = "error";
    }
  }

  private _close(): void {
    this._closed = true;
    this._dialog?.removeEventListener("touchmove", this._guardPull);
    this._dialog?.close();
    this.remove();
  }

  private _count(): string {
    if (this._total) {
      const done = this._pages.length < this._total ? `${this._pages.length} von ` : "";
      return `${done}${this._total} ${this._total === 1 ? "Seite" : "Seiten"}`;
    }
    return this._state === "error" ? "nur Seite 1 (PDF nicht ladbar)" : "lädt …";
  }

  protected render() {
    return html`
      <dialog @cancel=${(e: Event) => (e.preventDefault(), this._close())}>
        <div class="bar">
          <div class="title">${this.heading}<span>${this._count()}</span></div>
          <button
            ?disabled=${this._zoom === 100}
            @click=${() => (this._zoom = nextZoom(this._zoom, -1))}
            aria-label="Verkleinern"
          >
            <ha-icon icon="mdi:magnify-minus-outline"></ha-icon>
          </button>
          <button @click=${() => (this._zoom = nextZoom(this._zoom, 1))} aria-label="Vergrößern">
            <ha-icon icon="mdi:magnify-plus-outline"></ha-icon>
          </button>
          <button @click=${() => this._close()} aria-label="Schließen">
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>
        <div class="pages" style="--z:${this._zoom / 100}">
          ${this._pages.length
            ? this._pages
            : this.thumb
              ? html`<img src=${this.thumb} alt="" />`
              : nothing}
        </div>
      </dialog>
    `;
  }

  static styles = css`
    dialog {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      max-width: none;
      max-height: none;
      margin: 0;
      padding: 0;
      border: none;
      background: rgba(0, 0, 0, 0.94);
      color: #fff;
      overscroll-behavior: none;
      font-family: var(--paper-font-body1_-_font-family, sans-serif);
    }
    dialog[open] {
      display: flex;
      flex-direction: column;
    }
    dialog::backdrop {
      background: rgba(0, 0, 0, 0.6);
    }
    .bar {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px 10px 18px;
    }
    .title {
      flex: 1;
      min-width: 0;
      font-weight: 600;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .title span {
      margin-left: 12px;
      font-weight: 400;
      opacity: 0.7;
    }
    button {
      width: 52px;
      height: 52px;
      border: none;
      border-radius: 26px;
      background: rgba(255, 255, 255, 0.12);
      color: #fff;
      cursor: pointer;
      --mdc-icon-size: 28px;
    }
    button:disabled {
      opacity: 0.35;
    }
    .pages {
      flex: 1;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      /* scrolling past the first/last page must not reload the dashboard */
      overscroll-behavior: contain;
      padding: 0 12px 24px;
      display: flex;
      flex-direction: column;
      /* "safe": when zoomed wider than the screen, the left edge stays reachable */
      align-items: safe center;
      gap: 12px;
    }
    .pages canvas,
    .pages img {
      /* 100 % = page fits the width (at most 900 px), zoom multiplies that */
      width: calc(min(100%, 900px) * var(--z, 1));
      max-width: none;
      height: auto;
      flex: none;
      background: #fff;
      border-radius: 4px;
    }
  `;
}

if (!customElements.get("paperless-pdf-viewer")) {
  customElements.define("paperless-pdf-viewer", PaperlessPdfViewer);
}
