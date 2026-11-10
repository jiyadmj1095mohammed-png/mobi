"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { places, Place } from "@/utils/places";
import { findRoute, Route } from "@/navigation/graph";
import { V2 } from "@/utils/geometry";
import {
  Compass,
  MapPin,
  Navigation,
  Search,
  X,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Layers,
  Sparkles,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Hand,
  MousePointer,
} from "lucide-react";

const CampusScene = dynamic(() => import("@/three/scene/CampusScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#F4EEDC] text-black gap-3 p-6 text-center">
      <div className="w-10 h-10 border-4 border-black border-t-[#EEA827] rounded-full animate-spin shadow-[2px_2px_0px_#000]" />
      <span className="text-xs font-black tracking-wider uppercase text-black">
        Loading 3D Campus Environment...
      </span>
    </div>
  ),
});

export default function CampusMapViewer() {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<string | null>(null);
  const [view, setView] = useState<"3d" | "map">("3d");
  const [from, setFrom] = useState("BUS-001");
  const [dest, setDest] = useState<string | null>(null);
  const [isNavDrawerCollapsed, setIsNavDrawerCollapsed] = useState(false);
  const [mobileTouchEnabled, setMobileTouchEnabled] = useState(true);

  const getPlace = (id: string | null): Place | null => places.find((p) => p.id === id) || null;

  // Search Results
  const hits = useMemo(() => {
    if (!q.trim()) return [];
    const query = q.toLowerCase();
    return places
      .filter((p) => (p.name + " " + p.type + " " + p.id).toLowerCase().includes(query))
      .slice(0, 6);
  }, [q]);

  const a = getPlace(from);
  const b = getPlace(dest);
  const cur = getPlace(sel);

  // Dijkstra Route
  const route: Route | null = useMemo(() => {
    if (a && b) {
      return findRoute(a.node, b.node);
    }
    return null;
  }, [a, b]);

  const focus: V2 | null = (cur || b)?.pos ?? null;

  const handlePick = (id: string) => {
    setSel(id);
    setQ("");
  };

  const startOptions = useMemo(() => {
    return places.filter(
      (p) => p.group === "building" || p.id === "BUS-001" || p.id === "ENT-001"
    );
  }, []);

  return (
    <div className="relative w-full h-[calc(100vh-8.5rem)] rounded-[28px] overflow-hidden bg-[#d0e4f2] font-sans border-[2.5px] border-black shadow-[6px_6px_0px_#000]">
      {/* 3D WebGL Canvas Scene */}
      <div className={`w-full h-full ${mobileTouchEnabled ? "pointer-events-auto" : "pointer-events-none md:pointer-events-auto"}`}>
        <CampusScene
          view={view}
          route={route?.pts ?? null}
          sel={sel}
          focus={focus}
          from={a?.pos ?? null}
          to={b?.pos ?? null}
          onSelect={setSel}
        />
      </div>

      {/* TOP-LEFT: Floating Search & Perspective Controls */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 w-auto max-w-[calc(100vw-24px)] sm:w-[320px] space-y-2 pointer-events-auto">
        <div className="rounded-2xl bg-[#FAF3E0] border-2 border-black shadow-[3px_3px_0px_#000] p-2.5">
          <div className="flex items-center gap-2 px-1">
            <Search className="w-4 h-4 text-black" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search building, lab, facility..."
              className="w-full bg-transparent text-xs font-black text-black placeholder-stone-500 focus:outline-none"
            />
            {q && (
              <button
                onClick={() => setQ("")}
                className="p-1 text-black hover:text-[#D84F2A]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Autocomplete hits */}
          {hits.length > 0 && (
            <div className="mt-2 pt-2 border-t-2 border-black/10 space-y-1.5 max-h-48 overflow-y-auto">
              {hits.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handlePick(p.id)}
                  className="w-full flex items-center justify-between p-2 rounded-xl text-left text-xs bg-white hover:bg-[#EEA827] border border-black transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-black" />
                    <div>
                      <div className="font-black text-black">{p.name}</div>
                      <div className="text-[10px] text-stone-600 font-bold">{p.type}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[#FAF3E0] border border-black uppercase">
                    {p.id}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 3D vs Map View Toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex bg-[#FAF3E0] rounded-xl p-1 border-2 border-black shadow-[2.5px_2.5px_0px_#000]">
            <button
              onClick={() => setView("3d")}
              className={`px-3 py-1 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all ${
                view === "3d" ? "bg-[#EEA827] text-black border border-black" : "text-stone-700 hover:text-black"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>3D Orbit</span>
            </button>
            <button
              onClick={() => setView("map")}
              className={`px-3 py-1 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all ${
                view === "map" ? "bg-[#1D838F] text-white border border-black" : "text-stone-700 hover:text-black"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>2D Top-Down</span>
            </button>
          </div>

          {/* Mobile Scroll vs Map Interaction Toggle (Solves mobile trapped touch!) */}
          <button
            onClick={() => setMobileTouchEnabled(!mobileTouchEnabled)}
            className={`md:hidden px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 border-2 border-black shadow-[2.5px_2.5px_0px_#000] ${
              mobileTouchEnabled
                ? "bg-[#D84F2A] text-white"
                : "bg-white text-black"
            }`}
          >
            {mobileTouchEnabled ? (
              <>
                <Hand className="w-3.5 h-3.5" />
                <span>Map Active</span>
              </>
            ) : (
              <>
                <MousePointer className="w-3.5 h-3.5" />
                <span>Page Scroll</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* BOTTOM-RIGHT: Fast Zoom & Reset Floating Dock */}
      <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-20 flex flex-col gap-2 pointer-events-auto">
        <button
          onClick={() => {
            setSel(null);
            setDest(null);
            setView("3d");
          }}
          className="brutal-btn w-9 h-9 rounded-xl bg-[#FAF3E0] flex items-center justify-center text-black"
          title="Reset Camera"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* TOP-RIGHT: DOCKED COLLAPSIBLE ROUTE & DETAILS DRAWER */}
      {(cur || route) && (
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-[calc(100vw-24px)] sm:w-[320px] pointer-events-auto">
          <div className="rounded-2xl bg-[#FAF3E0] border-[2.5px] border-black shadow-[4px_4px_0px_#000] p-4 space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-black/10 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EEA827] border border-black" />
                <h4 className="text-xs font-black text-black uppercase tracking-wider">
                  {route ? "Route Guide" : "Selected Marker"}
                </h4>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsNavDrawerCollapsed((prev) => !prev)}
                  className="p-1 rounded-lg hover:bg-black/10 text-black"
                >
                  {isNavDrawerCollapsed ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronUp className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setSel(null);
                    setDest(null);
                  }}
                  className="p-1 rounded-lg hover:bg-black/10 text-black"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* When Expanded */}
            {!isNavDrawerCollapsed && (
              <div className="space-y-3">
                {cur && (
                  <div>
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-sm font-black text-black">
                        {cur.name}
                      </h3>
                      <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#EEA827] text-black border border-black shrink-0">
                        {cur.type}
                      </span>
                    </div>
                    {cur.note && (
                      <p className="text-xs text-stone-600 font-bold mt-1 line-clamp-2">
                        {cur.note}
                      </p>
                    )}
                  </div>
                )}

                {/* Routing Selectors & Controls */}
                <div className="pt-2 border-t-2 border-black/10 space-y-2">
                  <div className="flex items-center justify-between text-xs text-black">
                    <span className="font-black text-[11px]">Start:</span>
                    <select
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      className="bg-white text-black font-black border-2 border-black rounded-lg px-2 py-1 text-xs outline-none max-w-[200px]"
                    >
                      {startOptions.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-2">
                    {cur && (
                      <button
                        onClick={() => setDest(cur.id)}
                        className={`brutal-btn flex-1 min-h-[36px] rounded-xl text-xs font-black flex items-center justify-center gap-1.5 ${
                          dest === cur.id
                            ? "bg-[#EEA827] text-black"
                            : "bg-[#1D838F] text-white"
                        }`}
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>
                          {dest === cur.id ? "Route Active" : "Directions Here"}
                        </span>
                      </button>
                    )}
                    {dest && (
                      <button
                        onClick={() => setDest(null)}
                        className="brutal-btn px-3 min-h-[36px] rounded-xl bg-white text-xs font-black text-black flex items-center gap-1"
                        title="Clear Route"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Clear</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Live Distance & Walking Info */}
                {route && (
                  <div className="p-2.5 rounded-xl bg-white border-2 border-black text-xs text-black flex items-center justify-between font-black shadow-[2px_2px_0px_#000]">
                    <span>Walk: ≈ {Math.round(route.length * 10)}m</span>
                    <span className="bg-[#EEA827] text-black border border-black px-2 py-0.5 rounded text-[10px] font-black">
                      {Math.max(1, Math.round((route.length * 10) / 75))} min
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
