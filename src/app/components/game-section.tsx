import { useEffect, useRef, useState } from 'react';

const BASE_WIDTH = 900;
const BASE_HEIGHT = 520;

const PLAYER_SIZE = 14;
const SPEED = 2.5;

type Enemy = { x: number; y: number; dx: number; dy: number };

export function GameSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [scale, setScale] = useState(1);
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const [player, setPlayer] = useState({ x: 60, y: 450 });

  const keys = useRef<Set<string>>(new Set());

  const [enemies, setEnemies] = useState<Enemy[]>([
    { x: 300, y: 200, dx: 1, dy: 0 },
    { x: 500, y: 300, dx: -1, dy: 0 },
    { x: 650, y: 120, dx: 0, dy: 1 },
    { x: 200, y: 350, dx: 0, dy: -1 },
    { x: 400, y: 100, dx: 1, dy: 1 },
  ]);

  // 📱 RESPONSIVE SCALE
  useEffect(() => {
    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      const s = Math.min(w / BASE_WIDTH, h / (BASE_HEIGHT + 200));
      setScale(s);
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // ⌨️ KEYBOARD
  useEffect(() => {
    const down = (e: KeyboardEvent) => keys.current.add(e.key.toLowerCase());
    const up = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());

    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);

    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  // 📱 TOUCH FIX
  const setMove = (k: string, v: boolean) => {
    if (v) keys.current.add(k);
    else keys.current.delete(k);
  };

  const bind = (k: string) => ({
    onPointerDown: () => setMove(k, true),
    onPointerUp: () => setMove(k, false),
    onPointerLeave: () => setMove(k, false),
    style: { touchAction: 'none' },
  });

  // 🎮 GAME LOOP
  useEffect(() => {
    if (!started || gameOver) return;

    let id: number;

    const loop = () => {
      setPlayer((p) => {
        let dx = 0;
        let dy = 0;

        if (keys.current.has('w')) dy -= 1;
        if (keys.current.has('s')) dy += 1;
        if (keys.current.has('a')) dx -= 1;
        if (keys.current.has('d')) dx += 1;

        return {
          x: Math.max(0, Math.min(BASE_WIDTH - PLAYER_SIZE, p.x + dx * SPEED)),
          y: Math.max(0, Math.min(BASE_HEIGHT - PLAYER_SIZE, p.y + dy * SPEED)),
        };
      });

      setEnemies((prev) =>
        prev.map((e) => {
          let nx = e.x + e.dx * 1.5;
          let ny = e.y + e.dy * 1.5;

          if (nx < 0 || nx > BASE_WIDTH) e.dx *= -1;
          if (ny < 0 || ny > BASE_HEIGHT) e.dy *= -1;

          return { ...e, x: nx, y: ny };
        })
      );

      id = requestAnimationFrame(loop);
    };

    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [started, gameOver]);

  // 💀 COLLISION
  useEffect(() => {
    enemies.forEach((e) => {
      const d = Math.hypot(player.x - e.x, player.y - e.y);
      if (d < 14) setGameOver(true);
    });
  }, [player, enemies]);

  return (
    <section className="flex flex-col items-center justify-center py-20 text-white">
      <h2 className="text-4xl mb-6">CITY RUN</h2>

      {/* GAME */}
      <div
        ref={containerRef}
        style={{
          width: BASE_WIDTH,
          height: BASE_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          border: '2px solid red',
          position: 'relative',
          background: '#0a0a0a',
        }}
      >
        {/* GRID */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundSize: '40px 40px',
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          }}
        />

        {/* 🏙 ROADS */}
        {[
          [0, 120, 900, 40],
          [0, 300, 900, 40],
          [200, 0, 40, 520],
          [450, 0, 40, 520],
          [700, 0, 40, 520],
        ].map(([x, y, w, h], i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: w,
              height: h,
              background: 'rgba(255,255,255,0.05)',
            }}
          />
        ))}

        {/* 🎯 TARGETS */}
        {[
          { x: 100, y: 50 },
          { x: 700, y: 80 },
          { x: 720, y: 400 },
        ].map((t, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: t.x,
              top: t.y,
              width: 24,
              height: 24,
              borderRadius: '50%',
              border: '2px solid red',
            }}
          />
        ))}

        {/* 👹 ENEMIES */}
        {enemies.map((e, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: e.x,
              top: e.y,
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: 'red',
            }}
          />
        ))}

        {/* 🧍 PLAYER */}
        <div
          style={{
            position: 'absolute',
            left: player.x,
            top: player.y,
            width: PLAYER_SIZE,
            height: PLAYER_SIZE,
            background: 'white',
            borderRadius: 3,
          }}
        />

        {/* GAME OVER */}
        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black text-3xl">
            GAME OVER
          </div>
        )}
      </div>

      {!started && (
        <button onClick={() => setStarted(true)} className="mt-6 border px-6 py-2">
          START
        </button>
      )}

      {/* 📱 CONTROLS */}
      {started && !gameOver && (
        <div className="grid grid-cols-3 gap-3 mt-6 text-xl">
          <div />
          <button {...bind('w')}>↑</button>
          <div />
          <button {...bind('a')}>←</button>
          <button {...bind('s')}>↓</button>
          <button {...bind('d')}>→</button>
        </div>
      )}
    </section>
  );
}
