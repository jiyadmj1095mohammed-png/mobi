"use client";

import { useMemo } from "react";
import {
  BUILDINGS,
  FACILITIES,
  NODES,
  EDGES,
  ROADS,
  CAMPUS_BOUNDARY,
  PLAY_FIELD,
  FACILITY_COLORS,
  V2,
} from "@/data/campusData";

interface Map2DFallbackProps {
  selectedId: string | null;
  routePoints: V2[] | null;
  startPoint: V2 | null;
  destinationPoint: V2 | null;
  onSelect: (id: string) => void;
  facilityFilter?: string;
}

// Convert local coordinates [-60..60, -50..60] to SVG viewBox [0..1000, 0..900]
const toSvg = (p: V2): [number, number] => {
  const x = (p[0] + 65) * 7.5;
  const y = (p[1] + 55) * 7.5;
  return [x, y];
};

export default function Map2DFallback({
  selectedId,
  routePoints,
  startPoint,
  destinationPoint,
  onSelect,
  facilityFilter = "all",
}: Map2DFallbackProps) {
  const boundaryPath = useMemo(() => {
    return CAMPUS_BOUNDARY.map((p, i) => {
      const [x, y] = toSvg(p);
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    }).join(" ") + " Z";
  }, []);

  const playFieldPath = useMemo(() => {
    return PLAY_FIELD.map((p, i) => {
      const [x, y] = toSvg(p);
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    }).join(" ") + " Z";
  }, []);

  const routePath = useMemo(() => {
    if (!routePoints || routePoints.length < 2) return null;
    return routePoints.map((p, i) => {
      const [x, y] = toSvg(p);
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    }).join(" ");
  }, [routePoints]);

  const filteredFacilities = FACILITIES.filter((f) => {
    if (facilityFilter === "all") return true;
    if (facilityFilter === "waste") return f.category === "waste";
    if (facilityFilter === "sanitation") return f.category === "sanitation";
    if (facilityFilter === "hydration") return f.category === "hydration";
    if (facilityFilter === "amenity") return f.category === "amenity";
    return true;
  });

  return (
    <div className="w-full h-full relative overflow-auto bg-[#E8F0E4] flex items-center justify-center p-2">
      <svg
        viewBox="0 0 1000 880"
        className="w-full h-full max-h-[85vh] select-none filter drop-shadow-md rounded-2xl bg-[#D8E6D2]"
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0, 50, 20, 0.04)" strokeWidth="1" />
          </pattern>
          <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="1" dy="2" stdDeviation="3" floodOpacity="0.25" />
          </filter>
        </defs>

        <rect width="1000" height="880" fill="#D8E6D2" />
        <rect width="1000" height="880" fill="url(#grid)" />

        {/* Campus Boundary */}
        <path d={boundaryPath} fill="#A6CD95" stroke="#77A464" strokeWidth="3" />

        {/* Sports Field */}
        <path d={playFieldPath} fill="#C6D378" stroke="#A9B852" strokeWidth="2" />
        <text x="210" y="740" fontSize="12" fill="#586716" fontWeight="bold">
          ATHLETIC FIELD
        </text>

        {/* Roads (Asphalt) */}
        {ROADS.map((road, rIdx) => {
          const d = road.pts.map((p, i) => {
            const [x, y] = toSvg(p);
            return `${i === 0 ? "M" : "L"} ${x} ${y}`;
          }).join(" ");
          return (
            <g key={`road-${rIdx}`}>
              <path d={d} fill="none" stroke="#33383F" strokeWidth="18" strokeLinecap="round" />
              <path d={d} fill="none" stroke="#F1F5F9" strokeWidth="2" strokeDasharray="6 6" />
            </g>
          );
        })}

        {/* Pedestrian Pathways (Walkable edges) */}
        {EDGES.map(([a, b, isConfirmed], eIdx) => {
          const [ax, ay] = toSvg(NODES[a]);
          const [bx, by] = toSvg(NODES[b]);
          return (
            <line
              key={`edge-${eIdx}`}
              x1={ax}
              y1={ay}
              x2={bx}
              y2={by}
              stroke={isConfirmed ? "#FFFFFF" : "#E2D3B8"}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={isConfirmed ? "none" : "4 3"}
            />
          );
        })}

        {/* Buildings */}
        {BUILDINGS.map((b) => {
          const [cx, cy] = toSvg(b.pos);
          const bw = b.size[0] * 6.5;
          const bh = b.size[1] * 6.5;
          const isSelected = selectedId === b.id;

          return (
            <g
              key={b.id}
              onClick={() => onSelect(b.id)}
              className="cursor-pointer transition-transform hover:opacity-90"
              filter="url(#shadow)"
            >
              <rect
                x={cx - bw / 2}
                y={cy - bh / 2}
                width={bw}
                height={bh}
                rx="6"
                fill={isSelected ? "#20C878" : "#EFECE6"}
                stroke={isSelected ? "#06251D" : "#8A7D6F"}
                strokeWidth={isSelected ? "3" : "1.5"}
                transform={`rotate(${b.rot}, ${cx}, ${cy})`}
              />
              {b.named && (
                <text
                  x={cx}
                  y={cy + 4}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="bold"
                  fill={isSelected ? "#FFFFFF" : "#1E293B"}
                  className="pointer-events-none select-none"
                >
                  {b.shortName}
                </text>
              )}
            </g>
          );
        })}

        {/* Active Navigation Route Line */}
        {routePath && (
          <path
            d={routePath}
            fill="none"
            stroke="#2563EB"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-pulse"
          />
        )}

        {/* Facilities Markers */}
        {filteredFacilities.map((f) => {
          const [fx, fy] = toSvg(f.pos);
          const color = FACILITY_COLORS[f.type] || "#20C878";
          const isSelected = selectedId === f.id;

          return (
            <g
              key={f.id}
              onClick={() => onSelect(f.id)}
              className="cursor-pointer"
            >
              {f.status === "proposed" && (
                <circle cx={fx} cy={fy} r="12" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="3 2" />
              )}
              <circle
                cx={fx}
                cy={fy}
                r={isSelected ? "9" : "6"}
                fill={color}
                stroke="#FFFFFF"
                strokeWidth="2"
                filter="url(#shadow)"
              />
            </g>
          );
        })}

        {/* Route Start Point */}
        {startPoint && (
          <g transform={`translate(${toSvg(startPoint)[0]}, ${toSvg(startPoint)[1]})`}>
            <circle r="10" fill="#20C878" stroke="#FFFFFF" strokeWidth="2.5" />
            <circle r="4" fill="#FFFFFF" />
          </g>
        )}

        {/* Route Destination Point */}
        {destinationPoint && (
          <g transform={`translate(${toSvg(destinationPoint)[0]}, ${toSvg(destinationPoint)[1]})`}>
            <circle r="12" fill="#EF4444" stroke="#FFFFFF" strokeWidth="2.5" />
            <polygon points="0,-4 4,4 -4,4" fill="#FFFFFF" />
          </g>
        )}
      </svg>
    </div>
  );
}
