"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Float, Text } from "@react-three/drei";
import type { Group } from "three";

function BottleNoir({ isDark }: { isDark: boolean }) {
  const group = useRef<Group>(null);
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.42;
  });

  const bodyColor = isDark ? "#f5f1ea" : "#0b0b0d";
  const stripColor = isDark ? "#1a1407" : "#b8923a";
  const labelColor = isDark ? "#e8e0d0" : "#17171a";
  const textColor = isDark ? "#1a1407" : "#d4b25a";

  return (
    <Float speed={1.1} rotationIntensity={0.025} floatIntensity={0.16}>
      <group ref={group} position={[0, -0.3, 0]}>
        {/* Cuerpo: bloque negro brillante */}
        <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.32, 1.9, 0.52, 3, 3, 3]} />
          <meshPhysicalMaterial
            color={bodyColor}
            roughness={0.12}
            metalness={0.35}
            clearcoat={1}
            clearcoatRoughness={0.05}
          />
        </mesh>

        {/* Franja dorada vertical en el frente y en la parte trasera */}
        {[1, -1].map((side) => (
          <mesh key={side} position={[0.42, 0.05, side * 0.265]}>
            <boxGeometry args={[0.035, 1.7, 0.01]} />
            <meshStandardMaterial
              color={stripColor}
              metalness={0.85}
              roughness={0.22}
            />
          </mesh>
        ))}

        {/* Placa de etiqueta frontal */}
        <mesh position={[-0.08, 0.1, 0.268]}>
          <boxGeometry args={[0.78, 0.62, 0.012]} />
          <meshStandardMaterial color={labelColor} metalness={0.5} roughness={0.3} />
        </mesh>
        <Text
          position={[-0.08, 0.2, 0.278]}
          fontSize={0.1}
          maxWidth={0.7}
          color={textColor}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.12}
        >
          La Casa
        </Text>
        <Text
          position={[-0.08, 0.02, 0.278]}
          fontSize={0.12}
          maxWidth={0.7}
          color={textColor}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.14}
        >
          Del Árabe
        </Text>
        <mesh position={[-0.08, -0.1, 0.278]}>
          <boxGeometry args={[0.4, 0.008, 0.008]} />
          <meshStandardMaterial color="#b8923a" metalness={0.85} roughness={0.22} />
        </mesh>

        {/* Hombro / cuello */}
        <mesh position={[0, 1.07, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.26, 0.12, 40]} />
          <meshStandardMaterial color="#0b0b0d" metalness={0.6} roughness={0.2} />
        </mesh>
        <mesh position={[0, 1.16, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.06, 40]} />
          <meshStandardMaterial color="#b8923a" metalness={0.85} roughness={0.22} />
        </mesh>

        {/* Tapa negra mate */}
        <mesh position={[0, 1.42, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 0.46, 48]} />
          <meshStandardMaterial color="#121214" metalness={0.3} roughness={0.35} />
        </mesh>
        <mesh position={[0, 1.66, 0]}>
          <cylinderGeometry args={[0.27, 0.3, 0.03, 48]} />
          <meshStandardMaterial color="#b8923a" metalness={0.85} roughness={0.22} />
        </mesh>

        {/* Base */}
        <mesh position={[0, -0.93, 0]}>
          <boxGeometry args={[1.34, 0.06, 0.54]} />
          <meshStandardMaterial color="#b8923a" metalness={0.8} roughness={0.25} />
        </mesh>
      </group>
    </Float>
  );
}

export function PerfumeTurntable() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.getAttribute("data-theme") === "dark");
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="turntable-wrap">
      <div className="turntable-copy">
        <p className="eyebrow">UNA FRAGANCIA, TODOS SUS ÁNGULOS</p>
        <h2>Descubre la esencia</h2>
      </div>
      <div className="turntable-canvas">
        <Canvas
          shadows
          camera={{ position: [0, 0.2, 5.2], fov: 34 }}
          dpr={[1, 1.7]}
        >
          <color attach="background" args={[isDark ? "#0f0c08" : "#ecebe8"]} />
          <ambientLight intensity={isDark ? 0.8 : 1.2} />
          <directionalLight position={[3, 4, 4]} intensity={isDark ? 1.8 : 2.2} castShadow />
          <directionalLight position={[-3, 1, -2]} intensity={isDark ? 1 : 1.5} />
          <Suspense fallback={null}>
            <Environment preset={isDark ? "city" : "studio"} />
            <BottleNoir isDark={isDark} />
            <ContactShadows
              position={[0, -1.4, 0]}
              opacity={isDark ? 0.35 : 0.3}
              scale={3.5}
              blur={2.2}
              far={2}
            />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}