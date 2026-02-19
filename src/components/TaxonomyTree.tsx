"use client";

import { useEffect, useState } from "react";
import { ChevronRight, ChevronDown, Folder, FolderOpen } from "lucide-react";
import { cn } from "@/lib/cn";
import { getSectorTheme } from "@/lib/sectorColors";

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
        const allIds = new Set<string>();
        function collect(n: TreeNode) {
          allIds.add(n.id);
          n.children?.forEach(collect);
        }
        data.forEach(collect);
        setOpen(allIds);
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
    const theme = getSectorTheme(node.rootName ?? "");
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
          {hasChildren ? (
            isOpen ? <FolderOpen className={cn("w-4 h-4", theme.accent)} /> : <Folder className={cn("w-4 h-4", theme.accent)} />
          ) : null}
          <span className={cn("truncate", theme.text)}>{node.name}</span>
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
