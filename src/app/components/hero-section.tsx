import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { useRef } from 'react';

const NAV_ITEMS = [
  { label: 'MINI GAME', target: 'game' },
  { label: 'ABOUT', target: 'about' },
  { label: 'WORKS', target: 'work' },
  { label: 'NFT', target: 'nft' },
  { label: 'CONTACT', target: 'contact' },
] as const;

type HeroFloatConfig = {
  pointerXFactor: number;
  pointerYFactor: number;
  rotateXFactor: number;
  rotateYFactor: number;
  yRange: [number, number, number];
  zRange: [number, number, number];
  rotateZRange: [number, number, number];
  scaleRange: [number, number, number];
};

function useHeroFloat(
  scrollYProgress: MotionValue<number>,
  pointerShiftX: MotionValue<number>,
  pointerShiftY: MotionValue<number>,
  pointerRotateX: MotionValue<number>,
  pointerRotateY: MotionValue<number>,
  config: HeroFloatConfig
) {
  const translateX = useTransform(
    pointerShiftX,
    (value) => value * config.pointerXFactor
  );
  const pointerY = useTransform(
    pointerShiftY,
    (value) => value * config.pointerYFactor
  );
  const scrollY = useTransform(scrollYProgress, [0, 0.34, 0.72], config.yRange);
  const translateY = useTransform(
    [pointerY, scrollY],
    ([pointerYOffset, scrollYOffset]) => pointerYOffset + scrollYOffset
  );
  const rotateX = useTransform(
    pointerRotateX,
    (value) => value * config.rotateXFactor
  );
  const rotateY = useTransform(
    pointerRotateY,
    (value) => value * config.rotateYFactor
  );
  const translateZ = useTransform(
    scrollYProgress,
    [0, 0.34, 0.72],
    config.zRange
  );
  const rotateZ = useTransform(
    scrollYProgress,
    [0, 0.34, 0.72],
    config.rotateZRange
  );
  const scale = useTransform(scrollYProgress, [0, 0.34, 0.72], config.scaleRange);

  return useMotionTemplate`translate3d(${translateX}px, ${translateY}px, ${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`;
}

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);

  const pointerRotateXTarget = useMotionValue(0);
  const pointerRotateYTarget = useMotionValue(0);
  const pointerShiftXTarget = useMotionValue(0);
  const pointerShiftYTarget = useMotionValue(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const sectionOpacity = useTransform(scrollYProgress, [0, 0.58], [1, 0]);
  const sectionScale = useTransform(scrollYProgress, [0, 0.58], [1, 0.935]);
  const sectionY = useTransform(scrollYProgress, [0, 0.58], [0, -84]);

  const titleRotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.34, 0.72], [0, 14, 34]),
    { stiffness: 148, damping: 24, mass: 0.42 }
  );
  const titleRotateY = useSpring(
    useTransform(scrollYProgress, [0, 0.34, 0.72], [0, -4, -12]),
    { stiffness: 148, damping: 24, mass: 0.42 }
  );
  const titleLift = useSpring(
    useTransform(scrollYProgress, [0, 0.34, 0.72], [0, -12, -32]),
    { stiffness: 148, damping: 24, mass: 0.42 }
  );
  const titleDepth = useSpring(
    useTransform(scrollYProgress, [0, 0.34, 0.72], [0, 64, 164]),
    { stiffness: 148, damping: 24, mass: 0.42 }
  );
  const titleScale = useSpring(
    useTransform(scrollYProgress, [0, 0.34, 0.72], [1, 1.028, 1.086]),
    { stiffness: 154, damping: 26, mass: 0.38 }
  );

  const pointerRotateX = useSpring(pointerRotateXTarget, {
    stiffness: 192,
    damping: 24,
    mass: 0.34,
  });
  const pointerRotateY = useSpring(pointerRotateYTarget, {
    stiffness: 192,
    damping: 24,
    mass: 0.34,
  });
  const pointerShiftX = useSpring(pointerShiftXTarget, {
    stiffness: 164,
    damping: 24,
    mass: 0.38,
  });
  const pointerShiftY = useSpring(pointerShiftYTarget, {
    stiffness: 164,
    damping: 24,
    mass: 0.38,
  });

  const combinedRotateX = useTransform(
    [titleRotateX, pointerRotateX],
    ([scrollTilt, pointerTilt]) => scrollTilt + pointerTilt
  );
  const combinedRotateY = useTransform(
    [titleRotateY, pointerRotateY],
    ([scrollTilt, pointerTilt]) => scrollTilt + pointerTilt
  );
  const combinedLift = useTransform(
    [titleLift, pointerShiftY],
    ([scrollLift, pointerLift]) => scrollLift + pointerLift
  );
  const combinedDepth = useTransform(
    [titleDepth, pointerRotateX, pointerRotateY],
    ([scrollDepth, pointerX, pointerY]) =>
      scrollDepth + Math.abs(pointerX) * 2 + Math.abs(pointerY) * 1.2
  );

  const backShiftX = useTransform(pointerShiftX, (value) => value * 0.95);
  const backShiftY = useTransform(pointerShiftY, (value) => value * 0.62);
  const midShiftX = useTransform(pointerShiftX, (value) => value * 0.46);
  const midShiftY = useTransform(pointerShiftY, (value) => value * 0.28);
  const subtitleShiftX = useTransform(pointerShiftX, (value) => value * 0.22);
  const subtitleShiftY = useTransform(pointerShiftY, (value) => value * 0.14);
  const glowShiftX = useTransform(pointerShiftX, (value) => value * 0.56);
  const glowShiftY = useTransform(pointerShiftY, (value) => value * 0.32);

  const backDepth = useTransform(scrollYProgress, [0, 0.34, 0.72], [-40, -92, -164]);
  const midDepth = useTransform(scrollYProgress, [0, 0.34, 0.72], [-16, -38, -96]);
  const glowDepth = useTransform(scrollYProgress, [0, 0.34, 0.72], [-64, -108, -172]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.34, 0.72], [0.16, 0.32, 0.48]);
  const glowScale = useTransform(scrollYProgress, [0, 0.34, 0.72], [1, 1.16, 1.34]);

  const titleTransform = useMotionTemplate`translate3d(${pointerShiftX}px, ${combinedLift}px, ${combinedDepth}px) rotateX(${combinedRotateX}deg) rotateY(${combinedRotateY}deg) scale(${titleScale})`;
  const backLayerTransform = useMotionTemplate`translate3d(${backShiftX}px, ${backShiftY}px, ${backDepth}px)`;
  const midLayerTransform = useMotionTemplate`translate3d(${midShiftX}px, ${midShiftY}px, ${midDepth}px)`;
  const glowTransform = useMotionTemplate`translate3d(${glowShiftX}px, ${glowShiftY}px, ${glowDepth}px) scale(${glowScale})`;
  const subtitleTransform = useMotionTemplate`translate3d(${subtitleShiftX}px, ${subtitleShiftY}px, 0px)`;

  const smileTransform = useHeroFloat(
    scrollYProgress,
    pointerShiftX,
    pointerShiftY,
    pointerRotateX,
    pointerRotateY,
    {
      pointerXFactor: -0.82,
      pointerYFactor: -0.5,
      rotateXFactor: -0.1,
      rotateYFactor: 0.18,
      yRange: [0, -18, -44],
      zRange: [10, 48, 90],
      rotateZRange: [-6, -2, 8],
      scaleRange: [1, 1.05, 1.12],
    }
  );
  const orbTransform = useHeroFloat(
    scrollYProgress,
    pointerShiftX,
    pointerShiftY,
    pointerRotateX,
    pointerRotateY,
    {
      pointerXFactor: 0.78,
      pointerYFactor: -0.42,
      rotateXFactor: 0.3,
      rotateYFactor: -0.34,
      yRange: [0, -20, -58],
      zRange: [12, 60, 112],
      rotateZRange: [6, 10, 16],
      scaleRange: [1, 1.08, 1.14],
    }
  );
  const cardTransform = useHeroFloat(
    scrollYProgress,
    pointerShiftX,
    pointerShiftY,
    pointerRotateX,
    pointerRotateY,
    {
      pointerXFactor: -0.48,
      pointerYFactor: 0.42,
      rotateXFactor: -0.18,
      rotateYFactor: 0.24,
      yRange: [0, 12, 36],
      zRange: [8, 40, 78],
      rotateZRange: [-10, -6, -2],
      scaleRange: [1, 1.04, 1.1],
    }
  );
  const frameTransform = useHeroFloat(
    scrollYProgress,
    pointerShiftX,
    pointerShiftY,
    pointerRotateX,
    pointerRotateY,
    {
      pointerXFactor: 0.52,
      pointerYFactor: 0.3,
      rotateXFactor: 0.2,
      rotateYFactor: -0.22,
      yRange: [0, 20, 48],
      zRange: [10, 42, 86],
      rotateZRange: [8, 12, 18],
      scaleRange: [1, 1.06, 1.12],
    }
  );
  const glyphTransform = useHeroFloat(
    scrollYProgress,
    pointerShiftX,
    pointerShiftY,
    pointerRotateX,
    pointerRotateY,
    {
      pointerXFactor: 0.28,
      pointerYFactor: -0.26,
      rotateXFactor: 0.12,
      rotateYFactor: -0.16,
      yRange: [0, -10, -28],
      zRange: [6, 28, 60],
      rotateZRange: [-8, -2, 6],
      scaleRange: [1, 1.04, 1.1],
    }
  );

  const scrollToSection = (target: (typeof NAV_ITEMS)[number]['target']) => {
    document.getElementById(target)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const resetPointerTilt = () => {
    pointerRotateXTarget.set(0);
    pointerRotateYTarget.set(0);
    pointerShiftXTarget.set(0);
    pointerShiftYTarget.set(0);
  };

  const handleMouseMove = (event: ReactMouseEvent<HTMLElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const normalizedX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const normalizedY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

    pointerRotateXTarget.set(-normalizedY * 10);
    pointerRotateYTarget.set(normalizedX * 14);
    pointerShiftXTarget.set(normalizedX * 18);
    pointerShiftYTarget.set(normalizedY * 12);
  };

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pb-12 pt-24 sm:px-10"
      onMouseMove={handleMouseMove}
      onMouseLeave={resetPointerTilt}
    >
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.14, ease: 'easeOut' }}
        className="fixed left-1/2 top-4 z-40 flex w-[min(94vw,44rem)] -translate-x-1/2 flex-wrap items-center justify-center gap-1.5 rounded-full border border-white/10 bg-black/55 px-2 py-2 backdrop-blur-xl sm:gap-2 sm:px-3"
        style={{
          boxShadow:
            '0 18px 40px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.08)',
        }}
      >
        {NAV_ITEMS.map((item) => (
          <button
            key={item.target}
            type="button"
            onClick={() => scrollToSection(item.target)}
            className="rounded-full border border-transparent px-3 py-2 text-[0.62rem] transition-all duration-300 hover:border-white/10 hover:bg-white/5 sm:px-4 sm:text-[0.7rem]"
            style={{
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: '#F5F5F5',
            }}
          >
            {item.label}
          </button>
        ))}
      </motion.nav>

      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.014) 24%, rgba(0,0,0,0) 56%), linear-gradient(180deg, rgba(8,8,8,0.18) 0%, rgba(8,8,8,0) 22%, rgba(8,8,8,0) 62%, rgba(8,8,8,0.34) 100%)',
        }}
      />

      <div
        className="absolute inset-x-0 bottom-0 top-[42%]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '52px 52px',
          opacity: 0.18,
          maskImage: 'linear-gradient(to top, black 0%, black 36%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to top, black 0%, black 36%, transparent 100%)',
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 22% 24%, rgba(230,37,37,0.11) 0%, rgba(230,37,37,0.02) 20%, rgba(0,0,0,0) 50%), radial-gradient(circle at 76% 66%, rgba(230,37,37,0.08) 0%, rgba(230,37,37,0.015) 22%, rgba(0,0,0,0) 54%)',
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            'repeating-linear-gradient(180deg, rgba(255,255,255,0.016) 0px, rgba(255,255,255,0.016) 1px, transparent 1px, transparent 4px)',
          opacity: 0.05,
          mixBlendMode: 'soft-light',
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          boxShadow:
            'inset 0 0 180px rgba(0,0,0,0.84), inset 0 -120px 160px rgba(0,0,0,0.7)',
        }}
      />

      <motion.div
        aria-hidden="true"
        className="absolute left-4 top-24 z-20 sm:left-[7%] sm:top-[18%]"
        style={{
          transform: smileTransform,
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          className="rounded-[10px] border border-white/12 bg-black/45 px-3 py-3 sm:px-4"
          style={{
            boxShadow:
              '0 18px 34px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.08)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(0.95rem, 1.7vw, 1.25rem)',
              letterSpacing: '0.26em',
              color: '#F5F5F5',
              textShadow: '0 0 18px rgba(255,255,255,0.18)',
            }}
          >
            :)
          </span>
        </div>
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="absolute right-[8%] top-[20%] z-20 hidden sm:block"
        style={{
          transform: orbTransform,
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="relative h-20 w-20 md:h-24 md:w-24">
          <div
            className="absolute inset-0 rounded-full border border-white/12"
            style={{
              background:
                'radial-gradient(circle at 34% 32%, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.06) 26%, rgba(255,255,255,0.02) 50%, rgba(0,0,0,0.28) 100%)',
              boxShadow:
                '0 20px 40px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.22)',
            }}
          />
          <div className="absolute inset-[12%] rounded-full border border-white/10" />
          <div className="absolute inset-y-1/2 left-[20%] right-[20%] h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
        </div>
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="absolute bottom-[18%] left-[8%] z-20 hidden md:block"
        style={{
          transform: cardTransform,
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          className="w-28 rounded-[26px] border border-white/12 bg-black/40 p-4"
          style={{
            boxShadow:
              '0 18px 38px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.08)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
        >
          <div
            className="mb-3 text-[0.54rem]"
            style={{
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.28em',
              color: '#E62525',
            }}
          >
            FRAME
          </div>
          <div className="rounded-[18px] border border-white/10 bg-white/[0.04] p-3">
            <div className="mb-2 h-1.5 w-10 rounded-full bg-white/15" />
            <div className="mb-2 h-10 rounded-[14px] border border-white/10 bg-gradient-to-br from-white/8 to-transparent" />
            <div className="h-1.5 w-16 rounded-full bg-red-500/20" />
          </div>
        </div>
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="absolute bottom-[18%] right-[9%] z-20 hidden md:block"
        style={{
          transform: frameTransform,
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="relative h-24 w-24 md:h-28 md:w-28">
          <div className="absolute inset-0 rotate-[10deg] border border-white/12" />
          <div className="absolute inset-3 rotate-[10deg] border border-red-500/30" />
          <div className="absolute inset-6 rotate-[10deg] border border-white/7" />
          <div className="absolute -inset-3 rotate-[10deg] border border-white/6" />
        </div>
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="absolute right-[19%] top-[34%] z-20 hidden lg:block"
        style={{
          transform: glyphTransform,
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          className="rounded-full border border-white/10 bg-black/35 px-4 py-2"
          style={{
            boxShadow:
              '0 18px 38px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              letterSpacing: '0.3em',
              color: 'rgba(245,245,245,0.72)',
            }}
          >
            ALT/3D
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 flex w-full max-w-6xl justify-center"
        style={{ opacity: sectionOpacity, scale: sectionScale, y: sectionY }}
      >
        <div className="relative inline-flex flex-col items-center text-center overflow-visible">
          <div
            className="relative overflow-visible"
            style={{
              perspective: '2200px',
              transformStyle: 'preserve-3d',
            }}
          >
            <motion.div
              className="relative inline-flex items-center justify-center overflow-visible"
              style={{
                transform: titleTransform,
                transformStyle: 'preserve-3d',
                willChange: 'transform',
              }}
            >
              <motion.div
                aria-hidden="true"
                className="absolute inset-[-10%] rounded-full"
                style={{
                  transform: glowTransform,
                  opacity: glowOpacity,
                  background:
                    'radial-gradient(circle, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0.09) 42%, rgba(255,255,255,0) 76%)',
                  filter: 'blur(36px)',
                  pointerEvents: 'none',
                }}
              />

              <motion.span
                aria-hidden="true"
                className="absolute inset-0 select-none whitespace-nowrap"
                style={{
                  transform: backLayerTransform,
                  transformStyle: 'preserve-3d',
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(4.5rem, 15vw, 11.7rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.075em',
                  lineHeight: 0.88,
                  color: 'rgba(0,0,0,0.72)',
                  textShadow: '0 20px 34px rgba(0,0,0,0.5)',
                  paddingLeft: '0.03em',
                  paddingRight: '0.11em',
                  pointerEvents: 'none',
                }}
              >
                MADBAK
              </motion.span>

              <motion.span
                aria-hidden="true"
                className="absolute inset-0 select-none whitespace-nowrap"
                style={{
                  transform: midLayerTransform,
                  transformStyle: 'preserve-3d',
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(4.5rem, 15vw, 11.7rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.075em',
                  lineHeight: 0.88,
                  color: 'rgba(255,255,255,0.14)',
                  textShadow: '0 18px 40px rgba(0,0,0,0.48)',
                  paddingLeft: '0.03em',
                  paddingRight: '0.11em',
                  pointerEvents: 'none',
                }}
              >
                MADBAK
              </motion.span>

              <motion.h1
                className="relative whitespace-nowrap"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(4.5rem, 15vw, 11.7rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.075em',
                  lineHeight: 0.88,
                  color: '#F6F6F6',
                  paddingLeft: '0.03em',
                  paddingRight: '0.11em',
                  background:
                    'linear-gradient(180deg, #ffffff 0%, #f6f6f6 56%, #d7d7d7 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  WebkitTextStroke: '0.45px rgba(255,255,255,0.08)',
                  textShadow:
                    '0 0 24px rgba(255,255,255,0.08), 0 18px 42px rgba(0,0,0,0.62)',
                }}
              >
                MADBAK
              </motion.h1>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.28, ease: 'easeOut' }}
            className="mt-4 flex flex-col items-center gap-2 sm:mt-5"
            style={{ transform: subtitleTransform }}
          >
            <p
              className="whitespace-nowrap"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(0.82rem, 1.45vw, 1.04rem)',
                fontWeight: 400,
                letterSpacing: '0.52em',
                textTransform: 'uppercase',
                color: '#E62525',
                paddingLeft: '0.52em',
                textShadow: '0 8px 22px rgba(230,37,37,0.18)',
              }}
            >
              : DESIGNER :
            </p>

            <p
              className="whitespace-nowrap"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(0.74rem, 1.1vw, 0.92rem)',
                fontWeight: 400,
                letterSpacing: '0.42em',
                textTransform: 'uppercase',
                color: 'rgba(245, 245, 245, 0.82)',
                paddingLeft: '0.42em',
                textShadow: '0 8px 20px rgba(0,0,0,0.28)',
              }}
            >
              &amp; DEVELOPER
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
