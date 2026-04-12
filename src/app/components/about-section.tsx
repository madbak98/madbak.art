import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

export function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const x = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [-100, 0, 0, 100]);

  return (
    <section
      id="about"
      ref={ref}
      className="relative min-h-screen flex items-center justify-center py-32 px-4"
    >
      <motion.div style={{ opacity, x }} className="max-w-4xl z-10">
        {/* Label */}
        <div className="mb-6">
          <span
            className="text-xs tracking-[0.3em] uppercase"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-red)' }}
          >
            [001] ABOUT
          </span>
        </div>

        {/* Heading */}
        <h2
          className="mb-12"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.5rem, 8vw, 5rem)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: 'var(--foreground)',
          }}
        >
          CRAFTING
          <br />
          DIGITAL LEGENDS
        </h2>

        {/* Content */}
        <div className="space-y-6" style={{ fontFamily: 'var(--font-body)' }}>
          <p
            className="text-base leading-relaxed tracking-wide uppercase"
            style={{ color: 'rgba(var(--foreground-rgb), 0.82)' }}
          >I’m a curious          <span className="font-bold italic">video editor</span> and <span className="font-bold">graphic designer</span> who sees every project as a new adventure. Whether I’m crafting a dynamic edit or designing a brand’s visual identity, I’m driven by a desire to create content that feels fresh, striking and impactful. Off‑screen, you’ll find me diving into digital art communities, experimenting with new tools and chasing inspiration in the city’s vibrant culture.</p>
          
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
          {[
            { value: '80+', label: 'CHARACTERS' },
            { value: '2', label: 'COLLECTIONS' },
            { value: '50+', label: 'HOLDERS' },
            { value: '5+', label: 'YEARS EXP' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="border-l-2 pl-4"
              style={{ borderColor: 'var(--accent-red)' }}
            >
              <div
                className="text-4xl mb-2"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  color: 'var(--main-element)',
                }}
              >
                {stat.value}
              </div>
                <div
                className="text-xs tracking-[0.2em] uppercase"
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: 'rgba(var(--foreground-rgb), 0.62)',
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
}              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="border-l-2 pl-4"
              style={{ borderColor: 'var(--accent-red)' }}
            >
              <div
                className="text-4xl mb-2"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  color: 'var(--main-element)',
                }}
              >
                {stat.value}
              </div>
                <div
                className="text-xs tracking-[0.2em] uppercase"
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: 'rgba(var(--foreground-rgb), 0.62)',
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
