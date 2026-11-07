// Authoritative MEA Engineering College (Perinthalmanna) Campus Geometry and Object Registry
// Traced from Reference C (Ground Truth) and Reference D (Annotated Concept)
// Coordinates: 1 unit = 10px of original 1080x1601 map. Origin = center (540, 800).
// Inferred/Proposed facilities are explicitly tagged with status="proposed".

export type V2 = [number, number];

export const toLocal = (x: number, y: number): V2 => [
  Number(((x - 540) * 0.1).toFixed(2)),
  Number(((y - 800) * 0.1).toFixed(2)),
];

export const dist = (a: V2, b: V2): number => Math.hypot(a[0] - b[0], a[1] - b[1]);

export interface BuildingData {
  id: string;
  name: string;
  shortName: string;
  kind: "academic" | "auditorium" | "hostel" | "workshop" | "unnamed" | "external";
  pos: V2;
  size: [number, number, number]; // [width, depth, height]
  rot: number; // degrees
  node: string; // nearest network node
  named: boolean;
  status: "confirmed" | "proposed";
  floors: number;
  departments?: string[];
  description: string;
}

export const BUILDINGS: BuildingData[] = [
  {
    id: "B-MAIN",
    name: "MEA Engineering College (Main Block)",
    shortName: "Main Block",
    kind: "academic",
    pos: toLocal(565, 790),
    size: [22, 18, 10],
    rot: 40,
    node: "N18",
    named: true,
    status: "confirmed",
    floors: 4,
    departments: ["Computer Science & Eng", "Electronics & Comm", "Administration", "Central Library"],
    description: "Primary academic and administrative block housing executive offices, central library, and CSE/ECE laboratories."
  },
  {
    id: "B-AUD",
    name: "MEA Engineering College Auditorium",
    shortName: "Campus Auditorium",
    kind: "auditorium",
    pos: toLocal(460, 1045),
    size: [14, 11, 8],
    rot: -20,
    node: "N13",
    named: true,
    status: "confirmed",
    floors: 2,
    departments: ["Campus Events", "Cultural Activities"],
    description: "Multipurpose air-conditioned campus auditorium for graduation, national conferences, cultural events, and orientations."
  },
  {
    id: "B-CIVIL",
    name: "Civil Engineering Department",
    shortName: "Civil Block",
    kind: "academic",
    pos: toLocal(830, 570),
    size: [16, 9, 8],
    rot: 30,
    node: "N15",
    named: true,
    status: "confirmed",
    floors: 3,
    departments: ["Civil Engineering", "Surveying Lab", "Environmental Lab"],
    description: "Specialized building containing material testing, surveying, CAD and hydraulics laboratories for Civil Engineering students."
  },
  {
    id: "B-HOSTEL",
    name: "MEA Men's Hostel",
    shortName: "Men's Hostel",
    kind: "hostel",
    pos: toLocal(940, 800),
    size: [13, 9, 9],
    rot: -35,
    node: "N16",
    named: true,
    status: "confirmed",
    floors: 4,
    departments: ["Residential Facilities", "Student Mess"],
    description: "On-campus student residential accommodation with study rooms, high-speed WiFi, and 24/7 solar hot water."
  },
  {
    id: "B-WORK",
    name: "Mechanical Workshop & Fab Lab",
    shortName: "Mechanical Workshop",
    kind: "workshop",
    pos: toLocal(800, 1010),
    size: [18, 9, 6],
    rot: -40,
    node: "N17",
    named: true,
    status: "confirmed",
    floors: 1,
    departments: ["Mechanical Engineering", "CNC Lab", "Foundry", "Robotics FabLab"],
    description: "Heavy manufacturing and machinery workshop with state-of-the-art CNC equipment, thermal labs, and rapid prototyping tools."
  },
  {
    id: "B-U01",
    name: "North Academic Annex 1",
    shortName: "Annex 1",
    kind: "unnamed",
    pos: toLocal(585, 520),
    size: [9, 11, 6],
    rot: 40,
    node: "N06",
    named: false,
    status: "confirmed",
    floors: 2,
    description: "North classroom complex and faculty research chambers."
  },
  {
    id: "B-U02",
    name: "North Academic Annex 2",
    shortName: "Annex 2",
    kind: "unnamed",
    pos: toLocal(665, 570),
    size: [9, 10, 6],
    rot: 40,
    node: "N08",
    named: false,
    status: "confirmed",
    floors: 2,
    description: "Tutorial rooms and student project discussion pods."
  },
  {
    id: "B-U03",
    name: "West Security & Utility Complex",
    shortName: "West Utility",
    kind: "unnamed",
    pos: toLocal(345, 645),
    size: [7, 7, 4],
    rot: 15,
    node: "N03",
    named: false,
    status: "confirmed",
    floors: 1,
    description: "Electrical substation, campus maintenance headquarters, and security."
  },
  {
    id: "B-EXT1",
    name: "Noorul Islam Higher Secondary School",
    shortName: "Noorul Islam HSS",
    kind: "external",
    pos: toLocal(150, 400),
    size: [12, 9, 5],
    rot: 20,
    node: "N01",
    named: true,
    status: "confirmed",
    floors: 2,
    description: "Adjacent educational campus landmark located north of Highway SH39."
  },
  {
    id: "B-EXT2",
    name: "AL Fouze Jamia English Medium School",
    shortName: "AL Fouze Jamia",
    kind: "external",
    pos: toLocal(590, 1400),
    size: [14, 7, 5],
    rot: 50,
    node: "N13",
    named: true,
    status: "confirmed",
    floors: 2,
    description: "South campus perimeter educational neighbor along the access road."
  }
];

