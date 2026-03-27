import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { ArrowDown } from 'lucide-react';

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100]);

  return (
    <section 
      ref={ref}
      className="relative h-screen flex items-center justify-center overflow-hidden"
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
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-6"
          style={{ 
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(4rem, 15vw, 10rem)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: '#F5F5F5',
          }}
        >
          MADBAK
        </motion.h1>

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
