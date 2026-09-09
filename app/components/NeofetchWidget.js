'use client';

import { useEffect, useState } from 'react';

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
      <span className="text-accent tracking-wider font-bold">{label}</span>
      <span className="text-ink-dim">{value}</span>
    </div>
  );
}

export default function NeofetchWidget() {
  const uptime = useUptime();

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
    </div>
  );
}
