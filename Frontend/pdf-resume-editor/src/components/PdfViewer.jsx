import { useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function PdfViewer({ pdfUrl }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!pdfUrl) return;

   
    if (
      typeof pdfUrl !== "string" ||
      (!pdfUrl.startsWith("blob:") && !pdfUrl.includes(".pdf"))
    ) {
      console.error(" Not a valid PDF URL:", pdfUrl);
      return;
    }

    let cancelled = false;

    const loadPdf = async () => {
      try {
        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        if (cancelled) return;

        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1 });

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        await page.render({
          canvasContext: ctx,
          viewport,
        }).promise;
      } catch (err) {
        console.error(" PDF render error:", err);
      }
    };

    loadPdf();
    return () => (cancelled = true);
  }, [pdfUrl]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: "block",
        margin: "0 auto",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
}
