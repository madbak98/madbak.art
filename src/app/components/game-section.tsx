'use client';

import { motion } from 'motion/react';
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

type Road = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  orientation: 'horizontal' | 'vertical';
};

type Crosswalk = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  orientation: 'horizontal' | 'vertical';
  stripes: number;
};

type StreetLight = {
  id: string;
  x: number;
  y: number;
  color: string;
  duration: number;
  delay: number;
};

type LightTrail = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  axis: 'x' | 'y';
  from: number;
  to: number;
  duration: number;
  delay: number;
  color: string;
};

type AmbientGlow = {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
};

type ArtAccent = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rotate: number;
  radius: string;
  color: string;
  blur: number;
  duration: number;
  delay: number;
};

type BuildingWindow = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  lit: boolean;
  color: string;
  duration: number;
  delay: number;
  minOpacity: number;
  maxOpacity: number;
};

type LeaderboardEntry = {
  username: string;
  kills: number;
  timestamp: number;
};

const WORLD_W = 900;
const WORLD_H = 520;

const PLAYER_SIZE = 22;
const ENEMY_SIZE = 22;
const BULLET_SIZE = 10;

const PLAYER_SPEED = 3;
const BULLET_SPEED = 7.5;
const ENEMY_SPEED = 0.82;
const FIRE_COOLDOWN = 260;
const ENEMY_RESPAWN_DELAY = 1800;
const LEADERBOARD_LIMIT = 10;
const LEADERBOARD_STORAGE_KEY = 'madbak-city-run-top10';
const USERNAME_STORAGE_KEY = 'madbak-city-run-username';

const START_POS: Vec = { x: 240, y: 344 };

const ENEMY_SPAWN_POINTS: Vec[] = [
  { x: 240, y: 18 },
  { x: 240, y: 92 },
  { x: 240, y: 246 },
  { x: 240, y: 428 },
  { x: 642, y: 18 },
  { x: 642, y: 92 },
  { x: 642, y: 246 },
  { x: 642, y: 428 },
  { x: 90, y: 170 },
  { x: 360, y: 170 },
  { x: 520, y: 170 },
  { x: 780, y: 170 },
  { x: 90, y: 344 },
  { x: 360, y: 344 },
  { x: 520, y: 344 },
  { x: 780, y: 344 },
];

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

const roads: Road[] = [
  { id: 'road-h-1', x: 0, y: 156, w: WORLD_W, h: 52, orientation: 'horizontal' },
  { id: 'road-h-2', x: 0, y: 334, w: WORLD_W, h: 52, orientation: 'horizontal' },
  { id: 'road-v-1', x: 230, y: 0, w: 54, h: WORLD_H, orientation: 'vertical' },
  { id: 'road-v-2', x: 616, y: 0, w: 54, h: WORLD_H, orientation: 'vertical' },
];

const crosswalks: Crosswalk[] = [
  { id: 'cw-1', x: 200, y: 160, w: 28, h: 44, orientation: 'vertical', stripes: 5 },
  { id: 'cw-2', x: 286, y: 160, w: 28, h: 44, orientation: 'vertical', stripes: 5 },
  { id: 'cw-3', x: 586, y: 160, w: 28, h: 44, orientation: 'vertical', stripes: 5 },
  { id: 'cw-4', x: 672, y: 160, w: 28, h: 44, orientation: 'vertical', stripes: 5 },
  { id: 'cw-5', x: 236, y: 126, w: 42, h: 24, orientation: 'horizontal', stripes: 4 },
  { id: 'cw-6', x: 236, y: 214, w: 42, h: 24, orientation: 'horizontal', stripes: 4 },
  { id: 'cw-7', x: 622, y: 304, w: 42, h: 24, orientation: 'horizontal', stripes: 4 },
  { id: 'cw-8', x: 622, y: 392, w: 42, h: 24, orientation: 'horizontal', stripes: 4 },
];

const streetLights: StreetLight[] = [
  { id: 'light-1', x: 70, y: 150, color: '#f3dcc1', duration: 2.2, delay: 0.2 },
  { id: 'light-2', x: 190, y: 150, color: '#c7b6a3', duration: 2.8, delay: 0.4 },
  { id: 'light-3', x: 352, y: 150, color: '#f0c7aa', duration: 2.6, delay: 0.6 },
  { id: 'light-4', x: 512, y: 150, color: '#b7c1cf', duration: 2.5, delay: 0.9 },
  { id: 'light-5', x: 742, y: 150, color: '#f3dcc1', duration: 2.3, delay: 1.1 },
  { id: 'light-6', x: 830, y: 150, color: '#d88f73', duration: 3, delay: 1.4 },
  { id: 'light-7', x: 92, y: 388, color: '#b7c1cf', duration: 2.4, delay: 0.5 },
  { id: 'light-8', x: 260, y: 388, color: '#f0c7aa', duration: 2.7, delay: 0.7 },
  { id: 'light-9', x: 438, y: 388, color: '#c7b6a3', duration: 2.9, delay: 1.1 },
  { id: 'light-10', x: 604, y: 388, color: '#f3dcc1', duration: 2.4, delay: 1.5 },
  { id: 'light-11', x: 786, y: 388, color: '#cf7f69', duration: 3.1, delay: 1.8 },
  { id: 'light-12', x: 226, y: 78, color: '#c7b6a3', duration: 2.8, delay: 0.3 },
  { id: 'light-13', x: 226, y: 274, color: '#f0c7aa', duration: 2.5, delay: 0.8 },
  { id: 'light-14', x: 226, y: 460, color: '#d88f73', duration: 3, delay: 1.3 },
  { id: 'light-15', x: 674, y: 102, color: '#f3dcc1', duration: 2.4, delay: 0.5 },
  { id: 'light-16', x: 674, y: 246, color: '#b7c1cf', duration: 2.7, delay: 1.1 },
  { id: 'light-17', x: 674, y: 434, color: '#cf7f69', duration: 3.2, delay: 1.6 },
];

