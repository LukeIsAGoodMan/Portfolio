"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Float } from "@react-three/drei";
import { useRef, useState, useMemo, useCallback } from "react";
import * as THREE from "three";

/* ─────────────────────────────────────────────
 * Procedural noise DataTexture (no DOM needed)
 * Matches the global paper-grain aesthetic
 * ───────────────────────────────────────────── */
function createNoiseTexture(size = 128): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  for (let i = 0; i < data.length; i += 4) {
    const v = Math.floor(Math.random() * 255);
    data[i] = v;
    data[i + 1] = v;
    data[i + 2] = v;
    data[i + 3] = 255;
  }
  const tex = new THREE.DataTexture(data, size, size);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.needsUpdate = true;
  return tex;
}

/* ─────────────────────────────────────────────
 * Glassmorphic Torus Knot
 * MeshPhysicalMaterial with high transmission,
 * low roughness, animated noise bump map
 * ───────────────────────────────────────────── */
function GlassCore({ hovered }: { hovered: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const noiseTexture = useMemo(() => createNoiseTexture(128), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    // Subtle self-rotation layered on top of OrbitControls auto-rotate
    const speed = hovered ? 0.2 : 0.08;
    meshRef.current.rotation.y += speed * 0.01;
    meshRef.current.rotation.x += speed * 0.004;

    // Animate noise texture UV offset — slow drift for living grain
    noiseTexture.offset.x = Math.sin(t * 0.2) * 0.12;
    noiseTexture.offset.y = Math.cos(t * 0.15) * 0.12;
    noiseTexture.needsUpdate = true;

    // Smooth envMapIntensity lerp for hover glow
    if (materialRef.current) {
      const target = hovered ? 3.0 : 1.4;
      materialRef.current.envMapIntensity +=
        (target - materialRef.current.envMapIntensity) * 0.06;
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1, 0.35, 200, 32]} />
      <meshPhysicalMaterial
        ref={materialRef}
        transmission={0.5}
        roughness={0.12}
        thickness={2.5}
        ior={1.45}
        clearcoat={1}
        clearcoatRoughness={0.05}
        envMapIntensity={1.8}
        color="#ffffff"
        emissive={hovered ? "#1a1a3a" : "#0a0a1a"}
        emissiveIntensity={hovered ? 0.15 : 0.05}
        bumpMap={noiseTexture}
        bumpScale={0.015}
        transparent
        opacity={0.85}
        attenuationColor={new THREE.Color("#d4e4ff")}
        attenuationDistance={3}
      />
    </mesh>
  );
}

/* ─────────────────────────────────────────────
 * Scene — composes lighting, glass mesh,
 * orbit controls with reactive auto-rotate speed
 * ───────────────────────────────────────────── */
function Scene() {
  const [hovered, setHovered] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null);
  const glowRef = useRef<THREE.PointLight>(null);

  const onPointerOver = useCallback(() => setHovered(true), []);
  const onPointerOut = useCallback(() => setHovered(false), []);

  // Smooth transitions for auto-rotate speed and glow light
  useFrame(() => {
    if (controlsRef.current) {
      const targetSpeed = hovered ? 2.8 : 0.6;
      controlsRef.current.autoRotateSpeed +=
        (targetSpeed - controlsRef.current.autoRotateSpeed) * 0.04;
    }
    if (glowRef.current) {
      const targetIntensity = hovered ? 2.0 : 0.5;
      glowRef.current.intensity +=
        (targetIntensity - glowRef.current.intensity) * 0.05;
    }
  });

  return (
    <>
      {/* Lighting — bright ambient so the glass is visible against #f5f5f7 */}
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <pointLight
        ref={glowRef}
        position={[-3, 2, 4]}
        intensity={0.5}
        color="#c4d4ff"
      />

      {/* Environment for reflections/refractions (not background) */}
      <Environment preset="city" background={false} />

      {/* Floating glass torus knot */}
      <Float speed={1.6} rotationIntensity={0.15} floatIntensity={0.35}>
        <group onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
          <GlassCore hovered={hovered} />
        </group>
      </Float>

      {/* Orbit — rotation only, no zoom/pan */}
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.6}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 3}
      />
    </>
  );
}

/* ─────────────────────────────────────────────
 * Canvas wrapper — transparent, responsive,
 * retina-aware, loaded client-only via
 * dynamic import in Hero.tsx
 * ───────────────────────────────────────────── */
export default function KnowledgeCore() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.5], fov: 40 }}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      }}
      style={{ background: "transparent", width: "100%", height: "100%" }}
      dpr={[1, 2]}
    >
      <Scene />
    </Canvas>
  );
}
