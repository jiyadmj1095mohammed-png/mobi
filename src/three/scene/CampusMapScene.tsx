"use client";

import { Canvas } from "@react-three/fiber";
import { Line, ContactShadows } from "@react-three/drei";
import { V2, FACILITIES } from "@/data/campusData";
import { Terrain } from "./Terrain";
import { Buildings } from "../models/Buildings";
import { Trees } from "../models/Trees";
import { FacilityModel } from "../models/Facility";
import { CameraRig } from "../controls/CameraRig";

export interface CampusMapSceneProps {
  viewMode: "3d" | "2d";
  routePoints: V2[] | null;
  selectedId: string | null;
  focusPoint: V2 | null;
  startPoint: V2 | null;
  destinationPoint: V2 | null;
  onSelect: (id: string | null) => void;
  facilityFilter?: string;
}

export default function CampusMapScene({
  viewMode,
  routePoints,
  selectedId,
  focusPoint,
  startPoint,
  destinationPoint,
  onSelect,
  facilityFilter = "all",
}: CampusMapSceneProps) {
  const filteredFacilities = FACILITIES.filter((f) => {
    if (facilityFilter === "all") return true;
    if (facilityFilter === "waste") return f.category === "waste";
    if (facilityFilter === "sanitation") return f.category === "sanitation";
    if (facilityFilter === "hydration") return f.category === "hydration";
    if (facilityFilter === "amenity") return f.category === "amenity";
    return true;
  });

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 95, 85], fov: 42, far: 800 }}
        onPointerMissed={() => onSelect(null)}
      >
        <color attach="background" args={["#D9E8F5"]} />
        <fog attach="fog" args={["#D9E8F5", 140, 360]} />

        {/* Ambient & Natural Sunlight */}
        <ambientLight intensity={0.65} />
        <hemisphereLight args={["#FFFFFF", "#556B2F", 0.6]} />
        <directionalLight
          position={[60, 110, 50]}
          intensity={1.9}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-100}
          shadow-camera-right={100}
          shadow-camera-top={100}
          shadow-camera-bottom={-100}
          shadow-camera-far={350}
        />

        {/* Environment Terrain & Buildings */}
        <Terrain />
        <Buildings selectedId={selectedId} onSelect={onSelect} />
        <Trees />

        {/* Facilities (Bins, Washrooms, Water, Benches, Lights) */}
        {filteredFacilities.map((facility) => (
          <FacilityModel
            key={facility.id}
            facility={facility}
            isSelected={selectedId === facility.id}
            onSelect={onSelect}
          />
        ))}

        {/* Navigation Route Path Line */}
        {routePoints && routePoints.length > 1 && (
          <Line
            points={routePoints.map((p) => [p[0], 0.6, p[1]] as [number, number, number])}
            color="#2563EB"
            lineWidth={6}
          />
        )}

        {/* Start Point Pin (Emerald Sphere) */}
        {startPoint && (
          <mesh position={[startPoint[0], 1.2, startPoint[1]]}>
            <sphereGeometry args={[1.0, 16, 16]} />
            <meshStandardMaterial color="#20C878" emissive="#20C878" emissiveIntensity={0.8} />
          </mesh>
        )}

        {/* Destination Pin (Ruby Cone Marker) */}
        {destinationPoint && (
          <group position={[destinationPoint[0], 2.8, destinationPoint[1]]}>
            <mesh rotation-x={Math.PI}>
              <coneGeometry args={[1.0, 2.6, 16]} />
              <meshStandardMaterial color="#EF4444" emissive="#DC2626" emissiveIntensity={0.8} />
            </mesh>
          </group>
        )}

        {/* Realistic Contact Shadowing */}
        <ContactShadows position={[0, 0.15, 0]} opacity={0.4} scale={200} blur={2} far={15} />

        {/* Dynamic Smooth Camera Rig */}
        <CameraRig viewMode={viewMode} focusPoint={focusPoint} />
      </Canvas>
    </div>
  );
}