const lightTrails: LightTrail[] = [
  {
    id: 'trail-h-1',
    x: -70,
    y: 171,
    w: 72,
    h: 3,
    axis: 'x',
    from: 0,
    to: WORLD_W + 120,
    duration: 6.8,
    delay: 0.6,
    color: 'rgba(201,182,163,0.78)',
  },
  {
    id: 'trail-h-2',
    x: WORLD_W,
    y: 188,
    w: 66,
    h: 3,
    axis: 'x',
    from: 0,
    to: -(WORLD_W + 160),
    duration: 5.9,
    delay: 1.8,
    color: 'rgba(217,143,115,0.74)',
  },
  {
    id: 'trail-h-3',
    x: -90,
    y: 351,
    w: 80,
    h: 3,
    axis: 'x',
    from: 0,
    to: WORLD_W + 150,
    duration: 7.2,
    delay: 0.2,
    color: 'rgba(242,210,178,0.76)',
  },
  {
    id: 'trail-v-1',
    x: 248,
    y: -70,
    w: 3,
    h: 68,
    axis: 'y',
    from: 0,
    to: WORLD_H + 120,
    duration: 6.4,
    delay: 1,
    color: 'rgba(183,193,207,0.72)',
  },
  {
    id: 'trail-v-2',
    x: 646,
    y: WORLD_H,
    w: 3,
    h: 74,
    axis: 'y',
    from: 0,
    to: -(WORLD_H + 160),
    duration: 7.4,
    delay: 1.6,
    color: 'rgba(207,127,105,0.68)',
  },
];

const ambientGlows: AmbientGlow[] = [
  { id: 'glow-1', x: 34, y: -24, size: 240, color: 'rgba(221,146,115,0.12)', duration: 6.2, delay: 0 },
  { id: 'glow-2', x: 328, y: 18, size: 220, color: 'rgba(242,220,193,0.08)', duration: 7.4, delay: 1.1 },
  { id: 'glow-3', x: 652, y: 286, size: 260, color: 'rgba(183,193,207,0.07)', duration: 8.1, delay: 0.6 },
  { id: 'glow-4', x: 182, y: 336, size: 210, color: 'rgba(207,127,105,0.09)', duration: 6.8, delay: 1.8 },
];

const artAccents: ArtAccent[] = [
  {
    id: 'accent-1',
    x: 84,
    y: 56,
    w: 138,
    h: 56,
    rotate: -9,
    radius: '22px',
    color: 'linear-gradient(135deg, rgba(222,145,112,0.14), rgba(255,255,255,0.02))',
    blur: 0,
    duration: 8,
    delay: 0.3,
  },
  {
    id: 'accent-2',
    x: 720,
    y: 82,
    w: 92,
    h: 92,
    rotate: 18,
    radius: '999px',
    color: 'radial-gradient(circle, rgba(245,223,198,0.12), rgba(245,223,198,0))',
    blur: 0,
    duration: 10,
    delay: 1.4,
  },
  {
    id: 'accent-3',
    x: 336,
    y: 406,
    w: 180,
    h: 42,
    rotate: -5,
    radius: '999px',
    color: 'linear-gradient(90deg, rgba(183,193,207,0.08), rgba(222,145,112,0.14), rgba(255,255,255,0))',
    blur: 0,
    duration: 9.2,
    delay: 0.8,
  },
];

function createInitialEnemies() {
  return ENEMY_SPAWN_POINTS.slice(0, 12).map((spawn, index) => ({
    id: index + 1,
    x: spawn.x,
    y: spawn.y,
    hp: 2,
  }));
}

const INITIAL_ENEMIES: Enemy[] = createInitialEnemies();

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

function sortLeaderboard(entries: LeaderboardEntry[]) {
  return [...entries]
    .sort((a, b) => {
      if (b.kills !== a.kills) return b.kills - a.kills;
      return a.timestamp - b.timestamp;
    })
    .slice(0, LEADERBOARD_LIMIT);
}

function isEnemyRectBlocked(
  rect: { x: number; y: number; w: number; h: number },
  enemies: Enemy[],
  ignoreEnemyId?: number
) {
  const blockedByBuilding = buildings.some((building) => rectsOverlap(rect, building));
  const blockedByTrap = traps.some((trap) => rectsOverlap(rect, trap));
  const blockedByEnemy = enemies.some((enemy) => {
    if (enemy.id === ignoreEnemyId) return false;

    return rectsOverlap(rect, {
      x: enemy.x,
      y: enemy.y,
      w: ENEMY_SIZE,
      h: ENEMY_SIZE,
    });
  });

  return blockedByBuilding || blockedByTrap || blockedByEnemy;
}

function canSpawnEnemyAt(spawn: Vec, enemies: Enemy[], player: Vec) {
  const enemyRect = { x: spawn.x, y: spawn.y, w: ENEMY_SIZE, h: ENEMY_SIZE };

  if (isEnemyRectBlocked(enemyRect, enemies)) return false;

  if (
    destinations.some((destination) =>
      rectsOverlap(enemyRect, {
        x: destination.x,
        y: destination.y,
        w: destination.w,
        h: destination.h,
      })
    )
  ) {
    return false;
  }

  const playerRect = { x: player.x, y: player.y, w: PLAYER_SIZE, h: PLAYER_SIZE };
  if (rectsOverlap(enemyRect, playerRect)) return false;

  const playerCenter = {
    x: player.x + PLAYER_SIZE / 2,
    y: player.y + PLAYER_SIZE / 2,
  };
  const spawnCenter = {
    x: spawn.x + ENEMY_SIZE / 2,
    y: spawn.y + ENEMY_SIZE / 2,
  };

  return distance(playerCenter, spawnCenter) > 132;
}

