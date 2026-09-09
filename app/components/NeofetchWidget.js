'use client';

import { useEffect, useState } from 'react';
import { useSystemStats } from '../hooks/useSystemStats';

const MONO = { fontFamily: 'var(--font-jetbrains), ui-monospace, monospace' };

/* ── Live uptime hook ────────────────────────────────────────────────────── */
function useUptime() {
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      setUptime(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Format as mm:ss
  const m = Math.floor(uptime / 60).toString().padStart(2, '0');
  const s = (uptime % 60).toString().padStart(2, '0');
  return `${m}m ${s}s`;
}

function Row({ label, value }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-accent tracking-wider font-bold w-12 text-right shrink-0">{label}</span>
      <span className="text-ink-dim">{value}</span>
    </div>
  );
}

function ProgressBar({ value, max = 100, isKB = false }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1 bg-line rounded-sm overflow-hidden flex-shrink-0">
        <div 
          className="h-full bg-accent transition-all duration-1000 ease-out" 
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-ink-dim w-6 text-right tabular-nums tracking-tighter">
        {isKB ? `${value}` : `${Math.round(pct)}%`}
      </span>
    </div>
  );
}

export default function NeofetchWidget() {
  const uptime = useUptime();
  const { cpu, mem, net } = useSystemStats();

  return (
    <div
      className="absolute top-14 right-8 text-[10px] select-none pointer-events-none flex flex-col gap-1"
      style={{ ...MONO, zIndex: 0 }}
      aria-hidden="true"
    >
      <Row label="os" value="portfolio_v1" />
      <Row label="uptime" value={uptime} />
      <Row label="shell" value="hacker-desktop" />
      <Row label="packages" value="react, socket.io, postgres" />

      {/* Conky-style stats block */}
      <div className="flex flex-col gap-1 mt-3 opacity-60">
        <div className="flex items-center gap-2">
          <span className="text-accent tracking-wider font-bold w-12 text-right shrink-0">cpu</span>
          <ProgressBar value={cpu} max={100} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-accent tracking-wider font-bold w-12 text-right shrink-0">mem</span>
          <ProgressBar value={mem} max={100} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-accent tracking-wider font-bold w-12 text-right shrink-0">net</span>
          <ProgressBar value={net} max={500} isKB />
        </div>
      </div>
    </div>
  );
}
