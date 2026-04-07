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

const MAZE_W = 360;
const MAZE_H = 520;
const PLAYER_SIZE = 12;
const PLAYER_SPEED = 2.4;
const INTERACTION_DISTANCE = 26;
const START_POS = { x: 18, y: 486 };

const portals: Portal[] = [
  { id: 'about-portal', label: 'ABOUT', targetId: 'about', x: 54, y: 68 },
  { id: 'work-portal', label: 'WORK', targetId: 'work', x: 270, y: 70 },
  { id: 'contact-portal', label: 'CONTACT', targetId: 'contact', x: 244, y: 396 },
];

const walls: Wall[] = [
  // outer frame
  { x: 0, y: 0, width: 360, height: 12 },
  { x: 0, y: 0, width: 12, height: 520 },
  { x: 348, y: 0, width: 12, height: 520 },
  { x: 0, y: 508, width: 360, height: 12 },

  // top maze
  { x: 36, y: 24, width: 12, height: 84 },
  { x: 48, y: 96, width: 60, height: 12 },

  { x: 96, y: 36, width: 12, height: 120 },
  { x: 96, y: 36, width: 48, height: 12 },

  { x: 144, y: 36, width: 12, height: 72 },
  { x: 144, y: 96, width: 84, height: 12 },

  { x: 216, y: 24, width: 12, height: 84 },
  { x: 216, y: 24, width: 60, height: 12 },

  { x: 264, y: 24, width: 12, height: 48 },
  { x: 264, y: 60, width: 48, height: 12 },

  { x: 312, y: 24, width: 12, height: 120 },

  // upper middle
  { x: 36, y: 144, width: 12, height: 72 },
  { x: 24, y: 204, width: 24, height: 12 },

  { x: 72, y: 144, width: 12, height: 120 },
  { x: 72, y: 144, width: 84, height: 12 },

  { x: 156, y: 144, width: 12, height: 60 },
  { x: 156, y: 192, width: 72, height: 12 },

  { x: 216, y: 132, width: 12, height: 84 },
  { x: 216, y: 132, width: 84, height: 12 },

  { x: 288, y: 144, width: 12, height: 72 },
  { x: 252, y: 204, width: 48, height: 12 },

  // center
  { x: 108, y: 240, width: 12, height: 84 },
  { x: 108, y: 240, width: 72, height: 12 },

  { x: 180, y: 240, width: 12, height: 120 },
  { x: 180, y: 348, width: 72, height: 12 },

  { x: 252, y: 240, width: 12, height: 72 },
  { x: 216, y: 300, width: 48, height: 12 },

  // lower middle
  { x: 36, y: 300, width: 12, height: 96 },
  { x: 48, y: 384, width: 60, height: 12 },

  { x: 96, y: 336, width: 12, height: 96 },
  { x: 96, y: 336, width: 72, height: 12 },

  { x: 168, y: 384, width: 12, height: 72 },
  { x: 168, y: 444, width: 60, height: 12 },

  { x: 228, y: 384, width: 12, height: 72 },
  { x: 228, y: 384, width: 72, height: 12 },

  { x: 288, y: 336, width: 12, height: 120 },

  // bottom accents
  { x: 36, y: 468, width: 72, height: 12 },
  { x: 132, y: 468, width: 84, height: 12 },
  { x: 252, y: 468, width: 60, height: 12 },

  // small blockers for classic feel
  { x: 186, y: 96, width: 30, height: 8 },
  { x: 138, y: 300, width: 30, height: 8 },
  { x: 222, y: 444, width: 24, height: 8 },
];

