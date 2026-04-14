
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Center, Clone, useGLTF } from '@react-three/drei';
import { Center, useGLTF } from '@react-three/drei';
import type { MotionValue } from 'motion/react';
import { Component, Suspense, useRef, type ReactNode } from 'react';
import {
  Component,
  Suspense,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';
import { MathUtils, type Group } from 'three';

type Hero3DProps = {
  scale: number;
};

type HeroModelConfig = {
type BaseNodeConfig = {
  id: string;
  path: string;
  desktop: HeroTransform;
  tablet: HeroTransform;
  mobile: HeroTransform;
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
  hasError: boolean;
};

// Add more GLB entries here after placing them in public/models.
const HERO_MODELS: HeroModelConfig[] = [
const HERO_NODES: HeroNodeConfig[] = [
  {
    id: 'sam',
    kind: 'glb',
    path: '/models/characters-sam.glb',
    desktop: { x: 2.34, y: 1.42, scale: 1.28 },
    tablet: { x: 1.92, y: 1.12, scale: 1.04 },
    mobile: { x: 1.3, y: 0.88, scale: 0.84 },
    pointerOffsetX: 0.34,
    desktop: { x: 2.22, y: 1.3, scale: 1.18 },
    tablet: { x: 1.86, y: 1.06, scale: 0.98 },
    mobile: { x: 1.32, y: 0.82, scale: 0.8 },
    pointerOffsetX: 0.36,
    pointerOffsetY: 0.18,
    tiltX: 0.08,
    tiltZ: 0.12,
    floatAmplitude: 0.08,
    floatSpeed: 1.08,
    floatSpeed: 1.02,
    rotationMultiplier: 1,
    rotationOffset: 0.36,
    rotationOffset: 0.24,
    idlePhase: 0,
    baseRotationX: -0.12,
    baseRotationZ: 0.06,
  },
  {
    id: 'matt',
    kind: 'glb',
    path: '/models/characters-matt.glb',
    desktop: { x: 1.5, y: 1.96, scale: 0.76 },
    tablet: { x: 1.24, y: 1.58, scale: 0.64 },
    mobile: { x: 0.98, y: 1.24, scale: 0.5 },
    pointerOffsetX: 0.24,
    desktop: { x: 1.22, y: 1.9, scale: 0.72 },
    tablet: { x: 1.02, y: 1.52, scale: 0.6 },
    mobile: { x: 0.86, y: 1.12, scale: 0.44 },
    pointerOffsetX: 0.22,
    pointerOffsetY: 0.14,
    tiltX: 0.06,
    tiltX: 0.05,
    tiltZ: 0.08,
    floatAmplitude: 0.06,
    floatSpeed: 0.92,
    rotationMultiplier: 0.86,
    rotationOffset: -0.5,
    idlePhase: 1.1,
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
    desktop: { x: 3.08, y: 2.02, scale: 0.56 },
    tablet: { x: 2.48, y: 1.62, scale: 0.46 },
    mobile: { x: 1.72, y: 1.28, scale: 0.38 },
    desktop: { x: 3.06, y: 1.92, scale: 0.54 },
    tablet: { x: 2.54, y: 1.56, scale: 0.46 },
    mobile: { x: 1.76, y: 1.18, scale: 0.34 },
    pointerOffsetX: 0.18,
    pointerOffsetY: 0.12,
    tiltX: 0.04,
    tiltZ: 0.06,
    floatAmplitude: 0.05,
    floatSpeed: 0.84,
    rotationMultiplier: 1.12,
    rotationOffset: 0.82,
    idlePhase: 2.4,
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
    desktop: { x: 3.58, y: 0.92, scale: 1 },
    tablet: { x: 2.88, y: 0.78, scale: 0.86 },
    mobile: { x: 1.94, y: 0.66, scale: 0.68 },
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
    desktop: { x: 0.92, y: 0.86, scale: 1 },
    tablet: { x: 0.8, y: 0.72, scale: 0.84 },
    mobile: { x: 0.7, y: 0.56, scale: 0.68 },
    pointerOffsetX: 0.16,
    pointerOffsetY: 0.1,
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
    desktop: { x: 2.78, y: 2.48, scale: 1 },
    tablet: { x: 2.24, y: 2.02, scale: 0.82 },
    mobile: { x: 1.52, y: 1.56, scale: 0.66 },
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

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidUpdate(prevProps: ModelErrorBoundaryProps) {
    if (prevProps.children !== this.props.children && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  render() {
  }
}

function HeroModel({
  config,
  scrollProgress,
  pointerX,
  pointerY,
}: Hero3DProps & { config: HeroModelConfig }) {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF(config.path);
function useNodeMotion(
  ref: React.RefObject<Group | null>,
  config: HeroNodeConfig,
  scrollProgress: MotionValue<number>,
  pointerX: MotionValue<number>,
  pointerY: MotionValue<number>
) {
  const { viewport } = useThree();

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    if (!ref.current) return;

    const progress = scrollProgress.get();
    const px = pointerX.get();
    const py = pointerY.get();
    const elapsed = state.clock.getElapsedTime();

    const baseTransform =
    const base =
      viewport.width > 13
        ? config.desktop
        : viewport.width > 10
          ? config.tablet
          : config.mobile;

    const targetX = baseTransform.x + px * config.pointerOffsetX;
    const targetX = base.x + px * config.pointerOffsetX;
    const targetY =
      baseTransform.y +
      base.y +
      py * config.pointerOffsetY +
      Math.sin(elapsed * config.floatSpeed + (config.idlePhase ?? 0)) *
        config.floatAmplitude;
    const targetScale = baseTransform.scale;
    const targetScale = base.scale;
    const targetRotationY =
      progress * Math.PI * 2 * (config.rotationMultiplier ?? 1) +
      (config.rotationOffset ?? 0);
    const targetRotationX =
      -0.14 + py * config.tiltX + Math.sin(elapsed * 0.44 + (config.idlePhase ?? 0)) * 0.03;
      (config.baseRotationX ?? 0) +
      py * config.tiltX +
      Math.sin(elapsed * 0.48 + (config.idlePhase ?? 0)) * 0.03;
    const targetRotationZ =
      0.06 - px * config.tiltZ + Math.cos(elapsed * 0.36 + (config.idlePhase ?? 0)) * 0.03;
      (config.baseRotationZ ?? 0) -
      px * config.tiltZ +
      Math.cos(elapsed * 0.34 + (config.idlePhase ?? 0)) * 0.03;

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
    ref.current.position.x = MathUtils.damp(ref.current.position.x, targetX, 5.4, delta);
    ref.current.position.y = MathUtils.damp(ref.current.position.y, targetY, 5.4, delta);

    const nextScale = MathUtils.damp(groupRef.current.scale.x, targetScale, 5.2, delta);
    groupRef.current.scale.setScalar(nextScale);
    const nextScale = MathUtils.damp(ref.current.scale.x, targetScale, 5, delta);
    ref.current.scale.setScalar(nextScale);

    groupRef.current.rotation.y = MathUtils.damp(
      groupRef.current.rotation.y,
      targetRotationY,
      6,
    ref.current.rotation.x = MathUtils.damp(
      ref.current.rotation.x,
      targetRotationX,
      5.1,
      delta
    );
    groupRef.current.rotation.x = MathUtils.damp(
      groupRef.current.rotation.x,
      targetRotationX,
      5.2,
    ref.current.rotation.y = MathUtils.damp(
      ref.current.rotation.y,
      targetRotationY,
      5.8,
      delta
    );
    groupRef.current.rotation.z = MathUtils.damp(
      groupRef.current.rotation.z,
    ref.current.rotation.z = MathUtils.damp(
      ref.current.rotation.z,
      targetRotationZ,
      5.2,
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
    <group ref={groupRef}>
    <group ref={ref}>
      <Center>
        <Clone object={scene} />
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
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 7.2], fov: 26 }}
        dpr={[1, 1.8]}
        camera={{ position: [0, 0, 7.4], fov: 26 }}
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
        {HERO_MODELS.map((model) => (
          <ModelErrorBoundary key={model.id}>
            <Suspense fallback={null}>
              <HeroModel
                config={model}
                scrollProgress={scrollProgress}
                pointerX={pointerX}
                pointerY={pointerY}
              />
            </Suspense>
          </ModelErrorBoundary>
        ))}
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
            'linear-gradient(90deg, rgba(var(--background-rgb), 0.9) 0%, rgba(var(--background-rgb), 0.8) 24%, rgba(var(--background-rgb), 0.34) 54%, rgba(var(--background-rgb), 0.02) 100%)',
            'linear-gradient(90deg, rgba(var(--background-rgb), 0.9) 0%, rgba(var(--background-rgb), 0.78) 24%, rgba(var(--background-rgb), 0.28) 54%, rgba(var(--background-rgb), 0.01) 100%)',
        }}
      />
    </div>
  );
}

HERO_MODELS.forEach((model) => {
  useGLTF.preload(model.path);
HERO_NODES.forEach((node) => {
  if (node.kind === 'glb') {
    useGLTF.preload(node.path);
  }
});
