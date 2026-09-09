'use client';

const MONO = { fontFamily: 'var(--font-jetbrains), ui-monospace, monospace' };
const BODY = { fontFamily: 'var(--font-inter), system-ui, sans-serif' };

export default function AboutBuildApp() {
  return (
    <div className="h-full overflow-y-auto p-5 bg-panel">
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
        <i className="ti ti-box text-3xl text-accent" aria-hidden="true" />
        <div>
          <h2 className="text-sm font-bold text-ink" style={BODY}>arnav.dev / desktop-environment</h2>
          <p className="text-xs text-ink-dim mt-1" style={BODY}>Build Information</p>
        </div>
        
        <div className="text-xs text-ink-faint flex flex-col gap-2 mt-2 text-left bg-void border border-line p-4 rounded w-full max-w-[280px]" style={MONO}>
          <div className="flex gap-4 justify-between"><span>Framework</span> <span className="text-ink-dim">Next.js 14+</span></div>
          <div className="flex gap-4 justify-between"><span>Styling</span> <span className="text-ink-dim">Tailwind CSS v4</span></div>
          <div className="flex gap-4 justify-between"><span>Icons</span> <span className="text-ink-dim">Tabler Icons</span></div>
          <div className="flex gap-4 justify-between"><span>Hosting</span> <span className="text-ink-dim">Vercel</span></div>
          <div className="flex gap-4 justify-between"><span>Architecture</span> <span className="text-ink-dim">React Windows</span></div>
        </div>
      </div>
    </div>
  );
}
