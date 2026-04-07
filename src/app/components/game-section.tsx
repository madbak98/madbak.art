import { motion } from 'motion/react';
import { useMemo, useState } from 'react';

type SceneObject = {
  id: string;
  label: string;
  targetId: string;
  x: string;
  y: string;
  width: string;
  height: string;
  title: string;
  subtitle: string;
  shape: 'monitor' | 'frame' | 'phone';
};

const objects: SceneObject[] = [
  {
    id: 'about-object',
    label: 'ABOUT',
    targetId: 'about',
    x: '16%',
    y: '18%',
    width: '22%',
    height: '42%',
    title: 'Identity Frame',
    subtitle: 'bio / archive / profile',
    shape: 'frame',
  },
  {
    id: 'work-object',
    label: 'WORK',
    targetId: 'work',
    x: '41%',
    y: '42%',
    width: '24%',
    height: '24%',
    title: 'Work Station',
    subtitle: 'projects / output / archive',
    shape: 'monitor',
  },
  {
    id: 'contact-object',
    label: 'CONTACT',
    targetId: 'contact',
    x: '74%',
    y: '46%',
    width: '10%',
    height: '22%',
    title: 'Signal Line',
    subtitle: 'contact / access / message',
    shape: 'phone',
  },
];

function openSection(targetId: string) {
  document.getElementById(targetId)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
}

function ObjectVisual({
  shape,
  active,
}: {
  shape: SceneObject['shape'];
  active: boolean;
}) {
  const border = active ? '#ffffff' : 'rgba(255,255,255,0.34)';
  const glow = active ? '0 0 28px rgba(255,255,255,0.18)' : '0 0 12px rgba(255,255,255,0.06)';
  const soft = active ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)';

  if (shape === 'frame') {
    return (
      <div
        className="absolute inset-0"
        style={{
          border: `1px solid ${border}`,
          background: soft,
          boxShadow: glow,
        }}
      >
        <div
          className="absolute"
          style={{
            left: '10%',
            top: '10%',
            right: '10%',
            bottom: '10%',
            border: `1px solid ${border}`,
          }}
        />
        <div
          className="absolute"
          style={{
            left: '18%',
            top: '18%',
            right: '18%',
            bottom: '18%',
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
          }}
        />
      </div>
    );
  }

  if (shape === 'monitor') {
    return (
      <div className="absolute inset-0">
        <div
          className="absolute"
          style={{
            left: '0%',
            top: '0%',
            width: '100%',
            height: '76%',
            border: `1px solid ${border}`,
            background: soft,
            boxShadow: glow,
          }}
        >
          <div
            className="absolute"
            style={{
              left: '6%',
              top: '10%',
              width: '88%',
              height: '72%',
              border: `1px solid ${border}`,
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.015))',
            }}
          />
        </div>
        <div
          className="absolute"
          style={{
            left: '42%',
            top: '76%',
            width: '16%',
            height: '12%',
            borderLeft: `1px solid ${border}`,
            borderRight: `1px solid ${border}`,
          }}
        />
        <div
          className="absolute"
          style={{
            left: '30%',
            top: '88%',
            width: '40%',
            height: '8%',
            border: `1px solid ${border}`,
            background: soft,
          }}
        />
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      <div
        className="absolute"
        style={{
          left: '22%',
          top: '0%',
          width: '56%',
          height: '72%',
          border: `1px solid ${border}`,
          borderRadius: '999px',
          background: soft,
          boxShadow: glow,
        }}
      />
      <div
        className="absolute"
        style={{
          left: '44%',
          top: '72%',
          width: '12%',
          height: '18%',
          borderLeft: `1px solid ${border}`,
          borderRight: `1px solid ${border}`,
        }}
      />
      <div
        className="absolute"
        style={{
          left: '32%',
          top: '90%',
          width: '36%',
          height: '8%',
          border: `1px solid ${border}`,
          borderRadius: '999px',
          background: soft,
        }}
      />
    </div>
  );
}

