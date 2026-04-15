import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Center, useGLTF } from '@react-three/drei';
import type { MotionValue } from 'motion/react';
import {
  Component,
  Suspense,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';
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

type BaseNodeConfig = {
  id: string;
  desktop: HeroTransform;
  tablet: HeroTransform;
  mobile: HeroTransform;
  minViewportWidth?: number;
  autoSpinSpeed?: number;
  swayAmplitudeX?: number;
  swaySpeedX?: number;
  swayTiltZ?: number;
  pointerOffsetX: number;
  pointerOffsetY: number;
  tiltX: number;
  tiltZ: number;
  floatAmplitude: number;
  floatSpeed: number;
  rotationMultiplier?: number;
  rotationOffset?: number;
  idlePhase?: number;
  baseRotationX?: number;
  baseRotationZ?: number;
};

type GlbNodeConfig = BaseNodeConfig & {
  kind: 'glb';
  path: string;
};

type ShapeNodeConfig = BaseNodeConfig & {
  kind: 'shape';
  shape: 'box' | 'torus' | 'icosahedron';
  color: string;
  emissive?: string;
  roughness: number;
  metalness: number;
  wireframe?: boolean;
  dimensions: [number, number, number?];
};

type HeroNodeConfig = GlbNodeConfig | ShapeNodeConfig;

type ModelErrorBoundaryProps = {
  children: ReactNode;
};

type ModelErrorBoundaryState = {
  hasError: boolean;
};

const HERO_NODES: HeroNodeConfig[] = [
  {
    id: 'sam',
    kind: 'glb',
    path: '/models/characters-sam.glb',
    desktop: { x: 2.05, y: 1.14, scale: 1.14 },
    tablet: { x: 1.74, y: 0.92, scale: 0.95 },
    mobile: { x: 1.2, y: 0.72, scale: 0.78 },
    autoSpinSpeed: 0.85,
    swayAmplitudeX: 0.22,
    swaySpeedX: 1.2,
    swayTiltZ: 0.07,
    pointerOffsetX: 0.36,
    pointerOffsetY: 0.18,
    tiltX: 0.08,
    tiltZ: 0.12,
    floatAmplitude: 0.08,
    floatSpeed: 1.02,
    rotationMultiplier: 1,
    rotationOffset: 0.24,
    idlePhase: 0,
    baseRotationX: -0.12,
    baseRotationZ: 0.06,
  },
  {
    id: 'matt',
    kind: 'glb',
    path: '/models/characters-matt.glb',
    minViewportWidth: 10.5,
    desktop: { x: 4.45, y: 1.9, scale: 0.5 },
    tablet: { x: 3.06, y: 1.54, scale: 0.42 },
    mobile: { x: 2.22, y: 1.1, scale: 0.32 },
    pointerOffsetX: 0.12,
    pointerOffsetY: 0.08,
    tiltX: 0.05,
    tiltZ: 0.08,
    floatAmplitude: 0.06,
    floatSpeed: 0.88,
    rotationMultiplier: 0.78,
    rotationOffset: -0.34,
    idlePhase: 1.2,
    baseRotationX: -0.1,
    baseRotationZ: -0.04,
  },
  {
    id: 'block',
    kind: 'glb',
    path: '/models/block-character.glb',
    minViewportWidth: 11.2,
    desktop: { x: 5.3, y: 1.24, scale: 0.36 },
    tablet: { x: 3.64, y: 1.1, scale: 0.3 },
    mobile: { x: 2.58, y: 0.92, scale: 0.24 },
    pointerOffsetX: 0.1,
    pointerOffsetY: 0.06,
    tiltX: 0.04,
    tiltZ: 0.06,
    floatAmplitude: 0.05,
    floatSpeed: 0.84,
    rotationMultiplier: 1.18,
    rotationOffset: 0.72,
    idlePhase: 2.1,
    baseRotationX: -0.08,
    baseRotationZ: 0.1,
  },
  {
    id: 'frame-torus',
    kind: 'shape',
    shape: 'torus',
    color: '#1a1a1d',
    emissive: '#7f1720',
    roughness: 0.36,
    metalness: 0.82,
    dimensions: [0.42, 0.085],
    minViewportWidth: 10.8,
    desktop: { x: 6.02, y: 0.84, scale: 0.7 },
    tablet: { x: 4.08, y: 0.72, scale: 0.56 },
    mobile: { x: 2.88, y: 0.58, scale: 0.46 },
    pointerOffsetX: 0.12,
    pointerOffsetY: 0.08,
    tiltX: 0.04,
    tiltZ: 0.08,
    floatAmplitude: 0.04,
    floatSpeed: 1.12,
    rotationMultiplier: 1.3,
    rotationOffset: 1.3,
    idlePhase: 0.9,
    baseRotationX: 0.84,
    baseRotationZ: 0.2,
  },
  {
    id: 'signal-box',
    kind: 'shape',
    shape: 'box',
    color: '#faf6ef',
    emissive: '#2b0e11',
    roughness: 0.32,
    metalness: 0.42,
    dimensions: [0.22, 0.88, 0.22],
    desktop: { x: 3.28, y: 0.62, scale: 0.72 },
    tablet: { x: 2.32, y: 0.52, scale: 0.58 },
    mobile: { x: 1.62, y: 0.48, scale: 0.5 },
    pointerOffsetX: 0.1,
    pointerOffsetY: 0.06,
    tiltX: 0.06,
    tiltZ: 0.08,
    floatAmplitude: 0.03,
    floatSpeed: 1.18,
    rotationMultiplier: 0.92,
    rotationOffset: -0.6,
    idlePhase: 2.8,
    baseRotationX: 0.4,
    baseRotationZ: -0.44,
  },
  {
    id: 'shard-ico',
    kind: 'shape',
    shape: 'icosahedron',
    color: '#4a0d14',
    emissive: '#bf202d',
    roughness: 0.18,
    metalness: 0.94,
    dimensions: [0.3],
    minViewportWidth: 10.2,
    desktop: { x: 4.9, y: 2.6, scale: 0.82 },
    tablet: { x: 3.16, y: 1.98, scale: 0.52 },
    mobile: { x: 2.24, y: 1.5, scale: 0.42 },
    pointerOffsetX: 0.12,
    pointerOffsetY: 0.08,
    tiltX: 0.04,
    tiltZ: 0.06,
    floatAmplitude: 0.04,
    floatSpeed: 1.26,
    rotationMultiplier: 1.48,
    rotationOffset: 0.4,
    idlePhase: 1.6,
    baseRotationX: 0.14,
    baseRotationZ: 0.12,
  },
];

class ModelErrorBoundary extends Component<
  ModelErrorBoundaryProps,
  ModelErrorBoundaryState
> {
  state: ModelErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

function useNodeMotion(
  ref: React.RefObject<Group | null>,
  config: HeroNodeConfig,
  scrollProgress: MotionValue<number>,
  pointerX: MotionValue<number>,
  pointerY: MotionValue<number>
) {
  const { viewport } = useThree();

  useFrame((state, delta) => {
    if (!ref.current) return;

    const meetsViewportWidth =
      config.minViewportWidth === undefined || viewport.width >= config.minViewportWidth;
    ref.current.visible = meetsViewportWidth;
    if (!meetsViewportWidth) return;

    const progress = scrollProgress.get();
    const px = pointerX.get();
    const py = pointerY.get();
    const elapsed = state.clock.getElapsedTime();

    const base =
      viewport.width > 13
        ? config.desktop
        : viewport.width > 10
          ? config.tablet
          : config.mobile;

    const swayX =
      Math.sin(elapsed * (config.swaySpeedX ?? 0) + (config.idlePhase ?? 0)) *
      (config.swayAmplitudeX ?? 0);
    const targetX = base.x + px * config.pointerOffsetX + swayX;
    const targetY =
      base.y +
      py * config.pointerOffsetY +
      Math.sin(elapsed * config.floatSpeed + (config.idlePhase ?? 0)) *
        config.floatAmplitude;
    const targetScale = base.scale;
    const targetRotationY =
      progress * Math.PI * 2 * (config.rotationMultiplier ?? 1) +
      elapsed * (config.autoSpinSpeed ?? 0) +
      (config.rotationOffset ?? 0);
    const targetRotationX =
      (config.baseRotationX ?? 0) +
      py * config.tiltX +
      Math.sin(elapsed * 0.48 + (config.idlePhase ?? 0)) * 0.03;
    const targetRotationZ =
      (config.baseRotationZ ?? 0) -
      px * config.tiltZ +
      Math.sin(elapsed * (config.swaySpeedX ?? 0) + (config.idlePhase ?? 0)) *
        (config.swayTiltZ ?? 0) +
      Math.cos(elapsed * 0.34 + (config.idlePhase ?? 0)) * 0.03;

    ref.current.position.x = MathUtils.damp(ref.current.position.x, targetX, 5.4, delta);
    ref.current.position.y = MathUtils.damp(ref.current.position.y, targetY, 5.4, delta);

    const nextScale = MathUtils.damp(ref.current.scale.x, targetScale, 5, delta);
    ref.current.scale.setScalar(nextScale);

    ref.current.rotation.x = MathUtils.damp(
      ref.current.rotation.x,
      targetRotationX,
      5.1,
      delta
    );
    ref.current.rotation.y = MathUtils.damp(
      ref.current.rotation.y,
      targetRotationY,
      5.8,
      delta
    );
    ref.current.rotation.z = MathUtils.damp(
      ref.current.rotation.z,
      targetRotationZ,
      5.1,
      delta
    );
  });
}

function HeroGlbNode({
  config,
  scrollProgress,
  pointerX,
  pointerY,
}: Hero3DProps & { config: GlbNodeConfig }) {
  const ref = useRef<Group>(null);
  const { scene } = useGLTF(config.path);
  const clone = useMemo(() => scene.clone(), [scene]);

  useNodeMotion(ref, config, scrollProgress, pointerX, pointerY);

  return (
    <group ref={ref}>
      <Center>
        <primitive object={clone} />
      </Center>
    </group>
  );
}

function HeroShapeNode({
  config,
  scrollProgress,
  pointerX,
  pointerY,
}: Hero3DProps & { config: ShapeNodeConfig }) {
  const ref = useRef<Group>(null);

  useNodeMotion(ref, config, scrollProgress, pointerX, pointerY);

  return (
    <group ref={ref}>
      <mesh castShadow={false} receiveShadow={false}>
        {config.shape === 'box' ? (
          <boxGeometry args={config.dimensions as [number, number, number]} />
        ) : config.shape === 'torus' ? (
          <torusGeometry args={config.dimensions as [number, number]} />
        ) : (
          <icosahedronGeometry args={config.dimensions as [number]} />
        )}
        <meshStandardMaterial
          color={config.color}
          emissive={config.emissive ?? '#000000'}
          emissiveIntensity={0.32}
          roughness={config.roughness}
          metalness={config.metalness}
          wireframe={config.wireframe}
        />
      </mesh>
    </group>
  );
}

export function Hero3D({ scrollProgress, pointerX, pointerY }: Hero3DProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
      <Canvas
        dpr={[1, 1.8]}
        camera={{ position: [0, 0, 7.4], fov: 26 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={1.04} />
        <directionalLight position={[4.8, 5.8, 6.4]} intensity={2.8} color="#f6efe7" />
        <directionalLight position={[-4.4, -2.2, 2.6]} intensity={1.02} color="#b81d29" />
        <pointLight position={[2.8, 2.6, 3.8]} intensity={0.8} color="#ffffff" />
        <pointLight position={[3.4, 1.1, 2.6]} intensity={0.6} color="#bf202d" />

        {HERO_NODES.map((node) =>
          node.kind === 'glb' ? (
            <ModelErrorBoundary key={node.id}>
              <Suspense fallback={null}>
                <HeroGlbNode
                  config={node}
                  scrollProgress={scrollProgress}
                  pointerX={pointerX}
                  pointerY={pointerY}
                />
              </Suspense>
            </ModelErrorBoundary>
          ) : (
            <HeroShapeNode
              key={node.id}
              config={node}
              scrollProgress={scrollProgress}
              pointerX={pointerX}
              pointerY={pointerY}
            />
          )
        )}
      </Canvas>

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(var(--background-rgb), 0.9) 0%, rgba(var(--background-rgb), 0.78) 24%, rgba(var(--background-rgb), 0.28) 54%, rgba(var(--background-rgb), 0.01) 100%)',
        }}
      />
    </div>
  );
}

HERO_NODES.forEach((node) => {
  if (node.kind === 'glb') {
    useGLTF.preload(node.path);
  }
});
