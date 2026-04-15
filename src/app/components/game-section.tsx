import { motion, useScroll, useTransform } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';

const GRID_SIZE = 5;
const ROUND_MS = 900;
const MAX_ROUNDS = 12;
const LEADERBOARD_KEY = 'madbak-mini-game-leaderboard-v1';
const MAX_LEADERBOARD_ITEMS = 8;

type LeaderboardEntry = {
  username: string;
  score: number;
  finishMs: number;
  playedAt: string;
};

function randomIndex(exclude: number) {
  let next = Math.floor(Math.random() * GRID_SIZE * GRID_SIZE);
  while (next === exclude) {
    next = Math.floor(Math.random() * GRID_SIZE * GRID_SIZE);
  }
  return next;
}

export function GameSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.18, 0.82, 1], [0, 1, 1, 0.4]);
  const y = useTransform(scrollYProgress, [0, 0.18, 0.82, 1], [60, 0, 0, -40]);
  const backgroundWordY = useTransform(scrollYProgress, [0, 1], [80, -40]);

  const [active, setActive] = useState(0);
  const [score, setScore] = useState(0);
  /** Moles finished (hit or miss); game ends at MAX_ROUNDS. */
  const [completedRounds, setCompletedRounds] = useState(0);
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [roundTimeLeftMs, setRoundTimeLeftMs] = useState(ROUND_MS);
  const [finishMs, setFinishMs] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [phase, setPhase] = useState<'idle' | 'playing' | 'done'>('idle');
  const sessionStartRef = useRef(0);
  const roundDeadlineRef = useRef(0);
  const hasSavedScoreRef = useRef(false);

  const saveLeaderboard = useCallback((entries: LeaderboardEntry[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as LeaderboardEntry[];
      if (Array.isArray(parsed)) setLeaderboard(parsed);
    } catch {
      localStorage.removeItem(LEADERBOARD_KEY);
    }
  }, []);

  const advance = useCallback((hit: boolean) => {
    if (hit) setScore((s) => s + 1);
    setCompletedRounds((c) => {
      const next = c + 1;
      if (next >= MAX_ROUNDS) {
        setPhase('done');
        setRoundTimeLeftMs(0);
        setFinishMs(Math.round(performance.now() - sessionStartRef.current));
        return MAX_ROUNDS;
      }
      setActive((prev) => randomIndex(prev));
      roundDeadlineRef.current = performance.now() + ROUND_MS;
      setRoundTimeLeftMs(ROUND_MS);
      return next;
    });
  }, []);

  const startGame = useCallback(() => {
    const trimmedName = username.trim();
    if (!trimmedName) {
      setUsernameError('Enter a username first.');
      return;
    }
    setUsername(trimmedName);
    setUsernameError('');
    setScore(0);
    setCompletedRounds(0);
    setPhase('playing');
    setActive(randomIndex(-1));
    setFinishMs(0);
    sessionStartRef.current = performance.now();
    roundDeadlineRef.current = sessionStartRef.current + ROUND_MS;
    setRoundTimeLeftMs(ROUND_MS);
    hasSavedScoreRef.current = false;
  }, [username]);

  useEffect(() => {
    if (phase !== 'playing' || completedRounds >= MAX_ROUNDS) return;
    const id = window.setTimeout(() => advance(false), ROUND_MS);
    return () => window.clearTimeout(id);
  }, [phase, active, completedRounds, advance]);

  useEffect(() => {
    if (phase !== 'playing') return;
    const id = window.setInterval(() => {
      setRoundTimeLeftMs(Math.max(0, Math.round(roundDeadlineRef.current - performance.now())));
    }, 33);
    return () => window.clearInterval(id);
  }, [phase, active]);

  useEffect(() => {
    if (phase !== 'done' || hasSavedScoreRef.current) return;
    const trimmedName = username.trim();
    if (!trimmedName) return;
    const entry: LeaderboardEntry = {
      username: trimmedName,
      score,
      finishMs,
      playedAt: new Date().toISOString(),
    };
    const next = [...leaderboard, entry]
      .sort((a, b) => b.score - a.score || a.finishMs - b.finishMs)
      .slice(0, MAX_LEADERBOARD_ITEMS);
    setLeaderboard(next);
    saveLeaderboard(next);
    hasSavedScoreRef.current = true;
  }, [phase, username, score, finishMs, leaderboard, saveLeaderboard]);

  const handleCellClick = (index: number) => {
    if (phase !== 'playing') return;
    if (index !== active) return;
    advance(true);
  };

  return (
    <section
      id="game"
      ref={ref}
      className="relative -mt-2 min-h-[82vh] px-6 py-20 sm:px-10 lg:px-14"
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-10 overflow-hidden"
        style={{ y: backgroundWordY }}
      >
        <div
          className="whitespace-nowrap"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(6rem, 20vw, 18rem)',
            fontWeight: 800,
            letterSpacing: '-0.08em',
            lineHeight: 0.8,
            color: 'rgba(var(--foreground-rgb), 0.035)',
            textTransform: 'uppercase',
          }}
        >
          Play Play Play
        </div>
      </motion.div>

      <motion.div
        className="relative z-10 mx-auto max-w-7xl"
        style={{ opacity, y }}
      >
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <div
              className="mb-7 inline-flex items-center gap-4"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: 'var(--accent-green)',
              }}
            >
              <span
                className="h-px w-12"
                style={{ background: 'rgba(var(--secondary-element-rgb), 0.9)' }}
              />
              [000] MINI GAME
            </div>

            <h2
              className="heading-glitch"
              data-text="Tap Targets"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(4.5rem, 10vw, 8.5rem)',
                fontWeight: 800,
                letterSpacing: '-0.06em',
                lineHeight: 0.82,
                textTransform: 'uppercase',
                color: 'var(--main-element)',
              }}
            >
              Tap
              <br />
              Targets
            </h2>

            <p
              className="mt-8 max-w-sm text-[0.98rem] leading-[1.7]"
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 300,
                letterSpacing: '0.06em',
                color: 'rgba(var(--foreground-rgb), 0.58)',
              }}
            >
              Hit the glowing cell before the round advances. Twelve rounds — how many can you
              catch?
            </p>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <div
              className="border p-6 sm:p-8"
              style={{
                borderColor: 'rgba(var(--foreground-rgb), 0.12)',
                background: 'rgba(var(--background-rgb), 0.4)',
              }}
            >
              <div className="mb-6 flex flex-wrap items-end justify-between gap-6">
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      color: 'rgba(var(--foreground-rgb), 0.48)',
                    }}
                  >
                    Score
                  </div>
                  <div
                    className="mt-1 tabular-nums"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'clamp(2.5rem, 6vw, 3.5rem)',
                      fontWeight: 700,
                      letterSpacing: '-0.04em',
                      color: 'var(--main-element)',
                    }}
                  >
                    {score}
                  </div>
                </div>
                <div className="text-right">
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      color: 'rgba(var(--foreground-rgb), 0.48)',
                    }}
                  >
                    Round
                  </div>
                  <div
                    className="mt-1 tabular-nums"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                      fontWeight: 600,
                      letterSpacing: '-0.03em',
                      color: 'rgba(var(--foreground-rgb), 0.82)',
                    }}
                  >
                    {phase === 'idle'
                      ? '—'
                      : `${Math.min(completedRounds + 1, MAX_ROUNDS)} / ${MAX_ROUNDS}`}
                  </div>
                </div>
                <div className="text-right">
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      color: 'rgba(var(--foreground-rgb), 0.48)',
                    }}
                  >
                    Timer
                  </div>
                  <div
                    className="mt-1 tabular-nums"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                      fontWeight: 600,
                      letterSpacing: '-0.03em',
                      color: 'rgba(var(--foreground-rgb), 0.82)',
                    }}
                  >
                    {phase === 'idle' ? '—' : `${(roundTimeLeftMs / 1000).toFixed(2)}s`}
                  </div>
                </div>
              </div>
              <div
                className="grid gap-2 sm:gap-3"
                style={{
                  gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
                }}
              >
                {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => {
                  const isHot = phase === 'playing' && i === active;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleCellClick(i)}
                      className="aspect-square min-h-[44px] transition-colors duration-200"
                      style={{
                        border: '1px solid rgba(var(--foreground-rgb), 0.14)',
                        background: isHot
                          ? 'rgba(var(--accent-green-rgb), 0.35)'
                          : 'rgba(var(--foreground-rgb), 0.04)',
                        boxShadow: isHot
                          ? '0 0 24px rgba(var(--secondary-element-rgb), 0.45)'
                          : 'none',
                      }}
                      aria-label={isHot ? 'Target — click to score' : 'Empty cell'}
                    />
                  );
                })}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {(phase === 'idle' || phase === 'done') && (
                  <label
                    className="w-full sm:max-w-[19rem]"
                    style={{
                      border: '1px solid rgba(var(--foreground-rgb), 0.14)',
                      background: 'linear-gradient(180deg, rgba(var(--background-rgb), 0.62) 0%, rgba(var(--background-rgb), 0.35) 100%)',
                      padding: '0.75rem 0.8rem',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.62rem',
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        color: 'rgba(var(--foreground-rgb), 0.52)',
                      }}
                    >
                      Username
                    </span>
                    <input
                      type="text"
                      value={username}
                      onChange={(event) => {
                        setUsername(event.target.value);
                        if (usernameError) setUsernameError('');
                      }}
                      placeholder="Enter your name"
                      className="mt-2 w-full border px-3 py-2.5 outline-none transition-colors duration-300"
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.88rem',
                        letterSpacing: '0.04em',
                        borderColor: 'rgba(var(--foreground-rgb), 0.14)',
                        background: 'rgba(var(--background-rgb), 0.72)',
                        color: 'var(--main-element)',
                      }}
                    />
                  </label>
                )}
                {phase === 'idle' && (
                  <button
                    type="button"
                    onClick={startGame}
                    className="border px-6 py-3 transition-all duration-300"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.68rem',
                      fontWeight: 500,
                      letterSpacing: '0.24em',
                      textTransform: 'uppercase',
                      borderColor: 'rgba(var(--secondary-element-rgb), 0.65)',
                      background:
                        'linear-gradient(180deg, rgba(var(--secondary-element-rgb), 0.28) 0%, rgba(var(--secondary-element-rgb), 0.1) 100%)',
                      color: 'rgba(var(--main-element-rgb), 0.96)',
                      boxShadow:
                        '0 10px 26px rgba(var(--secondary-element-rgb), 0.28), inset 0 0 0 1px rgba(var(--foreground-rgb), 0.08)',
                    }}
                  >
                    Start Game
                  </button>
                )}
                {phase === 'playing' && (
                  <button
                    type="button"
                    onClick={() => {
                      setPhase('idle');
                      setCompletedRounds(0);
                      setRoundTimeLeftMs(ROUND_MS);
                    }}
                    className="border px-5 py-3 transition-colors duration-300"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      borderColor: 'rgba(var(--foreground-rgb), 0.14)',
                      color: 'rgba(var(--foreground-rgb), 0.65)',
                    }}
                  >
                    Stop
                  </button>
                )}
                {phase === 'done' && (
                  <>
                    <p
                      className="flex items-center"
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.95rem',
                        color: 'rgba(var(--foreground-rgb), 0.72)',
                      }}
                    >
                      Final score: <strong className="ml-2 pl-1">{score}</strong>
                    </p>
                    <p
                      className="flex items-center"
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.95rem',
                        color: 'rgba(var(--foreground-rgb), 0.62)',
                      }}
                    >
                      Time: <strong className="ml-2 pl-1">{(finishMs / 1000).toFixed(2)}s</strong>
                    </p>
                    <button
                      type="button"
                      onClick={startGame}
                      className="border px-5 py-3 transition-colors duration-300"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.72rem',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        borderColor: 'rgba(var(--foreground-rgb), 0.22)',
                        color: 'var(--main-element)',
                      }}
                    >
                      Play again
                    </button>
                  </>
                )}
              </div>
              {usernameError && (
                <p
                  className="mt-3"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.88rem',
                    color: 'rgba(var(--secondary-element-rgb), 0.95)',
                  }}
                >
                  {usernameError}
                </p>
              )}
              <div
                className="mt-8 border-t pt-5"
                style={{ borderColor: 'rgba(var(--foreground-rgb), 0.1)' }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.66rem',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: 'rgba(var(--foreground-rgb), 0.62)',
                  }}
                >
                  Leaderboard
                </div>
                <div className="mt-3 space-y-2">
                  {leaderboard.length === 0 && (
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.92rem',
                        color: 'rgba(var(--foreground-rgb), 0.56)',
                      }}
                    >
                      No scores yet. Be the first.
                    </p>
                  )}
                  {leaderboard.map((entry, index) => (
                    <div
                      key={`${entry.playedAt}-${entry.username}-${index}`}
                      className="flex items-center justify-between border px-3 py-2"
                      style={{ borderColor: 'rgba(var(--foreground-rgb), 0.1)' }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.92rem',
                          color: 'rgba(var(--foreground-rgb), 0.82)',
                        }}
                      >
                        {index + 1}. {entry.username}
                      </span>
                      <span
                        className="tabular-nums"
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.78rem',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          color: 'rgba(var(--foreground-rgb), 0.62)',
                        }}
                      >
                        {entry.score} pts / {(entry.finishMs / 1000).toFixed(2)}s
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
