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
} from "lucide-react";

const CampusScene = dynamic(() => import("@/three/scene/CampusScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#CFE3F0] text-[#121417] gap-3">
      <div className="w-10 h-10 border-4 border-[#121417] border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-black tracking-wider uppercase text-slate-700">
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
  const [activeFilter, setActiveFilter] = useState<string>("all");

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
    <div className="relative w-full h-[calc(100vh-8.5rem)] rounded-[32px] overflow-hidden bg-[#CFE3F0] font-sans border border-black/10 shadow-lg">
      {/* 3D WebGL Canvas Scene */}
      <CampusScene
        view={view}
        route={route?.pts ?? null}
        sel={sel}
        focus={focus}
        from={a?.pos ?? null}
        to={b?.pos ?? null}
        onSelect={setSel}
      />

      {/* TOP-LEFT: Floating Search & Perspective Controls */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 w-auto max-w-[calc(100vw-24px)] sm:w-[320px] space-y-2 pointer-events-auto">
        <div className="rounded-2xl bg-white/95 backdrop-blur-md shadow-md border border-black/10 p-2">
          <div className="flex items-center gap-2 px-2">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search building, department, facility..."
              className="w-full bg-transparent text-xs font-semibold text-[#121417] placeholder-slate-400 focus:outline-none"
            />
            {q && (
              <button
                onClick={() => setQ("")}
                className="p-1 text-slate-400 hover:text-black"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Autocomplete hits */}
          {hits.length > 0 && (
            <div className="mt-2 pt-2 border-t border-slate-100 space-y-1 max-h-48 overflow-y-auto">
              {hits.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handlePick(p.id)}
                  className="w-full flex items-center justify-between p-2 rounded-xl text-left text-xs hover:bg-[#E8F876]/30 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-600" />
                    <div>
                      <div className="font-bold text-[#121417]">{p.name}</div>
                      <div className="text-[10px] text-slate-500 font-medium">{p.type}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase">
                    {p.id}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 3D vs Map View Toggles */}
        <div className="flex items-center gap-2">
          <div className="flex bg-white/95 backdrop-blur-md rounded-full p-1 border border-black/10 shadow-sm">
            <button
              onClick={() => setView("3d")}
              className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 transition-all ${
                view === "3d" ? "bg-[#121417] text-white shadow" : "text-slate-600 hover:text-black"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>3D Orbit</span>
            </button>
            <button
              onClick={() => setView("map")}
              className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 transition-all ${
                view === "map" ? "bg-[#121417] text-white shadow" : "text-slate-600 hover:text-black"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Map (Top-Down)</span>
            </button>
          </div>
        </div>
      </div>

      {/* TOP-RIGHT: DOCKED COLLAPSIBLE ROUTE & DETAILS DRAWER (Keeps center map clear!) */}
      {(cur || route) && (
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-[calc(100vw-24px)] sm:w-[320px] pointer-events-auto">
          <div className="rounded-[24px] bg-white/95 backdrop-blur-md shadow-xl border border-black/10 p-3.5 space-y-2.5">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E8F876] border border-black/20" />
                <h4 className="text-xs font-black text-[#121417] uppercase tracking-wider">
                  {route ? "Active Route Guide" : "Selected Location"}
                </h4>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsNavDrawerCollapsed((prev) => !prev)}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-500"
                  title={isNavDrawerCollapsed ? "Expand panel" : "Minimize panel"}
                >
                  {isNavDrawerCollapsed ? (
                    <ChevronDown className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronUp className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setSel(null);
                    setDest(null);
                  }}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-500"
                  title="Close panel"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* When Expanded */}
            {!isNavDrawerCollapsed && (
              <div className="space-y-2.5 pt-1">
                {cur && (
                  <div>
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-sm font-black text-[#121417]">
                        {cur.name}
                      </h3>
                      <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F4F5F2] text-slate-700 shrink-0">
                        {cur.type}
                      </span>
                    </div>
                    {cur.note && (
                      <p className="text-[11px] text-slate-500 font-medium mt-1 line-clamp-2">
                        {cur.note}
                      </p>
                    )}
                  </div>
                )}

                {/* Routing Selectors & Controls */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span className="font-bold text-[11px]">Start:</span>
                    <select
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      className="bg-[#F4F5F2] text-[#121417] font-bold rounded-lg px-2 py-1 text-xs outline-none max-w-[200px]"
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
                        className={`flex-1 min-h-[36px] rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                          dest === cur.id
                            ? "bg-[#E8F876] text-[#121417]"
                            : "bg-[#121417] hover:bg-black text-white"
                        }`}
                      >
                        <Navigation className="w-3 h-3" />
                        <span>
                          {dest === cur.id ? "Route Active" : "Directions Here"}
                        </span>
                      </button>
                    )}
                    {dest && (
                      <button
                        onClick={() => setDest(null)}
                        className="px-3 min-h-[36px] rounded-xl bg-[#F4F5F2] text-xs font-bold text-slate-700 hover:text-black flex items-center gap-1"
                        title="Clear Route"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Clear</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Live Distance & Walking Info */}
                {route && (
                  <div className="p-2.5 rounded-xl bg-[#E8F876]/40 border border-black/5 text-xs text-[#121417] flex items-center justify-between font-black">
                    <span>Walking: ≈ {Math.round(route.length * 10)}m</span>
                    <span className="bg-[#121417] text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                      {Math.max(1, Math.round((route.length * 10) / 75))} min walk
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
