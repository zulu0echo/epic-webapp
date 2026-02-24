"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Handle,
  Position,
  type Node,
  type Edge,
  type NodeProps,
  ReactFlowProvider,
} from "reactflow";
function FlowApiBridge({
  setApi,
}: {
  setApi: (api: {
    fitView: (opts?: { nodes?: Node[]; padding?: number; duration?: number; maxZoom?: number }) => void;
    getNodes: () => Node[];
  } | null) => void;
}) {
  const { fitView, getNodes } = useReactFlow();
  useEffect(() => {
    setApi({ fitView, getNodes });
    return () => setApi(null);
  }, [fitView, getNodes, setApi]);
  return null;
}
import "reactflow/dist/style.css";
import { Search, RotateCcw, PanelLeftOpen, X } from "lucide-react";
import { DomainDetailPanel } from "./DomainDetailPanel";
import { TaxonomyTree } from "./TaxonomyTree";
import { cn } from "@/lib/cn";
import { getSectorStyle, getSectorTheme, getSectorEdgeColor, DOMAIN_THEMES } from "@/lib/sectorColors";
import { getDomainIcon } from "@/lib/domainIcons";
import { useIsMobileDevice } from "@/hooks/useIsMobileDevice";

const NODE_WIDTH = 160;
const NODE_HEIGHT = 40;
const GAP_X = 48;
const GAP_Y = 24;
const CATEGORY_NAMES = Object.keys(DOMAIN_THEMES);

/** Custom node with domain icon + label for the map. */
function DomainNode({
  data,
}: NodeProps<{ label: string; slug: string; className?: string }>) {
  const Icon = getDomainIcon(data.slug ?? "");
  return (
    <div
      className={data.className ?? ""}
      style={{
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "8px 12px",
      }}
    >
      <Handle type="target" position={Position.Left} className="!w-2 !h-2 !border-2" />
      <Icon className="w-5 h-5 shrink-0 opacity-90" aria-hidden />
      <span className="truncate text-center font-medium text-sm leading-tight">
        {data.label}
      </span>
      <Handle type="source" position={Position.Right} className="!w-2 !h-2 !border-2" />
    </div>
  );
}

const nodeTypes = { domainNode: DomainNode };

/** Build a vertical tree layout: roots on the left, children to the right; siblings stacked vertically. */
type GraphNode = {
  id: string;
  label: string;
  parentId: string | null;
  position: { x: number; y: number };
  sector?: string;
  tier?: string;
};
function buildLayout(
  nodes: GraphNode[],
  _edges: { source: string; target: string }[]
) {
  const nodeIds = new Set(nodes.map((n) => n.id));
  const children = new Map<string, string[]>();
  for (const n of nodes) {
    if (n.parentId && nodeIds.has(n.parentId)) {
      if (!children.has(n.parentId)) children.set(n.parentId, []);
      children.get(n.parentId)!.push(n.id);
    }
  }
  const roots = nodes.filter((n) => !n.parentId || !nodeIds.has(n.parentId));

  const subtreeHeight = new Map<string, number>();
  function getHeight(id: string): number {
    if (subtreeHeight.has(id)) return subtreeHeight.get(id)!;
    const kids = children.get(id) ?? [];
    const h =
      kids.length === 0
        ? 1
        : Math.max(1, kids.reduce((sum, k) => sum + getHeight(k), 0));
    subtreeHeight.set(id, h);
    return h;
  }
  roots.forEach((r) => getHeight(r.id));

  const position = new Map<string, { x: number; y: number }>();
  function place(id: string, depth: number, slotStart: number): number {
    const kids = children.get(id) ?? [];
    let childSlot = slotStart;
    const childYPositions: number[] = [];
    for (const k of kids) {
      childYPositions.push(childSlot * (NODE_HEIGHT + GAP_Y));
      childSlot = place(k, depth + 1, childSlot);
    }
    const nodeX = depth * (NODE_WIDTH + GAP_X);
    const nodeY =
      childYPositions.length > 0
        ? (childYPositions[0]! +
            childYPositions[childYPositions.length - 1]! +
            NODE_HEIGHT) /
            2 -
          NODE_HEIGHT / 2
        : slotStart * (NODE_HEIGHT + GAP_Y);
    position.set(id, { x: nodeX, y: nodeY });
    return kids.length > 0 ? childSlot : slotStart + 1;
  }

  let slot = 0;
  for (const r of roots) {
    slot = place(r.id, 0, slot);
    slot += 1;
  }

  return nodes.map((n) => ({
    ...n,
    position: position.get(n.id) ?? { x: 0, y: 0 },
    data: { label: n.label },
  }));
}