export type FacilityType =
  | "bus"
  | "bin-general"
  | "bin-dry"
  | "bin-wet"
  | "bin-plastic"
  | "bin-ewaste"
  | "wc-men"
  | "wc-women"
  | "wc-access"
  | "water"
  | "handwash"
  | "bench"
  | "light"
  | "entrance"
  | "parking"
  | "assembly";

export interface CampusFacilityData {
  id: string;
  type: FacilityType;
  name: string;
  pos: V2;
  status: "confirmed" | "proposed";
  note: string;
  category: "waste" | "sanitation" | "hydration" | "amenity" | "transit";
}

export const FACILITY_LABELS: Record<FacilityType, string> = {
  bus: "Campus Bus Stop",
  "bin-general": "General Waste Bin (Blue)",
  "bin-dry": "Dry Recyclable Waste Bin (Yellow)",
  "bin-wet": "Organic Wet Waste Bin (Green)",
  "bin-plastic": "Plastic Segregation Point",
  "bin-ewaste": "E-Waste Disposal Unit",
  "wc-men": "Men's Washroom",
  "wc-women": "Women's Washroom",
  "wc-access": "Accessible Restroom",
  water: "Purified Drinking Water Station",
  handwash: "Handwashing Station",
  bench: "Eco Seating Bench",
  light: "Solar Streetlight",
  entrance: "Campus Main Gateway",
  parking: "Vehicle Parking Area",
  assembly: "Emergency Assembly Zone",
};

export const FACILITY_COLORS: Record<FacilityType, string> = {
  bus: "#8B5CF6",
  "bin-general": "#2563EB",
  "bin-dry": "#EAB308",
  "bin-wet": "#16A34A",
  "bin-plastic": "#F97316",
  "bin-ewaste": "#DC2626",
  "wc-men": "#0284C7",
  "wc-women": "#DB2777",
  "wc-access": "#6366F1",
  water: "#06B6D4",
  handwash: "#14B8A6",
  bench: "#A855F7",
  light: "#FACC15",
  entrance: "#EA580C",
  parking: "#64748B",
  assembly: "#10B981",
};

