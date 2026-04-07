import { motion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';

type Portal = {
  id: string;
  label: string;
  targetId: string;
  x: number;
  y: number;
};

type Wall = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const ARENA_WIDTH = 900;
const ARENA_HEIGHT = 520;
const PLAYER_SIZE = 26;
const PLAYER_SPEED = 4.2;
const INTERACTION_DISTANCE = 78;

const portals: Portal[] = [
  { id: 'about-portal', label: 'ABOUT', targetId: 'about', x: 140, y: 110 },
  { id: 'work-portal', label: 'WORK', targetId: 'work', x: 700, y: 180 },
  { id: 'contact-portal', label: 'CONTACT', targetId: 'contact', x: 430, y: 390 },
];

const walls: Wall[] = [
  { x: 210, y: 40, width: 18, height: 170 },
  { x: 210, y: 260, width: 18, height: 190 },

  { x: 360, y: 120, width: 180, height: 18 },
  { x: 360, y: 120, width: 18, height: 120 },

  { x: 520, y: 220, width: 18, height: 170 },
  { x: 620, y: 60, width: 18, height: 170 },

  { x: 680, y: 300, width: 120, height: 18 },
  { x: 300, y: 340, width: 160, height: 18 },
];

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function distance(ax: number, ay: number, bx: number, by: number) {
  return Math.hypot(ax - bx, ay - by);
}

function isCollidingWithWalls(x: number, y: number, size: number) {
  return walls.some((wall) => {
    return (
      x < wall.x + wall.width &&
      x + size > wall.x &&
      y < wall.y + wall.height &&
      y + size > wall.y
    );
  });
}

export function GameSection() {
  const [started, setStarted] = useState(false);
  const [player, setPlayer] = useState({ x: 430, y: 240 });
  const [nearPortalId, setNearPortalId] = useState<string | null>(null);
  const pressedKeys = useRef<Set<string>>(new Set());

  const activePortal = useMemo(
    () => portals.find((p) => p.id === nearPortalId) ?? null,
    [nearPortalId]
  );

  useEffect(() => {
    if (!started) return;

    const onKeyDown = (e: KeyboardEvent) => {
      pressedKeys.current.add(e.key.toLowerCase());

      if (e.key.toLowerCase() === 'e' && activePortal) {
        document.getElementById(activePortal.targetId)?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      pressedKeys.current.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    let frameId = 0;

    const tick = () => {
      setPlayer((prev) => {
        let dx = 0;
        let dy = 0;

        if (pressedKeys.current.has('arrowup') || pressedKeys.current.has('w')) dy -= 1;
        if (pressedKeys.current.has('arrowdown') || pressedKeys.current.has('s')) dy += 1;
        if (pressedKeys.current.has('arrowleft') || pressedKeys.current.has('a')) dx -= 1;
        if (pressedKeys.current.has('arrowright') || pressedKeys.current.has('d')) dx += 1;

        if (dx !== 0 && dy !== 0) {
          dx *= 0.7071;
          dy *= 0.7071;
        }

        let nextX = prev.x;
        let nextY = prev.y;

        const attemptedX = clamp(prev.x + dx * PLAYER_SPEED, 0, ARENA_WIDTH - PLAYER_SIZE);
        const attemptedY = clamp(prev.y + dy * PLAYER_SPEED, 0, ARENA_HEIGHT - PLAYER_SIZE);

        if (!isCollidingWithWalls(attemptedX, prev.y, PLAYER_SIZE)) {
          nextX = attemptedX;
        }

        if (!isCollidingWithWalls(nextX, attemptedY, PLAYER_SIZE)) {
          nextY = attemptedY;
        }

        let closest: Portal | null = null;
        let closestDist = Infinity;

        for (const portal of portals) {
          const d = distance(
            nextX + PLAYER_SIZE / 2,
            nextY + PLAYER_SIZE / 2,
            portal.x + 34,
            portal.y + 34
          );

          if (d < closestDist) {
            closestDist = d;
            closest = portal;
          }
        }

        if (closest && closestDist <= INTERACTION_DISTANCE) {
          setNearPortalId(closest.id);
        } else {
          setNearPortalId(null);
        }

        return { x: nextX, y: nextY };
      });

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      cancelAnimationFrame(frameId);
    };
  }, [started, activePortal]);

  return (
    <section
      id="game"
      className="relative min-h-screen flex items-center justify-center px-4 py-24"
    >
      <div className="w-full max-w-7xl z-10">
        <div className="mb-8 text-center">
          <div className="mb-4">
            <span
              className="text-xs tracking-[0.3em] uppercase"
              style={{ fontFamily: 'var(--font-mono)', color: '#E62525' }}
            >
              [00X] INTERACTIVE MODE
            </span>
          </div>

          <h2
            className="mb-4"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.5rem, 8vw, 5rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#F5F5F5',
            }}
          >
            ENTER THE WORLD
          </h2>

          <p
            className="mx-auto max-w-2xl text-sm tracking-[0.15em] uppercase"
            style={{
              fontFamily: 'var(--font-body)',
              color: 'rgba(245, 245, 245, 0.6)',
            }}
          >
            Move through the maze, find the right path, and press E to jump into a section.
          </p>
        </div>

        <div
          className="relative mx-auto overflow-hidden"
          style={{
            width: '100%',
            maxWidth: `${ARENA_WIDTH}px`,
            height: `${ARENA_HEIGHT}px`,
            border: '2px solid rgba(230, 37, 37, 0.5)',
            background:
              'radial-gradient(circle at center, rgba(230,37,37,0.08) 0%, rgba(10,10,10,1) 70%)',
            boxShadow: '0 0 40px rgba(230, 37, 37, 0.12)',
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
              `,
              backgroundSize: '36px 36px',
            }}
          />

          <div
            className="absolute left-0 top-0 w-full h-full pointer-events-none"
            style={{
              background:
                'linear-gradient(to bottom, rgba(230,37,37,0.08), transparent 20%, transparent 80%, rgba(230,37,37,0.08))',
            }}
          />

          {walls.map((wall, index) => (
            <div
              key={index}
              className="absolute"
              style={{
                left: wall.x,
                top: wall.y,
                width: wall.width,
                height: wall.height,
                background: 'rgba(230,37,37,0.14)',
                border: '1px solid rgba(230,37,37,0.45)',
                boxShadow: '0 0 12px rgba(230,37,37,0.18)',
              }}
            />
          ))}

          {portals.map((portal) => {
            const isActive = nearPortalId === portal.id;

            return (
              <motion.button
                key={portal.id}
                type="button"
                onClick={() => {
                  document.getElementById(portal.targetId)?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  });
                }}
                className="absolute flex items-center justify-center"
                style={{
                  left: portal.x,
                  top: portal.y,
                  width: 68,
                  height: 68,
                  borderRadius: 999,
                  border: '2px solid #E62525',
                  background: isActive ? 'rgba(230,37,37,0.22)' : 'rgba(230,37,37,0.08)',
                  boxShadow: isActive
                    ? '0 0 28px rgba(230,37,37,0.75)'
                    : '0 0 16px rgba(230,37,37,0.28)',
                  color: '#F5F5F5',
                  cursor: 'pointer',
                }}
                animate={{
                  scale: isActive ? 1.12 : [1, 1.05, 1],
                }}
                transition={{
                  duration: isActive ? 0.2 : 2.2,
                  repeat: isActive ? 0 : Infinity,
                  ease: 'easeInOut',
                }}
              >
                <span
                  className="text-[10px] tracking-[0.22em] uppercase"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {portal.label}
                </span>
              </motion.button>
            );
          })}

          <motion.div
            className="absolute"
            style={{
              left: player.x,
              top: player.y,
              width: PLAYER_SIZE,
              height: PLAYER_SIZE,
              borderRadius: 8,
              background: '#F5F5F5',
              boxShadow:
                '0 0 0 2px #0A0A0A, 0 0 18px rgba(245,245,245,0.35), 0 0 30px rgba(230,37,37,0.25)',
            }}
            animate={{
              rotate: nearPortalId ? 0 : [0, -6, 6, 0],
            }}
            transition={{
              duration: 0.6,
              repeat: nearPortalId ? 0 : Infinity,
              ease: 'easeInOut',
            }}
          />

          {!started && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/55 backdrop-blur-[2px]">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center px-6"
              >
                <h3
                  className="mb-4"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                    fontWeight: 800,
                    color: '#F5F5F5',
                  }}
                >
                  READY TO EXPLORE?
                </h3>

                <p
                  className="mb-6 text-xs tracking-[0.18em] uppercase"
                  style={{
                    fontFamily: 'var(--font-body)',
                    color: 'rgba(245, 245, 245, 0.65)',
                  }}
                >
                  Use WASD or Arrow Keys
                </p>

                <button
                  onClick={() => setStarted(true)}
                  className="px-8 py-4 transition-all duration-300"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.875rem',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    border: '2px solid #E62525',
                    color: '#F5F5F5',
                    background: 'transparent',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#E62525';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Start Experience
                </button>
              </motion.div>
            </div>
          )}

          <div className="absolute left-4 bottom-4">
            <div
              className="px-4 py-3"
              style={{
                border: '1px solid rgba(230,37,37,0.35)',
                background: 'rgba(10,10,10,0.7)',
                backdropFilter: 'blur(6px)',
              }}
            >
              <p
                className="text-[10px] tracking-[0.18em] uppercase"
                style={{ fontFamily: 'var(--font-mono)', color: 'rgba(245,245,245,0.6)' }}
              >
                Move: WASD / Arrows
              </p>
              <p
                className="mt-1 text-[10px] tracking-[0.18em] uppercase"
                style={{ fontFamily: 'var(--font-mono)', color: '#E62525' }}
              >
                Interact: E
              </p>
            </div>
          </div>

          {activePortal && started && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-4 bottom-4"
            >
              <div
                className="px-4 py-3"
                style={{
                  border: '1px solid #E62525',
                  background: 'rgba(10,10,10,0.82)',
                  boxShadow: '0 0 20px rgba(230,37,37,0.2)',
                }}
              >
                <p
                  className="text-[10px] tracking-[0.18em] uppercase"
                  style={{ fontFamily: 'var(--font-mono)', color: 'rgba(245,245,245,0.6)' }}
                >
                  Portal Detected
                </p>
                <p
                  className="mt-1 text-xs tracking-[0.2em] uppercase"
                  style={{ fontFamily: 'var(--font-mono)', color: '#F5F5F5' }}
                >
                  Press E for {activePortal.label}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
