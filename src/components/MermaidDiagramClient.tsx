"use client";

import { useEffect, useState } from "react";
import { MermaidDiagram } from "./MermaidDiagram";

/**
 * Renders Mermaid only after mount so server and client output match (avoids hydration errors).
 */
export function MermaidDiagramClient({ source }: { source: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <pre className="my-4 overflow-x-auto rounded-xl border border-slate-200 bg-slate-900 p-4 text-sm text-slate-100">
        <code>{source}</code>
      </pre>
    );
  }

  return <MermaidDiagram source={source} />;
}
