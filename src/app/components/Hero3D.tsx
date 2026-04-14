import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Center, Float, useGLTF } from '@react-three/drei';
import type { MotionValue } from 'motion/react';
import { Suspense, useRef } from 'react';
import { MathUtils, type Group } from 'three';

type Hero3DProps = {
  scrollProgress: MotionValue<number>;
};

function HeroModel({ scrollProgress }: Hero3DProps) {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF('/models/characters-sam.glb');
  const { viewport } = useThree();

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const progress = scrollProgress.get();
    const elapsed = state.clock.getElapsedTime();

    const baseX = viewport.width > 13 ? 4.15 : viewport.width > 10 ? 3.15 : 2.2;
    const baseY = viewport.width > 13 ? 1.95 : viewport.width > 10 ? 1.55 : 1.12;
    const baseScale = viewport.width > 13 ? 2.55 : viewport.width > 10 ? 2.15 : 1.45;
    const targetRotationY = progress * Math.PI * 2;

    groupRef.current.position.x = baseX;
    groupRef.current.position.y = baseY + Math.sin(elapsed * 1.05) * 0.08;
    groupRef.current.scale.setScalar(baseScale);
    groupRef.current.rotation.y = MathUtils.damp(
      groupRef.current.rotation.y,
      targetRotationY,
      6,
      delta
    );
    groupRef.current.rotation.x = -0.18 + Math.sin(elapsed * 0.42) * 0.05;
    groupRef.current.rotation.z = 0.08 + Math.cos(elapsed * 0.35) * 0.035;
  });

  return (
    <Float
      speed={0.8}
      rotationIntensity={0}
      floatIntensity={0.12}
      floatingRange={[-0.04, 0.04]}
    >
      <group ref={groupRef}>
        <Center>
          <primitive object={scene} />
        </Center>
      </group>
    </Float>
  );
}

export function Hero3D({ scrollProgress }: Hero3DProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 6.4], fov: 24 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={1.12} />
        <directionalLight position={[3.8, 4.8, 5.8]} intensity={2.75} color="#f6f0e8" />
        <directionalLight position={[-4, -2, 2]} intensity={1.05} color="#c91f2e" />
        <spotLight
          position={[5.2, 6.4, 6.2]}
          angle={0.4}
          penumbra={0.86}
          intensity={2.4}
          color="#ffffff"
        />
        <Suspense fallback={null}>
          <HeroModel scrollProgress={scrollProgress} />
        </Suspense>
      </Canvas>
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(var(--background-rgb), 0.78) 0%, rgba(var(--background-rgb), 0.56) 28%, rgba(var(--background-rgb), 0.22) 58%, rgba(var(--background-rgb), 0.04) 100%)',
        }}
      />
    </div>
  );
}

useGLTF.preload('/models/characters-sam.glb');