const traps: Trap[] = [
  { x: 186, y: 96, width: 22, height: 8 },
  { x: 140, y: 300, width: 22, height: 8 },
  { x: 222, y: 444, width: 18, height: 8 },
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

export function GameSection() {
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  const [viewportHeight, setViewportHeight] = useState(
    typeof window !== 'undefined' ? window.innerHeight : 900
  );

  const [started, setStarted] = useState(false);
  const [player, setPlayer] = useState(START_POS);
  const [nearPortalId, setNearPortalId] = useState<string | null>(null);
  const [showGameOver, setShowGameOver] = useState(false);
  const [flashTrap, setFlashTrap] = useState(false);

  const pressedKeys = useRef<Set<string>>(new Set());
  const mobileKeys = useRef<Set<string>>(new Set());
  const resetTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const onResize = () => {
      setViewportWidth(window.innerWidth);
      setViewportHeight(window.innerHeight);
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) window.clearTimeout(resetTimeoutRef.current);
    };
  }, []);

  const isMobile = viewportWidth <= 767;
  const isLandscapeMobile = isMobile && viewportWidth > viewportHeight;

  const renderWidth = isLandscapeMobile
    ? Math.min(viewportWidth - 32, 240)
    : isMobile
    ? Math.min(viewportWidth - 32, 360)
    : 430;

  const scale = renderWidth / MAZE_W;
  const renderHeight = MAZE_H * scale;

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
      if (e.key.toLowerCase() === 'e') interactWithPortal();
    };

    const onKeyUp = (e: KeyboardEvent) => {
      pressedKeys.current.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    let frameId = 0;

    const tick = () => {
      setPlayer((prev) => {
        if (showGameOver) return prev;

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

        const attemptedX = clamp(prev.x + dx * PLAYER_SPEED, 0, MAZE_W - PLAYER_SIZE);
        const attemptedY = clamp(prev.y + dy * PLAYER_SPEED, 0, MAZE_H - PLAYER_SIZE);

        const hitsWallX = walls.some((wall) =>
          isCollidingRect(attemptedX, prev.y, PLAYER_SIZE, wall)
        );
        const hitsWallY = walls.some((wall) =>
          isCollidingRect(nextX, attemptedY, PLAYER_SIZE, wall)
        );

        if (!hitsWallX) nextX = attemptedX;
        if (!hitsWallY) nextY = attemptedY;

        const hitTrap = traps.some((trap) =>
          isCollidingRect(nextX, nextY, PLAYER_SIZE, trap)
        );

        if (hitTrap) {
          setShowGameOver(true);
          setFlashTrap(true);
          setNearPortalId(null);

          if (resetTimeoutRef.current) {
            window.clearTimeout(resetTimeoutRef.current);
          }

          resetTimeoutRef.current = window.setTimeout(() => {
            setPlayer(START_POS);
            setShowGameOver(false);
            setFlashTrap(false);
          }, 1100);

          return prev;
        }

        let closest: Portal | null = null;
        let closestDist = Infinity;

        for (const portal of portals) {
          const d = distance(
            nextX + PLAYER_SIZE / 2,
            nextY + PLAYER_SIZE / 2,
            portal.x + 33,
            portal.y + 33
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
  }, [started, showGameOver, activePortal]);

  const setMobileKey = (key: string, isPressed: boolean) => {
    if (isPressed) mobileKeys.current.add(key);
    else mobileKeys.current.delete(key);
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

  return (
    <section
      id="game"
      className={`relative min-h-screen flex items-center justify-center px-4 ${
        isLandscapeMobile ? 'py-8' : 'py-20'
      }`}
    >
      <div className="w-full max-w-7xl z-10">
        <div className="mb-6 text-center">
          <div className="mb-3">
            <span
              className="text-xs tracking-[0.3em] uppercase"
              style={{ fontFamily: 'var(--font-mono)', color: '#ff3b3b' }}
            >
              [00X] INTERACTIVE MODE
            </span>
          </div>

          <h2
            className="mb-3"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: isMobile ? 'clamp(2rem, 9vw, 3.8rem)' : 'clamp(2.5rem, 8vw, 5rem)',
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
              color: 'rgba(245,245,245,0.6)',
            }}
          >
            Explore a classic labyrinth, avoid traps, and reach a portal.
          </p>
        </div>

        <div
          className="relative mx-auto"
          style={{
            width: `${renderWidth}px`,
            height: `${renderHeight}px`,
          }}
        >
          <div
            className="absolute left-0 top-0 origin-top-left overflow-hidden"
            style={{
              width: `${MAZE_W}px`,
              height: `${MAZE_H}px`,
              transform: `scale(${scale})`,
              border: flashTrap
                ? '2px solid rgba(255, 70, 70, 0.95)'
                : '2px solid rgba(255, 56, 56, 0.55)',
              background:
                'radial-gradient(circle at center, rgba(255,56,56,0.08) 0%, rgba(10,10,10,1) 70%)',
              boxShadow: flashTrap
                ? '0 0 45px rgba(255,0,0,0.28)'
                : '0 0 40px rgba(255,56,56,0.12)',
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
                `,
                backgroundSize: '24px 24px',
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
                  background: 'rgba(255,56,56,0.15)',
                  border: '1px solid rgba(255,56,56,0.72)',
                  boxShadow: '0 0 12px rgba(255,56,56,0.18)',
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
                  background: 'rgba(255,0,0,0.16)',
                  border: '1px solid rgba(255,0,0,0.82)',
                  boxShadow: '0 0 10px rgba(255,0,0,0.28)',
                }}
                animate={{ opacity: [0.35, 0.9, 0.35] }}
                transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
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
                    width: 66,
                    height: 66,
                    borderRadius: 999,
                    border: '2px solid #ff3b3b',
                    background: isActive ? 'rgba(255,56,56,0.16)' : 'rgba(255,56,56,0.06)',
                    boxShadow: isActive
                      ? '0 0 28px rgba(255,56,56,0.42)'
                      : '0 0 16px rgba(255,56,56,0.22)',
                    color: '#F5F5F5',
                    cursor: 'pointer',
                  }}
                  animate={{ scale: isActive ? 1.08 : [1, 1.03, 1] }}
                  transition={{
                    duration: isActive ? 0.2 : 2.4,
                    repeat: isActive ? 0 : Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <span
                    className="uppercase"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      letterSpacing: '0.2em',
                    }}
                  >
                    {portal.label}
                  </span>
                </motion.button>
              );
            })}

            {started && (
              <motion.div
                className="absolute"
                style={{
                  left: player.x,
                  top: player.y,
                  width: PLAYER_SIZE,
                  height: PLAYER_SIZE,
                  borderRadius: 999,
                  background: '#F5F5F5',
                  boxShadow:
                    '0 0 0 2px #0A0A0A, 0 0 14px rgba(245,245,245,0.42), 0 0 24px rgba(255,56,56,0.18)',
                }}
                animate={{ scale: flashTrap ? [1, 1.16, 1] : 1 }}
                transition={{ duration: 0.24 }}
              />
            )}

            {!started && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[3px]">
                <div className="text-center px-4">
                  <h3
                    className="mb-4"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: isMobile ? '1.2rem' : '2rem',
                      fontWeight: 800,
                      color: '#F5F5F5',
                    }}
                  >
                    ENTER MAZE
                  </h3>

                  <p
                    className="mb-3 uppercase"
                    style={{
                      fontFamily: 'var(--font-body)',
                      color: 'rgba(245,245,245,0.64)',
                      fontSize: '10px',
                      letterSpacing: '0.18em',
                    }}
                  >
                    Desktop: WASD / Arrows + E
                  </p>

                  <p
                    className="mb-6 uppercase"
                    style={{
                      fontFamily: 'var(--font-body)',
                      color: 'rgba(245,245,245,0.42)',
                      fontSize: '10px',
                      letterSpacing: '0.18em',
                    }}
                  >
                    Mobile: Touch controls + GO
                  </p>

                  <button
                    onClick={() => {
                      setPlayer(START_POS);
                      setNearPortalId(null);
                      setStarted(true);
                    }}
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.85rem',
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      border: '2px solid #ff3b3b',
                      color: '#F5F5F5',
                      background: 'transparent',
                      cursor: 'pointer',
                      padding: '12px 24px',
                    }}
                  >
                    GO
                  </button>
                </div>
              </div>
            )}

            {showGameOver && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/52 backdrop-blur-[2px] pointer-events-none">
                <div
                  style={{
                    fontFamily: '"Courier New", monospace',
                    fontSize: isMobile ? '1.4rem' : '2.6rem',
                    fontWeight: 800,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: '#ff3b3b',
                    textShadow:
                      '0 0 6px rgba(255,0,0,0.7), 0 0 18px rgba(255,0,0,0.35)',
                  }}
                >
                  Game Over
                </div>
              </div>
            )}

            {!isMobile && (
              <div
                className="absolute"
                style={{
                  left: 14,
                  top: 14,
                }}
              >
                <div
                  className="px-4 py-3"
                  style={{
                    border: '1px solid rgba(255,56,56,0.28)',
                    background: 'rgba(10,10,10,0.62)',
                    backdropFilter: 'blur(6px)',
                  }}
                >
                  <p
                    className="uppercase"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      color: 'rgba(245,245,245,0.56)',
                      fontSize: '10px',
                      letterSpacing: '0.18em',
                    }}
                  >
                    Move: WASD / Arrows
                  </p>
                  <p
                    className="mt-1 uppercase"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      color: '#ff4a4a',
                      fontSize: '10px',
                      letterSpacing: '0.18em',
                    }}
                  >
                    Interact: E
                  </p>
                </div>
              </div>
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
                border: '2px solid #ff3838',
                background: activePortal ? 'rgba(255,56,56,0.14)' : 'transparent',
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
                  border: '1px solid rgba(255,56,56,0.42)',
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
                  border: '1px solid rgba(255,56,56,0.42)',
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
                  border: '1px solid rgba(255,56,56,0.42)',
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
                  border: '1px solid rgba(255,56,56,0.42)',
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