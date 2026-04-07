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
  portalSize: number;
  infoBox: { x: number; y: number };
  portals: Portal[];
  walls: Wall[];
  traps: Trap[];
};

function getGameConfig(mode: 'mobile' | 'tablet' | 'desktop'): GameConfig {
  if (mode === 'mobile') {
    return {
      width: 340,
      height: 240,
      playerSize: 14,
      playerSpeed: 2.6,
      interactionDistance: 48,
      startPosition: { x: 12, y: 204 },
      portalSize: 46,
      infoBox: { x: 10, y: 186 },
      portals: [
        { id: 'about-portal', label: 'ABOUT', targetId: 'about', x: 18, y: 16 },
        { id: 'work-portal', label: 'WORK', targetId: 'work', x: 272, y: 18 },
        { id: 'contact-portal', label: 'CONTACT', targetId: 'contact', x: 246, y: 174 },
      ],
      walls: [
        { x: 58, y: 0, width: 10, height: 112 },
        { x: 0, y: 98, width: 104, height: 10 },

        { x: 122, y: 32, width: 10, height: 138 },
        { x: 122, y: 32, width: 112, height: 10 },

        { x: 224, y: 32, width: 10, height: 92 },
        { x: 160, y: 114, width: 74, height: 10 },

        { x: 78, y: 174, width: 118, height: 10 },
        { x: 268, y: 112, width: 60, height: 10 },

        { x: 200, y: 54, width: 26, height: 8 },
        { x: 166, y: 144, width: 44, height: 8 },
      ],
      traps: [
        { x: 102, y: 198, width: 42, height: 8 },
        { x: 188, y: 58, width: 24, height: 8 },
      ],
    };
  }

  if (mode === 'tablet') {
    return {
      width: 760,
      height: 430,
      playerSize: 18,
      playerSpeed: 3.2,
      interactionDistance: 66,
      startPosition: { x: 20, y: 386 },
      portalSize: 58,
      infoBox: { x: 18, y: 358 },
      portals: [
        { id: 'about-portal', label: 'ABOUT', targetId: 'about', x: 72, y: 68 },
        { id: 'work-portal', label: 'WORK', targetId: 'work', x: 628, y: 70 },
        { id: 'contact-portal', label: 'CONTACT', targetId: 'contact', x: 600, y: 334 },
      ],
      walls: [
        // left chamber
        { x: 92, y: 0, width: 14, height: 190 },
        { x: 0, y: 178, width: 210, height: 14 },

        // central shrine
        { x: 278, y: 52, width: 14, height: 286 },
        { x: 278, y: 52, width: 238, height: 14 },
        { x: 502, y: 52, width: 14, height: 182 },
        { x: 372, y: 176, width: 144, height: 14 },
        { x: 372, y: 176, width: 14, height: 136 },

        // bottom spine
        { x: 154, y: 328, width: 232, height: 14 },

        // right district
        { x: 560, y: 284, width: 176, height: 14 },
        { x: 736, y: 118, width: 14, height: 180 },

        // micro blockers
        { x: 458, y: 238, width: 14, height: 90 },
        { x: 520, y: 340, width: 92, height: 12 },
        { x: 438, y: 102, width: 56, height: 10 },
        { x: 206, y: 364, width: 84, height: 10 },
      ],
      traps: [
        { x: 210, y: 370, width: 74, height: 10 },
        { x: 432, y: 106, width: 50, height: 10 },
        { x: 582, y: 214, width: 10, height: 64 },
      ],
    };
  }

  return {
    width: 900,
    height: 520,
    playerSize: 22,
    playerSpeed: 3.8,
    interactionDistance: 82,
    startPosition: { x: 26, y: 470 },
    portalSize: 66,
    infoBox: { x: 18, y: 444 },
    portals: [
      { id: 'about-portal', label: 'ABOUT', targetId: 'about', x: 82, y: 84 },
      { id: 'work-portal', label: 'WORK', targetId: 'work', x: 760, y: 86 },
      { id: 'contact-portal', label: 'CONTACT', targetId: 'contact', x: 724, y: 414 },
    ],
    walls: [
      // left chamber
      { x: 104, y: 0, width: 18, height: 236 },
      { x: 0, y: 222, width: 250, height: 18 },

      // central shrine outer
      { x: 330, y: 70, width: 18, height: 320 },
      { x: 330, y: 70, width: 276, height: 18 },
      { x: 588, y: 70, width: 18, height: 220 },

      // shrine inner
      { x: 430, y: 202, width: 176, height: 18 },
      { x: 430, y: 202, width: 18, height: 168 },

      // bottom spine
      { x: 184, y: 398, width: 264, height: 18 },

      // right district
      { x: 662, y: 324, width: 220, height: 18 },
      { x: 882, y: 136, width: 18, height: 206 },

      // blockers / fake paths
      { x: 530, y: 274, width: 18, height: 114 },
      { x: 610, y: 410, width: 128, height: 16 },
      { x: 520, y: 118, width: 70, height: 12 },
      { x: 244, y: 444, width: 114, height: 12 },
      { x: 472, y: 250, width: 56, height: 12 },
    ],
    traps: [
      { x: 250, y: 456, width: 96, height: 12 },
      { x: 516, y: 122, width: 52, height: 12 },
      { x: 692, y: 238, width: 12, height: 84 },
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
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center px-6"
                >
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
                      textShadow:
                        '0 0 6px rgba(255,0,0,0.7), 0 0 18px rgba(255,0,0,0.35)',
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