function getEnemyNextPosition(enemy: Enemy, enemies: Enemy[], player: Vec) {
  const playerCenter = {
    x: player.x + PLAYER_SIZE / 2,
    y: player.y + PLAYER_SIZE / 2,
  };
  const enemyCenter = {
    x: enemy.x + ENEMY_SIZE / 2,
    y: enemy.y + ENEMY_SIZE / 2,
  };
  const angle = Math.atan2(playerCenter.y - enemyCenter.y, playerCenter.x - enemyCenter.x);
  const forwardX = Math.cos(angle);
  const forwardY = Math.sin(angle);
  const sidestepDirection = enemy.id % 2 === 0 ? 1 : -1;

  const rawCandidates = [
    {
      x: enemy.x + forwardX * ENEMY_SPEED,
      y: enemy.y + forwardY * ENEMY_SPEED,
    },
    {
      x: enemy.x + forwardX * ENEMY_SPEED,
      y: enemy.y,
    },
    {
      x: enemy.x,
      y: enemy.y + forwardY * ENEMY_SPEED,
    },
    {
      x: enemy.x + forwardY * ENEMY_SPEED * sidestepDirection,
      y: enemy.y - forwardX * ENEMY_SPEED * sidestepDirection,
    },
    {
      x: enemy.x - forwardY * ENEMY_SPEED * sidestepDirection,
      y: enemy.y + forwardX * ENEMY_SPEED * sidestepDirection,
    },
    {
      x:
        enemy.x +
        forwardX * ENEMY_SPEED * 0.72 +
        forwardY * ENEMY_SPEED * sidestepDirection,
      y:
        enemy.y +
        forwardY * ENEMY_SPEED * 0.72 -
        forwardX * ENEMY_SPEED * sidestepDirection,
    },
    {
      x:
        enemy.x +
        forwardX * ENEMY_SPEED * 0.72 -
        forwardY * ENEMY_SPEED * sidestepDirection,
      y:
        enemy.y +
        forwardY * ENEMY_SPEED * 0.72 +
        forwardX * ENEMY_SPEED * sidestepDirection,
    },
  ];

  for (const candidate of rawCandidates) {
    const nextX = clamp(candidate.x, 0, WORLD_W - ENEMY_SIZE);
    const nextY = clamp(candidate.y, 0, WORLD_H - ENEMY_SIZE);
    const nextRect = { x: nextX, y: nextY, w: ENEMY_SIZE, h: ENEMY_SIZE };

    if (!isEnemyRectBlocked(nextRect, enemies, enemy.id)) {
      return { x: nextX, y: nextY };
    }
  }

  return { x: enemy.x, y: enemy.y };
}

function hasClearShot(from: Vec, to: Vec) {
  const totalDist = distance(from, to);
  const steps = Math.max(1, Math.ceil(totalDist / 8));

  for (let step = 1; step < steps; step += 1) {
    const progress = step / steps;
    const x = from.x + (to.x - from.x) * progress;
    const y = from.y + (to.y - from.y) * progress;
    const probe = { x: x - 2, y: y - 2, w: 4, h: 4 };

    if (buildings.some((building) => rectsOverlap(probe, building))) {
      return false;
    }
  }

  return true;
}

