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

  const sectionOpacity = useTransform(scrollYProgress, [0, 0.56], [1, 0]);
  const sectionScale = useTransform(scrollYProgress, [0, 0.56], [1, 0.94]);
  const sectionY = useTransform(scrollYProgress, [0, 0.56], [0, -76]);

  const titleRotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.34, 0.72], [0, 12, 30]),
    { stiffness: 150, damping: 24, mass: 0.42 }
  );
  const titleRotateY = useSpring(
    useTransform(scrollYProgress, [0, 0.34, 0.72], [0, -4, -10]),
    { stiffness: 150, damping: 24, mass: 0.42 }
  );
  const titleLift = useSpring(
    useTransform(scrollYProgress, [0, 0.34, 0.72], [0, -10, -24]),
    { stiffness: 150, damping: 24, mass: 0.42 }
  );
  const titleDepth = useSpring(
    useTransform(scrollYProgress, [0, 0.34, 0.72], [0, 48, 138]),
    { stiffness: 150, damping: 24, mass: 0.42 }
  );
  const titleScale = useSpring(
    useTransform(scrollYProgress, [0, 0.34, 0.72], [1, 1.024, 1.075]),
    { stiffness: 155, damping: 26, mass: 0.38 }
  );

  const pointerRotateX = useSpring(pointerRotateXTarget, {
    stiffness: 190,
    damping: 24,
    mass: 0.34,
  });
  const pointerRotateY = useSpring(pointerRotateYTarget, {
    stiffness: 190,
    damping: 24,
    mass: 0.34,
  });
  const pointerShiftX = useSpring(pointerShiftXTarget, {
    stiffness: 160,
    damping: 24,
    mass: 0.38,
  });
  const pointerShiftY = useSpring(pointerShiftYTarget, {
    stiffness: 160,
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
      scrollDepth + Math.abs(pointerX) * 1.8 + Math.abs(pointerY) * 1.1
  );

  const backShiftX = useTransform(pointerShiftX, (value) => value * 0.9);
  const backShiftY = useTransform(pointerShiftY, (value) => value * 0.58);
  const midShiftX = useTransform(pointerShiftX, (value) => value * 0.42);
  const midShiftY = useTransform(pointerShiftY, (value) => value * 0.24);
  const subtitleShiftX = useTransform(pointerShiftX, (value) => value * 0.18);
  const subtitleShiftY = useTransform(pointerShiftY, (value) => value * 0.12);
  const glowShiftX = useTransform(pointerShiftX, (value) => value * 0.52);
  const glowShiftY = useTransform(pointerShiftY, (value) => value * 0.28);

  const backDepth = useTransform(scrollYProgress, [0, 0.34, 0.72], [-34, -76, -138]);
  const midDepth = useTransform(scrollYProgress, [0, 0.34, 0.72], [-14, -34, -84]);
  const glowDepth = useTransform(scrollYProgress, [0, 0.34, 0.72], [-48, -82, -144]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.34, 0.72], [0.16, 0.3, 0.45]);
  const glowScale = useTransform(scrollYProgress, [0, 0.34, 0.72], [1, 1.14, 1.28]);

  const titleTransform = useMotionTemplate`translate3d(${pointerShiftX}px, ${combinedLift}px, ${combinedDepth}px) rotateX(${combinedRotateX}deg) rotateY(${combinedRotateY}deg) scale(${titleScale})`;
  const backLayerTransform = useMotionTemplate`translate3d(${backShiftX}px, ${backShiftY}px, ${backDepth}px)`;
  const midLayerTransform = useMotionTemplate`translate3d(${midShiftX}px, ${midShiftY}px, ${midDepth}px)`;
  const glowTransform = useMotionTemplate`translate3d(${glowShiftX}px, ${glowShiftY}px, ${glowDepth}px) scale(${glowScale})`;
  const subtitleTransform = useMotionTemplate`translate3d(${subtitleShiftX}px, ${subtitleShiftY}px, 0px)`;

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

    pointerRotateXTarget.set(-normalizedY * 9);
    pointerRotateYTarget.set(normalizedX * 13);
    pointerShiftXTarget.set(normalizedX * 16);
    pointerShiftYTarget.set(normalizedY * 10);
  };

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6"
      onMouseMove={handleMouseMove}
      onMouseLeave={resetPointerTilt}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 34%, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.014) 26%, rgba(0,0,0,0) 58%), linear-gradient(180deg, rgba(10,10,10,0.22) 0%, rgba(10,10,10,0) 22%, rgba(10,10,10,0) 62%, rgba(10,10,10,0.34) 100%)',
        }}
      />

      <div
        className="absolute inset-x-0 bottom-0 top-[44%]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
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
            'radial-gradient(circle at 50% 62%, rgba(230,37,37,0.08) 0%, rgba(230,37,37,0.014) 24%, rgba(0,0,0,0) 56%)',
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
            'inset 0 0 180px rgba(0,0,0,0.84), inset 0 -120px 160px rgba(0,0,0,0.68)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 flex w-full max-w-6xl justify-center"
        style={{ opacity: sectionOpacity, scale: sectionScale, y: sectionY }}
      >
        <div className="relative inline-flex flex-col items-center text-center">
          <div
            className="relative"
            style={{
              perspective: '2100px',
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
                className="absolute inset-[-10%] rounded-full"
                style={{
                  transform: glowTransform,
                  opacity: glowOpacity,
                  background:
                    'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.08) 42%, rgba(255,255,255,0) 76%)',
                  filter: 'blur(34px)',
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
                  fontSize: 'clamp(4.8rem, 16vw, 11.6rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.08em',
                  lineHeight: 0.88,
                  color: 'rgba(0,0,0,0.72)',
                  textShadow: '0 20px 34px rgba(0,0,0,0.5)',
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
                  fontSize: 'clamp(4.8rem, 16vw, 11.6rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.08em',
                  lineHeight: 0.88,
                  color: 'rgba(255,255,255,0.12)',
                  textShadow: '0 18px 40px rgba(0,0,0,0.48)',
                  pointerEvents: 'none',
                }}
              >
                MADBAK
              </motion.span>

              <motion.h1
                className="relative whitespace-nowrap"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(4.8rem, 16vw, 11.6rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.08em',
                  lineHeight: 0.88,
                  color: '#F6F6F6',
                  background:
                    'linear-gradient(180deg, #ffffff 0%, #f5f5f5 56%, #dadada 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow:
                    '0 0 24px rgba(255,255,255,0.08), 0 18px 42px rgba(0,0,0,0.62)',
                }}
              >
                MADBAK
              </motion.h1>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.28, ease: 'easeOut' }}
            className="mt-4 whitespace-nowrap sm:mt-5"
            style={{
              transform: subtitleTransform,
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
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}  const pointerShiftY = useSpring(pointerShiftYTarget, {
    stiffness: 160,
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
      scrollDepth + Math.abs(pointerX) * 1.8 + Math.abs(pointerY) * 1.1
  );

  const backShiftX = useTransform(pointerShiftX, (value) => value * 0.9);
  const backShiftY = useTransform(pointerShiftY, (value) => value * 0.58);
  const midShiftX = useTransform(pointerShiftX, (value) => value * 0.42);
  const midShiftY = useTransform(pointerShiftY, (value) => value * 0.24);
  const subtitleShiftX = useTransform(pointerShiftX, (value) => value * 0.18);
  const subtitleShiftY = useTransform(pointerShiftY, (value) => value * 0.12);
  const glowShiftX = useTransform(pointerShiftX, (value) => value * 0.52);
  const glowShiftY = useTransform(pointerShiftY, (value) => value * 0.28);

  const backDepth = useTransform(scrollYProgress, [0, 0.34, 0.72], [-34, -76, -138]);
  const midDepth = useTransform(scrollYProgress, [0, 0.34, 0.72], [-14, -34, -84]);
  const glowDepth = useTransform(scrollYProgress, [0, 0.34, 0.72], [-48, -82, -144]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.34, 0.72], [0.16, 0.3, 0.45]);
  const glowScale = useTransform(scrollYProgress, [0, 0.34, 0.72], [1, 1.14, 1.28]);

  const titleTransform = useMotionTemplate`translate3d(${pointerShiftX}px, ${combinedLift}px, ${combinedDepth}px) rotateX(${combinedRotateX}deg) rotateY(${combinedRotateY}deg) scale(${titleScale})`;
  const backLayerTransform = useMotionTemplate`translate3d(${backShiftX}px, ${backShiftY}px, ${backDepth}px)`;
  const midLayerTransform = useMotionTemplate`translate3d(${midShiftX}px, ${midShiftY}px, ${midDepth}px)`;
  const glowTransform = useMotionTemplate`translate3d(${glowShiftX}px, ${glowShiftY}px, ${glowDepth}px) scale(${glowScale})`;
  const subtitleTransform = useMotionTemplate`translate3d(${subtitleShiftX}px, ${subtitleShiftY}px, 0px)`;

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

    pointerRotateXTarget.set(-normalizedY * 9);
    pointerRotateYTarget.set(normalizedX * 13);
    pointerShiftXTarget.set(normalizedX * 16);
    pointerShiftYTarget.set(normalizedY * 10);
  };

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6"
      onMouseMove={handleMouseMove}
      onMouseLeave={resetPointerTilt}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 34%, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.014) 26%, rgba(0,0,0,0) 58%), linear-gradient(180deg, rgba(10,10,10,0.22) 0%, rgba(10,10,10,0) 22%, rgba(10,10,10,0) 62%, rgba(10,10,10,0.34) 100%)',
        }}
      />

      <div
        className="absolute inset-x-0 bottom-0 top-[44%]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
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
            'radial-gradient(circle at 50% 62%, rgba(230,37,37,0.08) 0%, rgba(230,37,37,0.014) 24%, rgba(0,0,0,0) 56%)',
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
            'inset 0 0 180px rgba(0,0,0,0.84), inset 0 -120px 160px rgba(0,0,0,0.68)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 flex w-full max-w-6xl justify-center"
        style={{ opacity: sectionOpacity, scale: sectionScale, y: sectionY }}
      >
        <div className="relative inline-flex flex-col items-center text-center">
          <div
            className="relative"
            style={{
              perspective: '2100px',
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
                className="absolute inset-[-10%] rounded-full"
                style={{
                  transform: glowTransform,
                  opacity: glowOpacity,
                  background:
                    'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.08) 42%, rgba(255,255,255,0) 76%)',
                  filter: 'blur(34px)',
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
                  fontSize: 'clamp(4.8rem, 16vw, 11.6rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.08em',
                  lineHeight: 0.88,
                  color: 'rgba(0,0,0,0.72)',
                  textShadow: '0 20px 34px rgba(0,0,0,0.5)',
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
                  fontSize: 'clamp(4.8rem, 16vw, 11.6rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.08em',
                  lineHeight: 0.88,
                  color: 'rgba(255,255,255,0.12)',
                  textShadow: '0 18px 40px rgba(0,0,0,0.48)',
                  pointerEvents: 'none',
                }}
              >
                MADBAK
              </motion.span>

              <motion.h1
                className="relative whitespace-nowrap"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(4.8rem, 16vw, 11.6rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.08em',
                  lineHeight: 0.88,
                  color: '#F6F6F6',
                  background:
                    'linear-gradient(180deg, #ffffff 0%, #f5f5f5 56%, #dadada 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow:
                    '0 0 24px rgba(255,255,255,0.08), 0 18px 42px rgba(0,0,0,0.62)',
                }}
              >
                MADBAK
              </motion.h1>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.28, ease: 'easeOut' }}
            className="mt-4 whitespace-nowrap sm:mt-5"
            style={{
              transform: subtitleTransform,
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.82rem, 1.45vw, 1.04rem)',
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
