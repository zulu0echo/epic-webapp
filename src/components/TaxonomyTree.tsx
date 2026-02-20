"use client";

import { useEffect, useState } from "react";
import { ChevronRight, ChevronDown, Folder, FolderOpen } from "lucide-react";
import { cn } from "@/lib/cn";
import { getSectorTheme, getTreeTextColor } from "@/lib/sectorColors";
import { getDomainIcon } from "@/lib/domainIcons";

type TreeNode = {
  id: string;
  name: string;
  rootName?: string;
  children?: TreeNode[];
};

export function TaxonomyTree({
  onSelect,
  search,
}: {
  onSelect: (id: string) => void;
  search: string;
}) {
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [open, setOpen] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch(`/api/domains/tree?q=${encodeURIComponent(search)}`)
      .then((r) => r.json())
      .then((data) => {
        setTree(data);
        setOpen(new Set());
      });
  }, [search]);

  const toggle = (id: string) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const renderNode = (node: TreeNode, depth: number) => {
    const hasChildren = node.children && node.children.length > 0;
    const isOpen = open.has(node.id);
    const rootName = node.rootName ?? "";
    const theme = getSectorTheme(rootName || node.id);
    const textColor = getTreeTextColor(rootName, depth);
    return (
      <div key={node.id} className="flex flex-col">
        <div
          className={cn(
            "flex items-center gap-1.5 py-1.5 px-2 rounded-r-lg cursor-pointer text-sm transition-colors border-l-4",
            theme.border,
            "hover:bg-slate-50"
          )}
          style={{ paddingLeft: depth * 14 + 8 }}
          onClick={() => onSelect(node.id)}
        >
          <button
            className={cn("p-0.5 shrink-0 rounded", theme.accent, theme.accentHover)}
            onClick={(e) => {
              e.stopPropagation();
              toggle(node.id);
            }}
          >
            {hasChildren ? (
              isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
            ) : (
              <span className="w-4 inline-block" />
            )}
          </button>
          {(() => {
            const DomainIcon = getDomainIcon(node.id);
            return <DomainIcon className={cn("w-4 h-4 shrink-0", theme.accent)} aria-hidden />;
          })()}
          <span className={cn("truncate font-medium", depth > 0 && theme.accentHover)} style={{ color: textColor }}>{node.name}</span>
        </div>
        {hasChildren && isOpen && (
          <div>
            {node.children!.map((c) => renderNode(c, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-auto py-2">
      {tree.map((node) => renderNode(node, 0))}
    </div>
  );
}
