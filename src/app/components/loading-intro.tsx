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

const INTRO_DURATION_MS = 2800;

function IntroWordmark3D({ progress }: { progress: number }) {
  const groupRef = useRef<Group>(null);
  const textMaterialRef = useRef<{ opacity: number } | null>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const reveal = MathUtils.smoothstep(progress, 0.28, 0.62);
    const spin = MathUtils.smoothstep(progress, 0.38, 0.9);
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
    () => 1 - MathUtils.smoothstep(progress, 0.26, 0.44),
    [progress]
  );
  const subtitleOpacity = useMemo(
    () => MathUtils.smoothstep(progress, 0.68, 0.94),
    [progress]
  );
  const sceneOpacity = useMemo(
    () => MathUtils.smoothstep(progress, 0.34, 0.62),
    [progress]
  );
  const pulseOpacity = useMemo(
    () => 0.22 + MathUtils.smoothstep(progress, 0, 1) * 0.22,
    [progress]
  );
  const progressLabel = useMemo(() => `${Math.round(progress * 100)}%`, [progress]);
  const stageLabel = useMemo(() => {
    if (progress < 0.34) return 'Boot Sequence';
    if (progress < 0.68) return 'Rendering Identity';
    if (progress < 0.92) return 'Composing Atmosphere';
    return 'Entering Portfolio';
  }, [progress]);

  return (
    <motion.div className="fixed inset-0 z-[140] flex items-center justify-center bg-[#0a0a0a]">
      <div className="intro-grain pointer-events-none absolute inset-0" />
      <div className="intro-scanlines pointer-events-none absolute inset-0" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 38%, rgba(255,255,255,0.06), transparent 45%), radial-gradient(circle at 14% 18%, rgba(201,31,46,0.12), transparent 34%), radial-gradient(circle at 84% 80%, rgba(244,239,232,0.08), transparent 30%)',
        }}
      />

      <div className="relative z-10 mx-auto h-full w-[min(92vw,72rem)]">
        <motion.div
          className="absolute left-1/2 top-[48%] h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full border"
          animate={{ opacity: [pulseOpacity * 0.55, pulseOpacity, pulseOpacity * 0.55], scale: [0.97, 1.02, 0.97] }}
          transition={{ duration: 2.1, ease: 'easeInOut', repeat: Infinity }}
          style={{
            borderColor: 'rgba(244,239,232,0.08)',
            boxShadow: '0 0 120px rgba(201,31,46,0.11)',
          }}
        />

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
          className="absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2 text-center"
          animate={{ opacity: sceneOpacity, y: sceneOpacity > 0.5 ? 0 : 6 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          style={{
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            fontSize: '0.64rem',
            color: 'rgba(244,239,232,0.42)',
          }}
        >
          {stageLabel}
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

        <motion.div
          className="absolute bottom-[14%] left-1/2 w-[min(76vw,24rem)] -translate-x-1/2"
          animate={{ opacity: subtitleOpacity }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
        >
          <div
            className="h-px w-full overflow-hidden"
            style={{ background: 'rgba(244,239,232,0.12)' }}
          >
            <motion.div
              className="h-full"
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.08, ease: 'linear' }}
              style={{
                background:
                  'linear-gradient(90deg, rgba(201,31,46,0.55) 0%, rgba(244,239,232,0.82) 100%)',
              }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.58rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(244,239,232,0.45)',
              }}
            >
              Loading
            </span>
            <span
              className="tabular-nums"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.58rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(244,239,232,0.55)',
              }}
            >
              {progressLabel}
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
