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
