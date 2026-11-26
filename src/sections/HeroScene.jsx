import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { useRef } from "react";

// Your theme tokens, hardcoded here since there's no tailwind.config to read from at runtime.
const PRIMARY = "#8b5cf6"; // --primary
const HIGHLIGHT = "#22d3ee"; // --highlight

function DistortedSphere() {
  const meshRef = useRef();

  useFrame((state) => {
    const { pointer, clock } = state;
    if (!meshRef.current) return;
    // Slow idle rotation, nudged toward the pointer — subtle, not a toy.
    meshRef.current.rotation.y += 0.002;
    meshRef.current.rotation.x +=
      (pointer.y * 0.3 - meshRef.current.rotation.x) * 0.02;
    meshRef.current.rotation.z +=
      (pointer.x * 0.2 - meshRef.current.rotation.z) * 0.02;
    meshRef.current.position.y = Math.sin(clock.elapsedTime * 0.4) * 0.15;
  });

  return (
    <mesh ref={meshRef} scale={2.1}>
      <sphereGeometry args={[1, 64, 64]} />
      <MeshDistortMaterial
        color={PRIMARY}
        distort={0.45}
        speed={1.5}
        roughness={0.2}
        metalness={0.1}
        opacity={0.85}
        transparent
      />
    </mesh>
  );
}

export default function HeroScene({ particleCount = 120, maxDpr = 2 }) {
  return (
    <Canvas
      className="absolute inset-0"
      dpr={[1, maxDpr]}
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 3, 3]} intensity={1.2} />
      <DistortedSphere />
      <Sparkles
        count={particleCount}
        scale={6}
        size={2}
        speed={0.3}
        color={HIGHLIGHT}
        opacity={0.5}
      />
    </Canvas>
  );
}