function getBuildingWindows(building: Building, seed: number): BuildingWindow[] {
  const windowW = building.w >= 170 ? 12 : 10;
  const windowH = building.h >= 110 ? 10 : 8;
  const gapX = 8;
  const gapY = 10;
  const cols = Math.max(2, Math.floor((building.w - 24) / (windowW + gapX)));
  const rows = Math.max(2, Math.floor((building.h - 24) / (windowH + gapY)));
  const gridWidth = cols * windowW + (cols - 1) * gapX;
  const gridHeight = rows * windowH + (rows - 1) * gapY;
  const startX = Math.max(10, Math.round((building.w - gridWidth) / 2));
  const startY = Math.max(12, Math.round((building.h - gridHeight) / 2));

  return Array.from({ length: rows * cols }, (_, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    const pattern = (seed * 11 + row * 7 + col * 13) % 8;
    const lit = pattern !== 0 && pattern !== 5;
    const color =
      pattern === 2
        ? 'rgba(183,193,207,0.82)'
        : pattern === 3
          ? 'rgba(217,143,115,0.84)'
          : 'rgba(244,220,193,0.9)';

    return {
      id: `${seed}-${row}-${col}`,
      x: startX + col * (windowW + gapX),
      y: startY + row * (windowH + gapY),
      w: windowW,
      h: windowH,
      lit,
      color,
      duration: 2.8 + ((seed + row + col) % 4) * 0.65,
      delay: ((seed * 0.17 + row * 0.21 + col * 0.13) % 1.8),
      minOpacity: lit ? 0.42 : 0.12,
      maxOpacity: lit ? 0.96 : 0.18,
    };
  });
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
        width: ENEMY_SIZE,
        height: ENEMY_SIZE,
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
  const [enemies, setEnemies] = useState<Enemy[]>(() => createInitialEnemies());
  const [message, setMessage] = useState('Reach ABOUT / WORK / CONTACT');
  const [kills, setKills] = useState(0);
  const [username, setUsername] = useState('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [storageLoaded, setStorageLoaded] = useState(false);

  const keysRef = useRef<Set<string>>(new Set());
  const touchMoveRef = useRef<Set<string>>(new Set());
  const bulletIdRef = useRef(1);
  const arenaRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<Vec>(START_POS);
  const combatTargetRef = useRef<{ x: number; y: number } | null>(null);
  const lastFireRef = useRef(0);
  const startedRef = useRef(false);
  const gameOverRef = useRef(false);
  const facingRef = useRef(0);
  const enemyIdRef = useRef(INITIAL_ENEMIES.length + 1);
  const respawnTimeoutsRef = useRef<number[]>([]);
  const submittedScoreRef = useRef(false);

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
    facingRef.current = facing;
  }, [facing]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const storedUsername = window.localStorage.getItem(USERNAME_STORAGE_KEY);
      if (storedUsername) {
        setUsername(storedUsername);
      }

      const rawLeaderboard = window.localStorage.getItem(LEADERBOARD_STORAGE_KEY);
      if (rawLeaderboard) {
        const parsed = JSON.parse(rawLeaderboard);
        if (Array.isArray(parsed)) {
          const safeEntries = parsed
            .filter((entry): entry is LeaderboardEntry => {
              return (
                typeof entry?.username === 'string' &&
                typeof entry?.kills === 'number' &&
                typeof entry?.timestamp === 'number'
              );
            })
            .map((entry) => ({
              username: entry.username.slice(0, 18),
              kills: Math.max(0, Math.floor(entry.kills)),
              timestamp: entry.timestamp,
            }));

          setLeaderboard(sortLeaderboard(safeEntries));
        }
      }
    } catch {
      setLeaderboard([]);
    } finally {
      setStorageLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!storageLoaded || typeof window === 'undefined') return;
    window.localStorage.setItem(USERNAME_STORAGE_KEY, username);
  }, [username, storageLoaded]);

  useEffect(() => {
    if (!storageLoaded || typeof window === 'undefined') return;
    window.localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(leaderboard));
  }, [leaderboard, storageLoaded]);

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
  const normalizedUsername = username.trim().slice(0, 18);

  const clearRespawnTimers = () => {
    respawnTimeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    respawnTimeoutsRef.current = [];
  };

  useEffect(() => {
    if (gameOver) {
      clearRespawnTimers();
    }
  }, [gameOver]);

  const spawnEnemy = () => {
    setEnemies((prevEnemies) => {
      const playerPosition = playerRef.current;
      const playerCenter = {
        x: playerPosition.x + PLAYER_SIZE / 2,
        y: playerPosition.y + PLAYER_SIZE / 2,
      };

      const spawnCandidates = [...ENEMY_SPAWN_POINTS].sort((a, b) => {
        const aCenter = { x: a.x + ENEMY_SIZE / 2, y: a.y + ENEMY_SIZE / 2 };
        const bCenter = { x: b.x + ENEMY_SIZE / 2, y: b.y + ENEMY_SIZE / 2 };
        return distance(playerCenter, bCenter) - distance(playerCenter, aCenter);
      });

      const safeSpawn =
        spawnCandidates.find((spawn) => canSpawnEnemyAt(spawn, prevEnemies, playerPosition)) ??
        spawnCandidates.find((spawn) => {
          const relaxedRect = { x: spawn.x, y: spawn.y, w: ENEMY_SIZE, h: ENEMY_SIZE };

          if (isEnemyRectBlocked(relaxedRect, prevEnemies)) return false;

          return !rectsOverlap(relaxedRect, {
            x: playerPosition.x,
            y: playerPosition.y,
            w: PLAYER_SIZE,
            h: PLAYER_SIZE,
          });
        });

      if (!safeSpawn) return prevEnemies;

      return [
        ...prevEnemies,
        {
          id: enemyIdRef.current++,
          x: safeSpawn.x,
          y: safeSpawn.y,
          hp: 2,
        },
      ];
    });
  };

  const scheduleEnemyRespawns = (count: number) => {
    for (let respawnIndex = 0; respawnIndex < count; respawnIndex += 1) {
      const timeoutId = window.setTimeout(() => {
        respawnTimeoutsRef.current = respawnTimeoutsRef.current.filter((id) => id !== timeoutId);

        if (!startedRef.current || gameOverRef.current) return;
        spawnEnemy();
      }, ENEMY_RESPAWN_DELAY + respawnIndex * 320);

      respawnTimeoutsRef.current.push(timeoutId);
    }
  };

  const resetRun = () => {
    clearRespawnTimers();
    setGameOver(false);
    setStarted(true);
    setPlayer(START_POS);
    playerRef.current = START_POS;
    setFacing(0);
    facingRef.current = 0;
    setBullets([]);
    setEnemies(createInitialEnemies());
    setMessage('Reach ABOUT / WORK / CONTACT');
    setKills(0);
    touchMoveRef.current.clear();
    keysRef.current.clear();
    lastFireRef.current = 0;
    combatTargetRef.current = null;
    enemyIdRef.current = INITIAL_ENEMIES.length + 1;
    submittedScoreRef.current = false;
  };

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

  useEffect(() => {
    const origin = {
      x: player.x + PLAYER_SIZE / 2,
      y: player.y + PLAYER_SIZE / 2,
    };

    const nearestVisibleEnemy = enemies
      .map((enemy) => {
        const target = {
          x: enemy.x + ENEMY_SIZE / 2,
          y: enemy.y + ENEMY_SIZE / 2,
        };

        return {
          ...target,
          dist: distance(origin, target),
        };
      })
      .filter((enemy) => hasClearShot(origin, { x: enemy.x, y: enemy.y }))
      .sort((a, b) => a.dist - b.dist)[0];

    if (nearestVisibleEnemy) {
      combatTargetRef.current = {
        x: nearestVisibleEnemy.x,
        y: nearestVisibleEnemy.y,
      };
      return;
    }

    if (hasClearShot(origin, { x: centerTarget.x, y: centerTarget.y })) {
      combatTargetRef.current = { x: centerTarget.x, y: centerTarget.y };
      return;
    }

    combatTargetRef.current = null;
  }, [centerTarget, enemies, player]);

  const shootToward = (tx: number, ty: number) => {
    if (!startedRef.current || gameOverRef.current) return;

    const now = Date.now();
    if (now - lastFireRef.current < FIRE_COOLDOWN) return;
    lastFireRef.current = now;

    const p = playerRef.current;
    const cx = p.x + PLAYER_SIZE / 2;
    const cy = p.y + PLAYER_SIZE / 2;
    const angle = Math.atan2(ty - cy, tx - cx);
    const muzzleOffset = PLAYER_SIZE / 2 + 6;
    const spawnX = cx + Math.cos(angle) * muzzleOffset;
    const spawnY = cy + Math.sin(angle) * muzzleOffset;

    setFacing(angle);

    setBullets((prev) => [
      ...prev,
      {
        id: bulletIdRef.current++,
        x: spawnX,
        y: spawnY,
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
    const target = combatTargetRef.current ?? centerTarget;
    shootToward(target.x, target.y);
  };

  useEffect(() => {
    const isTypingField = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;

      const tagName = target.tagName;
      return (
        tagName === 'INPUT' ||
        tagName === 'TEXTAREA' ||
        tagName === 'SELECT' ||
        target.isContentEditable
      );
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (isTypingField(e.target)) {
        return;
      }

      const blocked = [
        'ArrowUp',
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight',
        'Space',
        'KeyW',
        'KeyA',
        'KeyS',
        'KeyD',
      ];

      if (blocked.includes(e.code)) {
        e.preventDefault();
      }

      keysRef.current.add(e.code);

      if (e.code === 'Space') {
        const target = combatTargetRef.current;
        if (target) {
          shootToward(target.x, target.y);
        } else {
          const p = playerRef.current;
          const angle = facingRef.current || 0;
          shootToward(
            p.x + PLAYER_SIZE / 2 + Math.cos(angle) * 220,
            p.y + PLAYER_SIZE / 2 + Math.sin(angle) * 220
          );
        }
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (isTypingField(e.target)) {
        return;
      }

      keysRef.current.delete(e.code);
    };

    window.addEventListener('keydown', onKeyDown, { passive: false });
    window.addEventListener('keyup', onKeyUp);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  useEffect(() => {
    return () => {
      clearRespawnTimers();
    };
  }, []);

  useEffect(() => {
    if (!started || gameOver) return;

    let frame = 0;

    const loop = () => {
      if (!startedRef.current || gameOverRef.current) return;

      setPlayer((prev) => {
        const allKeys = new Set([
          ...Array.from(keysRef.current),
          ...Array.from(touchMoveRef.current),
        ]);

        let dx = 0;
        let dy = 0;

        if (allKeys.has('KeyW') || allKeys.has('ArrowUp')) dy -= 1;
        if (allKeys.has('KeyS') || allKeys.has('ArrowDown')) dy += 1;
        if (allKeys.has('KeyA') || allKeys.has('ArrowLeft')) dx -= 1;
        if (allKeys.has('KeyD') || allKeys.has('ArrowRight')) dx += 1;

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

      setBullets((prev) =>
        prev
          .map((b) => ({
            ...b,
            x: b.x + b.vx,
            y: b.y + b.vy,
          }))
          .filter((b) => {
            if (b.x < -20 || b.x > WORLD_W + 20 || b.y < -20 || b.y > WORLD_H + 20) {
              return false;
            }

            const bulletRect = {
              x: b.x - BULLET_SIZE / 2,
              y: b.y - BULLET_SIZE / 2,
              w: BULLET_SIZE,
              h: BULLET_SIZE,
            };

            if (buildings.some((bld) => rectsOverlap(bulletRect, bld))) return false;

            return true;
          })
      );

      setEnemies((prev) =>
        prev.map((enemy) => {
          const nextPosition = getEnemyNextPosition(enemy, prev, playerRef.current);
          return { ...enemy, x: nextPosition.x, y: nextPosition.y };
        })
      );

      frame = requestAnimationFrame(loop);
    };

    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [started, gameOver]);

  useEffect(() => {
    if (!started || gameOver || bullets.length === 0 || enemies.length === 0) return;

    const bulletsToRemove = new Set<number>();
    const nextEnemies = enemies.map((enemy) => ({ ...enemy }));
    let defeatedEnemies = 0;

    for (const bullet of bullets) {
      const hitIndex = nextEnemies.findIndex((enemy) => {
        return (
          distance(
            { x: bullet.x, y: bullet.y },
            { x: enemy.x + ENEMY_SIZE / 2, y: enemy.y + ENEMY_SIZE / 2 }
          ) < 14
        );
      });

      if (hitIndex !== -1) {
        nextEnemies[hitIndex].hp -= 1;
        bulletsToRemove.add(bullet.id);

        if (nextEnemies[hitIndex].hp <= 0) {
          defeatedEnemies += 1;
        }
      }
    }

    if (defeatedEnemies > 0) {
      setKills((prevKills) => prevKills + defeatedEnemies);
      scheduleEnemyRespawns(defeatedEnemies);
      setMessage(defeatedEnemies > 1 ? 'Multiple targets down' : 'Target down');
    }

    if (bulletsToRemove.size > 0) {
      setBullets((prevBullets) =>
        prevBullets.filter((bullet) => !bulletsToRemove.has(bullet.id))
      );
      setEnemies(nextEnemies.filter((enemy) => enemy.hp > 0));
    }
  }, [bullets, enemies, started, gameOver]);

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
      const playerCenter = {
        x: player.x + PLAYER_SIZE / 2,
        y: player.y + PLAYER_SIZE / 2,
      };
      const enemyCenter = {
        x: enemy.x + ENEMY_SIZE / 2,
        y: enemy.y + ENEMY_SIZE / 2,
      };

      if (distance(playerCenter, enemyCenter) < 18) {
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

  useEffect(() => {
    if (!gameOver || submittedScoreRef.current || kills <= 0) return;

    submittedScoreRef.current = true;
    setLeaderboard((prevEntries) =>
      sortLeaderboard([
        ...prevEntries,
        {
          username: normalizedUsername || 'GUEST',
          kills,
          timestamp: Date.now(),
        },
      ])
    );
  }, [gameOver, kills, normalizedUsername]);

  const restart = () => {
    resetRun();
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
            MAKE IT COUNT
          </h2>

          <p
            className="mx-auto max-w-2xl text-[11px] sm:text-sm tracking-[0.12em] uppercase"
            style={{
              fontFamily: 'var(--font-body)',
              color: 'rgba(245,245,245,0.58)',
            }}
          >
            DON'T MISS
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
            onPointerDown={(e) => shootByPointer(e.clientX, e.clientY)}
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
              touchAction: 'none',
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(circle at 18% 12%, rgba(222,145,112,0.16), transparent 30%), radial-gradient(circle at 82% 18%, rgba(242,220,193,0.1), transparent 28%), linear-gradient(180deg, rgba(22,18,18,1) 0%, rgba(14,12,12,1) 100%)',
              }}
            />

            {artAccents.map((accent) => (
              <motion.div
                key={accent.id}
                className="absolute"
                animate={{
                  y: [0, -10, 4, 0],
                  rotate: [accent.rotate, accent.rotate + 2, accent.rotate - 1, accent.rotate],
                  opacity: [0.64, 0.9, 0.72],
                }}
                transition={{
                  duration: accent.duration,
                  delay: accent.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{
                  left: accent.x,
                  top: accent.y,
                  width: accent.w,
                  height: accent.h,
                  borderRadius: accent.radius,
                  background: accent.color,
                  filter: accent.blur ? `blur(${accent.blur}px)` : undefined,
                  pointerEvents: 'none',
                }}
              />
            ))}

            {ambientGlows.map((glow) => (
              <motion.div
                key={glow.id}
                className="absolute rounded-full"
                animate={{
                  opacity: [0.22, 0.52, 0.28],
                  scale: [1, 1.08, 0.96],
                }}
                transition={{
                  duration: glow.duration,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: glow.delay,
                }}
                style={{
                  left: glow.x,
                  top: glow.y,
                  width: glow.size,
                  height: glow.size,
                  background: glow.color,
                  filter: 'blur(42px)',
                  pointerEvents: 'none',
                }}
              />
            ))}

            <motion.div
              className="absolute left-0 w-full"
              animate={{ y: [-160, WORLD_H + 80] }}
              transition={{ duration: 11, repeat: Infinity, ease: 'linear' }}
              style={{
                top: 0,
                height: 130,
                background:
                  'linear-gradient(180deg, rgba(244,220,193,0) 0%, rgba(244,220,193,0.06) 46%, rgba(244,220,193,0) 100%)',
                pointerEvents: 'none',
                mixBlendMode: 'soft-light',
              }}
            />

            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(90deg, rgba(255,255,255,0.018) 0 1px, transparent 1px 118px),
                  repeating-linear-gradient(180deg, rgba(255,255,255,0.012) 0 1px, transparent 1px 86px),
                  linear-gradient(120deg, rgba(255,255,255,0.03), transparent 26%, transparent 74%, rgba(222,145,112,0.04))
                `,
                opacity: 0.55,
              }}
            />

            {roads.map((road) => (
              <div
                key={road.id}
                className="absolute overflow-hidden"
                style={{
                  left: road.x,
                  top: road.y,
                  width: road.w,
                  height: road.h,
                  background:
                    road.orientation === 'horizontal'
                      ? 'linear-gradient(180deg, rgba(48,41,38,0.92) 0%, rgba(28,24,23,0.98) 50%, rgba(48,41,38,0.92) 100%)'
                      : 'linear-gradient(90deg, rgba(48,41,38,0.92) 0%, rgba(28,24,23,0.98) 50%, rgba(48,41,38,0.92) 100%)',
                  border: '1px solid rgba(244,220,193,0.06)',
                  boxShadow:
                    'inset 0 0 26px rgba(0,0,0,0.26), inset 0 0 0 1px rgba(255,255,255,0.01)',
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      road.orientation === 'horizontal'
                        ? 'linear-gradient(180deg, rgba(222,145,112,0.08), transparent 24%, transparent 76%, rgba(242,220,193,0.05))'
                        : 'linear-gradient(90deg, rgba(222,145,112,0.08), transparent 24%, transparent 76%, rgba(242,220,193,0.05))',
                  }}
                />
                <div
                  className="absolute"
                  style={{
                    left: road.orientation === 'horizontal' ? 0 : road.w / 2 - 1,
                    top: road.orientation === 'horizontal' ? road.h / 2 - 1 : 0,
                    width: road.orientation === 'horizontal' ? road.w : 2,
                    height: road.orientation === 'horizontal' ? 2 : road.h,
                    backgroundImage:
                      road.orientation === 'horizontal'
                        ? 'repeating-linear-gradient(90deg, rgba(242,220,193,0.38) 0 18px, transparent 18px 42px)'
                        : 'repeating-linear-gradient(180deg, rgba(242,220,193,0.38) 0 18px, transparent 18px 42px)',
                    opacity: 0.56,
                  }}
                />
                <div
                  className="absolute"
                  style={{
                    left: road.orientation === 'horizontal' ? 0 : 6,
                    top: road.orientation === 'horizontal' ? 8 : 0,
                    width: road.orientation === 'horizontal' ? road.w : 1,
                    height: road.orientation === 'horizontal' ? 1 : road.h,
                    background: 'rgba(244,220,193,0.08)',
                  }}
                />
                <div
                  className="absolute"
                  style={{
                    right: road.orientation === 'horizontal' ? 0 : 6,
                    bottom: road.orientation === 'horizontal' ? 8 : 0,
                    width: road.orientation === 'horizontal' ? road.w : 1,
                    height: road.orientation === 'horizontal' ? 1 : road.h,
                    background: 'rgba(201,182,163,0.06)',
                  }}
                />
              </div>
            ))}

            {crosswalks.map((crosswalk) => (
              <div
                key={crosswalk.id}
                className="absolute flex items-center justify-between"
                style={{
                  left: crosswalk.x,
                  top: crosswalk.y,
                  width: crosswalk.w,
                  height: crosswalk.h,
                  flexDirection:
                    crosswalk.orientation === 'horizontal' ? 'row' : 'column',
                  opacity: 0.44,
                }}
              >
                {Array.from({ length: crosswalk.stripes }, (_, stripeIndex) => (
                  <div
                    key={stripeIndex}
                    style={{
                      width: crosswalk.orientation === 'horizontal' ? 6 : crosswalk.w,
                      height: crosswalk.orientation === 'horizontal' ? crosswalk.h : 5,
                      borderRadius: '999px',
                      background: 'rgba(245,226,205,0.38)',
                      boxShadow: '0 0 8px rgba(245,226,205,0.05)',
                    }}
                  />
                ))}
              </div>
            ))}

            {lightTrails.map((trail) => (
              <motion.div
                key={trail.id}
                className="absolute"
                animate={trail.axis === 'x' ? { x: trail.to } : { y: trail.to }}
                initial={trail.axis === 'x' ? { x: trail.from } : { y: trail.from }}
                transition={{
                  duration: trail.duration,
                  delay: trail.delay,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                style={{
                  left: trail.x,
                  top: trail.y,
                  width: trail.w,
                  height: trail.h,
                  borderRadius: '999px',
                  background:
                    trail.axis === 'x'
                      ? `linear-gradient(90deg, rgba(255,255,255,0), ${trail.color}, rgba(255,255,255,0))`
                      : `linear-gradient(180deg, rgba(255,255,255,0), ${trail.color}, rgba(255,255,255,0))`,
                  boxShadow: `0 0 10px ${trail.color}`,
                  opacity: 0.72,
                  pointerEvents: 'none',
                }}
              />
            ))}

            {streetLights.map((light) => (
              <div
                key={light.id}
                className="absolute"
                style={{
                  left: light.x,
                  top: light.y,
                  width: 10,
                  height: 10,
                  pointerEvents: 'none',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: 4,
                    top: 8,
                    width: 2,
                    height: 16,
                    background: 'rgba(245,226,205,0.12)',
                  }}
                />
                <motion.div
                  animate={{
                    opacity: [0.45, 0.95, 0.55],
                    scale: [0.94, 1.08, 1],
                  }}
                  transition={{
                    duration: light.duration,
                    delay: light.delay,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '999px',
                    background: light.color,
                    boxShadow: `0 0 12px ${light.color}, 0 0 24px ${light.color}`,
                  }}
                />
              </div>
            ))}

            {buildings.map((b, i) => {
              const windows = getBuildingWindows(b, i + 1);

              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: b.x,
                    top: b.y,
                    width: b.w,
                    height: b.h,
                    background:
                      'linear-gradient(180deg, rgba(58,49,45,0.84) 0%, rgba(23,19,18,0.96) 100%)',
                    border: '1px solid rgba(242,220,193,0.1)',
                    boxShadow:
                      'inset 0 0 0 1px rgba(255,255,255,0.025), 0 14px 24px rgba(0,0,0,0.18)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 8,
                      border: '1px solid rgba(255,255,255,0.04)',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: '100%',
                      height: 14,
                      background:
                        'linear-gradient(90deg, rgba(217,143,115,0.18), rgba(244,220,193,0.08), rgba(183,193,207,0.12))',
                    }}
                  />
                  {windows.map((window) => (
                    <motion.div
                      key={window.id}
                      animate={
                        window.lit
                          ? {
                              opacity: [
                                window.minOpacity,
                                window.maxOpacity,
                                window.minOpacity + 0.08,
                              ],
                            }
                          : undefined
                      }
                      transition={
                        window.lit
                          ? {
                              duration: window.duration,
                              delay: window.delay,
                              repeat: Infinity,
                              ease: 'easeInOut',
                            }
                          : undefined
                      }
                      style={{
                        position: 'absolute',
                        left: window.x,
                        top: window.y,
                        width: window.w,
                        height: window.h,
                        borderRadius: '2px',
                        background: window.lit ? window.color : 'rgba(255,255,255,0.08)',
                        boxShadow: window.lit ? `0 0 10px ${window.color}` : 'none',
                        opacity: window.lit ? window.minOpacity : 0.16,
                      }}
                    />
                  ))}
                </div>
              );
            })}

            {destinations.map((d) => (
              <div
                key={d.id}
                style={{
                  position: 'absolute',
                  left: d.x,
                  top: d.y,
                  width: d.w,
                  height: d.h,
                  border: '1px solid rgba(255,74,74,0.9)',
                  background: 'rgba(255,74,74,0.07)',
                  boxShadow: '0 0 16px rgba(255,74,74,0.16)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
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

            {traps.map((t, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: t.x,
                  top: t.y,
                  width: t.w,
                  height: t.h,
                  background:
                    t.w > t.h
                      ? 'linear-gradient(90deg, rgba(255,0,0,0.08), rgba(255,0,0,0.52), rgba(255,0,0,0.08))'
                      : 'linear-gradient(180deg, rgba(255,0,0,0.08), rgba(255,0,0,0.52), rgba(255,0,0,0.08))',
                  border: '1px solid rgba(255,0,0,0.8)',
                  boxShadow: '0 0 10px rgba(255,0,0,0.24)',
                }}
              />
            ))}

            {bullets.map((b) => (
              <div
                key={b.id}
                style={{
                  position: 'absolute',
                  left: b.x - BULLET_SIZE / 2,
                  top: b.y - BULLET_SIZE / 2,
                  width: BULLET_SIZE,
                  height: BULLET_SIZE,
                  borderRadius: '999px',
                  background: '#f5f5f5',
                  boxShadow: '0 0 8px rgba(255,255,255,0.5)',
                }}
              />
            ))}

            {enemies.map((e) => (
              <Beast key={e.id} x={e.x} y={e.y} />
            ))}

            <Character x={player.x} y={player.y} facing={facing} />

            <div
              className="absolute left-4 top-4 px-4 py-3"
              style={{
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(10,10,10,0.68)',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.18em',
                  color: '#ff4a4a',
                  textTransform: 'uppercase',
                }}
              >
                Status
              </div>
              <div
                className="mt-1"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.16em',
                  color: 'rgba(245,245,245,0.56)',
                  textTransform: 'uppercase',
                }}
              >
                {message}
              </div>
              <div
                className="mt-1"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.16em',
                  color: 'rgba(255,74,74,0.7)',
                  textTransform: 'uppercase',
                }}
              >
                Enemies: {enemies.length}
              </div>
              <div
                className="mt-1"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  letterSpacing: '0.16em',
                  color: 'rgba(245,226,205,0.7)',
                  textTransform: 'uppercase',
                }}
              >
                Kills: {kills}
              </div>
            </div>

            {!started && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/72 backdrop-blur-[2px]">
                <div className="w-full max-w-[420px] text-center px-6">
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'clamp(1.4rem, 4vw, 2.2rem)',
                      fontWeight: 800,
                      color: '#F5F5F5',
                    }}
                  >
                    ENTER THE CITY
                  </div>
                  <p
                    className="mb-3 uppercase"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      color: 'rgba(245,245,245,0.58)',
                      fontSize: '10px',
                      letterSpacing: '0.18em',
                    }}
                  >
                    Desktop: WASD + click to shoot
                  </p>
                  <p
                    className="mb-6 uppercase"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      color: 'rgba(245,245,245,0.42)',
                      fontSize: '10px',
                      letterSpacing: '0.18em',
                    }}
                  >
                    Phone / iPad: touch controls
                  </p>
                  <div className="mb-5">
                    <label
                      htmlFor="city-run-username"
                      className="mb-2 block uppercase"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        color: 'rgba(245,245,245,0.52)',
                        fontSize: '10px',
                        letterSpacing: '0.18em',
                      }}
                    >
                      choose your username for top 10
                    </label>
                    <input
                      id="city-run-username"
                      autoFocus
                      value={username}
                      maxLength={18}
                      onChange={(event) => setUsername(event.target.value.slice(0, 18))}
                      placeholder="MADBAK"
                      className="w-full"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.14)',
                        color: '#F5F5F5',
                        padding: '12px 14px',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        outline: 'none',
                      }}
                    />
                  </div>
                  <button
                    disabled={!normalizedUsername}
                    onClick={resetRun}
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.85rem',
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      border: '2px solid #ff4a4a',
                      color: '#F5F5F5',
                      background: normalizedUsername ? 'transparent' : 'rgba(255,255,255,0.06)',
                      cursor: normalizedUsername ? 'pointer' : 'not-allowed',
                      opacity: normalizedUsername ? 1 : 0.58,
                      padding: '12px 26px',
                    }}
                  >
                    Start
                  </button>
                </div>
              </div>
            )}

            {gameOver && (
              <div
                onClick={restart}
                className="absolute inset-0 flex items-center justify-center bg-black/86"
                style={{ cursor: 'pointer' }}
              >
                <div className="text-center px-6">
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'clamp(2rem, 6vw, 3.4rem)',
                      color: '#F5F5F5',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Game Over
                  </div>
                  <div
                    className="mt-3"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      letterSpacing: '0.18em',
                      color: 'rgba(255,74,74,0.82)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {normalizedUsername || 'Guest'} • {kills} Kills
                  </div>
                  <div
                    className="mt-3"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      letterSpacing: '0.18em',
                      color: 'rgba(245,245,245,0.52)',
                      textTransform: 'uppercase',
                    }}
                  >
                    Tap to restart
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          className={`mt-5 grid gap-4 ${
            isPhone || isTablet ? 'grid-cols-1' : 'grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]'
          }`}
        >
          <div
            className="px-4 py-4"
            style={{
              border: '1px solid rgba(255,255,255,0.12)',
              background:
                'linear-gradient(180deg, rgba(18,18,18,0.82) 0%, rgba(10,10,10,0.72) 100%)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#ff4a4a',
              }}
            >
              Current Run
            </div>
            <div
              className="mt-2"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.2rem, 2.2vw, 1.8rem)',
                color: '#F5F5F5',
              }}
            >
              {normalizedUsername || 'Choose a username'}
            </div>
            <div
              className="mt-3 grid grid-cols-2 gap-3"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'rgba(245,245,245,0.62)',
              }}
            >
              <div>Kills: {kills}</div>
              <div>Live enemies: {enemies.length}</div>
              <div>Respawn: {started && !gameOver ? 'active' : 'standby'}</div>
              <div>Top list: local top 10</div>
            </div>
          </div>

          <div
            className="px-4 py-4"
            style={{
              border: '1px solid rgba(255,255,255,0.12)',
              background:
                'linear-gradient(180deg, rgba(18,18,18,0.82) 0%, rgba(10,10,10,0.72) 100%)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#ff4a4a',
              }}
            >
              Top 10 Hunters
            </div>
            <div className="mt-3 space-y-2">
              {leaderboard.length > 0 ? (
                leaderboard.map((entry, index) => (
                  <div
                    key={`${entry.username}-${entry.timestamp}-${index}`}
                    className="flex items-center justify-between gap-3"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: index < 3 ? '#F5F5F5' : 'rgba(245,245,245,0.68)',
                    }}
                  >
                    <span>
                      {String(index + 1).padStart(2, '0')} • {entry.username}
                    </span>
                    <span style={{ color: index < 3 ? '#ff4a4a' : 'rgba(255,74,74,0.78)' }}>
                      {entry.kills}
                    </span>
                  </div>
                ))
              ) : (
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: 'rgba(245,245,245,0.48)',
                  }}
                >
                  No scores yet. Start a run and take down beasts.
                </div>
              )}
            </div>
          </div>
        </div>

        {(isPhone || isTablet) && started && !gameOver && (
          <div
            className={`mt-4 flex ${
              isLandscapeMobile
                ? 'flex-row items-end justify-between gap-4'
                : 'flex-col items-center gap-4'
            }`}
          >
            <div
              className={`grid grid-cols-3 select-none ${
                isTablet ? 'gap-3 w-[240px]' : 'gap-3 w-[210px]'
              }`}
            >
              <div />
              <button
                type="button"
                {...bindMoveBtn('KeyW')}
                style={{
                  touchAction: 'none',
                  WebkitUserSelect: 'none',
                  userSelect: 'none',
                  border: '1px solid rgba(255,74,74,0.45)',
                  background: 'rgba(10,10,10,0.78)',
                  color: '#F5F5F5',
                  fontSize: isTablet ? '1.3rem' : '1.2rem',
                  height: isTablet ? '64px' : '56px',
                }}
              >
                Up
              </button>
              <div />
              <button
                type="button"
                {...bindMoveBtn('KeyA')}
                style={{
                  touchAction: 'none',
                  WebkitUserSelect: 'none',
                  userSelect: 'none',
                  border: '1px solid rgba(255,74,74,0.45)',
                  background: 'rgba(10,10,10,0.78)',
                  color: '#F5F5F5',
                  fontSize: isTablet ? '1.3rem' : '1.2rem',
                  height: isTablet ? '64px' : '56px',
                }}
              >
                Left
              </button>
              <button
                type="button"
                {...bindMoveBtn('KeyS')}
                style={{
                  touchAction: 'none',
                  WebkitUserSelect: 'none',
                  userSelect: 'none',
                  border: '1px solid rgba(255,74,74,0.45)',
                  background: 'rgba(10,10,10,0.78)',
                  color: '#F5F5F5',
                  fontSize: isTablet ? '1.3rem' : '1.2rem',
                  height: isTablet ? '64px' : '56px',
                }}
              >
                Down
              </button>
              <button
                type="button"
                {...bindMoveBtn('KeyD')}
                style={{
                  touchAction: 'none',
                  WebkitUserSelect: 'none',
                  userSelect: 'none',
                  border: '1px solid rgba(255,74,74,0.45)',
                  background: 'rgba(10,10,10,0.78)',
                  color: '#F5F5F5',
                  fontSize: isTablet ? '1.3rem' : '1.2rem',
                  height: isTablet ? '64px' : '56px',
                }}
              >
                Right
              </button>
            </div>

            <div className={`flex ${isLandscapeMobile ? 'flex-col gap-3' : 'flex-row gap-3'}`}>
              <button
                type="button"
                onClick={shootNearestTarget}
                style={{
                  touchAction: 'manipulation',
                  border: '2px solid #ff4a4a',
                  background: 'rgba(255,74,74,0.08)',
                  color: '#F5F5F5',
                  fontFamily: 'var(--font-body)',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  fontSize: isTablet ? '1rem' : '0.9rem',
                  padding: isTablet ? '18px 34px' : '16px 28px',
                }}
              >
                Fire
              </button>
              <button
                type="button"
                onClick={() => openSection(centerTarget.targetId)}
                style={{
                  touchAction: 'manipulation',
                  border: '2px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.04)',
                  color: '#F5F5F5',
                  fontFamily: 'var(--font-body)',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  fontSize: isTablet ? '1rem' : '0.9rem',
                  padding: isTablet ? '18px 34px' : '16px 28px',
                }}
              >
                Enter
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
