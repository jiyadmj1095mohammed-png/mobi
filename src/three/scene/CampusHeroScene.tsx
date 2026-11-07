"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, ContactShadows, PresentationControls } from "@react-three/drei";
import * as THREE from "three";

function CampusMiniature() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.6, 0]}>
      {/* Floating Island Ground Base */}
      <mesh position-y={-0.3} receiveShadow>
        <cylinderGeometry args={[4.2, 3.8, 0.6, 32]} />
        <meshStandardMaterial color="#0B3829" roughness={0.6} />
      </mesh>

      {/* Lush Green Turf Cap */}
      <mesh position-y={0.02} receiveShadow>
        <cylinderGeometry args={[4.1, 4.1, 0.08, 32]} />
        <meshStandardMaterial color="#1E5C3E" roughness={0.7} />
      </mesh>

      {/* Main Block Academic Building (Miniature) */}
      <group position={[-0.4, 0.5, 0.2]} rotation-y={0.5}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.6, 1.0, 1.2]} />
          <meshStandardMaterial color="#E2DDD2" roughness={0.4} />
        </mesh>
        {/* Glass Windows Band */}
        <mesh position-y={0.05}>
          <boxGeometry args={[1.62, 0.35, 1.22]} />
          <meshStandardMaterial color="#38BDF8" roughness={0.2} metalness={0.7} />
        </mesh>
        {/* Roof Cap */}
        <mesh position-y={0.55} castShadow>
          <boxGeometry args={[1.7, 0.1, 1.3]} />
          <meshStandardMaterial color="#20C878" roughness={0.3} />
        </mesh>
      </group>

      {/* Auditorium (Miniature) */}
      <group position={[1.4, 0.35, -0.6]} rotation-y={-0.3}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.7, 0.9]} />
          <meshStandardMaterial color="#CFD8DC" roughness={0.5} />
        </mesh>
        <mesh position-y={0.4} castShadow>
          <boxGeometry args={[1.25, 0.1, 0.95]} />
          <meshStandardMaterial color="#55D98A" roughness={0.3} />
        </mesh>
      </group>

      {/* Civil Department (Miniature) */}
      <group position={[-1.6, 0.4, -1.0]} rotation-y={0.4}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.0, 0.8, 0.7]} />
          <meshStandardMaterial color="#ECEFF1" roughness={0.4} />
        </mesh>
      </group>

      {/* Pathway Loops */}
      <mesh rotation-x={-Math.PI / 2} position-y={0.07}>
        <ringGeometry args={[2.0, 2.3, 32]} />
        <meshBasicMaterial color="#E2E8F0" transparent opacity={0.6} />
      </mesh>

      {/* Mini Trees Scatter */}
      {[
        [-1.8, 1.2],
        [-1.0, 2.2],
        [0.8, 2.0],
        [2.2, 1.0],
        [2.0, -1.4],
        [0.2, -2.4],
        [-2.4, -0.6],
        [0.0, 1.4],
      ].map(([x, z], i) => (
        <group key={i} position={[x * 0.9, 0, z * 0.9]}>
          <mesh position-y={0.2} castShadow>
            <cylinderGeometry args={[0.04, 0.08, 0.4, 6]} />
            <meshStandardMaterial color="#4A3525" />
          </mesh>
          <mesh position-y={0.55} castShadow>
            <dodecahedronGeometry args={[0.32, 1]} />
            <meshStandardMaterial color={i % 2 === 0 ? "#20C878" : "#55D98A"} roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* Tiny Segregation Bins */}
      <mesh position={[0.6, 0.12, 1.2]}>
        <cylinderGeometry args={[0.08, 0.08, 0.22, 10]} />
        <meshStandardMaterial color="#2563EB" emissive="#2563EB" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.85, 0.12, 1.2]}>
        <cylinderGeometry args={[0.08, 0.08, 0.22, 10]} />
        <meshStandardMaterial color="#EAB308" emissive="#EAB308" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[1.1, 0.12, 1.2]}>
        <cylinderGeometry args={[0.08, 0.08, 0.22, 10]} />
        <meshStandardMaterial color="#16A34A" emissive="#16A34A" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

export default function CampusHeroScene() {
  return (
    <div className="w-full h-[380px] sm:h-[460px] md:h-[520px] relative select-none">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 4.2, 7.5], fov: 45 }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={2.2}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-4, 3, -4]} intensity={1.5} color="#20C878" />

        <PresentationControls
          global
          config={{ mass: 2, tension: 250 }}
          snap={{ mass: 4, tension: 300 }}
          rotation={[0.3, 0.4, 0]}
          polar={[-Math.PI / 6, Math.PI / 4]}
          azimuth={[-Math.PI / 3, Math.PI / 3]}
        >
          <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.4}>
            <CampusMiniature />
          </Float>
        </PresentationControls>

        <ContactShadows position={[0, -1.2, 0]} opacity={0.5} scale={12} blur={2.4} far={8} />
      </Canvas>
    </div>
  );
}
