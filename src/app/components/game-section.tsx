import { motion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';

type Portal = {
  id: string;
  label: string;
  targetId: string;
  x: number;
  y: number;
};

const ARENA_WIDTH = 900;
const ARENA_HEIGHT = 520;
const PLAYER_SIZE = 26;
const PLAYER_SPEED = 4.2;
const INTERACTION_DISTANCE = 78;

const portals: Portal[] = [
  { id: 'about-portal', label: 'ABOUT', targetId: 'about', x: 140, y: 110 },
  { id: 'work-portal', label: 'WORK', targetId: 'work', x: 700, y: 180 },
  { id: 'contact-portal', label: 'CONTACT', targetId: 'contact', x: 430, y: 390 },
];

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function distance(ax: number, ay: number, bx: number, by: number) {
  return Math.hypot(ax - bx, ay - by);
}

export function GameSection() {
  const [started, setStarted] = useState(false);
  const [player, setPlayer] = useState({ x: 430, y: 240 });
  const [nearPortalId, setNearPortalId] = useState<string | null>(null);
  const pressedKeys = useRef<Set<string>>(new Set());

  const activePortal = useMemo(
    () => portals.find((p) => p.id === nearPortalId) ?? null,
    [nearPortalId]
  );

  useEffect(() => {
    if (!started) return;

    const onKeyDown = (e: KeyboardEvent) => {
      pressedKeys.current.add(e.key.toLowerCase());

      if (e.key.toLowerCase() === 'e' && activePortal) {
        document.getElementById(activePortal.targetId)?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
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
        let dx = 0;
        let dy = 0;

        if (pressedKeys.current.has('arrowup') || pressedKeys.current.has('w')) dy -= 1;
        if (pressedKeys.current.has('arrowdown') || pressedKeys.current.has('s')) dy += 1;
        if (pressedKeys.current.has('arrowleft') || pressedKeys.current.has('a')) dx -= 1;
        if (pressedKeys.current.has('arrowright') || pressedKeys.current.has('d')) dx += 1;

        if (dx !== 0 && dy !== 0) {
          dx *= 0.7071;
