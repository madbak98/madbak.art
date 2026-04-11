import {
  motion,
  useMotionTemplate,
  useScroll,
  useSpring,
  useMotionValue,
  useTransform,
} from 'motion/react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { useRef } from 'react';
import { ArrowDown } from 'lucide-react';

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const pointerRotateXTarget = useMotionValue(0);
  const pointerRotateYTarget = useMotionValue(0);
  const pointerShiftXTarget = useMotionValue(0);
  const pointerShiftYTarget = useMotionValue(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  const titleLift = useSpring(
    useTransform(scrollYProgress, [0, 0.36, 0.72], [0, -10, -24]),
    { stiffness: 140, damping: 24, mass: 0.45 }
  );
  const titleRotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.32, 0.72], [0, 18, 40]),
    { stiffness: 140, damping: 24, mass: 0.45 }
  );
  const titleRotateY = useSpring(
    useTransform(scrollYProgress, [0, 0.36, 0.72], [0, -5, -14]),
    { stiffness: 140, damping: 24, mass: 0.45 }
  );
  const titleDepth = useSpring(
    useTransform(scrollYProgress, [0, 0.36, 0.72], [0, 40, 128]),
    { stiffness: 140, damping: 24, mass: 0.45 }
  );
  const titleScale = useSpring(
    useTransform(scrollYProgress, [0, 0.36, 0.72], [1, 1.035, 1.085]),
    { stiffness: 140, damping: 26, mass: 0.4 }
  );
  const titleGlowOpacity = useTransform(scrollYProgress, [0, 0.36, 0.72], [0.2, 0.36, 0.54]);
  const titleHaloScale = useTransform(scrollYProgress, [0, 0.36, 0.72], [1, 1.14, 1.32]);
  const titleEchoY = useTransform(scrollYProgress, [0, 0.36, 0.72], [0, 10, 20]);
  const titleEchoDepth = useTransform(scrollYProgress, [0, 0.36, 0.72], [-10, -36, -76]);
  const pointerRotateX = useSpring(pointerRotateXTarget, {
    stiffness: 180,
    damping: 22,
    mass: 0.35,
  });
  const pointerRotateY = useSpring(pointerRotateYTarget, {
    stiffness: 180,
    damping: 22,
    mass: 0.35,
  });
  const pointerShiftX = useSpring(pointerShiftXTarget, {
    stiffness: 160,
    damping: 22,
    mass: 0.4,
  });
  const pointerShiftY = useSpring(pointerShiftYTarget, {
    stiffness: 160,
    damping: 22,
    mass: 0.4,
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
      scrollDepth + Math.abs(pointerX) * 1.4 + Math.abs(pointerY) * 0.8
  );
  const haloShiftX = useTransform(pointerShiftX, (value) => value * 0.55);
  const haloShiftY = useTransform(pointerShiftY, (value) => value * 0.35);
  const echoShiftX = useTransform(pointerShiftX, (value) => value * 0.8);
  const echoShiftY = useTransform(pointerShiftY, (value) => value * 0.6);
  const combinedEchoY = useTransform(
    [titleEchoY, echoShiftY],
    ([scrollEchoY, pointerEchoY]) => scrollEchoY + pointerEchoY
  );
  const titleTransform = useMotionTemplate`translate3d(${pointerShiftX}px, ${combinedLift}px, ${combinedDepth}px) rotateX(${combinedRotateX}deg) rotateY(${combinedRotateY}deg) scale(${titleScale})`;
  const titleHaloTransform = useMotionTemplate`translate3d(${haloShiftX}px, ${haloShiftY}px, -125px) scale(${titleHaloScale})`;
  const titleEchoTransform = useMotionTemplate`translate3d(${echoShiftX}px, ${combinedEchoY}px, ${titleEchoDepth}px) scale(0.985)`;

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

    pointerRotateXTarget.set(-normalizedY * 11);
    pointerRotateYTarget.set(normalizedX * 14);
    pointerShiftXTarget.set(normalizedX * 18);
    pointerShiftYTarget.set(normalizedY * 12);
  };

  return (
    <section 
      ref={ref}
      className="relative h-screen flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={resetPointerTilt}
    >
      <motion.div 
        style={{ opacity, scale, y }}
        className="text-center z-10 px-4"
      >
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <span 
            className="text-xs tracking-[0.3em] uppercase"
            style={{ fontFamily: 'var(--font-mono)', color: '#E62525' }}
          >
           · GRAPHIC DESIGNER ·
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-6"
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
              className="absolute inset-[-10%] rounded-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0.12) 38%, rgba(255,255,255,0) 72%)',
                filter: 'blur(28px)',
                opacity: titleGlowOpacity,
                transform: titleHaloTransform,
              }}
            />

            <motion.span
              aria-hidden="true"
              className="absolute inset-0 select-none"
              style={{
                transform: titleEchoTransform,
                transformStyle: 'preserve-3d',
                fontFamily: 'var(--font-hero)',
                fontSize: 'clamp(4rem, 15vw, 10rem)',
                fontWeight: 400,
                letterSpacing: 'clamp(0.08em, 0.5vw, 0.18em)',
                textTransform: 'uppercase',
                lineHeight: 0.92,
                color: 'rgba(255,255,255,0.16)',
                textShadow: '0 24px 40px rgba(0,0,0,0.5)',
                pointerEvents: 'none',
              }}
            >
              MADBAK
            </motion.span>

            <motion.h1
              style={{
                fontFamily: 'var(--font-hero)',
                fontSize: 'clamp(4rem, 15vw, 10rem)',
                fontWeight: 400,
                letterSpacing: 'clamp(0.08em, 0.5vw, 0.18em)',
                textTransform: 'uppercase',
                lineHeight: 0.92,
                color: '#FFFFFF',
                background:
                  'linear-gradient(180deg, #ffffff 0%, #ffffff 46%, #e8edf5 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow:
                  '0 0 18px rgba(255,255,255,0.18), 0 22px 40px rgba(0,0,0,0.4)',
                WebkitTextStroke: '1px rgba(255,255,255,0.18)',
                position: 'relative',
              }}
            >
              MADBAK
            </motion.h1>
          </motion.div>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-2xl mx-auto mb-12 text-sm tracking-[0.15em] uppercase"
          style={{ 
            fontFamily: 'var(--font-body)',
            color: 'rgba(245, 245, 245, 0.7)',
          }}
        >crafting digital stories for the Web3 universe<br /></motion.p>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          onClick={() => {
            document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="group relative px-8 py-4 overflow-hidden transition-all duration-300"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.875rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            border: '2px solid #E62525',
            color: '#F5F5F5',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E62525'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <span className="relative z-10">View Work</span>
        </motion.button>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowDown size={24} style={{ color: '#E62525' }} />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Red accent lines */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 1 }}
        className="absolute top-0 left-0 h-[2px] w-full origin-left"
        style={{ backgroundColor: '#E62525' }}
      />
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 1.1 }}
        className="absolute bottom-0 left-0 h-[2px] w-full origin-right"
        style={{ backgroundColor: '#E62525' }}
      />
    </section>
  );
}
