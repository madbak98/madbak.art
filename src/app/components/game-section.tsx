import { useEffect, useMemo, useRef, useState } from 'react';
 
type Vec = { x: number; y: number };
 
type Destination = {
  id: 'about' | 'work' | 'contact';
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
};
 
type Building = {
  x: number;
  y: number;
  w: number;
  h: number;
};
 
type Trap = {
  x: number;
  y: number;
  w: number;
  h: number;
};
 
type Enemy = {
  id: number;
  x: number;
  y: number;
  hp: number;
};
 
type Bullet = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
};
 
const WORLD_W = 900;
const WORLD_H = 520;
 
const PLAYER_SIZE = 22;
const PLAYER_SPEED = 3;
const BULLET_SPEED = 7.5;
const ENEMY_SPEED = 0.82;
const FIRE_COOLDOWN = 260;
 
const START_POS: Vec = { x: 72, y: 438 };
 
const destinations: Destination[] = [
  { id: 'about', label: 'ABOUT', x: 56, y: 56, w: 120, h: 68 },
  { id: 'work', label: 'WORK', x: 690, y: 60, w: 132, h: 68 },
  { id: 'contact', label: 'CONTACT', x: 640, y: 392, w: 150, h: 72 },
];
 
const buildings: Building[] = [
  { x: 28, y: 28, w: 180, h: 118 },
  { x: 272, y: 34, w: 152, h: 110 },
  { x: 492, y: 28, w: 130, h: 120 },
  { x: 670, y: 30, w: 188, h: 116 },
 
  { x: 56, y: 212, w: 146, h: 112 },
  { x: 294, y: 202, w: 174, h: 118 },
  { x: 548, y: 208, w: 112, h: 118 },
  { x: 696, y: 212, w: 136, h: 106 },
 
  { x: 28, y: 380, w: 198, h: 92 },
  { x: 286, y: 378, w: 152, h: 90 },
  { x: 606, y: 372, w: 212, h: 100 },
];
 
const traps: Trap[] = [
  { x: 234, y: 168, w: 82, h: 10 },
  { x: 476, y: 336, w: 88, h: 10 },
  { x: 620, y: 174, w: 10, h: 86 },
 
  { x: 332, y: 168, w: 74, h: 10 },
  { x: 118, y: 336, w: 72, h: 10 },
  { x: 742, y: 336, w: 62, h: 10 },
  { x: 618, y: 272, w: 10, h: 70 },
];
 
// FIX 3: increased from 6 to 12 enemies
const INITIAL_ENEMIES: Enemy[] = [
  { id: 1, x: 770, y: 246, hp: 2 },
  { id: 2, x: 444, y: 120, hp: 2 },
  { id: 3, x: 570, y: 408, hp: 2 },
  { id: 4, x: 350, y: 246, hp: 2 },
  { id: 5, x: 182, y: 350, hp: 2 },
  { id: 6, x: 705, y: 350, hp: 2 },
  { id: 7, x: 140, y: 120, hp: 2 },
  { id: 8, x: 460, y: 260, hp: 2 },
  { id: 9, x: 820, y: 100, hp: 2 },
  { id: 10, x: 300, y: 440, hp: 2 },
  { id: 11, x: 650, y: 220, hp: 2 },
  { id: 12, x: 200, y: 240, hp: 2 },
];
 
function rectsOverlap(
  a: { x: number; y: number; w: number; h: number },
  b: { x: number; y: number; w: number; h: number }
) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}
 
function distance(a: Vec, b: Vec) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}
 
function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}
 
function openSection(targetId: string) {
  document.getElementById(targetId)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
}
 
function Character({ x, y, facing }: { x: number; y: number; facing: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: PLAYER_SIZE,
        height: PLAYER_SIZE,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 4,
          top: 8,
          width: 14,
          height: 11,
          borderRadius: '7px',
          background: '#101010',
          border: '2px solid #F5F5F5',
          boxShadow: '0 0 10px rgba(255,255,255,0.18)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 6,
          top: 1,
          width: 10,
          height: 10,
          borderRadius: '999px',
          background: '#F5F5F5',
          boxShadow: '0 0 8px rgba(255,255,255,0.3)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 11,
          top: 11,
          width: 14,
          height: 3,
          background: '#ff4a4a',
          borderRadius: '999px',
          transformOrigin: '0 50%',
          transform: `rotate(${facing}rad)`,
          boxShadow: '0 0 10px rgba(255,74,74,0.4)',
        }}
      />
    </div>
  );
}
 
