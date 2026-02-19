"use client";

import { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  ReactFlowProvider,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";
import { DomainDetailPanel } from "./DomainDetailPanel";
import { TaxonomyTree } from "./TaxonomyTree";
import { cn } from "@/lib/cn";
import { getSectorStyle, SECTOR_COLORS } from "@/lib/sectorColors";

const NODE_WIDTH = 180;
const NODE_HEIGHT = 44;
const GAP_X = 72;
const GAP_Y = 32;

/** Build a non-overlapping tree layout from taxonomy parentId; each root gets a column, children spread under. */
type GraphNode = { id: string; label: string; parentId: string | null; position: { x: number; y: number }; sector?: string; tier?: string };
function buildLayout(nodes: GraphNode[], _edges: { source: string; target: string }[]) {
  const nodeIds = new Set(nodes.map((n) => n.id));
  const children = new Map<string, string[]>();
  for (const n of nodes) {
    if (n.parentId && nodeIds.has(n.parentId)) {
      if (!children.has(n.parentId)) children.set(n.parentId, []);
      children.get(n.parentId)!.push(n.id);
    }
  }
  const roots = nodes.filter((n) => !n.parentId || !nodeIds.has(n.parentId));

  const subtreeWidth = new Map<string, number>();
  function getWidth(id: string): number {
    if (subtreeWidth.has(id)) return subtreeWidth.get(id)!;
    const kids = children.get(id) ?? [];
    const w = kids.length === 0 ? 1 : Math.max(1, kids.reduce((sum, k) => sum + getWidth(k), 0));
    subtreeWidth.set(id, w);
    return w;
  }
  roots.forEach((r) => getWidth(r.id));

  const position = new Map<string, { x: number; y: number }>();
  function place(id: string, depth: number, slotStart: number): number {
    const kids = children.get(id) ?? [];
    let childSlot = slotStart;
    const childXPositions: number[] = [];
    for (const k of kids) {
      childXPositions.push(childSlot * (NODE_WIDTH + GAP_X));
      childSlot = place(k, depth + 1, childSlot);
    }
    const nodeX =
      childXPositions.length > 0
        ? (childXPositions[0]! + childXPositions[childXPositions.length - 1]! + NODE_WIDTH) / 2 - NODE_WIDTH / 2
        : slotStart * (NODE_WIDTH + GAP_X);
    const nodeY = depth * (NODE_HEIGHT + GAP_Y);
    position.set(id, { x: nodeX, y: nodeY });
    return kids.length > 0 ? childSlot : slotStart + 1;
  }

  let slot = 0;
  for (const r of roots) {
    slot = place(r.id, 0, slot);
    slot += 1; // gap between root trees
  }

  return nodes.map((n) => ({
    ...n,
    position: position.get(n.id) ?? { x: 0, y: 0 },
    data: { label: n.label },
  }));
}

function MapExplorerInner({ initialDomainId }: { initialDomainId?: string | null }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedId, setSelectedId] = useState<string | null>(initialDomainId ?? null);
  const [focusId, setFocusId] = useState<string | null>(initialDomainId ?? null);
  const [treeSearch, setTreeSearch] = useState("");
  const [graphLoading, setGraphLoading] = useState(true);

  const loadGraph = useCallback(async () => {
    setGraphLoading(true);
    const params = new URLSearchParams();
    if (focusId) params.set("focusId", focusId);
    if (treeSearch) params.set("tags", treeSearch);
    const res = await fetch(`/api/domains/graph?${params}`);
    const data = await res.json();
    const layouted = buildLayout(data.nodes, data.edges);
    setNodes(
      layouted.map((n: GraphNode & { position: { x: number; y: number }; data?: { label: string } }) => ({
        id: n.id,
        type: "default",
        position: n.position,
        data: { label: n.label },
        style: { width: NODE_WIDTH, height: NODE_HEIGHT },
        className: cn(
          "rounded-xl border-2 shadow-md px-3 py-2 flex items-center justify-center text-center",
          getSectorStyle(n.sector ?? "", n.tier ?? "child"),
          selectedId === n.id && "ring-2 ring-indigo-500 ring-offset-2"
        ),
      }))
    );
    setEdges(
      data.edges.map((e: { id: string; source: string; target: string; type: string }) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        label: e.type?.replace("_", " "),
        type: "smoothstep",
      }))
    );
    setGraphLoading(false);
  }, [focusId, treeSearch, setNodes, setEdges, selectedId]);

  useEffect(() => {
    loadGraph();
  }, [loadGraph]);

  const onNodeClick = useCallback((_e: React.MouseEvent, node: Node) => {
    setSelectedId(node.id);
  }, []);

  return (
    <div className="flex h-[calc(100vh-0px)] w-full bg-slate-50/50">
      <div className="w-64 border-r border-slate-200/80 bg-white flex flex-col shrink-0 shadow-epic">
        <div className="p-3 border-b border-slate-200/80">
          <input
            type="search"
            placeholder="Search taxonomy..."
            className="epic-input py-2 text-sm"
            value={treeSearch}
            onChange={(e) => setTreeSearch(e.target.value)}
          />
        </div>
        <TaxonomyTree
          onSelect={(id) => {
            setSelectedId(id);
            setFocusId(id);
          }}
          search={treeSearch}
        />
        <div className="p-3 border-t border-slate-200/80 text-xs text-slate-500 bg-slate-50/50">
          Focus: {focusId ? "on" : "all"} · Click node for details
        </div>
      </div>
      <div className="flex-1 relative bg-slate-100/50">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          fitView
          fitViewOptions={{ padding: 0.25, minZoom: 0.15, maxZoom: 1.2 }}
          minZoom={0.15}
          maxZoom={1.5}
        >
          <Background />
          <Controls />
          <MiniMap />
          <Panel position="top-left" className="epic-card p-3 text-sm space-y-2 max-w-xs shadow-epic-md">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={!!focusId}
                onChange={(e) => setFocusId(e.target.checked ? selectedId ?? null : null)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              Focus mode (selected node + neighbors)
            </label>
            <div className="text-xs text-slate-600 border-t border-slate-200 pt-2 mt-2">
              <span className="font-semibold text-slate-700 block mb-1.5">Sectors</span>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(SECTOR_COLORS).slice(0, 6).map(([name, style]) => (
                  <span key={name} className={`px-2 py-0.5 rounded-md text-xs font-medium ${style.bg} ${style.text}`} title={name}>
                    {name.split(" ")[0]}
                  </span>
                ))}
              </div>
            </div>
          </Panel>
        </ReactFlow>
        {graphLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
            <span className="text-slate-600 font-medium">Loading graph...</span>
          </div>
        )}
      </div>
      <div className="w-96 border-l border-slate-200/80 bg-white flex flex-col shrink-0 overflow-hidden shadow-epic">
        {selectedId ? (
          <DomainDetailPanel
            domainId={selectedId}
            onClose={() => setSelectedId(null)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 p-8 text-center">
            <p className="text-slate-500 text-sm">Select a domain from the tree or graph to view details.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function MapExplorer({ initialDomainId }: { initialDomainId?: string | null } = {}) {
  return (
    <ReactFlowProvider>
      <MapExplorerInner initialDomainId={initialDomainId} />
    </ReactFlowProvider>
  );
}
