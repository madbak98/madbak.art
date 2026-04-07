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

type GameConfig = {
  width: number;
  height: number;
  playerSize: number;
  playerSpeed: number;
  interactionDistance: number;
  startPosition: { x: number; y: number };
  portals: Portal[];
  walls: Wall[];
  traps: Trap[];
  portalSize: number;
  infoBox: { x: number; y: number };
};

function getGameConfig(mode: 'mobile' | 'tablet' | 'desktop'): GameConfig {
  if (mode === 'mobile') {
    return {
      width: 320,
      height: 220,
      playerSize: 14,
      playerSpeed: 2.8,
      interactionDistance: 46,
      startPosition: { x: 12, y: 188 },
      portalSize: 48,
      infoBox: { x: 10, y: 168 },
      portals: [
        { id: 'about-portal', label: 'ABOUT', targetId: 'about', x: 22, y: 18 },
        { id: 'work-portal', label: 'WORK', targetId: 'work', x: 248, y: 18 },
        { id: 'contact-portal', label: 'CONTACT', targetId: 'contact', x: 226, y: 164 },
      ],
      walls: [
        { x: 60, y: 0, width: 10, height: 95 },
        { x: 0, y: 95, width: 110, height: 10 },

        { x: 120, y: 35, width: 10, height: 130 },
        { x: 120, y: 35, width: 95, height: 10 },

        { x: 205, y: 35, width: 10, height: 85 },
        { x: 150, y: 115, width: 65, height: 10 },

        { x: 80, y: 165, width: 110, height: 10 },
        { x: 248, y: 104, width: 58, height: 10 },
      ],
      traps: [
        { x: 98, y: 185, width: 38, height: 8 },
        { x: 182, y: 60, width: 24, height: 8 },
      ],
    };
  }

  if (mode === 'tablet') {
    return {
      width: 760,
      height: 430,
      playerSize: 20,
      playerSpeed: 3.5,
      interactionDistance: 68,
      startPosition: { x: 26, y: 384 },
      portalSize: 62,
      infoBox: { x: 16, y: 356 },
      portals: [
        { id: 'about-portal', label: 'ABOUT', targetId: 'about', x: 84, y: 72 },
        { id: 'work-portal', label: 'WORK', targetId: 'work', x: 636, y: 72 },
        { id: 'contact-portal', label: 'CONTACT', targetId: 'contact', x: 624, y: 344 },
      ],
      walls: [
        { x: 96, y: 0, width: 14, height: 190 },
        { x: 0, y: 178, width: 204, height: 14 },

        { x: 276, y: 62, width: 14, height: 250 },
        { x: 276, y: 62, width: 218, height: 14 },

        { x: 494, y: 62, width: 14, height: 180 },
        { x: 360, y: 176, width: 148, height: 14 },

        { x: 360, y: 176, width: 14, height: 136 },
        { x: 166, y: 330, width: 208, height: 14 },

        { x: 560, y: 274, width: 178, height: 14 },
        { x: 738, y: 120, width: 14, height: 168 },

        { x: 430, y: 224, width: 14, height: 86 },
        { x: 510, y: 338, width: 96, height: 14 },
      ],
      traps: [
        { x: 212, y: 372, width: 78, height: 12 },
        { x: 402, y: 108, width: 64, height: 12 },
        { x: 584, y: 198, width: 12, height: 72 },
      ],
    };
  }

  return {
    width: 900,
    height: 520,
    playerSize: 24,
    playerSpeed: 4,
    interactionDistance: 82,
    startPosition: { x: 36, y: 460 },
    portalSize: 68,
    infoBox: { x: 16, y: 442 },
    portals: [
      { id: 'about-portal', label: 'ABOUT', targetId: 'about', x: 90, y: 90 },
      { id: 'work-portal', label: 'WORK', targetId: 'work', x: 770, y: 90 },
      { id: 'contact-portal', label: 'CONTACT', targetId: 'contact', x: 760, y: 430 },
    ],
    walls: [
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
    ],
    traps: [
      { x: 260, y: 455, width: 110, height: 16 },
      { x: 470, y: 130, width: 90, height: 16 },
      { x: 705, y: 240, width: 16, height: 90 },
    ],
  };
}