const rawFacilities: [string, FacilityType, number, number, "waste" | "sanitation" | "hydration" | "amenity" | "transit"][] = [
  ["BUS-001", "bus", 155, 705, "transit"],
  ["ENT-001", "entrance", 175, 690, "transit"],
  ["BIN-001", "bin-general", 180, 742, "waste"],
  ["BIN-002", "bin-dry", 200, 742, "waste"],
  ["BIN-003", "bin-wet", 220, 742, "waste"],
  ["BIN-004", "bin-general", 488, 890, "waste"],
  ["BIN-005", "bin-dry", 500, 905, "waste"],
  ["BIN-006", "bin-wet", 412, 955, "waste"],
  ["BIN-007", "bin-general", 505, 1085, "waste"],
  ["BIN-008", "bin-dry", 520, 1115, "waste"],
  ["BIN-009", "bin-plastic", 570, 1060, "waste"],
  ["BIN-010", "bin-general", 895, 830, "waste"],
  ["BIN-011", "bin-wet", 915, 845, "waste"],
  ["BIN-012", "bin-ewaste", 880, 770, "waste"],
  ["BIN-013", "bin-plastic", 735, 990, "waste"],
  ["BIN-014", "bin-ewaste", 770, 1030, "waste"],
  ["BIN-015", "bin-general", 770, 650, "waste"],
  ["BIN-016", "bin-dry", 790, 660, "waste"],
  ["BIN-017", "bin-plastic", 690, 660, "waste"],
  ["BIN-018", "bin-plastic", 365, 750, "waste"],
  ["BIN-019", "bin-general", 640, 710, "waste"],
  ["WC-M-001", "wc-men", 470, 830, "sanitation"],
  ["WC-W-001", "wc-women", 450, 850, "sanitation"],
  ["WC-A-001", "wc-access", 435, 870, "sanitation"],
  ["WC-M-002", "wc-men", 490, 1065, "sanitation"],
  ["WC-W-002", "wc-women", 475, 1075, "sanitation"],
  ["WC-A-002", "wc-access", 490, 1090, "sanitation"],
  ["WC-M-003", "wc-men", 850, 590, "sanitation"],
  ["WC-W-003", "wc-women", 870, 600, "sanitation"],
  ["WC-A-003", "wc-access", 885, 610, "sanitation"],
  ["WTR-001", "water", 200, 700, "hydration"],
  ["WTR-002", "water", 455, 880, "hydration"],
  ["WTR-003", "water", 575, 1085, "hydration"],
  ["WTR-004", "water", 880, 810, "hydration"],
  ["WTR-005", "water", 760, 640, "hydration"],
  ["HW-001", "handwash", 455, 830, "sanitation"],
  ["HW-002", "handwash", 480, 1050, "sanitation"],
  ["HW-003", "handwash", 860, 580, "sanitation"],
  ["BEN-001", "bench", 340, 770, "amenity"],
  ["BEN-002", "bench", 480, 760, "amenity"],
  ["BEN-003", "bench", 620, 720, "amenity"],
  ["BEN-004", "bench", 560, 1100, "amenity"],
  ["BEN-005", "bench", 880, 740, "amenity"],
  ["BEN-006", "bench", 760, 700, "amenity"],
  ["LGT-001", "light", 230, 730, "amenity"],
  ["LGT-002", "light", 385, 700, "amenity"],
  ["LGT-003", "light", 500, 640, "amenity"],
  ["LGT-004", "light", 700, 690, "amenity"],
  ["LGT-005", "light", 840, 730, "amenity"],
  ["LGT-006", "light", 450, 900, "amenity"],
  ["LGT-007", "light", 525, 1030, "amenity"],
  ["LGT-008", "light", 895, 760, "amenity"],
  ["PRK-001", "parking", 830, 1055, "amenity"],
  ["ASM-001", "assembly", 230, 930, "amenity"],
  ["ASM-002", "assembly", 640, 1100, "amenity"],
];

export const FACILITIES: CampusFacilityData[] = rawFacilities.map(([id, type, x, y, category]) => {
  const isConfirmed = id === "BUS-001" || id === "ENT-001";
  return {
    id,
    type,
    name: `${FACILITY_LABELS[type]} (${id})`,
    pos: toLocal(x, y),
    status: isConfirmed ? "confirmed" : "proposed",
    note: isConfirmed
      ? "Directly mapped from authoritative campus survey."
      : "PROPOSED — LOCATION TO BE VERIFIED by student eco audits.",
    category,
  };
});

// Routing Network
export const NODES: Record<string, V2> = {
  N01: toLocal(160, 712),
  N02: toLocal(280, 722),
  N03: toLocal(380, 732),
  N04: toLocal(440, 692),
  N05: toLocal(495, 705),
  N06: toLocal(500, 562),
  N07: toLocal(650, 688),
  N08: toLocal(705, 678),
  N09: toLocal(810, 742),
  N10: toLocal(430, 800),
  N11: toLocal(435, 935),
  N12: toLocal(520, 1005),
  N13: toLocal(545, 1095),
  N14: toLocal(855, 745),
  N15: toLocal(790, 625),
  N16: toLocal(905, 790),
  N17: toLocal(760, 985),
  N18: toLocal(470, 870),
};

export const EDGES: [string, string, boolean][] = [
  ["N01", "N02", true],
  ["N02", "N03", true],
  ["N03", "N04", true],
  ["N04", "N05", true],
  ["N03", "N05", true],
  ["N03", "N10", true],
  ["N10", "N18", true],
  ["N18", "N11", true],
  ["N02", "N11", true],
  ["N11", "N12", true],
  ["N12", "N13", true],
  ["N06", "N04", true],
  ["N06", "N07", true],
  ["N05", "N07", true],
  ["N07", "N08", true],
  ["N08", "N09", true],
  ["N09", "N14", true],
  ["N08", "N15", true],
  ["N14", "N16", true],
  ["N12", "N17", false], // inferred connector
  ["N17", "N16", false], // inferred connector
];

