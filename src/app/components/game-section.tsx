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

type Trap = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const BASE_WIDTH = 900;
const BASE_HEIGHT = 520;
const PLAYER_SIZE = 24;
const PLAYER_SPEED = 4;
const INTERACTION_DISTANCE = 82;
const START_POSITION = { x: 36, y: 460 };

const portals: Portal[] = [
  { id: 'about-portal', label: 'ABOUT', targetId: 'about', x: 90, y: 90 },
  { id: 'work-portal', label: 'WORK', targetId: 'work', x: 770, y: 90 },
  { id: 'contact-portal', label: 'CONTACT', targetId: 'contact', x: 760, y: 430 },
];

const walls: Wall[] = [
  { x: 110, y: 0, width: 18, height: 240 },
  { x: 0, y: 220, width: 240, height: 18 },

  { x: 330, y: 80, width: 18, height: 300 },
  { x: 330, y: 80, width: 260, height: 18 },

  { x: 590, y: 80, width: 18, height: 210 },
  { x: 420, y: 210, width: 170, height: 18 },

  { x: 420, y: 210, width: 18, height: 170 },
  { x: 200, y: 400, width: 238, height: 18 },

  { x: 660, y: 320, width: 220, height: 18 },
  { x: 880, y: 140, width: 18, height: 200 },

  { x: 510, y: 270, width: 18, height: 110 },
  { x: 600, y: 410, width: 130, height: 18 },
];

const traps: Trap[] = [
  { x: 260, y: 455, width: 110, height: 16 },
  { x: 470, y: 130, width: 90, height: 16 },
  { x: 705, y: 240, width: 16, height: 90 },
];

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function distance(ax: number, ay: number, bx: number, by: number) {
  return Math.hypot(ax - bx, ay - by);
}

function isCollidingRect(
  x: number,
  y: number,
  size: number,
  rect: { x: number; y: number; width: number; height: number }
) {
  return (
    x < rect.x + rect.width &&
    x + size > rect.x &&
    y < rect.y + rect.height &&
    y + size > rect.y
  );
}

function isCollidingWithWalls(x: number, y: number, size: number) {
  return walls.some((wall) => isCollidingRect(x, y, size, wall));
}

function isCollidingWithTraps(x: number, y: number, size: number) {
  return traps.some((trap) => isCollidingRect(x, y, size, trap));
}