function MapExplorerInner({
  initialDomainId,
}: {
  initialDomainId?: string | null;
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialDomainId ?? null
  );
  const [treeSearch, setTreeSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<Set<string>>(new Set());
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const isMobile = useIsMobileDevice(1024);
  const [graphLoading, setGraphLoading] = useState(true);
  const [rawNodes, setRawNodes] = useState<GraphNode[]>([]);
  const [rawEdges, setRawEdges] = useState<
    { id: string; source: string; target: string; type: string }[]
  >([]);
  const flowApiRef = useRef<{
    fitView: (opts?: { nodes?: Node[]; padding?: number; duration?: number; maxZoom?: number }) => void;
    getNodes: () => Node[];
  } | null>(null);
  const hasInitialFitRef = useRef(false);
  const setFlowApi = useCallback(
    (api: typeof flowApiRef.current) => {
      flowApiRef.current = api;
    },
    []
  );

  const toggleCategory = useCallback((name: string) => {
    setCategoryFilter((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }, []);

  const fetchGraph = useCallback(async () => {
    setGraphLoading(true);
    try {
      const params = new URLSearchParams();
      if (treeSearch) params.set("tags", treeSearch);
      const res = await fetch(`/api/domains/graph?${params}`);
      const data = await res.json();
      const apiNodes = Array.isArray(data?.nodes) ? data.nodes : [];
      const apiEdges = Array.isArray(data?.edges) ? data.edges : [];
      setRawNodes(apiNodes);
      setRawEdges(apiEdges);
    } catch {
      setRawNodes([]);
      setRawEdges([]);
    } finally {
      setGraphLoading(false);
    }
  }, [treeSearch]);

  useEffect(() => {
    fetchGraph();
  }, [fetchGraph]);

  const applyFilterAndLayout = useCallback(() => {
    let filtered = rawNodes;
    if (categoryFilter.size > 0) {
      filtered = rawNodes.filter(
        (n) => n.sector && categoryFilter.has(n.sector)
      );
    }
    const filteredEdgeList = rawEdges.filter(
      (e) =>
        filtered.some((n) => n.id === e.source) &&
        filtered.some((n) => n.id === e.target)
    );
    const layouted = buildLayout(filtered, filteredEdgeList);
    const filteredIds = new Set(layouted.map((n) => n.id));
    const visibleEdges = rawEdges.filter(
      (e) => filteredIds.has(e.source) && filteredIds.has(e.target)
    );
    const parentChildEdges: { id: string; source: string; target: string; type: string }[] = [];
    for (const n of layouted) {
      if (n.parentId && filteredIds.has(n.parentId)) {
        parentChildEdges.push({
          id: `taxonomy-${n.id}`,
          source: n.parentId,
          target: n.id,
          type: "subdomain",
        });
      }
    }
    const nodeIdToSector = new Map(layouted.map((n) => [n.id, n.sector ?? ""]));
    const allEdges = [...visibleEdges, ...parentChildEdges];

    setNodes(
      layouted.map((n) => ({
        id: n.id,
        type: "domainNode",
        position: n.position,
        data: {
          label: n.label,
          slug: n.id,
          className: cn(
            "rounded-xl border-2 shadow-md transition-all duration-200",
            getSectorStyle(n.id ?? "", n.tier ?? "child"),
            selectedId === n.id && "ring-2 ring-offset-2 shadow-lg",
            selectedId === n.id && getSectorTheme(n.id ?? "").ring
          ),
        },
        style: {
          width: NODE_WIDTH,
          height: NODE_HEIGHT,
          transition: "opacity 0.2s ease, filter 0.2s ease",
        },
      }))
    );
    setEdges(
      allEdges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        label: e.type === "subdomain" ? "" : e.type?.replace("_", " "),
        type: "smoothstep",
        animated: false,
        style: {
          transition: "opacity 0.2s ease",
          stroke: getSectorEdgeColor(
            e.type === "subdomain"
              ? nodeIdToSector.get(e.target) ?? ""
              : nodeIdToSector.get(e.source) ?? ""
          ),
        },
      }))
    );
  }, [
    rawNodes,
    rawEdges,
    categoryFilter,
    selectedId,
    setNodes,
    setEdges,
  ]);

  useEffect(() => {
    if (rawNodes.length === 0 && rawEdges.length === 0) {
      setNodes([]);
      setEdges([]);
      return;
    }
    applyFilterAndLayout();
  }, [rawNodes, rawEdges, applyFilterAndLayout, setNodes, setEdges]);

  const neighborSet = useMemo(() => {
    if (!hoveredId) return null;
    const set = new Set<string>([hoveredId]);
    for (const e of edges) {
      if (e.source === hoveredId) set.add(e.target);
      if (e.target === hoveredId) set.add(e.source);
    }
    return set;
  }, [hoveredId, edges]);

  const highlightEdges = useMemo(() => {
    if (!neighborSet) return null;
    const set = new Set<string>();
    for (const e of edges) {
      if (neighborSet.has(e.source) && neighborSet.has(e.target)) {
        set.add(e.id);
      }
    }
    return set;
  }, [neighborSet, edges]);

  const nodesWithVisibility = useMemo(() => {
    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dimOpacity = reducedMotion ? 1 : 0.35;
    return nodes.map((node) => {
      const isHighlight =
        !neighborSet ||
        neighborSet.has(node.id) ||
        (selectedId && node.id === selectedId);
      const opacity = isHighlight ? 1 : dimOpacity;
      return {
        ...node,
        style: {
          ...node.style,
          opacity,
          ...(isHighlight ? {} : { filter: "grayscale(0.15)" }),
        },
      };
    });
  }, [nodes, neighborSet, selectedId]);

  const edgesWithVisibility = useMemo(() => {
    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dimOpacity = reducedMotion ? 1 : 0.25;
    return edges.map((edge) => {
      const isHighlight =
        !highlightEdges ||
        highlightEdges.has(edge.id) ||
        (selectedId &&
          (edge.source === selectedId || edge.target === selectedId));
      const edgeStyle = {
        ...(edge.style as Record<string, unknown>),
        opacity: isHighlight ? 1 : dimOpacity,
        strokeWidth: isHighlight ? 2 : 1,
      };
      return { ...edge, style: edgeStyle };
    });
  }, [edges, highlightEdges, selectedId]);

  const onNodeClick = useCallback((_e: React.MouseEvent, node: Node) => {
    setSelectedId(node.id);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedId(null);
  }, []);

  const onNodeDoubleClick = useCallback(
    (_e: React.MouseEvent, node: Node) => {
      const api = flowApiRef.current;
      if (api) {
        const nds = api.getNodes();
        const n = nds.find((x) => x.id === node.id);
        if (n) {
          api.fitView({
            nodes: [n],
            padding: 0.4,
            duration: 300,
            maxZoom: 1.2,
          });
        }
      }
      setSelectedId(node.id);
    },
    []
  );

  const onNodeMouseEnter = useCallback((_e: React.MouseEvent, node: Node) => {
    setHoveredId(node.id);
  }, []);

  const onNodeMouseLeave = useCallback(() => {
    setHoveredId(null);
  }, []);

  const resetView = useCallback(() => {
    setSelectedId(null);
    setCategoryFilter(new Set());
    setTreeSearch("");
    hasInitialFitRef.current = false;
    setTimeout(
      () =>
        flowApiRef.current?.fitView({
          padding: 0.12,
          duration: 400,
          maxZoom: 1,
        }),
      100
    );
  }, []);

  const focusableNodeIds = useMemo(
    () => nodesWithVisibility.map((n) => n.id),
    [nodesWithVisibility]
  );
  const [keyboardIndex, setKeyboardIndex] = useState(-1);
  const selectedIndex =
    selectedId && focusableNodeIds.includes(selectedId)
      ? focusableNodeIds.indexOf(selectedId)
      : -1;
  useEffect(() => {
    if (selectedIndex >= 0) setKeyboardIndex(selectedIndex);
  }, [selectedIndex]);

  // Fit entire map in view when graph first loads (no selection)
  useEffect(() => {
    if (nodes.length === 0 || selectedId || hasInitialFitRef.current) return;
    const timer = setTimeout(() => {
      const api = flowApiRef.current;
      if (!api) return;
      api.fitView({
        padding: 0.12,
        duration: 400,
        maxZoom: 1,
      });
      hasInitialFitRef.current = true;
    }, 150);
    return () => clearTimeout(timer);
  }, [nodes.length, selectedId]);

  // Center map on the selected node when selection changes (e.g. from sidebar or detail panel)
  useEffect(() => {
    if (!selectedId) return;
    const timer = setTimeout(() => {
      const api = flowApiRef.current;
      if (!api) return;
      const nds = api.getNodes();
      const node = nds.find((n) => n.id === selectedId);
      if (node) {
        api.fitView({
          nodes: [node],
          padding: 0.4,
          duration: 300,
          maxZoom: 1.2,
        });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [selectedId, nodes]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "Escape") {
        setSelectedId(null);
        setHoveredId(null);
        setMobileFiltersOpen(false);
        return;
      }
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        const next = Math.min(keyboardIndex + 1, focusableNodeIds.length - 1);
        if (next >= 0 && focusableNodeIds[next]) {
          setKeyboardIndex(next);
          setSelectedId(focusableNodeIds[next]!);
        }
      }
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        const next = Math.max(keyboardIndex - 1, 0);
        if (focusableNodeIds[next]) {
          setKeyboardIndex(next);
          setSelectedId(focusableNodeIds[next]!);
        }
      }
    },
    [keyboardIndex, focusableNodeIds]
  );

  return (
    <div
      className="flex w-full flex-1 min-h-0 bg-slate-50/80"
      style={{ height: "100%", minHeight: "70vh" }}
      onKeyDown={handleKeyDown}
      role="application"
      aria-label="Ecosystem map"
    >
      {/* Left sidebar: search, category filter chips, reset — on mobile device hidden below lg and shown in overlay */}
      <aside
        className={cn(
          "w-72 border-r border-slate-200 bg-white flex flex-col shrink-0 shadow-epic overflow-hidden",
          isMobile ? "hidden lg:flex" : "flex"
        )}
        aria-label="Map filters"
      >
        <div className="p-3 border-b border-slate-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="search"
              placeholder="Search taxonomy..."
              className="epic-input py-2 pl-9 pr-3 text-sm"
              value={treeSearch}
              onChange={(e) => setTreeSearch(e.target.value)}
              aria-label="Search domains"
            />
          </div>
        </div>
        <div className="px-3 py-2 border-b border-slate-200">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
            Category
          </p>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORY_NAMES.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => toggleCategory(name)}
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-150",
                  categoryFilter.has(name)
                    ? "ring-1 ring-offset-1 ring-slate-400"
                    : "opacity-80 hover:opacity-100",
                  DOMAIN_THEMES[name]
                    ? `${DOMAIN_THEMES[name]!.bg} ${DOMAIN_THEMES[name]!.border} ${DOMAIN_THEMES[name]!.text}`
                    : "bg-slate-100 border-slate-300 text-slate-700"
                )}
                aria-pressed={categoryFilter.has(name)}
                aria-label={`Filter by ${name}`}
              >
                {name.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
        <div className="p-3 border-b border-slate-200">
          <button
            type="button"
            onClick={resetView}
            className="epic-btn-secondary w-full flex items-center justify-center gap-2 py-2 text-sm"
            aria-label="Reset view and clear filters"
          >
            <RotateCcw className="w-4 h-4" />
            Reset view
          </button>
        </div>
        <TaxonomyTree
          onSelect={(id) => setSelectedId(id)}
          search={treeSearch}
        />
      </aside>

      {/* Mobile filters drawer */}
      {isMobile && mobileFiltersOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setMobileFiltersOpen(false)}
            aria-hidden
          />
          <aside
            className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] flex flex-col border-r border-slate-200 bg-white shadow-xl overflow-y-auto lg:hidden"
            aria-label="Map filters"
          >
            <div className="flex items-center justify-between p-3 border-b border-slate-200">
              <span className="font-semibold text-slate-800">Filters</span>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                aria-label="Close filters"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-3 border-b border-slate-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="search"
                  placeholder="Search taxonomy..."
                  className="epic-input py-2 pl-9 pr-3 text-sm"
                  value={treeSearch}
                  onChange={(e) => setTreeSearch(e.target.value)}
                  aria-label="Search domains"
                />
              </div>
            </div>
            <div className="px-3 py-2 border-b border-slate-200">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Category</p>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORY_NAMES.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => toggleCategory(name)}
                    className={cn(
                      "px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-150",
                      categoryFilter.has(name)
                        ? "ring-1 ring-offset-1 ring-slate-400"
                        : "opacity-80 hover:opacity-100",
                      DOMAIN_THEMES[name]
                        ? `${DOMAIN_THEMES[name]!.bg} ${DOMAIN_THEMES[name]!.border} ${DOMAIN_THEMES[name]!.text}`
                        : "bg-slate-100 border-slate-300 text-slate-700"
                    )}
                    aria-pressed={categoryFilter.has(name)}
                    aria-label={`Filter by ${name}`}
                  >
                    {name.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-3 border-b border-slate-200">
              <button
                type="button"
                onClick={() => { resetView(); setMobileFiltersOpen(false); }}
                className="epic-btn-secondary w-full flex items-center justify-center gap-2 py-2 text-sm"
                aria-label="Reset view and clear filters"
              >
                <RotateCcw className="w-4 h-4" />
                Reset view
              </button>
            </div>
            <TaxonomyTree
              onSelect={(id) => { setSelectedId(id); setMobileFiltersOpen(false); }}
              search={treeSearch}
            />
          </aside>
        </>
      )}

      {/* Canvas */}
      <div
        className="flex-1 min-h-0 relative bg-slate-100/60 overflow-hidden"
        style={{ height: "100%" }}
      >
        <ReactFlow
          nodes={nodesWithVisibility}
          edges={edgesWithVisibility}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onNodeDoubleClick={onNodeDoubleClick}
          onNodeMouseEnter={onNodeMouseEnter}
          onNodeMouseLeave={onNodeMouseLeave}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.25, minZoom: 0.15, maxZoom: 1.2 }}
          minZoom={0.15}
          maxZoom={1.5}
          style={{ width: "100%", height: "100%" }}
          nodesDraggable={true}
          proOptions={{ hideAttribution: true }}
        >
          <FlowApiBridge setApi={setFlowApi} />
          <Background
            gap={20}
            size={1}
            className="[--bg-color:theme(colors.slate.200/0.5)]"
          />
          <Controls
            className="!bg-white !border-slate-200 !rounded-lg !shadow-epic !border"
            showInteractive={false}
          />
          <MiniMap
            className="!bg-slate-100 !border-slate-200 !rounded-lg !border"
            nodeColor={(n) =>
              getSectorEdgeColor(
                rawNodes.find((r) => r.id === n.id)?.sector ?? ""
              )
            }
            maskColor="rgb(248 250 252 / 0.7)"
          />
          </ReactFlow>
        {graphLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm transition-opacity duration-200">
            <span className="text-slate-600 font-medium">Loading graph…</span>
          </div>
        )}
        <button
          type="button"
          onClick={() => setMobileFiltersOpen(true)}
          className={cn(
            "absolute bottom-4 left-4 z-10 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-md hover:bg-slate-50",
            isMobile ? "flex" : "hidden"
          )}
          aria-label="Open filters"
        >
          <PanelLeftOpen className="h-4 w-4" />
          Filters
        </button>
      </div>

      {isMobile && selectedId && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white lg:hidden">
          <DomainDetailPanel
            domainId={selectedId}
            onClose={() => setSelectedId(null)}
            onSelectNode={(id) => setSelectedId(id)}
          />
        </div>
      )}

      {/* Right details panel — on mobile device hidden below lg; detail shown in full-screen overlay */}
      <aside
        className={cn(
          "w-96 border-l border-slate-200 bg-white flex flex-col shrink-0 overflow-hidden shadow-epic",
          isMobile ? "hidden lg:flex" : "flex"
        )}
        aria-label="Node details"
        role="region"
      >
        {selectedId ? (
          <DomainDetailPanel
            domainId={selectedId}
            onClose={() => setSelectedId(null)}
            onSelectNode={(id) => setSelectedId(id)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 p-8 text-center">
            <p className="text-slate-500 text-sm">
              Click a node for details. Double-click to zoom. Use arrow keys to
              move between nodes.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}

export function MapExplorer({
  initialDomainId,
}: { initialDomainId?: string | null } = {}) {
  return (
    <ReactFlowProvider>
      <MapExplorerInner initialDomainId={initialDomainId} />
    </ReactFlowProvider>
  );
}
