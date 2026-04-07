import { motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';

type CameraFeed = {
  id: string;
  label: string;
  targetId: string;
  title: string;
  subtitle: string;
  theme: 'about' | 'work' | 'contact';
};

const feeds: CameraFeed[] = [
  {
    id: 'cam-01',
    label: 'CAM 01',
    targetId: 'about',
    title: 'IDENTITY ARCHIVE',
    subtitle: 'BIO / PROFILE / ORIGIN',
    theme: 'about',
  },
  {
    id: 'cam-02',
    label: 'CAM 02',
    targetId: 'work',
    title: 'WORK STATION',
    subtitle: 'PROJECTS / OUTPUT / SYSTEM',
    theme: 'work',
  },
  {
    id: 'cam-03',
    label: 'CAM 03',
    targetId: 'contact',
    title: 'CONTACT NODE',
    subtitle: 'CHANNEL / ACCESS / SIGNAL',
    theme: 'contact',
  },
];

function themeStyles(theme: CameraFeed['theme']) {
  switch (theme) {
    case 'about':
      return {
        accent: '#ff4a4a',
        glow: 'rgba(255,74,74,0.28)',
        panel: 'rgba(255,74,74,0.08)',
      };
    case 'work':
      return {
        accent: '#f5f5f5',
        glow: 'rgba(245,245,245,0.22)',
        panel: 'rgba(245,245,245,0.07)',
      };
    case 'contact':
      return {
        accent: '#ff7a7a',
        glow: 'rgba(255,122,122,0.25)',
        panel: 'rgba(255,122,122,0.08)',
      };
  }
}

function FeedScene({ theme }: { theme: CameraFeed['theme'] }) {
  const { accent, panel } = themeStyles(theme);

  if (theme === 'about') {
    return (
      <div className="absolute inset-0">
        <div
          className="absolute left-[10%] top-[16%] h-[62%] w-[34%]"
          style={{ border: `1px solid ${accent}`, background: panel }}
        />
        <div
          className="absolute left-[48%] top-[18%] h-[12%] w-[18%]"
          style={{ border: `1px solid ${accent}`, background: 'rgba(255,255,255,0.03)' }}
        />
        <div
          className="absolute left-[48%] top-[36%] h-[8%] w-[28%]"
          style={{ border: `1px solid ${accent}`, background: 'rgba(255,255,255,0.03)' }}
        />
        <div
          className="absolute left-[48%] top-[50%] h-[8%] w-[22%]"
          style={{ border: `1px solid ${accent}`, background: 'rgba(255,255,255,0.03)' }}
        />
        <div
          className="absolute left-[48%] top-[66%] h-[14%] w-[36%]"
          style={{ border: `1px solid ${accent}`, background: panel }}
        />
      </div>
    );
  }

  if (theme === 'work') {
    return (
      <div className="absolute inset-0">
        <div
          className="absolute left-[14%] top-[20%] h-[42%] w-[44%]"
          style={{ border: `1px solid ${accent}`, background: panel }}
        />
        <div
          className="absolute left-[22%] top-[64%] h-[10%] w-[28%]"
          style={{ border: `1px solid ${accent}`, background: 'rgba(255,255,255,0.04)' }}
        />
        <div
          className="absolute left-[64%] top-[24%] h-[14%] w-[16%]"
          style={{ border: `1px solid ${accent}`, background: 'rgba(255,255,255,0.03)' }}
        />
        <div
          className="absolute left-[62%] top-[46%] h-[26%] w-[18%]"
          style={{ border: `1px solid ${accent}`, background: panel }}
        />
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      <div
        className="absolute left-[12%] top-[20%] h-[18%] w-[24%]"
        style={{ border: `1px solid ${accent}`, background: 'rgba(255,255,255,0.03)' }}
      />
      <div
        className="absolute left-[12%] top-[46%] h-[22%] w-[56%]"
        style={{ border: `1px solid ${accent}`, background: panel }}
      />
      <div
        className="absolute left-[72%] top-[24%] h-[44%] w-[14%]"
        style={{ border: `1px solid ${accent}`, background: panel }}
      />
      <div
        className="absolute left-[18%] top-[74%] h-[8%] w-[24%]"
        style={{ border: `1px solid ${accent}`, background: 'rgba(255,255,255,0.03)' }}
      />
    </div>
  );
}

export function GameSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [booted, setBooted] = useState(false);
  const [scanlineOffset, setScanlineOffset] = useState(0);
  const [noiseSeed, setNoiseSeed] = useState(0);
  const [glitch, setGlitch] = useState(false);

  const activeFeed = feeds[activeIndex];
  const { accent, glow } = useMemo(
    () => themeStyles(activeFeed.theme),
    [activeFeed.theme]
  );

  useEffect(() => {
    if (!booted) return;

    const scan = window.setInterval(() => {
      setScanlineOffset((prev) => (prev + 1) % 100);
    }, 40);

    const noise = window.setInterval(() => {
      setNoiseSeed(Math.random());
    }, 180);

    const glitcher = window.setInterval(() => {
      setGlitch(true);
      window.setTimeout(() => setGlitch(false), 90);
    }, 2600);

    return () => {
      window.clearInterval(scan);
      window.clearInterval(noise);
      window.clearInterval(glitcher);
    };
  }, [booted]);

  const goToFeed = (index: number) => {
    setActiveIndex(index);
  };

  const openCurrentFeed = () => {
    document.getElementById(activeFeed.targetId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <section
      id="game"
      className="relative min-h-screen flex items-center justify-center px-4 py-20"
    >
      <div className="w-full max-w-6xl z-10">
        <div className="mb-8 text-center">
          <div className="mb-3">
            <span
              className="text-xs tracking-[0.3em] uppercase"
              style={{ fontFamily: 'var(--font-mono)', color: accent }}
            >
              [00X] SURVEILLANCE MODE
            </span>
          </div>

          <h2
            className="mb-3"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.3rem, 8vw, 5rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#F5F5F5',
              lineHeight: 1,
            }}
          >
            CAMERA INFILTRATION
          </h2>

          <p
            className="mx-auto max-w-2xl text-[11px] sm:text-sm tracking-[0.12em] uppercase"
            style={{
              fontFamily: 'var(--font-body)',
              color: 'rgba(245,245,245,0.58)',
            }}
          >
            Cycle through surveillance feeds and breach the right channel.
          </p>
        </div>

        <div
          className="relative mx-auto overflow-hidden"
          style={{
            border: `1px solid ${accent}`,
            boxShadow: `0 0 32px ${glow}`,
            background: 'rgba(10,10,10,0.88)',
          }}
        >
          {!booted && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/80 backdrop-blur-[3px]">
              <div className="text-center px-6">
                <div
                  className="mb-4"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(1.4rem, 4vw, 2.2rem)',
                    fontWeight: 800,
                    color: '#F5F5F5',
                  }}
                >
                  INITIATE SURVEILLANCE
                </div>

                <p
                  className="mb-6 uppercase"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    color: 'rgba(245,245,245,0.52)',
                    fontSize: '11px',
                    letterSpacing: '0.18em',
                  }}
                >
                  Select feed / enter node
                </p>

                <button
                  onClick={() => setBooted(true)}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.85rem',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    border: `2px solid ${accent}`,
                    color: '#F5F5F5',
                    background: 'transparent',
                    cursor: 'pointer',
                    padding: '12px 26px',
                  }}
                >
                  Start
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_320px]">
            <div className="relative min-h-[420px] sm:min-h-[500px]">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'radial-gradient(circle at center, rgba(255,255,255,0.03), transparent 55%)',
                }}
              />

              <div
                className="absolute inset-0"
                style={{
                  opacity: glitch ? 0.18 : 0.08,
                  backgroundImage: `
                    linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)
                  `,
                  backgroundSize: `100% 4px, 28px 100%`,
                  transform: glitch ? 'translateX(2px)' : 'none',
                }}
              />

              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `linear-gradient(
                    to bottom,
                    transparent ${scanlineOffset}%,
                    rgba(255,255,255,0.08) ${scanlineOffset + 1}%,
                    transparent ${scanlineOffset + 3}%
                  )`,
                }}
              />

              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  opacity: 0.08,
                  backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.9) 0.6px, transparent 0.8px)`,
                  backgroundSize: `${18 + Math.floor(noiseSeed * 8)}px ${18 + Math.floor(noiseSeed * 8)}px`,
                }}
              />

              <FeedScene theme={activeFeed.theme} />

              <div
                className="absolute left-4 top-4 px-3 py-2"
                style={{
                  border: `1px solid ${accent}`,
                  background: 'rgba(10,10,10,0.72)',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    letterSpacing: '0.18em',
                    color: accent,
                    textTransform: 'uppercase',
                  }}
                >
                  {activeFeed.label}
                </div>
                <div
                  className="mt-1"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    letterSpacing: '0.14em',
                    color: 'rgba(245,245,245,0.66)',
                    textTransform: 'uppercase',
                  }}
                >
                  Live Feed
                </div>
              </div>

              <div
                className="absolute right-4 top-4 px-3 py-2"
                style={{
                  border: '1px solid rgba(245,245,245,0.18)',
                  background: 'rgba(10,10,10,0.72)',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    letterSpacing: '0.16em',
                    color: '#F5F5F5',
                    textTransform: 'uppercase',
                  }}
                >
                  Status: Tracking
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-5">
                <div
                  className="p-4"
                  style={{
                    border: `1px solid ${accent}`,
                    background: 'rgba(10,10,10,0.78)',
                    boxShadow: `0 0 18px ${glow}`,
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'clamp(1.1rem, 3vw, 1.7rem)',
                      fontWeight: 700,
                      color: '#F5F5F5',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {activeFeed.title}
                  </div>

                  <div
                    className="mt-2"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      letterSpacing: '0.16em',
                      color: 'rgba(245,245,245,0.56)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {activeFeed.subtitle}
                  </div>
                </div>
              </div>
            </div>

            <div
              className="border-t lg:border-t-0 lg:border-l"
              style={{ borderColor: 'rgba(255,255,255,0.08)' }}
            >
              <div className="p-5">
                <div
                  className="mb-4"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    letterSpacing: '0.18em',
                    color: 'rgba(245,245,245,0.56)',
                    textTransform: 'uppercase',
                  }}
                >
                  Active Channels
                </div>

                <div className="space-y-3">
                  {feeds.map((feed, index) => {
                    const active = activeIndex === index;
                    const styles = themeStyles(feed.theme);

                    return (
                      <button
                        key={feed.id}
                        onClick={() => goToFeed(index)}
                        className="w-full text-left px-4 py-4 transition-all"
                        style={{
                          border: `1px solid ${active ? styles.accent : 'rgba(255,255,255,0.12)'}`,
                          background: active ? styles.panel : 'rgba(255,255,255,0.02)',
                          boxShadow: active ? `0 0 18px ${styles.glow}` : 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <div
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '10px',
                            letterSpacing: '0.18em',
                            color: active ? styles.accent : 'rgba(245,245,245,0.6)',
                            textTransform: 'uppercase',
                          }}
                        >
                          {feed.label}
                        </div>

                        <div
                          className="mt-2"
                          style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '1rem',
                            color: '#F5F5F5',
                            fontWeight: 700,
                          }}
                        >
                          {feed.title}
                        </div>

                        <div
                          className="mt-1"
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '10px',
                            letterSpacing: '0.14em',
                            color: 'rgba(245,245,245,0.46)',
                            textTransform: 'uppercase',
                          }}
                        >
                          {feed.subtitle}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={openCurrentFeed}
                  className="mt-5 w-full px-4 py-4"
                  style={{
                    border: `2px solid ${accent}`,
                    background: 'transparent',
                    color: '#F5F5F5',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9rem',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                  }}
                >
                  Enter Feed
                </button>

                <div
                  className="mt-5 p-4"
                  style={{
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.02)',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      letterSpacing: '0.18em',
                      color: 'rgba(245,245,245,0.5)',
                      textTransform: 'uppercase',
                    }}
                  >
                    Instructions
                  </div>

                  <div
                    className="mt-2"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.92rem',
                      color: 'rgba(245,245,245,0.72)',
                      lineHeight: 1.6,
                    }}
                  >
                    Browse the surveillance feeds, inspect the scene, then breach the selected node.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}