import { Html } from "@react-three/drei";
import { BUILDINGS, BuildingData } from "@/data/campusData";

interface BuildingsProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const WALL_COLORS: Record<BuildingData["kind"], string> = {
  academic: "#DFD8CB",
  auditorium: "#D2C5B5",
  hostel: "#E2DDD2",
  workshop: "#B0B5B3",
  unnamed: "#CCC5BA",
  external: "#C6BEB2",
};

const ROOF_COLORS: Record<BuildingData["kind"], string> = {
  academic: "#854D3D",
  auditorium: "#7C3F32",
  hostel: "#9E604F",
  workshop: "#5A626A",
  unnamed: "#887A6E",
  external: "#70685E",
};

export function Buildings({ selectedId, onSelect }: BuildingsProps) {
  return (
    <group>
      {BUILDINGS.map((b) => {
        const [w, d, h] = b.size;
        const isSelected = selectedId === b.id;

        return (
          <group
            key={b.id}
            position={[b.pos[0], 0, b.pos[1]]}
            rotation-y={(-b.rot * Math.PI) / 180}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(b.id);
            }}
          >
            {/* Main Building Mass */}
            <mesh position-y={h / 2} castShadow receiveShadow>
              <boxGeometry args={[w, h, d]} />
              <meshStandardMaterial
                color={WALL_COLORS[b.kind]}
                roughness={0.7}
                emissive={isSelected ? "#20C878" : "#000000"}
                emissiveIntensity={isSelected ? 0.35 : 0}
              />
            </mesh>

            {/* Architectural Modern Window Bands */}
            <mesh position-y={h * 0.52}>
              <boxGeometry args={[w + 0.1, h * 0.35, d + 0.1]} />
              <meshStandardMaterial
                color="#4B6B8A"
                roughness={0.2}
                metalness={0.7}
              />
            </mesh>

            {/* Overhanging Parapet / Roof Cap */}
            <mesh position-y={h + 0.25} castShadow receiveShadow>
              <boxGeometry args={[w + 0.6, 0.5, d + 0.6]} />
              <meshStandardMaterial
                color={ROOF_COLORS[b.kind]}
                roughness={0.8}
              />
            </mesh>

            {/* Entrance Portico / Canopy */}
            <mesh position={[0, 1.2, d / 2 + 0.8]} castShadow>
              <boxGeometry args={[Math.min(6, w * 0.4), 0.3, 1.6]} />
              <meshStandardMaterial color="#2E3A33" roughness={0.4} />
            </mesh>

            {/* Floating 3D Building Badge */}
            {b.named && b.kind !== "external" && (
              <Html
                position={[0, h + 3.2, 0]}
                center
                distanceFactor={70}
                style={{ pointerEvents: "none" }}
              >
                <div
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap shadow-lg backdrop-blur-sm transition-all duration-300 ${
                    isSelected
                      ? "bg-emerald-600 text-white ring-2 ring-emerald-300 scale-110"
                      : "bg-slate-900/85 text-slate-100 hover:bg-slate-900"
                  }`}
                >
                  {b.shortName}
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}
