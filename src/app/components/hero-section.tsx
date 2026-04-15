import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import { useRef, type MouseEvent as ReactMouseEvent } from 'react';
import { Hero3D } from './Hero3D';

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const pointerXTarget = useMotionValue(0);
  const pointerYTarget = useMotionValue(0);

  const pointerX = useSpring(pointerXTarget, {
    stiffness: 180,
    damping: 24,
    mass: 0.52,
  });
  const pointerY = useSpring(pointerYTarget, {
    stiffness: 180,
    damping: 24,
    mass: 0.52,
  });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  const titleY = useTransform(scrollYProgress, [0, 0.55], [0, -118]);
  const titleScale = useTransform(scrollYProgress, [0, 0.55], [1, 0.92]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0.18]);
  const infoY = useTransform(scrollYProgress, [0, 0.55], [0, -40]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 110]);

  const handleMouseMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const normalizedX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const normalizedY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

    pointerXTarget.set(normalizedX);
    pointerYTarget.set(normalizedY);
  };

  const resetPointer = () => {
    pointerXTarget.set(0);
    pointerYTarget.set(0);
  };

  return (
    <section ref={ref} id="hero" className="relative min-h-[112vh]">
      <div
        className="sticky top-0 flex min-h-screen items-end overflow-hidden px-6 pb-10 pt-28 sm:px-10 lg:px-14"
        onMouseMove={handleMouseMove}
        onMouseLeave={resetPointer}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            y: backgroundY,
            background:
              'radial-gradient(circle at 20% 18%, rgba(var(--secondary-element-rgb), 0.12) 0%, rgba(var(--secondary-element-rgb), 0.02) 22%, transparent 50%), radial-gradient(circle at 76% 64%, rgba(var(--foreground-rgb), 0.08) 0%, rgba(var(--foreground-rgb), 0.01) 22%, transparent 56%)',
          }}
        />

        <div
          className="absolute inset-x-0 bottom-0 top-[42%]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(var(--foreground-rgb), 0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(var(--foreground-rgb), 0.06) 1px, transparent 1px)
            `,
            backgroundSize: '72px 72px',
            opacity: 0.36,
            maskImage:
              'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.72) 18%, black 100%)',
            WebkitMaskImage:
              'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.72) 18%, black 100%)',
          }}
        />

        <div
          className="absolute inset-y-0 left-[7%] hidden w-px lg:block"
          style={{ background: 'rgba(var(--foreground-rgb), 0.08)' }}
        />
        <div
          className="absolute inset-y-0 right-[7%] hidden w-px lg:block"
          style={{ background: 'rgba(var(--foreground-rgb), 0.05)' }}
        />

        <Hero3D
          scrollProgress={scrollYProgress}
          pointerX={pointerX}
          pointerY={pointerY}
        />

        <div className="relative z-10 mx-auto grid min-h-[calc(100vh-8rem)] w-full max-w-7xl grid-cols-1 gap-14 lg:grid-cols-12">
          <motion.div
            className="hidden lg:col-span-2 lg:flex lg:flex-col lg:justify-between"
            style={{ y: infoY }}
          >
            <div className="pt-12">
              <div
                className="mb-4 h-px w-14"
                style={{ background: 'rgba(var(--secondary-element-rgb), 0.92)' }}
              />
              <div
                className="space-y-1 text-[0.68rem]"
                style={{
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  color: 'rgba(var(--foreground-rgb), 0.74)',
                }}
              >
                <p style={{ color: 'var(--accent-green)' }}>01 / PORTFOLIO</p>
                <p>Creative direction</p>
                <p>Digital image systems</p>
              </div>
            </div>

            <div
              className="space-y-2 pb-5 text-[0.7rem]"
              style={{
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(var(--foreground-rgb), 0.46)',
              }}
            >
              <p>Editorial composition</p>
              <p>Motion language</p>
              <p>Black / white / red</p>
            </div>
          </motion.div>

          <motion.div
            className="flex flex-col justify-end lg:col-span-8"
            style={{ y: titleY, scale: titleScale, opacity: titleOpacity }}
          >
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08, ease: 'easeOut' }}
              className="mb-7 flex items-center gap-4"
            >
              <span
                className="h-px w-12 sm:w-16"
                style={{ background: 'rgba(var(--secondary-element-rgb), 0.9)' }}
              />
              <span
                className="text-[0.68rem] sm:text-[0.72rem]"
                style={{
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: 'var(--accent-green)',
                }}
              >
                Madbak.art / Visual Portfolio
              </span>
            </motion.div>

            <div className="relative">
              <motion.span
                aria-hidden="true"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.12, ease: 'easeOut' }}
                className="pointer-events-none absolute left-0 top-[10%] hidden whitespace-nowrap lg:block"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(5rem, 19vw, 16rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.06em',
                  lineHeight: 0.82,
                  color: 'transparent',
                  WebkitTextStroke: '1px rgba(var(--foreground-rgb), 0.12)',
                  opacity: 0.3,
                  transform: 'translate3d(1.2rem, 1.2rem, 0)',
                }}

              >
                MADBAK
              </motion.span>

              <motion.h1
                className="heading-glitch"
                data-text="MADBAK"
                initial={{ opacity: 0, y: 40, clipPath: 'inset(0 0 100% 0)' }}
                animate={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
                transition={{
                  duration: 0.95,
                  delay: 0.12,
                  ease: [0.2, 1, 0.22, 1],
                }}
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(5rem, 19vw, 16rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.06em',
                  lineHeight: 0.82,
                  color: 'var(--main-element)',
                  textTransform: 'uppercase',
                }}
              >
                MADBAK
              </motion.h1>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.78, delay: 0.24, ease: 'easeOut' }}
              className="mt-8 grid max-w-4xl gap-7 border-t pt-7 sm:grid-cols-[1fr_auto]"
              style={{ borderColor: 'rgba(var(--foreground-rgb), 0.12)' }}
            >
              <div
                className="border-l pl-5"
                style={{ borderColor: 'rgba(var(--foreground-rgb), 0.14)' }}
              >
                <p
                  className="text-[0.98rem] sm:text-[1.1rem]"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 300,
                    letterSpacing: '0.34em',
                    textTransform: 'uppercase',
                    color: 'rgba(var(--foreground-rgb), 0.9)',
                  }}
                >
                  Designer
                </p>
                <p
                  className="mt-2 text-[0.98rem] sm:text-[1.1rem]"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 300,
                    letterSpacing: '0.34em',
                    textTransform: 'uppercase',
                    color: 'rgba(var(--foreground-rgb), 0.62)',
                  }}
                >
                  &amp; Developer
                </p>
              </div>

              <div className="sm:text-right">
                <p
                  className="text-[0.72rem] sm:text-[0.78rem]"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.26em',
                    textTransform: 'uppercase',
                    color: 'var(--accent-green)',
                  }}
                >
                  Cinematic systems
                </p>
                <p
                  className="mt-2 max-w-[20rem] text-[0.9rem] leading-relaxed sm:ml-auto"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 300,
                    letterSpacing: '0.08em',
                    color: 'rgba(var(--foreground-rgb), 0.58)',
                  }}
                >
                  Building dark visual worlds with restrained direction, sharp
                  typography and image-led storytelling.
                </p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="hidden items-end justify-end lg:col-span-2 lg:flex"
            style={{ y: infoY }}
          >
            <div
              className="w-full border-t pt-4"
              style={{ borderColor: 'rgba(var(--foreground-rgb), 0.12)' }}
            >
              <p
                className="text-[0.7rem]"
                style={{
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  color: 'var(--accent-green)',
                }}
              >
                Based in Istanbul
              </p>
              <p
                className="mt-2 text-[0.86rem]"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 300,
                  letterSpacing: '0.1em',
                  color: 'rgba(var(--foreground-rgb), 0.64)',
                }}
              >
                Graphic design, video editing and web programming.
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="absolute bottom-5 left-6 sm:left-10 lg:left-14"
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.66rem',
              letterSpacing: '0.26em',
              textTransform: 'uppercase',
              color: 'rgba(var(--foreground-rgb), 0.44)',
            }}
          >
            Scroll to enter
          </span>
        </motion.div>
      </div>
    </section>
  );
}