export function GameSection() {
  const [started, setStarted] = useState(false);
  const [player, setPlayer] = useState(START_POSITION);
  const [nearPortalId, setNearPortalId] = useState<string | null>(null);
  const [flashTrap, setFlashTrap] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLandscapeMobile, setIsLandscapeMobile] = useState(false);

  const pressedKeys = useRef<Set<string>>(new Set());
  const mobileKeys = useRef<Set<string>>(new Set());

  useEffect(() => {
    const updateViewportFlags = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const mobile = w <= 900;
      const landscape = mobile && w > h;

      setIsMobile(mobile);
      setIsLandscapeMobile(landscape);
    };

    updateViewportFlags();
    window.addEventListener('resize', updateViewportFlags);

    return () => window.removeEventListener('resize', updateViewportFlags);
  }, []);

  const activePortal = useMemo(
    () => portals.find((p) => p.id === nearPortalId) ?? null,
    [nearPortalId]
  );

  const interactWithPortal = () => {
    if (!activePortal) return;
    document.getElementById(activePortal.targetId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  useEffect(() => {
    if (!started) return;

    const onKeyDown = (e: KeyboardEvent) => {
      pressedKeys.current.add(e.key.toLowerCase());

      if (e.key.toLowerCase() === 'e') {
        interactWithPortal();
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
        const allKeys = new Set([
          ...Array.from(pressedKeys.current),
          ...Array.from(mobileKeys.current),
        ]);

        let dx = 0;
        let dy = 0;

        if (allKeys.has('arrowup') || allKeys.has('w')) dy -= 1;
        if (allKeys.has('arrowdown') || allKeys.has('s')) dy += 1;
        if (allKeys.has('arrowleft') || allKeys.has('a')) dx -= 1;
        if (allKeys.has('arrowright') || allKeys.has('d')) dx += 1;

        if (dx !== 0 && dy !== 0) {
          dx *= 0.7071;
          dy *= 0.7071;
        }

        let nextX = prev.x;
        let nextY = prev.y;

        const attemptedX = clamp(prev.x + dx * PLAYER_SPEED, 0, BASE_WIDTH - PLAYER_SIZE);
        const attemptedY = clamp(prev.y + dy * PLAYER_SPEED, 0, BASE_HEIGHT - PLAYER_SIZE);

        if (!isCollidingWithWalls(attemptedX, prev.y, PLAYER_SIZE)) {
          nextX = attemptedX;
        }

        if (!isCollidingWithWalls(nextX, attemptedY, PLAYER_SIZE)) {
          nextY = attemptedY;
        }

        if (isCollidingWithTraps(nextX, nextY, PLAYER_SIZE)) {
          setFlashTrap(true);
          setTimeout(() => setFlashTrap(false), 220);
          setNearPortalId(null);
          return START_POSITION;
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

  const setMobileKey = (key: string, isPressed: boolean) => {
    if (isPressed) {
      mobileKeys.current.add(key);
    } else {
      mobileKeys.current.delete(key);
    }
  };

  const bindPressEvents = (key: string) => ({
    onMouseDown: () => setMobileKey(key, true),
    onMouseUp: () => setMobileKey(key, false),
    onMouseLeave: () => setMobileKey(key, false),
    onTouchStart: (e: React.TouchEvent) => {
      e.preventDefault();
      setMobileKey(key, true);
    },
    onTouchEnd: (e: React.TouchEvent) => {
      e.preventDefault();
      setMobileKey(key, false);
    },
  });

  const arenaWidth = isLandscapeMobile
    ? 'min(92vw, 720px)'
    : isMobile
    ? 'min(94vw, 520px)'
    : '100%';

  const arenaHeight = isLandscapeMobile
    ? 'min(52vh, 340px)'
    : isMobile
    ? 'min(58vw, 420px)'
    : `${BASE_HEIGHT}px`;

  const arenaTransform = isMobile ? 'scale(0.92)' : 'scale(1)';
  const sectionPadding = isLandscapeMobile ? 'py-10' : 'py-24';
  const titleSize = isLandscapeMobile
    ? 'clamp(2rem, 6vw, 3.5rem)'
    : 'clamp(2.5rem, 8vw, 5rem)';

  return (
    <section
      id="game"
      className={`relative min-h-screen flex items-center justify-center px-4 ${sectionPadding}`}
    >
      <div className="w-full max-w-7xl z-10">
        <div className="mb-6 text-center">
          <div className="mb-3">
            <span
              className="text-xs tracking-[0.3em] uppercase"
              style={{ fontFamily: 'var(--font-mono)', color: '#E62525' }}
            >
              [00X] INTERACTIVE MODE
            </span>
          </div>

          <h2
            className="mb-3"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: titleSize,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#F5F5F5',
              lineHeight: 1,
            }}
          >
            ENTER THE WORLD
          </h2>

          <p
            className="mx-auto max-w-2xl text-[11px] sm:text-sm tracking-[0.12em] uppercase"
            style={{
              fontFamily: 'var(--font-body)',
              color: 'rgba(245, 245, 245, 0.6)',
            }}
          >
            Move through the maze, avoid traps, and reach a portal to jump into a section.
          </p>
        </div>

        <div
          className="relative mx-auto overflow-hidden origin-top"
          style={{
            width: arenaWidth,
            height: arenaHeight,
            maxWidth: `${BASE_WIDTH}px`,
            border: flashTrap
              ? '2px solid rgba(255, 70, 70, 0.95)'
              : '2px solid rgba(230, 37, 37, 0.5)',
            background:
              'radial-gradient(circle at center, rgba(230,37,37,0.08) 0%, rgba(10,10,10,1) 70%)',
            boxShadow: flashTrap
              ? '0 0 45px rgba(255, 0, 0, 0.28)'
              : '0 0 40px rgba(230, 37, 37, 0.12)',
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              transform: arenaTransform,
              transformOrigin: 'top left',
              width: `${BASE_WIDTH}px`,
              height: `${BASE_HEIGHT}px`,
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
                key={`wall-${index}`}
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

            {traps.map((trap, index) => (
              <motion.div
                key={`trap-${index}`}
                className="absolute"
                style={{
                  left: trap.x,
                  top: trap.y,
                  width: trap.width,
                  height: trap.height,
                  background: 'rgba(255, 0, 0, 0.16)',
                  border: '1px solid rgba(255, 0, 0, 0.85)',
                  boxShadow: '0 0 12px rgba(255, 0, 0, 0.35)',
                }}
                animate={{ opacity: [0.45, 0.9, 0.45] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
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
                  animate={{ scale: isActive ? 1.12 : [1, 1.05, 1] }}
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
                scale: flashTrap ? [1, 1.18, 1] : 1,
              }}
              transition={{
                duration: 0.35,
                repeat: nearPortalId || flashTrap ? 0 : Infinity,
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
                      fontSize: 'clamp(1.2rem, 4vw, 2.5rem)',
                      fontWeight: 800,
                      color: '#F5F5F5',
                    }}
                  >
                    READY TO EXPLORE?
                  </h3>

                  <p
                    className="mb-3 text-[10px] sm:text-xs tracking-[0.18em] uppercase"
                    style={{
                      fontFamily: 'var(--font-body)',
                      color: 'rgba(245, 245, 245, 0.65)',
                    }}
                  >
                    Desktop: WASD / Arrows + E
                  </p>

                  <p
                    className="mb-6 text-[10px] sm:text-xs tracking-[0.18em] uppercase"
                    style={{
                      fontFamily: 'var(--font-body)',
                      color: 'rgba(245, 245, 245, 0.45)',
                    }}
                  >
                    Mobile: Touch controls + GO
                  </p>

                  <button
                    onClick={() => {
                      setPlayer(START_POSITION);
                      setNearPortalId(null);
                      setStarted(true);
                    }}
                    className="px-6 py-3 sm:px-8 sm:py-4 transition-all duration-300"
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

            {!isMobile && (
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
            )}

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
                    Desktop: E / Mobile: GO
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {isMobile && (
          <div className={`mt-4 flex flex-col items-center ${isLandscapeMobile ? 'gap-3' : 'gap-4'}`}>
            <button
              type="button"
              onClick={interactWithPortal}
              className={isLandscapeMobile ? 'px-6 py-2' : 'px-8 py-3'}
              style={{
                border: '2px solid #E62525',
                background: activePortal ? 'rgba(230,37,37,0.18)' : 'transparent',
                color: '#F5F5F5',
                fontFamily: 'var(--font-body)',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                fontSize: isLandscapeMobile ? '0.8rem' : '0.9rem',
              }}
            >
              GO
            </button>

            <div
              className={`grid grid-cols-3 select-none ${
                isLandscapeMobile ? 'gap-2 w-[180px]' : 'gap-3 w-[220px]'
              }`}
            >
              <div />
              <button
                type="button"
                {...bindPressEvents('arrowup')}
                className={isLandscapeMobile ? 'h-12' : 'h-14'}
                style={{
                  border: '1px solid rgba(230,37,37,0.5)',
                  background: 'rgba(10,10,10,0.75)',
                  color: '#F5F5F5',
                  fontSize: isLandscapeMobile ? '1rem' : '1.25rem',
                }}
              >
                ↑
              </button>
              <div />

              <button
                type="button"
                {...bindPressEvents('arrowleft')}
                className={isLandscapeMobile ? 'h-12' : 'h-14'}
                style={{
                  border: '1px solid rgba(230,37,37,0.5)',
                  background: 'rgba(10,10,10,0.75)',
                  color: '#F5F5F5',
                  fontSize: isLandscapeMobile ? '1rem' : '1.25rem',
                }}
              >
                ←
              </button>

              <button
                type="button"
                {...bindPressEvents('arrowdown')}
                className={isLandscapeMobile ? 'h-12' : 'h-14'}
                style={{
                  border: '1px solid rgba(230,37,37,0.5)',
                  background: 'rgba(10,10,10,0.75)',
                  color: '#F5F5F5',
                  fontSize: isLandscapeMobile ? '1rem' : '1.25rem',
                }}
              >
                ↓
              </button>

              <button
                type="button"
                {...bindPressEvents('arrowright')}
                className={isLandscapeMobile ? 'h-12' : 'h-14'}
                style={{
                  border: '1px solid rgba(230,37,37,0.5)',
                  background: 'rgba(10,10,10,0.75)',
                  color: '#F5F5F5',
                  fontSize: isLandscapeMobile ? '1rem' : '1.25rem',
                }}
              >
                →
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}