function Beast({ x, y }: { x: number; y: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 22,
        height: 22,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '999px',
          background: '#ff3b3b',
          boxShadow: '0 0 16px rgba(255,59,59,0.35)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 4,
          top: 5,
          width: 4,
          height: 4,
          borderRadius: '999px',
          background: '#0a0a0a',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 4,
          top: 5,
          width: 4,
          height: 4,
          borderRadius: '999px',
          background: '#0a0a0a',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 5,
          bottom: 4,
          width: 12,
          height: 2,
          borderRadius: '999px',
          background: '#0a0a0a',
        }}
      />
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
  const [gameOver, setGameOver] = useState(false);
  const [player, setPlayer] = useState<Vec>(START_POS);
  const [facing, setFacing] = useState(0);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>(INITIAL_ENEMIES);
  const [message, setMessage] = useState('Reach ABOUT / WORK / CONTACT');
 
  const keysRef = useRef<Set<string>>(new Set());
  const touchMoveRef = useRef<Set<string>>(new Set());
  const bulletIdRef = useRef(1);
  const arenaRef = useRef<HTMLDivElement | null>(null);
  // FIX 1: keep a ref to player for use inside the game loop
  const playerRef = useRef<Vec>(START_POS);
  const lastFireRef = useRef(0);
  const startedRef = useRef(false);
  const gameOverRef = useRef(false);
 
  useEffect(() => {
    playerRef.current = player;
  }, [player]);
 
  useEffect(() => {
    startedRef.current = started;
  }, [started]);
 
  useEffect(() => {
    gameOverRef.current = gameOver;
  }, [gameOver]);
 
  useEffect(() => {
    const onResize = () => {
      setViewportWidth(window.innerWidth);
      setViewportHeight(window.innerHeight);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
 
  const isPhone = viewportWidth <= 767;
  const isTablet = viewportWidth > 767 && viewportWidth <= 1180;
  const isLandscapeMobile = isPhone && viewportWidth > viewportHeight;
 
  const renderWidth = isLandscapeMobile
    ? Math.min(viewportWidth - 32, 420)
    : isPhone
    ? Math.min(viewportWidth - 24, 360)
    : isTablet
    ? Math.min(viewportWidth - 48, 760)
    : 820;
 
  const scale = renderWidth / WORLD_W;
  const renderHeight = WORLD_H * scale;
 
  const centerTarget = useMemo(() => {
    const nearest = destinations
      .map((d) => {
        const cx = d.x + d.w / 2;
        const cy = d.y + d.h / 2;
        return {
          id: d.id,
          targetId: d.id,
          x: cx,
          y: cy,
          dist: distance(player, { x: cx, y: cy }),
        };
      })
      .sort((a, b) => a.dist - b.dist)[0];
 
    return nearest;
  }, [player]);
 
  // FIX 1: global keydown listener that always works regardless of focus
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const blocked = ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '];
      if (blocked.includes(e.key)) {
        e.preventDefault();
      }
      keysRef.current.add(e.key.toLowerCase());
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key.toLowerCase());
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);
 
  useEffect(() => {
    if (!started || gameOver) return;
 
    let frame = 0;
 
    const loop = () => {
      if (!startedRef.current || gameOverRef.current) return;
 
      // --- Player movement ---
      setPlayer((prev) => {
        const allKeys = new Set([
          ...Array.from(keysRef.current),
          ...Array.from(touchMoveRef.current),
        ]);
 
        let dx = 0;
        let dy = 0;
 
        if (allKeys.has('w') || allKeys.has('arrowup')) dy -= 1;
        if (allKeys.has('s') || allKeys.has('arrowdown')) dy += 1;
        if (allKeys.has('a') || allKeys.has('arrowleft')) dx -= 1;
        if (allKeys.has('d') || allKeys.has('arrowright')) dx += 1;
 
        if (dx !== 0 && dy !== 0) {
          dx *= 0.7071;
          dy *= 0.7071;
        }
 
        const tryX = clamp(prev.x + dx * PLAYER_SPEED, 0, WORLD_W - PLAYER_SIZE);
        const tryY = clamp(prev.y + dy * PLAYER_SPEED, 0, WORLD_H - PLAYER_SIZE);
 
        let nextX = prev.x;
        let nextY = prev.y;
 
        const rectX = { x: tryX, y: prev.y, w: PLAYER_SIZE, h: PLAYER_SIZE };
        if (!buildings.some((b) => rectsOverlap(rectX, b))) nextX = tryX;
 
        const rectY = { x: nextX, y: tryY, w: PLAYER_SIZE, h: PLAYER_SIZE };
        if (!buildings.some((b) => rectsOverlap(rectY, b))) nextY = tryY;
 
        playerRef.current = { x: nextX, y: nextY };
        return { x: nextX, y: nextY };
      });
 
      // FIX 2: Bullets stop when hitting buildings
      setBullets((prev) =>
        prev
          .map((b) => ({
            ...b,
            x: b.x + b.vx,
            y: b.y + b.vy,
          }))
          .filter((b) => {
            // out of bounds
            if (b.x < -20 || b.x > WORLD_W + 20 || b.y < -20 || b.y > WORLD_H + 20) return false;
            // FIX 2: remove bullet if it hits a building
            const bulletRect = { x: b.x - 3, y: b.y - 3, w: 6, h: 6 };
            if (buildings.some((bld) => rectsOverlap(bulletRect, bld))) return false;
            return true;
          })
      );
 
      // --- Enemy movement ---
      setEnemies((prev) =>
        prev.map((enemy) => {
          const p = playerRef.current;
          const angle = Math.atan2(p.y - enemy.y, p.x - enemy.x);
          const nx = enemy.x + Math.cos(angle) * ENEMY_SPEED;
          const ny = enemy.y + Math.sin(angle) * ENEMY_SPEED;
 
          const enemyRect = { x: nx, y: ny, w: 22, h: 22 };
          const blocked = buildings.some((b) => rectsOverlap(enemyRect, b));
          if (blocked) return enemy;
 
          return { ...enemy, x: nx, y: ny };
        })
      );
 
      frame = requestAnimationFrame(loop);
    };
 
    frame = requestAnimationFrame(loop);
 
    return () => {
      cancelAnimationFrame(frame);
    };
  }, [started, gameOver]);
 
  // Bullet-enemy collision
  useEffect(() => {
    if (!started || gameOver) return;
 
    setEnemies((prevEnemies) => {
      let next = [...prevEnemies];
 
      bullets.forEach((bullet) => {
        next = next
          .map((enemy) => {
            const hit = distance(
              { x: bullet.x, y: bullet.y },
              { x: enemy.x + 11, y: enemy.y + 11 }
            ) < 16;
 
            if (!hit) return enemy;
            return { ...enemy, hp: enemy.hp - 1 };
          })
          .filter((enemy) => enemy.hp > 0);
      });
 
      return next;
    });
  }, [bullets, started, gameOver]);
 
  // Collision detection: traps, enemies, destinations
  useEffect(() => {
    if (!started || gameOver) return;
 
    for (const trap of traps) {
      if (
        rectsOverlap(
          { x: player.x, y: player.y, w: PLAYER_SIZE, h: PLAYER_SIZE },
          trap
        )
      ) {
        setGameOver(true);
        setMessage('Trap hit');
        return;
      }
    }
 
    for (const enemy of enemies) {
      if (distance(player, enemy) < 18) {
        setGameOver(true);
        setMessage('A beast got you');
        return;
      }
    }
 
    for (const dest of destinations) {
      if (
        rectsOverlap(
          { x: player.x, y: player.y, w: PLAYER_SIZE, h: PLAYER_SIZE },
          { x: dest.x, y: dest.y, w: dest.w, h: dest.h }
        )
      ) {
        setMessage(`Entering ${dest.label}`);
        openSection(dest.id);
        return;
      }
    }
  }, [player, enemies, started, gameOver]);
 
  const shootToward = (tx: number, ty: number) => {
    if (!started || gameOver) return;
 
    const now = Date.now();
    if (now - lastFireRef.current < FIRE_COOLDOWN) return;
    lastFireRef.current = now;
 
    const cx = player.x + PLAYER_SIZE / 2;
    const cy = player.y + PLAYER_SIZE / 2;
    const angle = Math.atan2(ty - cy, tx - cx);
 
    setFacing(angle);
 
    setBullets((prev) => [
      ...prev,
      {
        id: bulletIdRef.current++,
        x: cx,
        y: cy,
        vx: Math.cos(angle) * BULLET_SPEED,
        vy: Math.sin(angle) * BULLET_SPEED,
      },
    ]);
  };
 
  const shootByPointer = (clientX: number, clientY: number) => {
    if (!arenaRef.current) return;
    const rect = arenaRef.current.getBoundingClientRect();
    const tx = ((clientX - rect.left) / rect.width) * WORLD_W;
    const ty = ((clientY - rect.top) / rect.height) * WORLD_H;
    shootToward(tx, ty);
  };
 
  const shootNearestTarget = () => {
    shootToward(centerTarget.x, centerTarget.y);
  };
 
  const restart = () => {
    setGameOver(false);
    setStarted(true);
    setPlayer(START_POS);
    playerRef.current = START_POS;
    setBullets([]);
    setEnemies(INITIAL_ENEMIES);
    setMessage('Reach ABOUT / WORK / CONTACT');
    touchMoveRef.current.clear();
    keysRef.current.clear();
  };
 
  const setTouchMove = (key: string, active: boolean) => {
    if (active) touchMoveRef.current.add(key);
    else touchMoveRef.current.delete(key);
  };
 
  const bindMoveBtn = (key: string) => ({
    onMouseDown: () => setTouchMove(key, true),
    onMouseUp: () => setTouchMove(key, false),
    onMouseLeave: () => setTouchMove(key, false),
    onTouchStart: (e: React.TouchEvent) => {
      e.preventDefault();
      setTouchMove(key, true);
    },
    onTouchEnd: (e: React.TouchEvent) => {
      e.preventDefault();
      setTouchMove(key, false);
    },
    onTouchCancel: () => setTouchMove(key, false),
  });
 
  return (
    <section
      id="game"
      className={`relative min-h-screen flex items-center justify-center px-4 ${
        isLandscapeMobile ? 'py-8' : 'py-20'
      }`}
    >
      <div className="w-full max-w-6xl z-10">
        <div className="mb-8 text-center">
          <div className="mb-3">
            <span
              className="text-xs tracking-[0.3em] uppercase"
              style={{ fontFamily: 'var(--font-mono)', color: '#ff4a4a' }}
            >
              [00X] CITY RUN
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
            REACH THE TARGET
          </h2>
 
          <p
            className="mx-auto max-w-2xl text-[11px] sm:text-sm tracking-[0.12em] uppercase"
            style={{
              fontFamily: 'var(--font-body)',
              color: 'rgba(245,245,245,0.58)',
            }}
          >
            WASD on desktop. Touch controls on phone and iPad.
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
            ref={arenaRef}
            onClick={(e) => shootByPointer(e.clientX, e.clientY)}
            className="absolute left-0 top-0 origin-top-left overflow-hidden"
            style={{
              width: `${WORLD_W}px`,
              height: `${WORLD_H}px`,
              transform: `scale(${scale})`,
              border: '2px solid rgba(255,74,74,0.55)',
              background:
                'linear-gradient(180deg, rgba(12,12,12,1) 0%, rgba(8,8,8,1) 100%)',
              boxShadow: '0 0 38px rgba(255,74,74,0.12)',
              cursor: isPhone || isTablet ? 'default' : 'crosshair',
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
              }}
            />
 
            {/* Streets */}
            <div
              className="absolute"
              style={{
                left: 0, top: 156, width: WORLD_W, height: 52,
                background: 'rgba(255,255,255,0.03)',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
              }}
            />
            <div
              className="absolute"
              style={{
                left: 0, top: 334, width: WORLD_W, height: 52,
                background: 'rgba(255,255,255,0.03)',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
              }}
            />
            <div
              className="absolute"
              style={{
                left: 230, top: 0, width: 54, height: WORLD_H,
                background: 'rgba(255,255,255,0.03)',
                borderLeft: '1px solid rgba(255,255,255,0.08)',
                borderRight: '1px solid rgba(255,255,255,0.08)',
              }}
            />
            <div
              className="absolute"
              style={{
                left: 616, top: 0, width: 54, height: WORLD_H,
                background: 'rgba(255,255,255,0.03)',
                borderLeft: '1px solid rgba(255,255,255,0.08)',
                borderRight: '1px solid rgba(255,255,255,0.08)',
              }}
            />
 
            {/* Buildings */}
            {buildings.map((b, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: b.x, top: b.y, width: b.w, height: b.h,
                  background: 'rgba(255,255,255,0.035)',
                  border: '1px solid rgba(255,255,255,0.11)',
                  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.03)',
                }}
              >
                <div style={{ position: 'absolute', inset: 8, border: '1px solid rgba(255,255,255,0.05)' }} />
              </div>
            ))}
 
            {/* Destinations */}
            {destinations.map((d) => (
              <div
                key={d.id}
                style={{
                  position: 'absolute',
                  left: d.x, top: d.y, width: d.w, height: d.h,
                  border: '1px solid rgba(255,74,74,0.9)',
                  background: 'rgba(255,74,74,0.07)',
                  boxShadow: '0 0 16px rgba(255,74,74,0.16)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#f5f5f5',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                }}
              >
                {d.label}
              </div>
            ))}
 
            {/* Traps */}
            {traps.map((t, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: t.x, top: t.y, width: t.w, height: t.h,
                  background: t.w > t.h
                    ? 'linear-gradient(90deg, rgba(255,0,0,0.08), rgba(255,0,0,0.52), rgba(255,0,0,0.08))'
                    : 'linear-gradient(180deg, rgba(255,0,0,0.08), rgba(255,0,0,0.52), rgba(255,0,0,0.08))',
                  border: '1px solid rgba(255,0,0,0.8)',
                  boxShadow: '0 0 10px rgba(255,0,0,0.24)',
                }}
              />
            ))}
 
            {/* Bullets */}
            {bullets.map((b) => (
              <div
                key={b.id}
                style={{
                  position: 'absolute',
                  left: b.x, top: b.y,
                  width: 6, height: 6,
                  borderRadius: '999px',
                  background: '#f5f5f5',
                  boxShadow: '0 0 8px rgba(255,255,255,0.5)',
                }}
              />
            ))}
 
            {/* Enemies */}
            {enemies.map((e) => (
              <Beast key={e.id} x={e.x} y={e.y} />
            ))}
 
            {/* Player */}
            <Character x={player.x} y={player.y} facing={facing} />
 
            {/* HUD */}
            <div
              className="absolute left-4 top-4 px-4 py-3"
              style={{
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(10,10,10,0.68)',
              }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.18em', color: '#ff4a4a', textTransform: 'uppercase' }}>
                Status
              </div>
              <div className="mt-1" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.16em', color: 'rgba(245,245,245,0.56)', textTransform: 'uppercase' }}>
                {message}
              </div>
              <div className="mt-1" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.16em', color: 'rgba(255,74,74,0.7)', textTransform: 'uppercase' }}>
                Enemies: {enemies.length}
              </div>
            </div>
 
            {/* Start screen */}
            {!started && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/72 backdrop-blur-[2px]">
                <div className="text-center px-6">
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.4rem, 4vw, 2.2rem)', fontWeight: 800, color: '#F5F5F5' }}>
                    ENTER THE CITY
                  </div>
                  <p className="mb-3 uppercase" style={{ fontFamily: 'var(--font-mono)', color: 'rgba(245,245,245,0.58)', fontSize: '10px', letterSpacing: '0.18em' }}>
                    Desktop: WASD + click to shoot
                  </p>
                  <p className="mb-6 uppercase" style={{ fontFamily: 'var(--font-mono)', color: 'rgba(245,245,245,0.42)', fontSize: '10px', letterSpacing: '0.18em' }}>
                    Phone / iPad: touch controls
                  </p>
                  <button
                    onClick={() => {
                      setStarted(true);
                      setGameOver(false);
                      setPlayer(START_POS);
                      playerRef.current = START_POS;
                      setMessage('Reach ABOUT / WORK / CONTACT');
                    }}
                    style={{
                      fontFamily: 'var(--font-body)', fontSize: '0.85rem', letterSpacing: '0.16em',
                      textTransform: 'uppercase', border: '2px solid #ff4a4a',
                      color: '#F5F5F5', background: 'transparent', cursor: 'pointer', padding: '12px 26px',
                    }}
                  >
                    Start
                  </button>
                </div>
              </div>
            )}
 
            {/* Game over screen */}
            {gameOver && (
              <div
                onClick={restart}
                className="absolute inset-0 flex items-center justify-center bg-black/86"
                style={{ cursor: 'pointer' }}
              >
                <div className="text-center px-6">
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 6vw, 3.4rem)', color: '#F5F5F5', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                    Game Over
                  </div>
                  <div className="mt-3" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.18em', color: 'rgba(245,245,245,0.52)', textTransform: 'uppercase' }}>
                    Tap to restart
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
 
        {/* Mobile controls */}
        {(isPhone || isTablet) && started && !gameOver && (
          <div className={`mt-4 flex ${isLandscapeMobile ? 'flex-row items-end justify-between gap-4' : 'flex-col items-center gap-4'}`}>
            <div className={`grid grid-cols-3 select-none ${isTablet ? 'gap-3 w-[240px]' : 'gap-3 w-[210px]'}`}>
              <div />
              <button type="button" {...bindMoveBtn('w')} style={{ touchAction: 'none', WebkitUserSelect: 'none', userSelect: 'none', border: '1px solid rgba(255,74,74,0.45)', background: 'rgba(10,10,10,0.78)', color: '#F5F5F5', fontSize: isTablet ? '1.3rem' : '1.2rem', height: isTablet ? '64px' : '56px' }}>Up</button>
              <div />
              <button type="button" {...bindMoveBtn('a')} style={{ touchAction: 'none', WebkitUserSelect: 'none', userSelect: 'none', border: '1px solid rgba(255,74,74,0.45)', background: 'rgba(10,10,10,0.78)', color: '#F5F5F5', fontSize: isTablet ? '1.3rem' : '1.2rem', height: isTablet ? '64px' : '56px' }}>Left</button>
              <button type="button" {...bindMoveBtn('s')} style={{ touchAction: 'none', WebkitUserSelect: 'none', userSelect: 'none', border: '1px solid rgba(255,74,74,0.45)', background: 'rgba(10,10,10,0.78)', color: '#F5F5F5', fontSize: isTablet ? '1.3rem' : '1.2rem', height: isTablet ? '64px' : '56px' }}>Down</button>
              <button type="button" {...bindMoveBtn('d')} style={{ touchAction: 'none', WebkitUserSelect: 'none', userSelect: 'none', border: '1px solid rgba(255,74,74,0.45)', background: 'rgba(10,10,10,0.78)', color: '#F5F5F5', fontSize: isTablet ? '1.3rem' : '1.2rem', height: isTablet ? '64px' : '56px' }}>Right</button>
            </div>
 
            <div className={`flex ${isLandscapeMobile ? 'flex-col gap-3' : 'flex-row gap-3'}`}>
              <button type="button" onClick={shootNearestTarget} style={{ touchAction: 'manipulation', border: '2px solid #ff4a4a', background: 'rgba(255,74,74,0.08)', color: '#F5F5F5', fontFamily: 'var(--font-body)', letterSpacing: '0.16em', textTransform: 'uppercase', fontSize: isTablet ? '1rem' : '0.9rem', padding: isTablet ? '18px 34px' : '16px 28px' }}>
                Fire
              </button>
              <button type="button" onClick={() => openSection(centerTarget.targetId)} style={{ touchAction: 'manipulation', border: '2px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.04)', color: '#F5F5F5', fontFamily: 'var(--font-body)', letterSpacing: '0.16em', textTransform: 'uppercase', fontSize: isTablet ? '1rem' : '0.9rem', padding: isTablet ? '18px 34px' : '16px 28px' }}>
                Enter
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

