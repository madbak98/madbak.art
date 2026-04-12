import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { useRef } from 'react';

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

  const opacity = useTransform(scrollYProgress, [0, 0.58], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.58], [1, 0.92]);
  const y = useTransform(scrollYProgress, [0, 0.58], [0, -72]);

  const titleRotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.35, 0.72], [0, 10, 22]),
    { stiffness: 140, damping: 24, mass: 0.45 }
  );
  const titleRotateY = useSpring(
    useTransform(scrollYProgress, [0, 0.35, 0.72], [0, -3, -8]),
    { stiffness: 140, damping: 24, mass: 0.45 }
  );
  const titleLift = useSpring(
    useTransform(scrollYProgress, [0, 0.35, 0.72], [0, -8, -18]),
    { stiffness: 140, damping: 24, mass: 0.45 }
  );
  const titleDepth = useSpring(
    useTransform(scrollYProgress, [0, 0.35, 0.72], [0, 36, 108]),
    { stiffness: 140, damping: 24, mass: 0.45 }
  );
  const titleScale = useSpring(
    useTransform(scrollYProgress, [0, 0.35, 0.72], [1, 1.018, 1.06]),
    { stiffness: 150, damping: 26, mass: 0.4 }
  );

  const pointerRotateX = useSpring(pointerRotateXTarget, {
    stiffness: 170,
    damping: 24,
    mass: 0.38,
  });
  const pointerRotateY = useSpring(pointerRotateYTarget, {
    stiffness: 170,
    damping: 24,
    mass: 0.38,
  });
  const pointerShiftX = useSpring(pointerShiftXTarget, {
    stiffness: 150,
    damping: 24,
    mass: 0.42,
  });
  const pointerShiftY = useSpring(pointerShiftYTarget, {
    stiffness: 150,
    damping: 24,
    mass: 0.42,
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
      scrollDepth + Math.abs(pointerX) * 1.4 + Math.abs(pointerY) * 0.9
  );

  const haloOpacity = useTransform(scrollYProgress, [0, 0.35, 0.72], [0.16, 0.28, 0.4]);
  const haloScale = useTransform(scrollYProgress, [0, 0.35, 0.72], [1, 1.12, 1.26]);
  const echoY = useTransform(scrollYProgress, [0, 0.35, 0.72], [0, 10, 18]);
  const echoDepth = useTransform(scrollYProgress, [0, 0.35, 0.72], [-16, -40, -88]);
  const haloShiftX = useTransform(pointerShiftX, (value) => value * 0.6);
  const haloShiftY = useTransform(pointerShiftY, (value) => value * 0.32);
  const echoShiftX = useTransform(pointerShiftX, (value) => value * 0.75);
  const echoShiftY = useTransform(pointerShiftY, (value) => value * 0.5);
  const combinedEchoY = useTransform(
    [echoY, echoShiftY],
    ([scrollEcho, pointerEcho]) => scrollEcho + pointerEcho
  );

  const titleTransform = useMotionTemplate`translate3d(${pointerShiftX}px, ${combinedLift}px, ${combinedDepth}px) rotateX(${combinedRotateX}deg) rotateY(${combinedRotateY}deg) scale(${titleScale})`;
  const haloTransform = useMotionTemplate`translate3d(${haloShiftX}px, ${haloShiftY}px, -120px) scale(${haloScale})`;
  const echoTransform = useMotionTemplate`translate3d(${echoShiftX}px, ${combinedEchoY}px, ${echoDepth}px)`;

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

    pointerRotateXTarget.set(-normalizedY * 8);
    pointerRotateYTarget.set(normalizedX * 12);
    pointerShiftXTarget.set(normalizedX * 14);
    pointerShiftYTarget.set(normalizedY * 8);
  };

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6"
      onMouseMove={handleMouseMove}
      onMouseLeave={resetPointerTilt}
      style={{ backgroundColor: '#020202' }}
    >
      <div className="absolute inset-0 bg-black" />

      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 38%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.014) 24%, rgba(0,0,0,0) 56%)',
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 58%, rgba(230,37,37,0.08) 0%, rgba(230,37,37,0.015) 22%, rgba(0,0,0,0) 52%)',
        }}
      />

      <div
        className="absolute inset-x-0 bottom-0 top-[48%]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.055) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
          opacity: 0.16,
          maskImage: 'linear-gradient(to top, black 0%, black 36%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to top, black 0%, black 36%, transparent 100%)',
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            'repeating-linear-gradient(180deg, rgba(255,255,255,0.018) 0px, rgba(255,255,255,0.018) 1px, transparent 1px, transparent 4px)',
          opacity: 0.05,
          mixBlendMode: 'soft-light',
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          boxShadow:
            'inset 0 0 180px rgba(0,0,0,0.92), inset 0 -120px 180px rgba(0,0,0,0.72)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 flex w-full max-w-6xl justify-center"
        style={{ opacity, scale, y }}
      >
        <div className="relative inline-flex flex-col items-center text-center">
          <motion.span
            initial={{ opacity: 0, y: -10, rotate: -6 }}
            animate={{ opacity: 1, y: 0, rotate: -6 }}
            transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
            className="absolute right-[2%] top-[10%] z-20 whitespace-nowrap rounded-sm border border-red-500/30 px-2 py-1 sm:right-0"
            style={{
              transform: 'translateX(18%) rotate(-6deg)',
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(0.58rem, 0.8vw, 0.74rem)',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: '#E62525',
              background: 'rgba(230,37,37,0.06)',
              boxShadow: '0 0 18px rgba(230,37,37,0.12)',
              pointerEvents: 'none',
            }}
          >
            [ LILOSAMA ]
          </motion.span>

          <div
            className="relative"
            style={{
              perspective: '1800px',
              transformStyle: 'preserve-3d',
            }}
          >
            <motion.div
              className="relative inline-flex items-center justify-center"
              style={{
                transform: titleTransform,
                transformStyle: 'preserve-3d',
                willChange: 'transform',
              }}
            >
              <motion.div
                aria-hidden="true"
                className="absolute inset-[-8%] rounded-full"
                style={{
                  transform: haloTransform,
                  opacity: haloOpacity,
                  background:
                    'radial-gradient(circle, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.09) 40%, rgba(255,255,255,0) 74%)',
                  filter: 'blur(26px)',
                  pointerEvents: 'none',
                }}
              />

              <motion.span
                aria-hidden="true"
                className="absolute inset-0 select-none whitespace-nowrap"
                style={{
                  transform: echoTransform,
                  transformStyle: 'preserve-3d',
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(4.7rem, 16vw, 11.5rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.08em',
                  lineHeight: 0.88,
                  color: 'rgba(255,255,255,0.12)',
                  textShadow: '0 18px 40px rgba(0,0,0,0.54)',
                  pointerEvents: 'none',
                }}
              >
                MADBAK
              </motion.span>

              <motion.h1
                className="relative whitespace-nowrap"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(4.7rem, 16vw, 11.5rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.08em',
                  lineHeight: 0.88,
                  color: '#F7F7F7',
                  background:
                    'linear-gradient(180deg, #ffffff 0%, #f6f6f6 54%, #d9d9d9 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow:
                    '0 0 24px rgba(255,255,255,0.08), 0 18px 42px rgba(0,0,0,0.64)',
                }}
              >
                MADBAK
              </motion.h1>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.3, ease: 'easeOut' }}
            className="mt-4 whitespace-nowrap sm:mt-5"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.82rem, 1.5vw, 1.08rem)',
              fontWeight: 400,
              letterSpacing: '0.52em',
              textTransform: 'uppercase',
              color: 'rgba(245,245,245,0.76)',
              paddingLeft: '0.52em',
              textShadow: '0 8px 22px rgba(0,0,0,0.34)',
            }}
          >
            DESIGNER
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}
