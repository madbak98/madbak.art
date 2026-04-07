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
  kind?: 'main' | 'sub';
};

type Trap = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type InfoBox = {
  x: number;
  y: number;
};

type GameConfig = {
  width: number;
  height: number;
  playerSize: number;
  playerSpeed: number;
  interactionDistance: number;
  portalSize: number;
  startPosition: { x: number; y: number };
  portals: Portal[];
  walls: Wall[];
  traps: Trap[];
  infoBox: InfoBox;
};

function getGameConfig(mode: 'mobile' | 'tablet' | 'desktop'): GameConfig {
  if (mode === 'mobile') {
    return {
      width: 340,
      height: 250,
      playerSize: 14,
      playerSpeed: 2.4,
      interactionDistance: 42,
      portalSize: 46,
      startPosition: { x: 14, y: 216 },
      infoBox: { x: 10, y: 10 },
      portals: [
        { id: 'about-portal', label: 'ABOUT', targetId: 'about', x: 18, y: 18 },
        { id: 'work-portal', label: 'WORK', targetId: 'work', x: 274, y: 18 },
        { id: 'contact-portal', label: 'CONTACT', targetId: 'contact', x: 246, y: 182 },
      ],
      walls: [
        // left district
        { x: 66, y: 0, width: 10, height: 118, kind: 'main' },
        { x: 0, y: 102, width: 110, height: 10, kind: 'main' },

        // central shrine
        { x: 138, y: 34, width: 10, height: 154, kind: 'main' },
        { x: 138, y: 34, width: 126, height: 10, kind: 'main' },
        { x: 254, y: 34, width: 10, height: 102, kind: 'main' },
        { x: 188, y: 126, width: 76, height: 10, kind: 'main' },
        { x: 188, y: 126, width: 10, height: 70, kind: 'main' },

        // lower spine
        { x: 86, y: 186, width: 128, height: 10, kind: 'main' },

        // right district
        { x: 270, y: 146, width: 58, height: 10, kind: 'main' },

        // fake path hints
        { x: 208, y: 60, width: 28, height: 8, kind: 'sub' },
        { x: 164, y: 164, width: 48, height: 8, kind: 'sub' },
      ],
      traps: [
        { x: 116, y: 214, width: 40, height: 8 },
        { x: 214, y: 60, width: 18, height: 8 },
      ],
    };
  }

  if (mode === 'tablet') {
    return {
      width: 760,
      height: 430,
      playerSize: 18,
      playerSpeed: 3.1,
      interactionDistance: 62,
      portalSize: 58,
      startPosition: { x: 20, y: 388 },
      infoBox: { x: 14, y: 14 },
      portals: [
        { id: 'about-portal', label: 'ABOUT', targetId: 'about', x: 74, y: 60 },
        { id: 'work-portal', label: 'WORK', targetId: 'work', x: 628, y: 60 },
        { id: 'contact-portal', label: 'CONTACT', targetId: 'contact', x: 598, y: 336 },
      ],
      walls: [
        { x: 102, y: 0, width: 14, height: 190, kind: 'main' },
        { x: 0, y: 176, width: 212, height: 14, kind: 'main' },

        { x: 286, y: 54, width: 14, height: 286, kind: 'main' },
        { x: 286, y: 54, width: 240, height: 14, kind: 'main' },
        { x: 512, y: 54, width: 14, height: 188, kind: 'main' },
        { x: 376, y: 176, width: 150, height: 14, kind: 'main' },
        { x: 376, y: 176, width: 14, height: 136, kind: 'main' },

        { x: 156, y: 328, width: 236, height: 14, kind: 'main' },
        { x: 560, y: 284, width: 176, height: 14, kind: 'main' },

        { x: 450, y: 96, width: 56, height: 10, kind: 'sub' },
        { x: 474, y: 236, width: 14, height: 76, kind: 'sub' },
        { x: 222, y: 370, width: 82, height: 10, kind: 'sub' },
      ],
      traps: [
        { x: 224, y: 372, width: 72, height: 10 },
        { x: 454, y: 96, width: 42, height: 10 },
        { x: 612, y: 236, width: 10, height: 62 },
      ],
    };
  }

  return {
    width: 920,
    height: 520,
    playerSize: 22,
    playerSpeed: 3.8,
    interactionDistance: 78,
    portalSize: 66,
    startPosition: { x: 24, y: 474 },
    infoBox: { x: 18, y: 18 },
    portals: [
      { id: 'about-portal', label: 'ABOUT', targetId: 'about', x: 86, y: 72 },
      { id: 'work-portal', label: 'WORK', targetId: 'work', x: 770, y: 74 },
      { id: 'contact-portal', label: 'CONTACT', targetId: 'contact', x: 728, y: 414 },
    ],
    walls: [
      // left district
      { x: 116, y: 0, width: 18, height: 230, kind: 'main' },
      { x: 0, y: 214, width: 258, height: 18, kind: 'main' },

      // central shrine / spine
      { x: 344, y: 72, width: 18, height: 312, kind: 'main' },
      { x: 344, y: 72, width: 286, height: 18, kind: 'main' },
      { x: 612, y: 72, width: 18, height: 212, kind: 'main' },
      { x: 448, y: 206, width: 182, height: 18, kind: 'main' },
      { x: 448, y: 206, width: 18, height: 166, kind: 'main' },

      // lower spine
      { x: 198, y: 402, width: 276, height: 18, kind: 'main' },

      // right district
      { x: 686, y: 320, width: 210, height: 18, kind: 'main' },

      // hints / fake branches
      { x: 536, y: 118, width: 72, height: 12, kind: 'sub' },
      { x: 560, y: 262, width: 18, height: 104, kind: 'sub' },
      { x: 246, y: 448, width: 112, height: 12, kind: 'sub' },
      { x: 496, y: 272, width: 60, height: 12, kind: 'sub' },
    ],
    traps: [
      { x: 258, y: 458, width: 86, height: 12 },
      { x: 540, y: 118, width: 48, height: 12 },
      { x: 754, y: 244, width: 12, height: 78 },
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
      if (resetTimeoutRef.current) window.clearTimeout(resetTimeoutRef.current);
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

        const hitsWallX = config.walls.some((wall) =>
          isCollidingRect(attemptedX, prev.y, config.playerSize, wall)
        );
        const hitsWallY = config.walls.some((wall) =>
          isCollidingRect(nextX, attemptedY, config.playerSize, wall)
        );

        if (!hitsWallX) nextX = attemptedX;
        if (!hitsWallY) nextY = attemptedY;

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
          }, 1100);

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
    ? 'min(88vw, 760px)'
    : `${config.width}px`;

  const arenaHeight = isLandscapeMobile
    ? 'min(36vh, 220px)'
    : isMobile
    ? '250px'
    : isTablet
    ? '430px'
    : `${config.height}px`;

  const titleSize = isLandscapeMobile
    ? 'clamp(1.7rem, 6vw, 3.2rem)'
    : isMobile
    ? 'clamp(2rem, 9vw, 3.8rem)'
    : isTablet
    ? 'clamp(3.6rem, 8vw, 5rem)'
    : 'clamp(2.5rem, 8vw, 5rem)';

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
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle at 50% 46%, rgba(230,37,37,0.12), transparent 42%)',
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
                  background:
                    wall.kind === 'sub'
                      ? 'rgba(230,37,37,0.1)'
                      : 'rgba(230,37,37,0.16)',
                  border:
                    wall.kind === 'sub'
                      ? '1px solid rgba(230,37,37,0.55)'
                      : '1px solid rgba(230,37,37,0.72)',
                  boxShadow:
                    wall.kind === 'sub'
                      ? '0 0 10px rgba(230,37,37,0.14)'
                      : '0 0 16px rgba(230,37,37,0.18)',
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
                  background: 'rgba(255, 0, 0, 0.14)',
                  border: '1px solid rgba(255, 0, 0, 0.85)',
                  boxShadow: '0 0 12px rgba(255, 0, 0, 0.25)',
                }}
                animate={{ opacity: [0.35, 0.9, 0.35] }}
                transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
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
                    border: '2px solid #ff3838',
                    background: isActive ? 'rgba(255,56,56,0.16)' : 'rgba(255,56,56,0.05)',
                    boxShadow: isActive
                      ? '0 0 28px rgba(255,56,56,0.45)'
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
                      fontSize:
                        mode === 'mobile' ? '8px' : mode === 'tablet' ? '9px' : '10px',
                      letterSpacing: '0.2em',
                    }}
                  >
                    {portal.label}
                  </span>
                </motion.button>
              );
            })}

            {!started && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[3px]">
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center px-4"
                >
                  <h3
                    className="mb-4"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize:
                        mode === 'mobile'
                          ? '1.2rem'
                          : mode === 'tablet'
                          ? '2rem'
                          : '2.4rem',
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
                      fontSize: mode === 'mobile' ? '9px' : '11px',
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
                      fontSize: mode === 'mobile' ? '9px' : '11px',
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
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: mode === 'mobile' ? '0.75rem' : '0.9rem',
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      border: '2px solid #ff3838',
                      color: '#F5F5F5',
                      background: 'transparent',
                      cursor: 'pointer',
                      padding: mode === 'mobile' ? '10px 20px' : '12px 28px',
                    }}
                  >
                    GO
                  </button>
                </motion.div>
              </div>
            )}

            {showGameOver && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/52 backdrop-blur-[2px] pointer-events-none">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                  <div
                    style={{
                      fontFamily: '"Courier New", monospace',
                      fontSize:
                        mode === 'mobile'
                          ? '1.4rem'
                          : mode === 'tablet'
                          ? '2.4rem'
                          : '3rem',
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
                </motion.div>
              </div>
            )}

            {started && (
              <motion.div
                className="absolute"
                style={{
                  left: player.x,
                  top: player.y,
                  width: config.playerSize,
                  height: config.playerSize,
                  borderRadius: 999,
                  background: '#F5F5F5',
                  boxShadow:
                    '0 0 0 2px #0A0A0A, 0 0 14px rgba(245,245,245,0.42), 0 0 24px rgba(255,56,56,0.18)',
                }}
                animate={{
                  scale: flashTrap ? [1, 1.16, 1] : 1,
                }}
                transition={{ duration: 0.24 }}
              />
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
                      color: '#ff4a4a',
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
              <div className="absolute right-4 bottom-4">
                <div
                  className="px-4 py-3"
                  style={{
                    border: '1px solid rgba(255,56,56,0.34)',
                    background: 'rgba(10,10,10,0.78)',
                    boxShadow: '0 0 20px rgba(255,56,56,0.12)',
                  }}
                >
                  <p
                    className="uppercase"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      color: 'rgba(245,245,245,0.56)',
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
                      fontSize: mode === 'mobile' ? '9px' : '11px',
                      letterSpacing: '0.18em',
                    }}
                  >
                    Desktop: E / Mobile: GO
                  </p>
                </div>
              </div>
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