function distance(ax: number, ay: number, bx: number, by: number) {
  return Math.hypot(ax - bx, ay - by);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
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
    typeof window !== 'undefined' ? window.innerWidth : 1400
  );
  const [viewportHeight, setViewportHeight] = useState(
    typeof window !== 'undefined' ? window.innerHeight : 900
  );

  const [started, setStarted] = useState(false);
  const [flashTrap, setFlashTrap] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [nearPortalId, setNearPortalId] = useState<string | null>(null);

  const pressedKeys = useRef<Set<string>>(new Set());
  const mobileKeys = useRef<Set<string>>(new Set());
  const resetTimeoutRef = useRef<number | null>(null);

  const isMobile = viewportWidth <= 767;
  const isTablet = viewportWidth > 767 && viewportWidth <= 1366;
  const isLandscapeMobile = isMobile && viewportWidth > viewportHeight;

  const mode: 'mobile' | 'tablet' | 'desktop' = isMobile
    ? 'mobile'
    : isTablet
    ? 'tablet'
    : 'desktop';

  const config = useMemo(() => getGameConfig(mode), [mode]);

  const [player, setPlayer] = useState(config.startPosition);

  useEffect(() => {
    setPlayer(config.startPosition);
    setNearPortalId(null);
  }, [config.startPosition.x, config.startPosition.y]);

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
      if (resetTimeoutRef.current) {
        window.clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  const activePortal = useMemo(
    () => config.portals.find((p) => p.id === nearPortalId) ?? null,
    [nearPortalId, config.portals]
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

        const attemptedX = clamp(
          prev.x + dx * config.playerSpeed,
          0,
          config.width - config.playerSize
        );
        const attemptedY = clamp(
          prev.y + dy * config.playerSpeed,
          0,
          config.height - config.playerSize
        );

        const collidesWallX = config.walls.some((wall) =>
          isCollidingRect(attemptedX, prev.y, config.playerSize, wall)
        );
        const collidesWallY = config.walls.some((wall) =>
          isCollidingRect(nextX, attemptedY, config.playerSize, wall)
        );

        if (!collidesWallX) nextX = attemptedX;
        if (!collidesWallY) nextY = attemptedY;

        const hitTrap = config.traps.some((trap) =>
          isCollidingRect(nextX, nextY, config.playerSize, trap)
        );

        if (hitTrap) {
          setFlashTrap(true);
          setShowGameOver(true);
          setNearPortalId(null);

          if (resetTimeoutRef.current) {
            window.clearTimeout(resetTimeoutRef.current);
          }

          resetTimeoutRef.current = window.setTimeout(() => {
            setPlayer(config.startPosition);
            setFlashTrap(false);
            setShowGameOver(false);
          }, 1200);

          return prev;
        }

        let closest: Portal | null = null;
        let closestDist = Infinity;

        for (const portal of config.portals) {
          const d = distance(
            nextX + config.playerSize / 2,
            nextY + config.playerSize / 2,
            portal.x + config.portalSize / 2,
            portal.y + config.portalSize / 2
          );

          if (d < closestDist) {
            closestDist = d;
            closest = portal;
          }
        }

        if (closest && closestDist <= config.interactionDistance) {
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
  }, [started, showGameOver, config, activePortal]);

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

  const arenaWidth = isLandscapeMobile
    ? 'min(92vw, 560px)'
    : isMobile
    ? 'min(94vw, 360px)'
    : isTablet
    ? 'min(86vw, 760px)'
    : `${config.width}px`;

  const arenaHeight = isLandscapeMobile
    ? 'min(36vh, 220px)'
    : isMobile
    ? 'min(58vw, 250px)'
    : isTablet
    ? '430px'
    : `${config.height}px`;

  const sectionPadding = isLandscapeMobile ? 'py-8' : 'py-20';
  const titleSize = isLandscapeMobile
    ? 'clamp(1.8rem, 6vw, 3.5rem)'
    : isMobile
    ? 'clamp(2.2rem, 9vw, 4rem)'
    : isTablet
    ? 'clamp(4rem, 8vw, 5.4rem)'
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
          className="relative mx-auto overflow-hidden"
          style={{
            width: arenaWidth,
            height: arenaHeight,
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
          <div className="absolute inset-0">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
                `,
                backgroundSize:
                  mode === 'mobile' ? '20px 20px' : mode === 'tablet' ? '28px 28px' : '36px 36px',
              }}
            />

            <div
              className="absolute left-0 top-0 w-full h-full pointer-events-none"
              style={{
                background:
                  'linear-gradient(to bottom, rgba(230,37,37,0.08), transparent 20%, transparent 80%, rgba(230,37,37,0.08))',
              }}
            />

            {config.walls.map((wall, index) => (
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

            {config.traps.map((trap, index) => (
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

            {config.portals.map((portal) => {
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
                    width: config.portalSize,
                    height: config.portalSize,
                    borderRadius: 999,
                    border: '2px solid #E62525',
                    background: isActive ? 'rgba(230,37,37,0.22)' : 'rgba(230,37,37,0.08)',
                    boxShadow: isActive
                      ? '0 0 28px rgba(230,37,37,0.75)'
                      : '0 0 16px rgba(230,37,37,0.28)',
                    color: '#F5F5F5',
                    cursor: 'pointer',
                  }}
                  animate={{ scale: isActive ? 1.08 : [1, 1.04, 1] }}
                  transition={{
                    duration: isActive ? 0.2 : 2.2,
                    repeat: isActive ? 0 : Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <span
                    className="uppercase"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize:
                        mode === 'mobile' ? '8px' : mode === 'tablet' ? '9px' : '10px',
                      letterSpacing: '0.22em',
                    }}
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
                width: config.playerSize,
                height: config.playerSize,
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
              <div className="absolute inset-0 flex items-center justify-center bg-black/58 backdrop-blur-[3px]">
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full h-full flex flex-col items-center justify-center text-center px-4 sm:px-6"
                >
                  <h3
                    className="mb-4"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize:
                        mode === 'mobile'
                          ? 'clamp(1.1rem, 4vw, 1.7rem)'
                          : mode === 'tablet'
                          ? 'clamp(2.2rem, 4vw, 3rem)'
                          : 'clamp(1.2rem, 4vw, 2.5rem)',
                      fontWeight: 800,
                      color: '#F5F5F5',
                    }}
                  >
                    READY TO EXPLORE?
                  </h3>

                  <p
                    className="mb-3 uppercase"
                    style={{
                      fontFamily: 'var(--font-body)',
                      color: 'rgba(245, 245, 245, 0.65)',
                      fontSize: mode === 'mobile' ? '9px' : mode === 'tablet' ? '12px' : '11px',
                      letterSpacing: '0.18em',
                    }}
                  >
                    Desktop: WASD / Arrows + E
                  </p>

                  <p
                    className="mb-6 uppercase"
                    style={{
                      fontFamily: 'var(--font-body)',
                      color: 'rgba(245, 245, 245, 0.45)',
                      fontSize: mode === 'mobile' ? '9px' : mode === 'tablet' ? '12px' : '11px',
                      letterSpacing: '0.18em',
                    }}
                  >
                    Mobile: Touch controls + GO
                  </p>

                  <button
                    onClick={() => {
                      setPlayer(config.startPosition);
                      setNearPortalId(null);
                      setStarted(true);
                    }}
                    className="transition-all duration-300"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: mode === 'mobile' ? '0.75rem' : '0.875rem',
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      border: '2px solid #E62525',
                      color: '#F5F5F5',
                      background: 'transparent',
                      cursor: 'pointer',
                      padding: mode === 'mobile' ? '10px 20px' : '12px 28px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#E62525';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    GO
                  </button>
                </motion.div>
              </div>
            )}

            {showGameOver && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/52 backdrop-blur-[2px] pointer-events-none">
                <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} className="text-center px-6">
                  <div
                    style={{
                      fontFamily: '"Courier New", monospace',
                      fontSize:
                        mode === 'mobile'
                          ? 'clamp(1.2rem, 5vw, 2rem)'
                          : mode === 'tablet'
                          ? 'clamp(2rem, 5vw, 3rem)'
                          : 'clamp(1.5rem, 5vw, 3.5rem)',
                      fontWeight: 800,
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      color: '#ff3b3b',
                      textShadow: '0 0 6px rgba(255,0,0,0.7), 0 0 18px rgba(255,0,0,0.35)',
                    }}
                  >
                    Game Over
                  </div>
                </motion.div>
              </div>
            )}

            {mode !== 'mobile' && (
              <div
                className="absolute"
                style={{
                  left: config.infoBox.x,
                  top: config.infoBox.y,
                }}
              >
                <div
                  className="px-4 py-3"
                  style={{
                    border: '1px solid rgba(230,37,37,0.35)',
                    background: 'rgba(10,10,10,0.7)',
                    backdropFilter: 'blur(6px)',
                  }}
                >
                  <p
                    className="uppercase"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      color: 'rgba(245,245,245,0.6)',
                      fontSize: mode === 'tablet' ? '9px' : '10px',
                      letterSpacing: '0.18em',
                    }}
                  >
                    Move: WASD / Arrows
                  </p>
                  <p
                    className="mt-1 uppercase"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      color: '#E62525',
                      fontSize: mode === 'tablet' ? '9px' : '10px',
                      letterSpacing: '0.18em',
                    }}
                  >
                    Interact: E
                  </p>
                </div>
              </div>
            )}

            {activePortal && started && !showGameOver && (
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
                    className="uppercase"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      color: 'rgba(245,245,245,0.6)',
                      fontSize: mode === 'mobile' ? '8px' : '10px',
                      letterSpacing: '0.18em',
                    }}
                  >
                    Portal Detected
                  </p>
                  <p
                    className="mt-1 uppercase"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      color: '#F5F5F5',
                      fontSize: mode === 'mobile' ? '9px' : '12px',
                      letterSpacing: '0.2em',
                    }}
                  >
                    Desktop: E / Mobile: GO
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {mode === 'mobile' && (
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