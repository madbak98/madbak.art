import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

const ARENA_WIDTH = 900;
const ARENA_HEIGHT = 520;
const PLAYER_SIZE = 18;
const SPEED = 2.8;

type Target = {
  id: string;
  x: number;
  y: number;
  targetId: string;
};

type Enemy = {
  x: number;
  y: number;
  dirX: number;
  dirY: number;
};

export function GameSection() {
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const [player, setPlayer] = useState({ x: 40, y: 440 });

  const keys = useRef<Set<string>>(new Set());

  // 🎯 Targets
  const targets: Target[] = [
    { id: 'about', x: 120, y: 80, targetId: 'about' },
    { id: 'work', x: 740, y: 100, targetId: 'work' },
    { id: 'contact', x: 700, y: 420, targetId: 'contact' },
  ];

  // 👹 Enemies (بیشتر و سخت‌تر)
  const [enemies, setEnemies] = useState<Enemy[]>([
    { x: 300, y: 200, dirX: 1, dirY: 0 },
    { x: 500, y: 350, dirX: -1, dirY: 0 },
    { x: 650, y: 250, dirX: 0, dirY: 1 },
    { x: 200, y: 400, dirX: 0, dirY: -1 },
    { x: 400, y: 120, dirX: 1, dirY: 1 },
  ]);

  // 🎮 Keyboard
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keys.current.add(e.key.toLowerCase());
    };
    const up = (e: KeyboardEvent) => {
      keys.current.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);

    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  // 🎮 Mobile FIX
  const setMove = (k: string, v: boolean) => {
    if (v) keys.current.add(k);
    else keys.current.delete(k);
  };

  const bindBtn = (k: string) => ({
    onPointerDown: () => setMove(k, true),
    onPointerUp: () => setMove(k, false),
    onPointerLeave: () => setMove(k, false),
    style: { touchAction: 'none' },
  });

  // 🔄 Game loop
  useEffect(() => {
    if (!started || gameOver) return;

    let id: number;

    const loop = () => {
      setPlayer((p) => {
        let dx = 0;
        let dy = 0;

        if (keys.current.has('w') || keys.current.has('arrowup')) dy -= 1;
        if (keys.current.has('s') || keys.current.has('arrowdown')) dy += 1;
        if (keys.current.has('a') || keys.current.has('arrowleft')) dx -= 1;
        if (keys.current.has('d') || keys.current.has('arrowright')) dx += 1;

        return {
          x: Math.max(0, Math.min(ARENA_WIDTH - PLAYER_SIZE, p.x + dx * SPEED)),
          y: Math.max(0, Math.min(ARENA_HEIGHT - PLAYER_SIZE, p.y + dy * SPEED)),
        };
      });

      setEnemies((prev) =>
        prev.map((e) => {
          let nx = e.x + e.dirX * 1.6;
          let ny = e.y + e.dirY * 1.6;

          if (nx < 0 || nx > ARENA_WIDTH) e.dirX *= -1;
          if (ny < 0 || ny > ARENA_HEIGHT) e.dirY *= -1;

          return { ...e, x: nx, y: ny };
        })
      );

      id = requestAnimationFrame(loop);
    };

    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [started, gameOver]);

  // 💀 Collision
  useEffect(() => {
    enemies.forEach((e) => {
      const d = Math.hypot(player.x - e.x, player.y - e.y);
      if (d < 18) setGameOver(true);
    });
  }, [player, enemies]);

  // 🔫 Shoot
  const shoot = () => {
    setEnemies((prev) => prev.slice(1));
  };

  return (
    <section className="flex flex-col items-center justify-center py-20">
      <h2 className="text-white text-4xl mb-6">CITY RUN</h2>

      <div
        className="relative"
        style={{
          width: ARENA_WIDTH,
          height: ARENA_HEIGHT,
          border: '2px solid red',
        }}
      >
        {/* Player */}
        <motion.div
          style={{
            position: 'absolute',
            width: PLAYER_SIZE,
            height: PLAYER_SIZE,
            background: 'white',
            borderRadius: 4,
            left: player.x,
            top: player.y,
          }}
        />

        {/* Targets */}
        {targets.map((t) => (
          <div
            key={t.id}
            style={{
              position: 'absolute',
              left: t.x,
              top: t.y,
              width: 30,
              height: 30,
              border: '2px solid red',
              borderRadius: '50%',
            }}
          />
        ))}

        {/* Enemies */}
        {enemies.map((e, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: e.x,
              top: e.y,
              width: 14,
              height: 14,
              background: 'red',
              borderRadius: '50%',
            }}
          />
        ))}

        {/* GAME OVER */}
        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black text-white text-3xl">
            GAME OVER
          </div>
        )}
      </div>

      {/* START */}
      {!started && (
        <button
          onClick={() => setStarted(true)}
          className="mt-6 border px-6 py-2 text-white"
        >
          START
        </button>
      )}

      {/* MOBILE CONTROLS */}
      {started && !gameOver && (
        <>
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div />
            <button {...bindBtn('w')}>↑</button>
            <div />
            <button {...bindBtn('a')}>←</button>
            <button {...bindBtn('s')}>↓</button>
            <button {...bindBtn('d')}>→</button>
          </div>

          <button
            onClick={shoot}
            className="mt-4 border px-6 py-2 text-white"
          >
            FIRE
          </button>
        </>
      )}
    </section>
  );
}
