"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, Torus } from "@react-three/drei";
import { useRef } from "react";
import type { Mesh } from "three";

function FloatingShapes() {
  const torusRef = useRef<Mesh>(null);
  const sphereRef = useRef<Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (torusRef.current) {
      torusRef.current.rotation.x = t * 0.3;
      torusRef.current.rotation.y = t * 0.5;
    }
    if (sphereRef.current) {
      sphereRef.current.rotation.y = t * 0.4;
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#FF6B9D" />
      <pointLight position={[-10, -5, 5]} intensity={1} color="#C084FC" />
      <spotLight position={[0, 10, 0]} intensity={0.8} color="#F59E0B" angle={0.3} />

      <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
        <Torus ref={torusRef} args={[1.2, 0.35, 32, 64]} position={[-2, 0.5, 0]}>
          <MeshDistortMaterial
            color="#FF6B9D"
            attach="material"
            distort={0.3}
            speed={2}
            roughness={0.2}
            metalness={0.8}
          />
        </Torus>
      </Float>

      <Float speed={1.5} rotationIntensity={0.8} floatIntensity={2}>
        <Sphere ref={sphereRef} args={[0.9, 64, 64]} position={[2.2, -0.3, -1]}>
          <MeshDistortMaterial
            color="#C084FC"
            attach="material"
            distort={0.4}
            speed={3}
            roughness={0.1}
            metalness={0.9}
          />
        </Sphere>
      </Float>

      <Float speed={2.5} rotationIntensity={1} floatIntensity={1}>
        <Sphere args={[0.5, 32, 32]} position={[0.5, 1.5, -2]}>
          <meshStandardMaterial color="#F59E0B" metalness={0.9} roughness={0.1} />
        </Sphere>
      </Float>

      <Float speed={1.8} rotationIntensity={0.6} floatIntensity={1.2}>
        <Torus args={[0.6, 0.15, 16, 32]} position={[-1, -1.2, -1.5]} rotation={[1, 0.5, 0]}>
          <meshStandardMaterial color="#34D399" metalness={0.7} roughness={0.2} />
        </Torus>
      </Float>
    </>
  );
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]}>
        <FloatingShapes />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0118]/60 to-[#0a0118]" />
    </div>
  );
}
