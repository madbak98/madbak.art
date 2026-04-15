/// <reference types="@react-three/fiber" />

import React from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { motion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { MathUtils, type Group } from 'three';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      meshStandardMaterial: any;
      ambientLight: any;
      directionalLight: any;
      pointLight: any;
    }
  }
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      meshStandardMaterial: any;
      ambientLight: any;
      directionalLight: any;
      pointLight: any;
    }
  }
}

const INTRO_DURATION_MS = 1900;

function IntroWordmark3D({ progress }: { progress: number }) {
  const groupRef = useRef<Group>(null);
  const textMaterialRef = useRef<{ opacity: number } | null>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const reveal = MathUtils.smoothstep(progress, 0.25, 0.55);
    const spin = MathUtils.smoothstep(progress, 0.32, 0.9);
    const finalPush = MathUtils.smoothstep(progress, 0.9, 1);

    const targetOpacity = reveal;
    const targetScale = 0.92 + reveal * 0.16 + finalPush * 0.08;
    const targetRotationY = spin * Math.PI * 2;
    const targetZ = finalPush * 0.16;

    groupRef.current.rotation.y = MathUtils.damp(
      groupRef.current.rotation.y,
      targetRotationY,
      5.6,
      delta
    );
    groupRef.current.position.z = MathUtils.damp(groupRef.current.position.z, targetZ, 5.4, delta);
    const nextScale = MathUtils.damp(groupRef.current.scale.x, targetScale, 5.4, delta);
    groupRef.current.scale.setScalar(nextScale);

    if (textMaterialRef.current) {
      textMaterialRef.current.opacity = MathUtils.damp(
        textMaterialRef.current.opacity,
        targetOpacity,
        7,
        delta
      );
    }
  });

  return (
    <group ref={groupRef}>
      <Text
        font="https://fonts.gstatic.com/s/barlowcondensed/v12/HTxwL3I-JCGChYJ8VI-L6OO_au7B6xHT2Q.woff"
        fontSize={1.1}
        letterSpacing={-0.035}
        maxWidth={8}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
      >
        MADBAK
        <meshStandardMaterial
          ref={textMaterialRef}
          color="#f4efe8"
          metalness={0.45}
          roughness={0.34}
          envMapIntensity={0.42}
          transparent
          opacity={0}
        />
      </Text>
    </group>
  );
}

export function LoadingIntro() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const start = performance.now();
    let frameId = 0;

    const tick = () => {
      if (cancelled) return;
      const elapsed = performance.now() - start;
      const next = Math.min(1, elapsed / INTRO_DURATION_MS);
      setProgress(next);
      if (next < 1) frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
    };
  }, []);

  const loadingOpacity = useMemo(
    () => 1 - MathUtils.smoothstep(progress, 0.24, 0.38),
    [progress]
  );
  const subtitleOpacity = useMemo(
    () => MathUtils.smoothstep(progress, 0.58, 0.9),
    [progress]
  );
  const sceneOpacity = useMemo(
    () => MathUtils.smoothstep(progress, 0.28, 0.52),
    [progress]
  );

  return (
    <motion.div className="fixed inset-0 z-[140] flex items-center justify-center bg-[#0a0a0a]">
      <div className="intro-grain pointer-events-none absolute inset-0" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 38%, rgba(255,255,255,0.06), transparent 45%), radial-gradient(circle at 14% 18%, rgba(201,31,46,0.12), transparent 34%), radial-gradient(circle at 84% 80%, rgba(244,239,232,0.08), transparent 30%)',
        }}
      />

      <div className="relative z-10 mx-auto h-full w-[min(92vw,72rem)]">
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: sceneOpacity }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <Canvas dpr={[1, 1.8]} camera={{ position: [0, 0, 4.4], fov: 32 }}>
            <ambientLight intensity={0.62} />
            <directionalLight position={[2.8, 3.2, 4.2]} intensity={1.65} color="#f3ebe0" />
            <directionalLight position={[-3.4, 0.7, -2.5]} intensity={1.15} color="#c91f2e" />
            <pointLight position={[0, -1.3, 2.3]} intensity={0.56} color="#ffffff" />
            <IntroWordmark3D progress={progress} />
          </Canvas>
        </motion.div>

        <motion.div
          className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2"
          animate={{ opacity: loadingOpacity, y: loadingOpacity > 0.5 ? 0 : -8 }}
          transition={{ duration: 0.32, ease: 'easeInOut' }}
          style={{
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.34em',
            textTransform: 'uppercase',
            fontSize: '0.72rem',
            color: 'rgba(244,239,232,0.58)',
          }}
        >
          INITIALIZING
        </motion.div>

        <motion.div
          className="absolute left-1/2 top-[61%] -translate-x-1/2 -translate-y-1/2 text-center"
          animate={{ opacity: subtitleOpacity, y: subtitleOpacity > 0.5 ? 0 : 10 }}
          transition={{ duration: 0.42, ease: 'easeInOut' }}
          style={{
            fontFamily: 'var(--font-body)',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            fontSize: '0.82rem',
            color: 'rgba(244,239,232,0.62)',
          }}
        >
          Creative Developer / Designer
        </motion.div>
      </div>
    </motion.div>
  );
}
