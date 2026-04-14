import { motion, useScroll, useTransform } from 'motion/react';
import { useRef, type SVGProps } from 'react';
import { Mail, Instagram } from 'lucide-react';

function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M5 4L18.2 20"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <path
        d="M18.4 4L9.8 13.8"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <path
        d="M7.2 20L12 14.45"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

const socialLinks = [
  { icon: XIcon, label: 'X', handle: '@Lilosama98', url: 'https://x.com/Lilosama98' },
  { icon: Instagram, label: 'Instagram', handle: '@madbak98', url: 'https://www.instagram.com/madbak98/' },
];

export function ContactSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [0, 1, 1]);
  const y = useTransform(scrollYProgress, [0, 0.3, 1], [100, 0, 0]);

  return (
    <section
      id="contact"
      ref={ref}
      className="relative min-h-screen flex items-center justify-center py-32 px-4"
    >
      <motion.div 
        style={{ opacity, y }}
        className="max-w-4xl w-full z-10"
      >
        {/* Label */}
        <div className="mb-6">
          <span 
            className="text-xs tracking-[0.3em] uppercase"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-green)' }}
          >
            [004] CONTACT
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
          LET'S CREATE<br />TOGETHER
        </h2>

        {/* Email */}
        <motion.a
          href="mailto:madbak98@gmail.com"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="group flex items-center gap-4 mb-16 w-fit"
        >
          <Mail size={24} style={{ color: 'var(--accent-green)' }} />
          <span
            className="transition-colors duration-300"
            style={{ 
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(1.25rem, 3vw, 2rem)',
              letterSpacing: '0.05em',
              color: 'var(--foreground)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-green)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--foreground)'}
          >MADBAK98@gmail.com</span>
        </motion.a>

        {/* Social Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {socialLinks.map((social, index) => (
            <motion.a
              key={social.label}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              viewport={{ once: true }}
              className="group border-l-2 pl-6 py-4 transition-all duration-300"
              style={{ borderColor: 'rgba(var(--foreground-rgb), 0.16)' }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-green)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(var(--foreground-rgb), 0.16)'}
            >
              <div className="flex items-center gap-3 mb-2">
                <social.icon
                  size={social.label === 'X' ? 18 : 20}
                  style={{
                    color: 'var(--accent-green)',
                    display: 'block',
                    strokeWidth: social.label === 'X' ? 1.9 : undefined,
                  }}
                />
                <span 
                  className="text-sm tracking-[0.2em] uppercase"
                  style={{ 
                    fontFamily: 'var(--font-mono)',
                    color: 'rgba(var(--foreground-rgb), 0.6)',
                  }}
                >
                  {social.label}
                </span>
              </div>
              <span
                className="text-lg transition-colors duration-300"
                style={{ 
                  fontFamily: 'var(--font-body)',
                  letterSpacing: '0.1em',
                  color: 'var(--foreground)',
                }}
              >
                {social.handle}
              </span>
            </motion.a>
          ))}
        </div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          viewport={{ once: true }}
          className="h-[2px] w-full mb-12 origin-left"
          style={{ backgroundColor: 'rgba(var(--secondary-element-rgb), 0.35)' }}
        />

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
        >
          <div>
            <p 
              className="text-xs tracking-[0.2em] uppercase mb-2"
              style={{ 
                fontFamily: 'var(--font-body)',
                color: 'rgba(var(--foreground-rgb), 0.66)',
              }}
            >
              Available for commissions & collaborations
            </p>
            <p 
              className="text-xs tracking-[0.15em]"
              style={{ 
                fontFamily: 'var(--font-mono)',
                color: 'rgba(var(--foreground-rgb), 0.48)',
              }}
            >
              © 2026 MADBAK. All rights reserved.
            </p>
          </div>
          
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="flex items-center gap-2"
          >
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: 'var(--accent-green)' }}
            />
            <span 
              className="text-xs tracking-[0.2em] uppercase"
              style={{ 
                fontFamily: 'var(--font-mono)',
                color: 'var(--accent-green)',
              }}
            >
              Currently Available
            </span>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Decorative Lines */}
      <motion.div
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        transition={{ duration: 1.2, delay: 0.4 }}
        viewport={{ once: true }}
        className="absolute left-0 top-0 w-[2px] h-full origin-top"
        style={{ backgroundColor: 'var(--accent-green)' }}
      />
      <motion.div
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        transition={{ duration: 1.2, delay: 0.5 }}
        viewport={{ once: true }}
        className="absolute right-0 top-0 w-[2px] h-full origin-top"
        style={{ backgroundColor: 'var(--accent-green)' }}
      />
    </section>
  );
}
