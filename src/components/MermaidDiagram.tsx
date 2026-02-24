"use client";

import { useEffect, useState } from "react";
import { Maximize2, X } from "lucide-react";

/**
 * Renders a Mermaid diagram from source. Runs on the client.
 * Supports enlarge: click the expand button to view in a modal.
 */
export function MermaidDiagram({ source }: { source: string }) {
  const [error, setError] = useState<string | null>(null);
  const [svg, setSvg] = useState<string | null>(null);
  const [enlarged, setEnlarged] = useState(false);

  useEffect(() => {
    if (!source?.trim()) return;
    const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;
    let cancelled = false;

    async function render() {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "neutral",
          securityLevel: "loose",
          flowchart: { useMaxWidth: true },
        });
        const { svg: result } = await mermaid.render(id, source.trim());
        if (!cancelled && result) setSvg(result);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to render diagram");
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [source]);

  useEffect(() => {
    if (!enlarged) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setEnlarged(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enlarged]);

  if (error) {
    return (
      <div className="my-4 rounded-xl border-2 border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <p className="font-medium">Diagram could not be rendered</p>
        <p className="mt-1">{error}</p>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-900 p-4 text-xs text-slate-100">
          {source}
        </pre>
      </div>
    );
  }

  if (svg) {
    return (
      <>
        <div className="my-6 flex flex-col items-stretch gap-2">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setEnlarged(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 shadow-sm hover:bg-slate-50 hover:border-slate-300"
              aria-label="Enlarge diagram"
            >
              <Maximize2 className="h-3.5 w-3.5" aria-hidden />
              Enlarge
            </button>
          </div>
          <div
            className="flex justify-center overflow-x-auto rounded-xl border-2 border-slate-200 bg-white p-4 [&_svg]:max-w-full [&_svg]:h-auto"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        </div>
        {enlarged && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={() => setEnlarged(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Enlarged diagram"
          >
            <div
              className="relative flex min-h-[80vh] min-w-[80vw] max-h-[95vh] max-w-[95vw] flex-col overflow-auto rounded-xl border-2 border-slate-200 bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setEnlarged(false)}
                className="absolute right-2 top-2 z-10 rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close enlarged diagram"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
              <div className="flex min-h-0 flex-1 items-center justify-center p-6 pt-12 [&_svg]:max-h-full [&_svg]:max-w-full [&_svg]:object-contain">
                <div
                  className="h-full w-full [&_svg]:max-h-full [&_svg]:max-w-full [&_svg]:object-contain"
                  dangerouslySetInnerHTML={{ __html: svg }}
                />
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="my-6 flex min-h-[120px] items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50">
      <span className="text-sm text-slate-500">Loading diagram…</span>
    </div>
  );
}
