import { useMemo, useRef, useLayoutEffect } from "react";
import * as THREE from "three";
import { CAMPUS_BOUNDARY, EDGES, NODES, ROADS, BUILDINGS, dist, V2 } from "@/data/campusData";

export interface TreeInstance {
  x: number;
  z: number;
  scale: number;
  type: number;
}

// Deterministic Pseudo-random number generator
function seededRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function isInsidePolygon(point: V2, poly: V2[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    const intersect = yi > point[1] !== yj > point[1] && point[0] < ((xj - xi) * (point[1] - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function distToSegment(p: V2, v: V2, w: V2): number {
  const l2 = (w[0] - v[0]) ** 2 + (w[1] - v[1]) ** 2;
  if (l2 === 0) return dist(p, v);
  let t = ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;
  t = Math.max(0, Math.min(1, t));
  return dist(p, [v[0] + t * (w[0] - v[0]), v[1] + t * (w[1] - v[1])]);
}

export function generateCampusTrees(count = 280): TreeInstance[] {
  const rand = seededRandom(1095);
  const trees: TreeInstance[] = [];

  const segments: [V2, V2][] = [
    ...EDGES.map(([a, b]) => [NODES[a], NODES[b]] as [V2, V2]),
    ...ROADS.flatMap((r) => r.pts.slice(1).map((p, i) => [r.pts[i], p] as [V2, V2])),
  ];

  for (let attempt = 0; attempt < count * 15 && trees.length < count; attempt++) {
    const candidate: V2 = [-60 + rand() * 120, -50 + rand() * 105];

    // Must be inside campus boundary
    if (!isInsidePolygon(candidate, CAMPUS_BOUNDARY)) continue;

    // Must stay clear of pedestrian pathways and roads
    if (segments.some(([a, b]) => distToSegment(candidate, a, b) < 2.8)) continue;

    // Must not collide with building footprints
    if (
      BUILDINGS.some(
        (b) => dist(candidate, b.pos) < Math.max(b.size[0], b.size[1]) / 2 + 2.5
      )
    )
      continue;

    trees.push({
      x: candidate[0],
      z: candidate[1],
      scale: 0.75 + rand() * 0.7,
      type: rand() > 0.4 ? 1 : 0,
    });
  }

  return trees;
}

export function Trees({ customTrees }: { customTrees?: TreeInstance[] }) {
  const trees = useMemo(() => customTrees || generateCampusTrees(), [customTrees]);

  const foliageRef = useRef<THREE.InstancedMesh>(null);
  const trunkRef = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    if (!foliageRef.current || !trunkRef.current) return;

    const dummy = new THREE.Object3D();

    trees.forEach((tree, idx) => {
      // Trunk
      dummy.position.set(tree.x, (tree.scale * 1.2) / 2, tree.z);
      dummy.scale.set(tree.scale, tree.scale, tree.scale);
      dummy.rotation.set(0, (tree.x + tree.z) * 10, 0);
      dummy.updateMatrix();
      trunkRef.current!.setMatrixAt(idx, dummy.matrix);

      // Foliage
      dummy.position.set(tree.x, tree.scale * 1.8, tree.z);
      dummy.scale.set(tree.scale * 1.4, tree.scale * 1.8, tree.scale * 1.4);
      dummy.updateMatrix();
      foliageRef.current!.setMatrixAt(idx, dummy.matrix);
    });

    trunkRef.current.instanceMatrix.needsUpdate = true;
    foliageRef.current.instanceMatrix.needsUpdate = true;
  }, [trees]);

  return (
    <group>
      {/* Tree Trunks */}
      <instancedMesh ref={trunkRef} args={[undefined, undefined, trees.length]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.35, 1.4, 6]} />
        <meshStandardMaterial color="#4A3525" roughness={0.9} />
      </instancedMesh>

      {/* Lush Foliage Cones / Spheres */}
      <instancedMesh ref={foliageRef} args={[undefined, undefined, trees.length]} castShadow>
        <dodecahedronGeometry args={[1.2, 1]} />
        <meshStandardMaterial color="#2E7D32" roughness={0.7} />
      </instancedMesh>
    </group>
  );
}
