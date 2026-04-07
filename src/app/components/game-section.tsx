import { motion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';

type MovingTarget = {
  id: string;
  label: string;
  targetId: string;
  baseX: number;
  baseY: number;
  size: number;
  pattern: 'horizontal' | 'orbit' | 'wave';
  speed: number;
  rangeX: number;
  rangeY: number;
};

type ShotEffect = {
  x: number;
  y: number;
  hit: boolean;
  id: number;
};

const DESKTOP_W = 900;
const DESKTOP_H = 520;

function getTargetLayout(mode: 'mobile' | 'tablet' | 'desktop'): MovingTarget[] {
  if (mode === 'mobile') {
    return [
      {
        id: 'about-target',
        label: 'ABOUT',
        targetId: 'about',
        baseX: 90,
        baseY: 120,
        size: 54,
        pattern: 'horizontal',
        speed: 1.8,
        rangeX: 42,
        rangeY: 0,
      },
      {
        id: 'work-target',
        label: 'WORK',
        targetId: 'work',
        baseX: 250,
        baseY: 130,
        size: 54,
        pattern: 'wave',
        speed: 2.1,
        rangeX: 34,
        rangeY: 18,
      },
      {
        id: 'contact-target',
        label: 'CONTACT',
        targetId: 'contact',
        baseX: 180,
        baseY: 340,
        size: 54,
        pattern: 'orbit',
        speed: 1.8,
        rangeX: 26,
        rangeY: 26,
      },
    ];
  }

  if (mode === 'tablet') {
    return [
      {
        id: 'about-target',
        label: 'ABOUT',
        targetId: 'about',
        baseX: 160,
        baseY: 125,
        size: 62,
        pattern: 'horizontal',
        speed: 2.0,
        rangeX: 72,
        rangeY: 0,
      },
      {
        id: 'work-target',
        label: 'WORK',
        targetId: 'work',
        baseX: 590,
        baseY: 140,
        size: 62,
        pattern: 'wave',
        speed: 2.35,
        rangeX: 64,
        rangeY: 26,
      },
      {
        id: 'contact-target',
        label: 'CONTACT',
        targetId: 'contact',
        baseX: 400,
        baseY: 338,
        size: 62,
        pattern: 'orbit',
        speed: 2.0,
        rangeX: 34,
        rangeY: 34,
      },
    ];
  }

  return [
    {
      id: 'about-target',
      label: 'ABOUT',
      targetId: 'about',
      baseX: 170,
      baseY: 140,
      size: 66,
      pattern: 'horizontal',
      speed: 2.0,
      rangeX: 92,
      rangeY: 0,
    },
    {
      id: 'work-target',
      label: 'WORK',
      targetId: 'work',
      baseX: 650,
      baseY: 150,
      size: 66,
      pattern: 'wave',
      speed: 2.55,
      rangeX: 92,
      rangeY: 30,
    },
    {
      id: 'contact-target',
      label: 'CONTACT',
      targetId: 'contact',
      baseX: 470,
      baseY: 360,
      size: 66,
      pattern: 'orbit',
      speed: 2.15,
      rangeX: 42,
      rangeY: 42,
    },
  ];
}

function getTargetPosition(target: MovingTarget, time: number, difficultyMultiplier: number) {
  const t = time * target.speed * difficultyMultiplier;

  switch (target.pattern) {
    case 'horizontal':
      return {
        x: target.baseX + Math.sin(t) * target.rangeX,
        y: target.baseY,
      };

    case 'wave':
      return {
        x: target.baseX + Math.sin(t) * target.rangeX,
        y: target.baseY + Math.cos(t * 1.25) * target.rangeY,
      };

    case 'orbit':
      return {
        x: target.baseX + Math.cos(t) * target.rangeX,
        y: target.baseY + Math.sin(t) * target.rangeY,
      };

    default:
      return {
        x: target.baseX,
        y: target.baseY,
      };
  }
}

function distance(ax: number, ay: number, bx: number, by: number) {
  return Math.hypot(ax - bx, ay - by);
}

function TargetIcon({
  label,
  size,
  active,
}: {
  label: string;
  size: number;
  active: boolean;
}) {
  const ring = active ? '#ffffff' : '#ff3b3b';
  const faint = active ? 'rgba(255,255,255,0.12)' : 'rgba(255,59,59,0.08)';

  return (
    <div
      style={{
        width: size,
        height: size,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        filter: active ? 'drop-shadow(0 0 20px rgba(255,255,255,0.45))' : 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '999px',
          border: `2px solid ${ring}`,
          background: faint,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: '10px',
          borderRadius: '999px',
          border: `2px solid ${ring}`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: '20px',
          borderRadius: '999px',
          border: `2px solid ${ring}`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 2,
          bottom: 2,
          width: 2,
          transform: 'translateX(-50%)',
          background: ring,
          opacity: 0.85,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: 2,
          right: 2,
          height: 2,
          transform: 'translateY(-50%)',
          background: ring,
          opacity: 0.85,
        }}
      />
      <span
        style={{
          position: 'relative',
          zIndex: 2,
          fontFamily: 'var(--font-mono)',
          fontSize: size < 56 ? '7px' : '8px',
          letterSpacing: '0.16em',
          color: '#F5F5F5',
          textTransform: 'uppercase',
          textAlign: 'center',
          textShadow: '0 0 8px rgba(0,0,0,0.85)',
          pointerEvents: 'none',
        }}
      >
        {label}
      </span>
    </div>
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
  const [time, setTime] = useState(0);
  const [shots, setShots] = useState<ShotEffect[]>([]);
  const [hitTargetId, setHitTargetId] = useState<string | null>(null);
  const [crosshair, setCrosshair] = useState({ x: DESKTOP_W / 2, y: DESKTOP_H / 2 });
  const [gameMessage, setGameMessage] = useState('LOCK TARGETS');
  const [shake, setShake] = useState(false);
  const [combo, setCombo] = useState(0);
  const [score, setScore] = useState(0);

  const arenaRef = useRef<HTMLDivElement | null>(null);
  const shotIdRef = useRef(1);
  const comboTimeoutRef = useRef<number | null>(null);
  const shootAudioRef = useRef<HTMLAudioElement | null>(null);
  const hitAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const onResize = () => {
      setViewportWidth(window.innerWidth);
      setViewportHeight(window.innerHeight);
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    shootAudioRef.current = new Audio('/sounds/shoot.mp3');
    hitAudioRef.current = new Audio('/sounds/hit.mp3');

    shootAudioRef.current.volume = 0.35;
    hitAudioRef.current.volume = 0.45;
  }, []);

  useEffect(() => {
    return () => {
      if (comboTimeoutRef.current) {
        window.clearTimeout(comboTimeoutRef.current);
      }
    };
  }, []);

  const isMobile = viewportWidth <= 767;
  const isTablet = viewportWidth > 767 && viewportWidth <= 1366;
  const isLandscapeMobile = isMobile && viewportWidth > viewportHeight;

  const mode: 'mobile' | 'tablet' | 'desktop' = isMobile
    ? 'mobile'
    : isTablet
    ? 'tablet'
    : 'desktop';

  const arenaWidth = isLandscapeMobile
    ? Math.min(viewportWidth - 32, 280)
    : isMobile
    ? Math.min(viewportWidth - 32, 360)
    : isTablet
    ? 700
    : 760;

  const arenaScale = arenaWidth / DESKTOP_W;
  const arenaHeight = DESKTOP_H * arenaScale;

  const baseTargets = useMemo(() => getTargetLayout(mode), [mode]);
  const difficultyMultiplier = 1 + combo * 0.12;

  useEffect(() => {
    if (!started) return;

    let frameId = 0;
    let startTs: number | null = null;

    const loop = (ts: number) => {
      if (startTs === null) startTs = ts;
      const elapsed = (ts - startTs) / 1000;
      setTime(elapsed);
      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [started]);

  const positionedTargets = useMemo(() => {
    return baseTargets.map((target) => {
      const pos = getTargetPosition(target, time, difficultyMultiplier);
      return {
        ...target,
        x: pos.x,
        y: pos.y,
      };
    });
  }, [baseTargets, time, difficultyMultiplier]);

  const playShootSound = () => {
    try {
      if (!shootAudioRef.current) return;
      shootAudioRef.current.currentTime = 0;
      void shootAudioRef.current.play();
    } catch {}
  };

  const playHitSound = () => {
    try {
      if (!hitAudioRef.current) return;
      hitAudioRef.current.currentTime = 0;
      void hitAudioRef.current.play();
    } catch {}
  };

  const triggerCombo = () => {
    setCombo((prev) => prev + 1);

    if (comboTimeoutRef.current) {
      window.clearTimeout(comboTimeoutRef.current);
    }

    comboTimeoutRef.current = window.setTimeout(() => {
      setCombo(0);
    }, 1500);
  };

  const shootAt = (x: number, y: number) => {
    if (!started) return;

    playShootSound();

    let hit: (typeof positionedTargets)[number] | null = null;

    for (const target of positionedTargets) {
      const cx = target.x + target.size / 2;
      const cy = target.y + target.size / 2;
      const d = distance(x, y, cx, cy);

      if (d <= target.size * 0.4) {
        hit = target;
        break;
      }
    }

    const effect: ShotEffect = {
      x,
      y,
      hit: Boolean(hit),
      id: shotIdRef.current++,
    };

    setShots((prev) => [...prev, effect]);

    window.setTimeout(() => {
      setShots((prev) => prev.filter((s) => s.id !== effect.id));
    }, 380);

    if (hit) {
      playHitSound();
      setHitTargetId(hit.id);
      setGameMessage(`LOCKED: ${hit.label}`);
      setShake(true);
      setScore((prev) => prev + 100);
      triggerCombo();

      window.setTimeout(() => setShake(false), 180);

      window.setTimeout(() => {
        document.getElementById(hit!.targetId)?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 250);

      window.setTimeout(() => {
        setHitTargetId(null);
        setGameMessage('LOCK TARGETS');
      }, 800);
    } else {
      setGameMessage('MISS');
      setCombo(0);
      window.setTimeout(() => setGameMessage('LOCK TARGETS'), 350);
    }
  };

  const handleArenaPointer = (
    clientX: number,
    clientY: number,
    shouldShoot = false
  ) => {
    if (!arenaRef.current) return;

    const rect = arenaRef.current.getBoundingClientRect();
    const localX = ((clientX - rect.left) / rect.width) * DESKTOP_W;
    const localY = ((clientY - rect.top) / rect.height) * DESKTOP_H;

    setCrosshair({ x: localX, y: localY });

    if (shouldShoot) {
      shootAt(localX, localY);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    handleArenaPointer(e.clientX, e.clientY, false);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    handleArenaPointer(e.clientX, e.clientY, true);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    if (!touch) return;
    handleArenaPointer(touch.clientX, touch.clientY, true);
  };

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
              [00X] TARGET MODE
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
            LOCK & SHOOT
          </h2>

          <p
            className="mx-auto max-w-2xl text-[11px] sm:text-sm tracking-[0.12em] uppercase"
            style={{
              fontFamily: 'var(--font-body)',
              color: 'rgba(245,245,245,0.6)',
            }}
          >
            Hit the moving targets to jump through the site.
          </p>
        </div>

        <div
          className="relative mx-auto"
          style={{
            width: `${arenaWidth}px`,
            height: `${arenaHeight}px`,
          }}
        >
          <div
            ref={arenaRef}
            className="absolute left-0 top-0 origin-top-left overflow-hidden"
            onMouseMove={handleMouseMove}
            onClick={handleClick}
            onTouchStart={handleTouchStart}
            style={{
              width: `${DESKTOP_W}px`,
              height: `${DESKTOP_H}px`,
              transform: `scale(${arenaScale}) ${shake ? 'translateX(-3px)' : ''}`,
              cursor: isMobile ? 'default' : 'crosshair',
              border: '2px solid rgba(255,56,56,0.55)',
              background:
                'radial-gradient(circle at 50% 40%, rgba(255,56,56,0.08) 0%, rgba(10,10,10,1) 70%)',
              boxShadow: '0 0 40px rgba(255,56,56,0.12)',
              touchAction: 'manipulation',
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

            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.12) 58%, rgba(0,0,0,0.44) 100%)',
              }}
            />

            {positionedTargets.map((target) => (
              <motion.div
                key={target.id}
                className="absolute"
                style={{
                  left: target.x,
                  top: target.y,
                  width: target.size,
                  height: target.size,
                }}
                animate={{
                  scale: hitTargetId === target.id ? [1, 1.16, 1] : [1, 1.03, 1],
                }}
                transition={{
                  duration: hitTargetId === target.id ? 0.35 : 1.6,
                  repeat: hitTargetId === target.id ? 0 : Infinity,
                  ease: 'easeInOut',
                }}
              >
                <TargetIcon
                  label={target.label}
                  size={target.size}
                  active={hitTargetId === target.id}
                />
              </motion.div>
            ))}

            {shots.map((shot) => (
              <motion.div
                key={shot.id}
                initial={{ opacity: 1, scale: 0.5 }}
                animate={{ opacity: 0, scale: shot.hit ? 2.2 : 1.6 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="absolute pointer-events-none"
                style={{
                  left: shot.x - 12,
                  top: shot.y - 12,
                  width: 24,
                  height: 24,
                  borderRadius: '999px',
                  border: `2px solid ${shot.hit ? '#ffffff' : '#ff3b3b'}`,
                  boxShadow: shot.hit
                    ? '0 0 20px rgba(255,255,255,0.6)'
                    : '0 0 16px rgba(255,59,59,0.42)',
                }}
              />
            ))}

            {hitTargetId && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(255,255,255,0.05)',
                  pointerEvents: 'none',
                }}
              />
            )}

            {!isMobile && started && (
              <div
                className="absolute pointer-events-none"
                style={{
                  left: crosshair.x - 20,
                  top: crosshair.y - 20,
                  width: 40,
                  height: 40,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    border: '1px solid rgba(255,255,255,0.8)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: 0,
                    right: 0,
                    height: 1,
                    transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.9)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: 0,
                    bottom: 0,
                    width: 1,
                    transform: 'translateX(-50%)',
                    background: 'rgba(255,255,255,0.9)',
                  }}
                />
              </div>
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
                    ENTER TARGET MODE
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
                    Desktop: Aim + Click
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
                    Mobile / iPad: Tap the moving targets
                  </p>

                  <button
                    onClick={() => {
                      setStarted(true);
                      setHitTargetId(null);
                      setGameMessage('LOCK TARGETS');
                      setCombo(0);
                      setScore(0);
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

            {started && (
              <>
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
                      Score: {score}
                    </p>
                    <p
                      className="mt-1 uppercase"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        color: hitTargetId ? '#ffffff' : '#ff4a4a',
                        fontSize: '10px',
                        letterSpacing: '0.18em',
                      }}
                    >
                      {gameMessage}
                    </p>
                  </div>
                </div>

                {combo > 1 && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 18,
                      top: 18,
                      color: '#ff3b3b',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      textShadow: '0 0 12px rgba(255,59,59,0.35)',
                    }}
                  >
                    Combo x{combo}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {isMobile && started && (
          <div className="mt-4 text-center">
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                color: 'rgba(245,245,245,0.58)',
                fontSize: '10px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
              }}
            >
              Tap the moving target icons
            </p>
          </div>
        )}
      </div>
    </section>
  );
}