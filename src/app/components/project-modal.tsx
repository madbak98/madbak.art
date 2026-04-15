import { motion } from 'motion/react';
import { X } from 'lucide-react';
import type { CSSProperties } from 'react';

type ProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  project: {
    title: string;
    category: string;
    year: string;
    image: string;
    images: string[];
  } | null;
};

const imageStyle: CSSProperties = {
  width: '100%',
  display: 'block',
  objectFit: 'cover',
};

export default function ProjectModal({
  isOpen,
  onClose,
  project,
}: ProjectModalProps) {
  if (!isOpen || !project) return null;

  const gallery = [project.image, ...project.images.filter((img) => img !== project.image)];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[9999] overflow-y-auto px-6 py-6 sm:px-10"
      style={{
        background: 'rgba(var(--background-rgb), 0.92)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 24% 18%, rgba(var(--secondary-element-rgb), 0.12) 0%, transparent 26%), radial-gradient(circle at 76% 72%, rgba(var(--foreground-rgb), 0.08) 0%, transparent 28%)',
          pointerEvents: 'none',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        onClick={(event) => event.stopPropagation()}
        className="relative mx-auto max-w-7xl border"
        style={{
          borderColor: 'rgba(var(--foreground-rgb), 0.1)',
          background: 'rgba(var(--background-rgb), 0.96)',
          boxShadow: '0 30px 80px rgba(var(--background-rgb), 0.58)',
        }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center border transition-colors duration-300"
          style={{
            borderColor: 'rgba(var(--foreground-rgb), 0.12)',
            color: 'rgba(var(--foreground-rgb), 0.84)',
            background: 'rgba(var(--background-rgb), 0.88)',
          }}
        >
          <X size={18} />
        </button>

        <div className="grid lg:grid-cols-[18rem_minmax(0,1fr)]">
          <aside
            className="border-b p-6 lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r lg:p-8"
            style={{
              borderColor: 'rgba(var(--foreground-rgb), 0.1)',
              background:
                'linear-gradient(180deg, rgba(var(--background-rgb), 0.98) 0%, rgba(var(--background-rgb), 0.92) 100%)',
            }}
          >
            <div
              className="mb-5 inline-flex items-center gap-4"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: 'var(--accent-green)',
              }}
            >
              <span
                className="h-px w-10"
                style={{ background: 'rgba(var(--secondary-element-rgb), 0.9)' }}
              />
              Project view
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(3rem, 6vw, 5rem)',
                fontWeight: 800,
                letterSpacing: '-0.06em',
                lineHeight: 0.82,
                textTransform: 'uppercase',
                color: 'var(--main-element)',
              }}
            >
              {project.title}
            </h2>

            <div
              className="mt-8 border-t pt-5"
              style={{ borderColor: 'rgba(var(--foreground-rgb), 0.1)' }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  color: 'var(--accent-green)',
                }}
              >
                {project.category}
              </p>
              <p
                className="mt-3"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  fontWeight: 300,
                  letterSpacing: '0.08em',
                  color: 'rgba(var(--foreground-rgb), 0.66)',
                }}
              >
                Selected frames from the project presentation and visual system.
              </p>
            </div>

            <div
              className="mt-8 grid gap-4 border-t pt-5"
              style={{ borderColor: 'rgba(var(--foreground-rgb), 0.1)' }}
            >
              <div>
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.66rem',
                    letterSpacing: '0.24em',
                    textTransform: 'uppercase',
                    color: 'rgba(var(--foreground-rgb), 0.42)',
                  }}
                >
                  Year
                </p>
                <p
                  className="mt-2"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '1rem',
                    fontWeight: 300,
                    letterSpacing: '0.1em',
                    color: 'var(--main-element)',
                  }}
                >
                  {project.year}
                </p>
              </div>

              <div>
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.66rem',
                    letterSpacing: '0.24em',
                    textTransform: 'uppercase',
                    color: 'rgba(var(--foreground-rgb), 0.42)',
                  }}
                >
                  Frames
                </p>
                <p
                  className="mt-2"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '1rem',
                    fontWeight: 300,
                    letterSpacing: '0.1em',
                    color: 'var(--main-element)',
                  }}
                >
                  {gallery.length}
                </p>
              </div>
            </div>
          </aside>

          <div className="p-4 sm:p-6 lg:p-8">
            <div className="grid gap-6">
              <div
                className="overflow-hidden border"
                style={{ borderColor: 'rgba(var(--foreground-rgb), 0.1)' }}
              >
                <img
                  src={gallery[0]}
                  alt={`${project.title} cover`}
                  style={{ ...imageStyle, aspectRatio: '16 / 10' }}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {gallery.slice(1).map((img, index) => (
                  <div
                    key={`${project.title}-${index}`}
                    className="overflow-hidden border"
                    style={{ borderColor: 'rgba(var(--foreground-rgb), 0.1)' }}
                  >
                    <img
                      src={img}
                      alt={`${project.title} frame ${index + 2}`}
                      style={{ ...imageStyle, aspectRatio: '4 / 5' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
