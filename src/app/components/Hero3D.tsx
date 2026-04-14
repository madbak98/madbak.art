import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Center, Float, useGLTF } from '@react-three/drei';
import type { MotionValue } from 'motion/react';
import { Suspense, useRef } from 'react';
import type { Group } from 'three';

type Hero3DProps = {
  scrollProgress: MotionValue<number>;
};

function HeroModel({ scrollProgress }: Hero3DProps) {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF('/models/characters-sam.glb');
  const { viewport } = useThree();

  useFrame((state) => {
    if (!groupRef.current) return;

    const progress = scrollProgress.get();
    const elapsed = state.clock.getElapsedTime();

    const baseX = viewport.width > 13 ? 2.8 : viewport.width > 10 ? 2.3 : 1.55;
    const baseY = viewport.width > 13 ? 1.4 : viewport.width > 10 ? 1.15 : 0.95;
    const baseScale = viewport.width > 13 ? 1.6 : viewport.width > 10 ? 1.35 : 1;

    groupRef.current.position.x = baseX;
    groupRef.current.position.y = baseY + Math.sin(elapsed * 0.9) * 0.05;
    groupRef.current.scale.setScalar(baseScale);
    groupRef.current.rotation.y = progress * Math.PI * 2;
    groupRef.current.rotation.x = Math.sin(elapsed * 0.45) * 0.04;
    groupRef.current.rotation.z = Math.cos(elapsed * 0.35) * 0.03;
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
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 7.5], fov: 28 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.95} />
        <directionalLight position={[3, 4, 5]} intensity={2.2} color="#f6f0e8" />
        <directionalLight position={[-4, -2, 2]} intensity={0.8} color="#c91f2e" />
        <spotLight
          position={[4, 6, 6]}
          angle={0.36}
          penumbra={0.8}
          intensity={1.8}
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
            'linear-gradient(90deg, rgba(var(--background-rgb), 0.02) 0%, rgba(var(--background-rgb), 0.1) 46%, rgba(var(--background-rgb), 0.42) 70%, rgba(var(--background-rgb), 0.84) 100%)',
        }}
      />
    </div>
  );
}

useGLTF.preload('/models/characters-sam.glb');