export const ROADS: { name: string; pts: V2[] }[] = [
  {
    name: "SH39 (State Highway 39)",
    pts: [toLocal(200, 610), toLocal(110, 820), toLocal(40, 1060), toLocal(0, 1150)],
  },
  {
    name: "Perumbilavu-Nilambur Road",
    pts: [toLocal(670, 225), toLocal(330, 520), toLocal(200, 610)],
  },
  {
    name: "Road to Usmankka's Pub",
    pts: [toLocal(670, 225), toLocal(745, 195), toLocal(850, 205), toLocal(1080, 270)],
  },
  {
    name: "West Campus Entrance Road",
    pts: [toLocal(0, 545), toLocal(130, 585), toLocal(195, 620)],
  },
  {
    name: "South Campus Boundary Road",
    pts: [toLocal(10, 1135), toLocal(190, 1255), toLocal(380, 1235), toLocal(650, 1290)],
  },
];

export const CAMPUS_BOUNDARY: V2[] = [
  toLocal(190, 630),
  toLocal(520, 410),
  toLocal(835, 438),
  toLocal(1078, 716),
  toLocal(718, 1284),
  toLocal(40, 1112),
  toLocal(110, 900),
];

export const PLAY_FIELD: V2[] = [
  toLocal(80, 950),
  toLocal(340, 800),
  toLocal(420, 930),
  toLocal(290, 1120),
  toLocal(40, 1112),
];

// Dijkstra Navigation Solver
export interface ComputedRoute {
  nodeIds: string[];
  pts: V2[];
  lengthUnits: number;
  lengthMeters: number;
  estMinutes: number;
  hasInferredSegment: boolean;
}

const buildAdj = () => {
  const adj = new Map<string, { to: string; weight: number; isVerified: boolean }[]>();
  Object.keys(NODES).forEach((k) => adj.set(k, []));
  EDGES.forEach(([a, b, isVerified]) => {
    const w = dist(NODES[a], NODES[b]);
    adj.get(a)!.push({ to: b, weight: w, isVerified });
    adj.get(b)!.push({ to: a, weight: w, isVerified });
  });
  return adj;
};

const adjList = buildAdj();

export function computePath(fromNode: string, toNode: string): ComputedRoute | null {
  if (!NODES[fromNode] || !NODES[toNode]) return null;
  if (fromNode === toNode) {
    return {
      nodeIds: [fromNode],
      pts: [NODES[fromNode]],
      lengthUnits: 0,
      lengthMeters: 0,
      estMinutes: 0,
      hasInferredSegment: false,
    };
  }

  const dists = new Map<string, number>();
  const prev = new Map<string, string>();
  const unvisited = new Set(Object.keys(NODES));

  unvisited.forEach((node) => dists.set(node, Infinity));
  dists.set(fromNode, 0);

  while (unvisited.size > 0) {
    let curr = "";
    let minD = Infinity;
    unvisited.forEach((node) => {
      const d = dists.get(node)!;
      if (d < minD) {
        minD = d;
        curr = node;
      }
    });

    if (!curr || minD === Infinity) break;
    unvisited.delete(curr);
    if (curr === toNode) break;

    const neighbors = adjList.get(curr) || [];
    for (const neighbor of neighbors) {
      if (!unvisited.has(neighbor.to)) continue;
      const alt = minD + neighbor.weight;
      if (alt < dists.get(neighbor.to)!) {
        dists.set(neighbor.to, alt);
        prev.set(neighbor.to, curr);
      }
    }
  }

  if (dists.get(toNode) === Infinity) return null;

  const nodeIds: string[] = [toNode];
  let curr = toNode;
  while (curr !== fromNode) {
    const p = prev.get(curr);
    if (!p) break;
    nodeIds.unshift(p);
    curr = p;
  }

  let hasInferredSegment = false;
  for (let i = 0; i < nodeIds.length - 1; i++) {
    const a = nodeIds[i];
    const b = nodeIds[i + 1];
    const edge = adjList.get(a)?.find((e) => e.to === b);
    if (edge && !edge.isVerified) {
      hasInferredSegment = true;
    }
  }

  const totalLength = dists.get(toNode)!;
  // 1 local unit ≈ 8.5 real-world meters on MEA campus
  const lengthMeters = Math.round(totalLength * 8.5);
  // Average student walking speed 75 meters / minute
  const estMinutes = Math.max(1, Math.round(lengthMeters / 75));

  return {
    nodeIds,
    pts: nodeIds.map((id) => NODES[id]),
    lengthUnits: totalLength,
    lengthMeters,
    estMinutes,
    hasInferredSegment,
  };
}

export const findNearestNode = (pos: V2): string => {
  let closest = "N01";
  let minD = Infinity;
  Object.entries(NODES).forEach(([id, coord]) => {
    const d = dist(pos, coord);
    if (d < minD) {
      minD = d;
      closest = id;
    }
  });
  return closest;
};
