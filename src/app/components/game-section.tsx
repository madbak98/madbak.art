import { useEffect, useRef, useState } from 'react';

const W = 900;
const H = 520;

const PLAYER_SIZE = 20;
const SPEED = 3.5;

const targets = [
  { id: 'about', x: 80, y: 80 },
  { id: 'work', x: 700, y: 100 },
  { id: 'contact', x: 400, y: 420 },
];

const traps = [
  { x: 200, y: 200 },
  { x: 500, y: 300 },
  { x: 300, y: 120 },
];

function distance(a: any, b: any) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function GameSection() {
  const [player, setPlayer] = useState({ x: 400, y: 250 });
  const [bullets, setBullets] = useState<any[]>([]);
  const [enemies, setEnemies] = useState([
    { x: 300, y: 200 },
    { x: 600, y: 350 },
  ]);
  const [gameOver, setGameOver] = useState(false);

  const keys = useRef<Set<string>>(new Set());

  // 🎮 Movement
  useEffect(() => {
    const down = (e: any) => keys.current.add(e.key.toLowerCase());
    const up = (e: any) => keys.current.delete(e.key.toLowerCase());

    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);

    let frame: any;

    const loop = () => {
      setPlayer((p) => {
        let dx = 0;
        let dy = 0;

        if (keys.current.has('w')) dy -= 1;
        if (keys.current.has('s')) dy += 1;
        if (keys.current.has('a')) dx -= 1;
        if (keys.current.has('d')) dx += 1;

        const nx = Math.max(0, Math.min(W - PLAYER_SIZE, p.x + dx * SPEED));
        const ny = Math.max(0, Math.min(H - PLAYER_SIZE, p.y + dy * SPEED));

        return { x: nx, y: ny };
      });

      frame = requestAnimationFrame(loop);
    };

    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []);

  // 🔫 Shoot
  const shoot = (e: any) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const tx = ((e.clientX - rect.left) / rect.width) * W;
    const ty = ((e.clientY - rect.top) / rect.height) * H;

    const angle = Math.atan2(ty - player.y, tx - player.x);

    setBullets((b) => [
      ...b,
      {
        x: player.x,
        y: player.y,
        vx: Math.cos(angle) * 6,
        vy: Math.sin(angle) * 6,
      },
    ]);
  };

  // 🔁 Update bullets + enemies
  useEffect(() => {
    let frame: any;

    const loop = () => {
      setBullets((bs) =>
        bs.map((b) => ({
          ...b,
          x: b.x + b.vx,
          y: b.y + b.vy,
        }))
      );

      setEnemies((es) =>
        es.map((e) => {
          const angle = Math.atan2(player.y - e.y, player.x - e.x);
          return {
            x: e.x + Math.cos(angle) * 1.2,
            y: e.y + Math.sin(angle) * 1.2,
          };
        })
      );

      frame = requestAnimationFrame(loop);
    };

    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [player]);

  // 💀 Collision
  useEffect(() => {
    // trap
    for (const t of traps) {
      if (distance(player, t) < 20) {
        setGameOver(true);
      }
    }

    // enemy
    for (const e of enemies) {
      if (distance(player, e) < 20) {
        setGameOver(true);
      }
    }

    // target
    for (const t of targets) {
      if (distance(player, t) < 30) {
        document.getElementById(t.id)?.scrollIntoView({
          behavior: 'smooth',
        });
      }
    }
  }, [player, enemies]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div
        onClick={shoot}
        style={{
          width: W,
          height: H,
          position: 'relative',
          border: '2px solid red',
          overflow: 'hidden',
        }}
      >
        {/* PLAYER */}
        <div
          style={{
            position: 'absolute',
            left: player.x,
            top: player.y,
            width: PLAYER_SIZE,
            height: PLAYER_SIZE,
            background: 'white',
          }}
        />

        {/* TARGETS */}
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
            }}
          />
        ))}

        {/* TRAPS */}
        {traps.map((t, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: t.x,
              top: t.y,
              width: 20,
              height: 20,
              background: 'purple',
            }}
          />
        ))}

        {/* ENEMIES */}
        {enemies.map((e, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: e.x,
              top: e.y,
              width: 20,
              height: 20,
              background: 'red',
            }}
          />
        ))}

        {/* BULLETS */}
        {bullets.map((b, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: b.x,
              top: b.y,
              width: 6,
              height: 6,
              background: 'yellow',
            }}
          />
        ))}

        {gameOver && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'black',
              color: 'white',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 40,
              fontFamily: 'monospace',
            }}
          >
            GAME OVER
          </div>
        )}
      </div>
    </div>
  );
}