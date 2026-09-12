'use client';

const MONO = { fontFamily: 'var(--font-jetbrains), ui-monospace, monospace' };

export default function GitHubWidget() {
  return (
    <div
      className="absolute top-[230px] right-8 text-[10px] select-none pointer-events-none flex flex-col gap-2 w-72"
      style={{ ...MONO, zIndex: 0 }}
      aria-hidden="true"
    >
      <div className="flex items-baseline gap-2">
        <span className="text-accent tracking-wider font-bold w-12 text-right shrink-0">github</span>
        <span className="text-ink-dim">Arnav-Chauhan-5</span>
      </div>
      
      {/* 
        We use an inversion trick because the ghchart endpoint generates an SVG 
        with light gray (#ebedf0) empty squares and no background. 
        Invert + hue-rotate gives us a dark mode look while preserving the 
        general hue of the accent color (5dcaa5).
      */}
      <div className="border border-line bg-panel p-2 rounded opacity-80 flex items-center justify-center">
        <img 
          src="https://ghchart.rshah.org/5dcaa5/Arnav-Chauhan-5" 
          alt="GitHub Contributions"
          className="w-full h-auto"
          style={{ filter: 'invert(1) hue-rotate(180deg) brightness(1.2)' }}
        />
      </div>
    </div>
  );
}
