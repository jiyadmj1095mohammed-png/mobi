import { useMemo } from "react";
import * as THREE from "three";
import { CAMPUS_BOUNDARY, PLAY_FIELD, ROADS, NODES, EDGES, V2 } from "@/data/campusData";

function PolygonMesh({ pts, color, yOffset }: { pts: V2[]; color: string; yOffset: number }) {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    pts.forEach((p, i) => {
      if (i === 0) s.moveTo(p[0], -p[1]);
      else s.lineTo(p[0], -p[1]);
    });
    return s;
  }, [pts]);

  return (
    <mesh rotation-x={-Math.PI / 2} position-y={yOffset} receiveShadow>
      <shapeGeometry args={[shape]} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
  );
}

function RoadStrip({ start, end, width, color, yOffset }: { start: V2; end: V2; width: number; color: string; yOffset: number }) {
  const length = Math.hypot(end[0] - start[0], end[1] - start[1]);
  const angle = -Math.atan2(end[1] - start[1], end[0] - start[0]);
  const midX = (start[0] + end[0]) / 2;
  const midZ = (start[1] + end[1]) / 2;

  return (
    <mesh position={[midX, yOffset, midZ]} rotation-y={angle} receiveShadow>
      <boxGeometry args={[length + width * 0.4, 0.08, width]} />
      <meshStandardMaterial color={color} roughness={0.8} />
    </mesh>
  );
}

export function Terrain() {
  return (
    <group>
      {/* Outer Regional Earth Base */}
      <mesh rotation-x={-Math.PI / 2} position-y={0} receiveShadow>
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial color="#5C6C42" roughness={1} />
      </mesh>

      {/* Campus Boundary Green Turf */}
      <PolygonMesh pts={CAMPUS_BOUNDARY} color="#4F7A3E" yOffset={0.03} />

      {/* College Sports & Playfield Area */}
      <PolygonMesh pts={PLAY_FIELD} color="#94A346" yOffset={0.05} />

      {/* Vehicular Paved Asphalt Roads (SH39 & Nilambur Road) */}
      {ROADS.flatMap((road) =>
        road.pts.slice(1).map((point, idx) => (
          <RoadStrip
            key={`${road.name}-${idx}`}
            start={road.pts[idx]}
            end={point}
            width={3.6}
            color="#2A2E33"
            yOffset={0.07}
          />
        ))
      )}

      {/* Internal Pedestrian Pathway Network (Traced Footpaths) */}
      {EDGES.map(([nodeA, nodeB, isConfirmed], idx) => (
        <RoadStrip
          key={`edge-${idx}-${nodeA}-${nodeB}`}
          start={NODES[nodeA]}
          end={NODES[nodeB]}
          width={1.6}
          color={isConfirmed ? "#E7E5E0" : "#D4CEBE"}
          yOffset={0.09}
        />
      ))}
    </group>
  );
}
