import { Html } from "@react-three/drei";
import { CampusFacilityData, FACILITY_COLORS } from "@/data/campusData";

interface FacilityModelProps {
  facility: CampusFacilityData;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function FacilityModel({ facility, isSelected, onSelect }: FacilityModelProps) {
  const color = FACILITY_COLORS[facility.type] || "#10B981";
  const type = facility.type;
  const isProposed = facility.status === "proposed";

  const emissiveColor = isSelected ? "#FFFFFF" : color;
  const emissiveIntensity = isSelected ? 0.7 : 0.15;

  return (
    <group
      position={[facility.pos[0], 0, facility.pos[1]]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(facility.id);
      }}
    >
      {/* Proposed Status Ground Indicator Ring */}
      {isProposed && (
        <mesh rotation-x={-Math.PI / 2} position-y={0.06}>
          <ringGeometry args={[0.9, 1.15, 24]} />
          <meshBasicMaterial color={color} transparent opacity={isSelected ? 0.9 : 0.45} />
        </mesh>
      )}

      {/* Selected Halo Indicator */}
      {isSelected && (
        <mesh rotation-x={-Math.PI / 2} position-y={0.08}>
          <ringGeometry args={[1.3, 1.6, 32]} />
          <meshBasicMaterial color="#20C878" transparent opacity={0.8} />
        </mesh>
      )}

      {/* 1. Waste Bins (Blue General, Yellow Dry, Green Wet, Orange Plastic, Red E-waste) */}
      {type.startsWith("bin") && (
        <group>
          {/* Bin Container */}
          <mesh position-y={0.55} castShadow>
            <cylinderGeometry args={[0.42, 0.36, 1.1, 16]} />
            <meshStandardMaterial
              color={color}
              roughness={0.4}
              metalness={0.2}
              emissive={emissiveColor}
              emissiveIntensity={emissiveIntensity}
            />
          </mesh>
          {/* Bin Flap Lid */}
          <mesh position-y={1.12}>
            <cylinderGeometry args={[0.46, 0.46, 0.12, 16]} />
            <meshStandardMaterial color="#1E293B" roughness={0.6} />
          </mesh>
        </group>
      )}

      {/* 2. Restrooms / Washrooms */}
      {type.startsWith("wc") && (
        <group>
          <mesh position-y={1.2} castShadow>
            <boxGeometry args={[2.0, 2.4, 1.8]} />
            <meshStandardMaterial
              color="#F1F5F9"
              roughness={0.5}
              emissive={emissiveColor}
              emissiveIntensity={isSelected ? 0.3 : 0}
            />
          </mesh>
          <mesh position-y={2.45} castShadow>
            <boxGeometry args={[2.3, 0.2, 2.1]} />
            <meshStandardMaterial color={color} roughness={0.3} />
          </mesh>
        </group>
      )}

      {/* 3. Drinking Water / Handwashing Stations */}
      {(type === "water" || type === "handwash") && (
        <group>
          <mesh position-y={0.55} castShadow>
            <cylinderGeometry args={[0.22, 0.28, 1.1, 12]} />
            <meshStandardMaterial color="#E2E8F0" roughness={0.3} metalness={0.4} />
          </mesh>
          <mesh position-y={1.15} castShadow>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial
              color={color}
              roughness={0.2}
              emissive={color}
              emissiveIntensity={0.6}
            />
          </mesh>
        </group>
      )}

      {/* 4. Eco Seating Bench */}
      {type === "bench" && (
        <group>
          {/* Seat */}
          <mesh position-y={0.48} castShadow>
            <boxGeometry args={[1.9, 0.12, 0.6]} />
            <meshStandardMaterial color="#8B5CF6" roughness={0.5} />
          </mesh>
          {/* Backrest */}
          <mesh position={[0, 0.85, -0.25]} castShadow>
            <boxGeometry args={[1.9, 0.45, 0.08]} />
            <meshStandardMaterial color="#7C3AED" roughness={0.5} />
          </mesh>
          {/* Legs */}
          {[-0.75, 0.75].map((x) => (
            <mesh key={x} position={[x, 0.24, 0]} castShadow>
              <boxGeometry args={[0.1, 0.48, 0.5]} />
              <meshStandardMaterial color="#334155" roughness={0.7} />
            </mesh>
          ))}
        </group>
      )}

      {/* 5. Streetlight with Warm Solar Bulb */}
      {type === "light" && (
        <group>
          <mesh position-y={1.9} castShadow>
            <cylinderGeometry args={[0.07, 0.12, 3.8, 8]} />
            <meshStandardMaterial color="#334155" roughness={0.6} />
          </mesh>
          {/* Solar Panel */}
          <mesh position={[0, 3.9, 0]} rotation-x={0.3}>
            <boxGeometry args={[0.8, 0.05, 0.5]} />
            <meshStandardMaterial color="#0F172A" roughness={0.2} metalness={0.8} />
          </mesh>
          {/* Glowing Lamp */}
          <mesh position={[0, 3.65, 0.2]}>
            <sphereGeometry args={[0.26, 16, 16]} />
            <meshStandardMaterial
              color="#FDE047"
              emissive="#FACC15"
              emissiveIntensity={1.8}
            />
          </mesh>
        </group>
      )}

      {/* 6. Campus Entrance Arch */}
      {type === "entrance" && (
        <group>
          <mesh position={[-2.2, 1.8, 0]} castShadow>
            <boxGeometry args={[0.4, 3.6, 0.4]} />
            <meshStandardMaterial color="#EA580C" roughness={0.4} />
          </mesh>
          <mesh position={[2.2, 1.8, 0]} castShadow>
            <boxGeometry args={[0.4, 3.6, 0.4]} />
            <meshStandardMaterial color="#EA580C" roughness={0.4} />
          </mesh>
          <mesh position-y={3.6} castShadow>
            <boxGeometry args={[5.2, 0.45, 0.5]} />
            <meshStandardMaterial color="#C2410C" roughness={0.4} />
          </mesh>
        </group>
      )}

      {/* 7. Campus Bus Shelter */}
      {type === "bus" && (
        <group>
          <mesh position-y={1.5} castShadow>
            <boxGeometry args={[3.4, 0.18, 1.8]} />
            <meshStandardMaterial color="#6D28D9" roughness={0.3} />
          </mesh>
          {[-1.5, 1.5].map((x) => (
            <mesh key={x} position={[x, 0.75, 0]} castShadow>
              <cylinderGeometry args={[0.08, 0.08, 1.5, 8]} />
              <meshStandardMaterial color="#334155" roughness={0.5} />
            </mesh>
          ))}
          {/* Glass Backing */}
          <mesh position={[0, 0.75, -0.85]}>
            <boxGeometry args={[3.2, 1.3, 0.05]} />
            <meshStandardMaterial color="#94A3B8" transparent opacity={0.6} />
          </mesh>
        </group>
      )}

      {/* Selected Info Pill in 3D Space */}
      {isSelected && (
        <Html position={[0, 2.2, 0]} center distanceFactor={45} style={{ pointerEvents: "none" }}>
          <div className="bg-slate-900/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-xl whitespace-nowrap border border-emerald-500/50">
            {facility.id} · {facility.status === "proposed" ? "PROPOSED" : "VERIFIED"}
          </div>
        </Html>
      )}
    </group>
  );
}
