"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/cn";
import { MermaidDiagramClient } from "@/components/MermaidDiagramClient";

const proseClasses = [
  "prose prose-slate max-w-none",
  "prose-headings:font-serif prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-epic-ink",
  "prose-h1:text-2xl prose-h1:sm:text-3xl prose-h1:mt-0 prose-h1:mb-4 prose-h1:pb-2 prose-h1:border-b-2 prose-h1:border-slate-300",
  "prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-3 prose-h2:pb-1 prose-h2:border-b prose-h2:border-slate-200 prose-h2:font-semibold",
  "prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2 prose-h3:text-slate-800 prose-h3:font-semibold",
  "prose-h4:text-base prose-h4:mt-4 prose-h4:mb-1.5 prose-h4:font-semibold prose-h4:text-slate-800",
  "prose-p:my-3 prose-p:leading-relaxed prose-p:text-slate-600",
  "prose-p:first-of-type:mt-0 prose-p:first-of-type:text-[1.0625rem] prose-p:first-of-type:text-slate-700 prose-p:first-of-type:leading-7",
  "prose-ul:my-4 prose-ul:pl-6 prose-ul:space-y-1.5",
  "prose-ol:my-4 prose-ol:pl-6 prose-ol:space-y-1.5",
  "prose-li:leading-relaxed prose-li:text-slate-600",
  "prose-strong:font-semibold prose-strong:text-slate-800",
  "prose-a:text-epic-navy prose-a:no-underline hover:prose-a:underline prose-a:font-medium prose-a:decoration-epic-navy-muted",
  "prose-blockquote:border-l-4 prose-blockquote:border-emerald-500 prose-blockquote:bg-slate-50 prose-blockquote:py-2 prose-blockquote:pl-4 prose-blockquote:pr-4 prose-blockquote:my-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-slate-700",
  "prose-code:rounded prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:font-mono prose-code:text-slate-800 prose-code:before:content-none prose-code:after:content-none",
  "prose-pre:rounded-xl prose-pre:border prose-pre:border-slate-200 prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:overflow-x-auto prose-pre:my-4",
  "prose-pre_code:bg-transparent prose-pre_code:p-0 prose-pre_code:text-inherit prose-pre_code:before:content-none prose-pre_code:after:content-none",
  "prose-hr:border-slate-200 prose-hr:my-8",
  "prose-table:my-6 prose-table:w-full prose-table:border-collapse prose-table:text-sm prose-table:rounded-lg prose-table:overflow-hidden prose-table:border prose-table:border-slate-300 prose-table:shadow-sm",
  "prose-thead:bg-slate-200 prose-th:border prose-th:border-slate-300 prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:font-semibold prose-th:text-slate-800",
  "prose-tbody_tr:border-b prose-tbody_tr:border-slate-200 prose-tbody_tr:last:border-b-0",
  "prose-td:border prose-td:border-slate-200 prose-td:px-4 prose-td:py-3 prose-td:text-slate-600 prose-td:align-top",
].join(" ");

export function MarkdownContent({
  content,
  className,
  /** When true, render the first h1 in the content as h2 to avoid duplicate top-level headings. */
  demoteFirstHeading,
}: {
  content: string;
  className?: string;
  demoteFirstHeading?: boolean;
}) {
  const components: import("react-markdown").Components = {
    ...(demoteFirstHeading
      ? {
          h1: ({ children }: { children?: React.ReactNode }) => (
            <h2 className="font-serif text-xl font-semibold tracking-tight text-epic-ink mt-10 mb-3 pb-1 border-b-2 border-slate-200">
              {children}
            </h2>
          ),
        }
      : {}),
    pre: ({ node, children }) => {
      let source = "";
      let isMermaid = false;
      try {
        if (node && "children" in node && Array.isArray(node.children) && node.children[0]) {
          const first = node.children[0] as { properties?: { className?: string | string[] }; children?: Array<{ type?: string; value?: string }> };
          const cls = first.properties?.className;
          const className = Array.isArray(cls) ? cls.join(" ") : String(cls ?? "");
          if (className.includes("mermaid")) {
            isMermaid = true;
            const textParts = (first.children ?? []).map((c) => ("value" in c ? c.value : "") ?? "");
            source = textParts.join("");
          }
        }
        if (!isMermaid && children != null) {
          const child = Array.isArray(children) ? children[0] : children;
          if (child && typeof child === "object" && "props" in child) {
            const props = (child as React.ReactElement).props;
            const cls = (props?.className as string) ?? "";
            if (cls.includes("mermaid")) {
              isMermaid = true;
              source = props.children != null ? String(props.children) : "";
            }
          }
        }
      } catch {
        /* use default pre */
      }
      if (isMermaid && source.trim()) {
        return <MermaidDiagramClient source={source} />;
      }
      return <pre className="rounded-xl border border-slate-200 bg-slate-900 overflow-x-auto my-4 p-4 text-slate-100">{children}</pre>;
    },
  };

  return (
    <div className={cn(proseClasses, className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
