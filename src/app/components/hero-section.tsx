import { motion } from 'motion/react';

export function HeroSection() {
  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6"
      style={{ backgroundColor: '#020202' }}
    >
      <div className="absolute inset-0 bg-black" />

      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 42%, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.015) 22%, rgba(0,0,0,0) 52%)',
        }}
      />

      <div
        className="absolute inset-x-0 bottom-0 top-[48%]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)
          `,
          backgroundSize: '72px 72px',
          opacity: 0.14,
          maskImage: 'linear-gradient(to top, black 0%, black 34%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to top, black 0%, black 34%, transparent 100%)',
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(2,2,2,0.08) 0%, rgba(2,2,2,0) 28%, rgba(2,2,2,0) 68%, rgba(2,2,2,0.28) 100%)',
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            'repeating-linear-gradient(180deg, rgba(255,255,255,0.016) 0px, rgba(255,255,255,0.016) 1px, transparent 1px, transparent 4px)',
          opacity: 0.06,
          mixBlendMode: 'soft-light',
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          boxShadow:
            'inset 0 0 180px rgba(0,0,0,0.92), inset 0 -120px 180px rgba(0,0,0,0.7)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 flex w-full max-w-6xl justify-center"
      >
        <div className="relative inline-flex flex-col items-center text-center">
          <motion.span
            initial={{ opacity: 0, y: -10, rotate: -6 }}
            animate={{ opacity: 1, y: 0, rotate: -6 }}
            transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
            className="absolute right-[1%] top-[8%] z-20 whitespace-nowrap rounded-sm border border-red-500/30 px-2 py-1 sm:right-0"
            style={{
              transform: 'translateX(22%) rotate(-6deg)',
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

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.12, ease: 'easeOut' }}
            className="whitespace-nowrap"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(4.4rem, 16vw, 11.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.08em',
              lineHeight: 0.88,
              color: '#F7F7F7',
              textShadow:
                '0 0 24px rgba(255,255,255,0.08), 0 18px 42px rgba(0,0,0,0.65)',
            }}
          >
            MADBAK
          </motion.h1>

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
            }}
          >
            DESIGNER
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}
scrollYProgress,
    [0, 0.36, 0.72],
    [0, 10, 20]
  );
  const titleEchoDepth = useTransform(
    scrollYProgress,
    [0, 0.36, 0.72],
    [-10, -36, -76]
  );

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
      <motion.div style={{ opacity, scale, y }} className="text-center z-10 px-4">
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
          <div
            className="relative inline-flex items-center justify-center px-[clamp(1.2rem,3vw,2.6rem)] py-[clamp(1rem,2.4vw,1.9rem)]"
            style={{
              borderRadius: '30px',
              border: '1px solid rgba(255,255,255,0.16)',
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 38%, rgba(255,255,255,0.03) 100%)',
              boxShadow:
                '0 24px 80px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(255,255,255,0.04)',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
              overflow: 'hidden',
            }}
          >
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 16%, rgba(255,255,255,0.02) 42%, rgba(255,255,255,0.01) 100%)',
                pointerEvents: 'none',
              }}
            />
            <div
              aria-hidden="true"
              className="absolute inset-[10px] rounded-[22px]"
              style={{
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: 'inset 0 0 24px rgba(255,255,255,0.03)',
                pointerEvents: 'none',
              }}
            />
            <div
              aria-hidden="true"
              className="absolute left-0 top-0 h-[2px] w-full"
              style={{
                background:
                  'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 48%, rgba(255,255,255,0) 100%)',
                opacity: 0.8,
                pointerEvents: 'none',
              }}
            />

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
                  fontSize: 'clamp(4.4rem, 15vw, 10.4rem)',
                  fontWeight: 400,
                  letterSpacing: 'clamp(0em, 0.05vw, 0.015em)',
                  textTransform: 'none',
                  lineHeight: 0.98,
                  color: 'rgba(255,255,255,0.14)',
                  textShadow: '0 20px 34px rgba(0,0,0,0.46)',
                  pointerEvents: 'none',
                }}
              >
                MADBAK
              </motion.span>

              <motion.h1
                style={{
                  fontFamily: 'var(--font-hero)',
                  fontSize: 'clamp(4.4rem, 15vw, 10.4rem)',
                  fontWeight: 400,
                  letterSpacing: 'clamp(0em, 0.05vw, 0.015em)',
                  textTransform: 'none',
                  lineHeight: 0.98,
                  color: '#FFFFFF',
                  background:
                    'linear-gradient(180deg, #ffffff 0%, #f5f5f5 54%, #dfe6ef 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow:
                    '0 0 14px rgba(255,255,255,0.12), 0 18px 34px rgba(0,0,0,0.36)',
                  WebkitTextStroke: '0.6px rgba(255,255,255,0.12)',
                  position: 'relative',
                }}
              >
                MADBAK
              </motion.h1>
            </motion.div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-2xl mx-auto mb-12 text-sm tracking-[0.15em] uppercase"
          style={{
            fontFamily: 'var(--font-body)',
            color: 'rgba(245, 245, 245, 0.7)',
          }}
        >
          crafting digital stories for the Web3 universe
          <br />
        </motion.p>

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
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#E62525';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <span className="relative z-10">View Work</span>
        </motion.button>

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