export function GameSection() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const activeObject = useMemo(
    () => objects.find((obj) => obj.id === hoveredId) ?? null,
    [hoveredId]
  );

  return (
    <section
      id="game"
      className="relative min-h-screen flex items-center justify-center px-4 py-20"
    >
      <div className="w-full max-w-6xl z-10">
        <div className="mb-8 text-center">
          <div className="mb-3">
            <span
              className="text-xs tracking-[0.3em] uppercase"
              style={{ fontFamily: 'var(--font-mono)', color: '#ff4a4a' }}
            >
              [00X] OBJECT REVEAL
            </span>
          </div>

          <h2
            className="mb-3"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.2rem, 8vw, 5rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#F5F5F5',
              lineHeight: 1,
            }}
          >
            ENTER THE ROOM
          </h2>

          <p
            className="mx-auto max-w-2xl text-[11px] sm:text-sm tracking-[0.12em] uppercase"
            style={{
              fontFamily: 'var(--font-body)',
              color: 'rgba(245,245,245,0.56)',
            }}
          >
            Discover the scene. Reveal an object. Enter a section.
          </p>
        </div>

        <div
          className="relative mx-auto overflow-hidden"
          style={{
            width: '100%',
            maxWidth: '1000px',
            aspectRatio: '16 / 9',
            border: '1px solid rgba(255,255,255,0.12)',
            background:
              'radial-gradient(circle at 50% 40%, rgba(255,255,255,0.03), rgba(10,10,10,1) 68%)',
            boxShadow: '0 0 40px rgba(255,255,255,0.04)',
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
              `,
              backgroundSize: '32px 32px',
            }}
          />

          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, rgba(255,255,255,0.02), transparent 18%, transparent 82%, rgba(255,255,255,0.02))',
            }}
          />

          <div
            className="absolute"
            style={{
              left: '6%',
              right: '6%',
              bottom: '8%',
              height: '18%',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              background:
                'linear-gradient(to top, rgba(255,255,255,0.03), rgba(255,255,255,0.01), transparent)',
            }}
          />

          <div
            className="absolute"
            style={{
              left: '8%',
              bottom: '22%',
              width: '22%',
              height: '4%',
              background: 'rgba(255,255,255,0.04)',
              filter: 'blur(10px)',
            }}
          />
          <div
            className="absolute"
            style={{
              left: '38%',
              bottom: '20%',
              width: '30%',
              height: '5%',
              background: 'rgba(255,255,255,0.05)',
              filter: 'blur(12px)',
            }}
          />
          <div
            className="absolute"
            style={{
              right: '12%',
              bottom: '21%',
              width: '12%',
              height: '4%',
              background: 'rgba(255,255,255,0.04)',
              filter: 'blur(10px)',
            }}
          />

          {objects.map((obj) => {
            const active = hoveredId === obj.id;

            return (
              <motion.button
                key={obj.id}
                type="button"
                onMouseEnter={() => setHoveredId(obj.id)}
                onMouseLeave={() => setHoveredId(null)}
                onFocus={() => setHoveredId(obj.id)}
                onBlur={() => setHoveredId(null)}
                onClick={() => openSection(obj.targetId)}
                className="absolute"
                style={{
                  left: obj.x,
                  top: obj.y,
                  width: obj.width,
                  height: obj.height,
                  background: 'transparent',
                  cursor: 'pointer',
                }}
                animate={{
                  y: active ? -4 : 0,
                  scale: active ? 1.02 : 1,
                }}
                transition={{
                  duration: 0.22,
                  ease: 'easeOut',
                }}
              >
                <ObjectVisual shape={obj.shape} active={active} />

                <motion.div
                  className="absolute inset-0"
                  animate={{
                    opacity: active ? 1 : 0,
                  }}
                  transition={{ duration: 0.18 }}
                  style={{
                    background:
                      'radial-gradient(circle at center, rgba(255,255,255,0.08), transparent 60%)',
                    pointerEvents: 'none',
                  }}
                />

                <motion.div
                  className="absolute left-1/2 -translate-x-1/2"
                  animate={{
                    opacity: active ? 1 : 0,
                    y: active ? -10 : -2,
                  }}
                  transition={{ duration: 0.18 }}
                  style={{
                    top: '-28px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    letterSpacing: '0.18em',
                    color: '#F5F5F5',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                  }}
                >
                  {obj.label}
                </motion.div>
              </motion.button>
            );
          })}

          <div
            className="absolute left-4 top-4 px-3 py-2"
            style={{
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(10,10,10,0.72)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.18em',
                color: '#ff4a4a',
                textTransform: 'uppercase',
              }}
            >
              Scene: Live
            </div>
            <div
              className="mt-1"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.16em',
                color: 'rgba(245,245,245,0.56)',
                textTransform: 'uppercase',
              }}
            >
              Hover / Tap objects
            </div>
          </div>

          {activeObject && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-4 bottom-4"
            >
              <div
                className="px-4 py-4"
                style={{
                  border: '1px solid rgba(255,255,255,0.16)',
                  background: 'rgba(10,10,10,0.78)',
                  boxShadow: '0 0 18px rgba(255,255,255,0.06)',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.05rem',
                    color: '#F5F5F5',
                    fontWeight: 700,
                  }}
                >
                  {activeObject.title}
                </div>

                <div
                  className="mt-2"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    letterSpacing: '0.16em',
                    color: 'rgba(245,245,245,0.52)',
                    textTransform: 'uppercase',
                  }}
                >
                  {activeObject.subtitle}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}