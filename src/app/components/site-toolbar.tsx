
import { useEffect, useState } from 'react';

const NAV_ITEMS = [
  { label: 'MINI GAME', target: 'game' },
  { label: 'ABOUT', target: 'about' },
  { label: 'CONTACT', target: 'contact' },
] as const;

const NAV_OFFSET = 108;

export function SiteToolbar() {
  const [activeTarget, setActiveTarget] =
    useState<(typeof NAV_ITEMS)[number]['target']>('game');

  useEffect(() => {
    const updateActiveSection = () => {
      let nextActive = activeTarget;

      for (const item of NAV_ITEMS) {
        const section = document.getElementById(item.target);
        if (!section) continue;

        const top = section.getBoundingClientRect().top;
        if (top - NAV_OFFSET <= 0) {
          nextActive = item.target;
        }
      }

      setActiveTarget(nextActive);
    };

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);

    return () => {
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, [activeTarget]);

  const scrollToSection = (target: (typeof NAV_ITEMS)[number]['target']) => {
    document.getElementById(target)?.scrollIntoView({
    const section = document.getElementById(target);
    if (!section) return;

    const top = section.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    window.scrollTo({
      top,
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <nav
      className="fixed left-1/2 top-5 z-50 flex w-[min(94vw,52rem)] -translate-x-1/2 flex-wrap items-center justify-center gap-1 border px-2 py-2 sm:px-3"
      className="pointer-events-auto fixed left-1/2 top-5 z-[70] flex w-[min(94vw,52rem)] -translate-x-1/2 flex-wrap items-center justify-center gap-1 border px-2 py-2 sm:px-3"
      style={{
        borderColor: 'rgba(var(--foreground-rgb), 0.1)',
        background: 'rgba(var(--background-rgb), 0.72)',
        boxShadow: '0 18px 50px rgba(var(--background-rgb), 0.4)',
        borderColor: 'rgba(var(--foreground-rgb), 0.12)',
        background: 'rgba(var(--background-rgb), 0.82)',
        boxShadow: '0 18px 50px rgba(var(--background-rgb), 0.46)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
      }}
    >
      {NAV_ITEMS.map((item) => (
        <button
          key={item.target}
          type="button"
          onClick={() => scrollToSection(item.target)}
          className="border px-3 py-2 transition-colors duration-300 sm:px-4"
          style={{
            borderColor: 'transparent',
            background: 'transparent',
            color: 'rgba(var(--foreground-rgb), 0.84)',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            fontSize: item.label === 'MINI GAME' ? '0.8rem' : '0.72rem',
            paddingInline: item.label === 'MINI GAME' ? '1.15rem' : undefined,
          }}
          onMouseEnter={(event) => {
            event.currentTarget.style.borderColor =
              'rgba(var(--foreground-rgb), 0.12)';
            event.currentTarget.style.color = 'var(--main-element)';
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.borderColor = 'transparent';
            event.currentTarget.style.color =
              'rgba(var(--foreground-rgb), 0.84)';
          }}
        >
          {item.label}
        </button>
      ))}
      {NAV_ITEMS.map((item) => {
        const isActive = item.target === activeTarget;

        return (
          <button
            key={item.target}
            type="button"
            onClick={() => scrollToSection(item.target)}
            aria-current={isActive ? 'page' : undefined}
            className="border px-3 py-2 transition-colors duration-300 sm:px-4"
            style={{
              borderColor: isActive
                ? 'rgba(var(--foreground-rgb), 0.18)'
                : 'transparent',
              background: 'transparent',
              color: isActive ? 'var(--main-element)' : 'rgba(var(--foreground-rgb), 0.84)',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              fontSize: item.label === 'MINI GAME' ? '0.82rem' : '0.72rem',
              paddingInline: item.label === 'MINI GAME' ? '1.2rem' : undefined,
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.borderColor =
                'rgba(var(--foreground-rgb), 0.14)';
              event.currentTarget.style.color = 'var(--main-element)';
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.borderColor = isActive
                ? 'rgba(var(--foreground-rgb), 0.18)'
                : 'transparent';
              event.currentTarget.style.color = isActive
                ? 'var(--main-element)'
                : 'rgba(var(--foreground-rgb), 0.84)';
            }}
          >
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
