'use client';

const MONO = { fontFamily: 'var(--font-jetbrains), ui-monospace, monospace' };

const PROCESSES = [
  { pid: 1001, name: 'chess.exe', status: 'running' },
  { pid: 1002, name: 'devshell.exe', status: 'running' },
  { pid: 1003, name: 'portfolio.exe', status: 'running' },
];

export default function ProcessWidget() {
  return (
    <div
      className="absolute bottom-16 right-8 text-[10px] select-none pointer-events-none flex flex-col gap-1 bg-panel/30 p-3 border border-line/50 rounded backdrop-blur-sm"
      style={{ ...MONO, zIndex: 0 }}
      aria-hidden="true"
    >
      <div className="flex items-baseline gap-4 text-accent font-bold border-b border-line pb-1 mb-1 opacity-80 uppercase tracking-widest">
        <span className="w-8">PID</span>
        <span className="w-24">NAME</span>
        <span>STATUS</span>
      </div>
      
      {PROCESSES.map((proc) => (
        <div key={proc.pid} className="flex items-baseline gap-4 opacity-70">
          <span className="w-8 text-ink-dim">{proc.pid}</span>
          <span className="w-24 text-ink truncate">{proc.name}</span>
          <span className="text-accent flex items-center gap-1.5 opacity-90">
            <span 
              className="inline-block w-1.5 h-1.5 bg-accent rounded-full animate-pulse" 
            />
            {proc.status}
          </span>
        </div>
      ))}
    </div>
  );
}
