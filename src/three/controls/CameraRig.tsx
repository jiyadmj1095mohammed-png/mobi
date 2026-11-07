import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { V2 } from "@/data/campusData";

interface CameraRigProps {
  viewMode: "3d" | "2d";
  focusPoint: V2 | null;
}

export function CameraRig({ viewMode, focusPoint }: CameraRigProps) {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const targetCamPos = useRef(new THREE.Vector3(0, 95, 85));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 10));

  useEffect(() => {
    if (viewMode === "2d") {
      // 2D top-down orthographic/straight down view
      targetCamPos.current.set(focusPoint ? focusPoint[0] : 0, 130, focusPoint ? focusPoint[1] + 0.1 : 10.1);
      targetLookAt.current.set(focusPoint ? focusPoint[0] : 0, 0, focusPoint ? focusPoint[1] : 10);
    } else {
      // 3D Isometric View
      if (focusPoint) {
        targetCamPos.current.set(focusPoint[0] - 25, 45, focusPoint[1] + 35);
        targetLookAt.current.set(focusPoint[0], 0, focusPoint[1]);
      } else {
        targetCamPos.current.set(0, 95, 85);
        targetLookAt.current.set(0, 0, 10);
      }
    }
  }, [viewMode, focusPoint]);

  useFrame((_, delta) => {
    const factor = Math.min(1, delta * 3.5);
    camera.position.lerp(targetCamPos.current, factor);
    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLookAt.current, factor);
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.08}
      maxPolarAngle={viewMode === "2d" ? 0.05 : Math.PI / 2.2}
      minPolarAngle={0}
      minDistance={15}
      maxDistance={220}
      screenSpacePanning
      touches={{
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN,
      }}
    />
  );
}
