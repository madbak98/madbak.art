import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

const STATS = [
  { value: '80+', label: 'Characters built' },
  { value: '02', label: 'Collections launched' },
  { value: '50+', label: 'Holders reached' },
  { value: '05+', label: 'Years in practice' },
];

export function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.18, 0.82, 1], [0, 1, 1, 0.4]);
  const y = useTransform(scrollYProgress, [0, 0.18, 0.82, 1], [60, 0, 0, -40]);
  const backgroundWordY = useTransform(scrollYProgress, [0, 1], [80, -40]);

  return (
    <section
      id="about"
      ref={ref}
      className="relative min-h-screen px-6 py-28 sm:px-10 lg:px-14"
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-10 overflow-hidden"
        style={{ y: backgroundWordY }}
      >
        <div
          className="whitespace-nowrap"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(6rem, 20vw, 18rem)',
            fontWeight: 800,
            letterSpacing: '-0.08em',
            lineHeight: 0.8,
            color: 'rgba(var(--foreground-rgb), 0.035)',
            textTransform: 'uppercase',
          }}
        >
          Profile Profile Profile
        </div>
      </motion.div>

      <motion.div
        className="relative z-10 mx-auto max-w-7xl"
        style={{ opacity, y }}
      >
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <div
              className="mb-7 inline-flex items-center gap-4"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: 'var(--accent-green)',
              }}
            >
              <span
                className="h-px w-12"
                style={{ background: 'rgba(var(--secondary-element-rgb), 0.9)' }}
              />
              [001] ABOUT
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(4.5rem, 10vw, 8.5rem)',
                fontWeight: 800,
                letterSpacing: '-0.06em',
                lineHeight: 0.82,
                textTransform: 'uppercase',
                color: 'var(--main-element)',
              }}
            >
              Designed
              <br />
              Presence
            </h2>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <div
              className="grid gap-8 border-t pt-8"
              style={{ borderColor: 'rgba(var(--foreground-rgb), 0.12)' }}
            >
              <p
                className="max-w-4xl text-[1.1rem] leading-[1.6] sm:text-[1.35rem]"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 300,
                  letterSpacing: '0.04em',
                  color: 'rgba(var(--foreground-rgb), 0.82)',
                }}
              >
                I approach design like direction: each image, frame and layout
                should carry presence before it explains itself. My work lives
                between graphic systems, motion language and cinematic visual
                storytelling.
              </p>

              <p
                className="max-w-3xl text-[0.98rem] leading-[1.7] sm:text-[1.08rem]"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 300,
                  letterSpacing: '0.06em',
                  color: 'rgba(var(--foreground-rgb), 0.58)',
                }}
              >
                From character-driven worlds to visual campaigns and portfolio
                systems, I build work that feels controlled, sharp and deeply
                composed. The goal is never decoration. The goal is impact,
                structure and a memorable atmosphere.
              </p>

              <div className="grid gap-4 pt-3 sm:grid-cols-3">
                {['Art direction', 'Motion systems', 'Graphic identity'].map(
                  (item) => (
                    <div
                      key={item}
                      className="border-t pt-4"
                      style={{ borderColor: 'rgba(var(--foreground-rgb), 0.1)' }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.7rem',
                          letterSpacing: '0.24em',
                          textTransform: 'uppercase',
                          color: 'rgba(var(--foreground-rgb), 0.54)',
                        }}
                      >
                        {item}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        <div
          className="mt-20 grid gap-6 border-t pt-8 sm:grid-cols-2 xl:grid-cols-4"
          style={{ borderColor: 'rgba(var(--foreground-rgb), 0.12)' }}
        >
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              viewport={{ once: true, margin: '-80px' }}
              className="border-l pl-5"
              style={{ borderColor: 'rgba(var(--secondary-element-rgb), 0.6)' }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(2.8rem, 5vw, 4.2rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.05em',
                  lineHeight: 0.86,
                  color: 'var(--main-element)',
                }}
              >
                {stat.value}
              </div>
              <div
                className="mt-2"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'rgba(var(--foreground-rgb), 0.52)',
                }}
              >
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
