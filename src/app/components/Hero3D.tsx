import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Center, Clone, useGLTF } from '@react-three/drei';
import type { MotionValue } from 'motion/react';
import { Suspense, useRef } from 'react';
import { MathUtils, type Group } from 'three';

type Hero3DProps = {
  scrollProgress: MotionValue<number>;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
};

type HeroTransform = {
  x: number;
  y: number;
  scale: number;
};

type HeroModelConfig = {
  id: string;
  path: string;
  desktop: HeroTransform;
  tablet: HeroTransform;
  mobile: HeroTransform;
  pointerOffsetX: number;
  pointerOffsetY: number;
  tiltX: number;
  tiltZ: number;
  floatAmplitude: number;
  floatSpeed: number;
  rotationMultiplier?: number;
  rotationOffset?: number;
  idlePhase?: number;
};

// Add more GLB entries here after placing them in public/models.
const HERO_MODELS: HeroModelConfig[] = [
  {
    id: 'sam',
    path: '/models/characters-sam.glb',
    desktop: { x: 2.72, y: 1.54, scale: 1.38 },
    tablet: { x: 2.18, y: 1.2, scale: 1.12 },
    mobile: { x: 1.44, y: 0.92, scale: 0.92 },
    pointerOffsetX: 0.34,
    pointerOffsetY: 0.18,
    tiltX: 0.08,
    tiltZ: 0.12,
    floatAmplitude: 0.08,
    floatSpeed: 1.08,
    rotationMultiplier: 1,
    rotationOffset: 0.36,
    idlePhase: 0,
  },
  {
    id: 'matt',
    path: '/models/characters-matt.glb',
    desktop: { x: 1.88, y: 2.18, scale: 0.86 },
    tablet: { x: 1.54, y: 1.74, scale: 0.72 },
    mobile: { x: 1.1, y: 1.32, scale: 0.56 },
    pointerOffsetX: 0.24,
    pointerOffsetY: 0.14,
    tiltX: 0.06,
    tiltZ: 0.08,
    floatAmplitude: 0.06,
    floatSpeed: 0.92,
    rotationMultiplier: 0.86,
    rotationOffset: -0.5,
    idlePhase: 1.1,
  },
  {
    id: 'block',
    path: '/models/block-character.glb',
    desktop: { x: 3.78, y: 2.26, scale: 0.64 },
    tablet: { x: 3.02, y: 1.82, scale: 0.52 },
    mobile: { x: 2.02, y: 1.4, scale: 0.42 },
    pointerOffsetX: 0.18,
    pointerOffsetY: 0.12,
    tiltX: 0.04,
    tiltZ: 0.06,
    floatAmplitude: 0.05,
    floatSpeed: 0.84,
    rotationMultiplier: 1.12,
    rotationOffset: 0.82,
    idlePhase: 2.4,
  },
];

function HeroModel({
  config,
  scrollProgress,
  pointerX,
  pointerY,
}: Hero3DProps & { config: HeroModelConfig }) {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF(config.path);
  const { viewport } = useThree();

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const progress = scrollProgress.get();
    const px = pointerX.get();
    const py = pointerY.get();
    const elapsed = state.clock.getElapsedTime();

    const baseTransform =
      viewport.width > 13
        ? config.desktop
        : viewport.width > 10
          ? config.tablet
          : config.mobile;

    const targetX = baseTransform.x + px * config.pointerOffsetX;
    const targetY =
      baseTransform.y +
      py * config.pointerOffsetY +
      Math.sin(elapsed * config.floatSpeed + (config.idlePhase ?? 0)) *
        config.floatAmplitude;
    const targetScale = baseTransform.scale;
    const targetRotationY =
      progress * Math.PI * 2 * (config.rotationMultiplier ?? 1) +
      (config.rotationOffset ?? 0);
    const targetRotationX =
      -0.14 + py * config.tiltX + Math.sin(elapsed * 0.44 + (config.idlePhase ?? 0)) * 0.03;
    const targetRotationZ =
      0.06 - px * config.tiltZ + Math.cos(elapsed * 0.36 + (config.idlePhase ?? 0)) * 0.03;

    groupRef.current.position.x = MathUtils.damp(
      groupRef.current.position.x,
      targetX,
      5.6,
      delta
    );
    groupRef.current.position.y = MathUtils.damp(
      groupRef.current.position.y,
      targetY,
      5.6,
      delta
    );

    const nextScale = MathUtils.damp(groupRef.current.scale.x, targetScale, 5.2, delta);
    groupRef.current.scale.setScalar(nextScale);

    groupRef.current.rotation.y = MathUtils.damp(
      groupRef.current.rotation.y,
      targetRotationY,
      6,
      delta
    );
    groupRef.current.rotation.x = MathUtils.damp(
      groupRef.current.rotation.x,
      targetRotationX,
      5.2,
      delta
    );
    groupRef.current.rotation.z = MathUtils.damp(
      groupRef.current.rotation.z,
      targetRotationZ,
      5.2,
      delta
    );
  });

  return (
    <group ref={groupRef}>
      <Center>
        <Clone object={scene} />
      </Center>
    </group>
  );
}

export function Hero3D({ scrollProgress, pointerX, pointerY }: Hero3DProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 7.2], fov: 26 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={1.1} />
        <directionalLight position={[4.6, 5.2, 6]} intensity={2.7} color="#f7f2eb" />
        <directionalLight position={[-4.6, -1.8, 2.4]} intensity={1.1} color="#bf202d" />
        <spotLight
          position={[5.8, 6.5, 6]}
          angle={0.38}
          penumbra={0.9}
          intensity={2.2}
          color="#ffffff"
        />
        <Suspense fallback={null}>
          {HERO_MODELS.map((model) => (
            <HeroModel
              key={model.id}
              config={model}
              scrollProgress={scrollProgress}
              pointerX={pointerX}
              pointerY={pointerY}
            />
          ))}
        </Suspense>
      </Canvas>

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(var(--background-rgb), 0.9) 0%, rgba(var(--background-rgb), 0.82) 26%, rgba(var(--background-rgb), 0.46) 56%, rgba(var(--background-rgb), 0.1) 100%)',
        }}
      />
    </div>
  );
}

HERO_MODELS.forEach((model) => {
  useGLTF.preload(model.path);
});
