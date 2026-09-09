'use client';

const MONO = { fontFamily: 'var(--font-jetbrains), ui-monospace, monospace' };
const BODY = { fontFamily: 'var(--font-inter), system-ui, sans-serif' };

export default function WelcomeApp() {
  return (
    <div className="h-full overflow-hidden p-6 flex flex-col items-center justify-center text-center">
      <pre
        className="text-accent text-[8px] sm:text-[10px] leading-none mb-6 select-none font-bold"
        style={MONO}
        aria-hidden="true"
      >
        {`
    _   ___ _  _   ___   __
   / \\ | _ \\ \\| | /_\\ \\ / /
  / _ \\|   / .  |/ _ \\ V / 
 /_/ \\_\\_|_\\_|\\_/_/ \\_\\_/  
        `}
      </pre>

      <h2 className="text-sm text-ink mb-4 font-bold" style={MONO}>
        Welcome to the Desktop
      </h2>
      
      <p className="text-[12px] text-ink-dim leading-relaxed max-w-xs" style={BODY}>
        I'm a full-stack developer and systems engineer. This environment is an interactive portfolio.
      </p>
      
      <p className="text-[12px] text-ink-dim leading-relaxed max-w-xs mt-3" style={BODY}>
        <strong className="text-ink">Double-click an icon</strong> on the left to explore projects, skills, and background.
      </p>

      <p className="text-[12px] text-ink-dim leading-relaxed max-w-xs mt-3" style={BODY}>
        Tip: drag a window to the screen edge to snap it.
      </p>
    </div>
  );
}
