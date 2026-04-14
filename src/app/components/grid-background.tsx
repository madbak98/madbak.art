const NOISE_TEXTURE =
  'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 140 140%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.82%27 numOctaves=%272%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27140%27 height=%27140%27 filter=%27url(%23n)%27 opacity=%270.42%27/%3E%3C/svg%3E")';

export function GridBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 18%, rgba(var(--foreground-rgb), 0.06) 0%, rgba(var(--background-rgb), 0) 38%), linear-gradient(180deg, rgba(var(--background-rgb), 0.12) 0%, rgba(var(--background-rgb), 0) 32%, rgba(var(--background-rgb), 0) 68%, rgba(var(--foreground-rgb), 0.06) 100%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(var(--foreground-rgb), 0.04) 1px, transparent 1px)',
          backgroundSize: '12.5vw 100%',
          opacity: 0.26,
          maskImage:
            'linear-gradient(180deg, transparent 0%, black 18%, black 82%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(180deg, transparent 0%, black 18%, black 82%, transparent 100%)',
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 top-[34%]"
        style={{
          backgroundImage: `
            linear-gradient(var(--grid-color) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid-color) 1px, transparent 1px)
          `,
          backgroundSize: '72px 72px',
          opacity: 0.44,
          maskImage:
            'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.88) 18%, black 100%)',
          WebkitMaskImage:
            'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.88) 18%, black 100%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: NOISE_TEXTURE,
          opacity: 0.05,
          mixBlendMode: 'soft-light',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          boxShadow:
            'inset 0 0 140px rgba(var(--background-rgb), 0.95), inset 0 -100px 160px rgba(var(--background-rgb), 0.9)',
        }}
      />
    </div>
  );
}
