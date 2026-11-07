/* ------------------------------------------------------------------ */
/*  Renders a PDF into canvases with pdf.js. pdf.js is not bundled: it  */
/*  is loaded from the CDN the first time a preview opens, so the card  */
/*  bundle stays small. The worker is started from a same-origin blob   */
/*  that imports the CDN worker (cross-origin workers are not allowed). */
/* ------------------------------------------------------------------ */

import { pdfjsUrls, renderScale } from "./paperless";

let pdfjs: Promise<any> | undefined;

function loadPdfjs(): Promise<any> {
  if (!pdfjs) {
    const { lib, worker } = pdfjsUrls();
    pdfjs = (import(/* webpackIgnore: true */ lib) as Promise<any>).then((m) => {
      const src = URL.createObjectURL(
        new Blob([`import ${JSON.stringify(worker)};`], { type: "text/javascript" }),
      );
      m.GlobalWorkerOptions.workerPort = new Worker(src, { type: "module" });
      return m;
    });
    pdfjs.catch(() => (pdfjs = undefined));
  }
  return pdfjs;
}

/**
 * Renders every page of `data` as a canvas `targetWidth` CSS pixels wide.
 * `onPage` gets each canvas as soon as it is ready, so the first page shows early.
 * Returns the page count.
 */
export async function renderPdf(
  data: ArrayBuffer,
  targetWidth: number,
  onPage: (canvas: HTMLCanvasElement, index: number, total: number) => void,
  cancelled: () => boolean = () => false,
): Promise<number> {
  const lib = await loadPdfjs();
  const doc = await lib.getDocument({ data, isEvalSupported: false }).promise;
  try {
    for (let i = 1; i <= doc.numPages && !cancelled(); i++) {
      const page = await doc.getPage(i);
      const base = page.getViewport({ scale: 1 });
      const viewport = page.getViewport({
        scale: renderScale(base.width, targetWidth, window.devicePixelRatio),
      });
      const canvas = document.createElement("canvas");
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      await page.render({ canvasContext: canvas.getContext("2d")!, viewport }).promise;
      page.cleanup();
      if (!cancelled()) onPage(canvas, i, doc.numPages);
    }
    return doc.numPages;
  } finally {
    doc.destroy();
  }
}
