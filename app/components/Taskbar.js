'use client';

import { useEffect, useState, startTransition } from 'react';
import { IconWifi, IconBattery4, IconVolume2 } from '@tabler/icons-react';
import { useSystemStats } from '../hooks/useSystemStats';

/* ── Live clock ──────────────────────────────────────────────────────────── */
function Clock() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const fmtTime = () =>
      new Date().toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    const fmtDate = () =>
      new Date().toLocaleDateString('en-GB', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
      });
    startTransition(() => {
      setTime(fmtTime());
      setDate(fmtDate());
    });
    const id = setInterval(() => {
      startTransition(() => {
        setTime(fmtTime());
        setDate(fmtDate());
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="flex items-center gap-2 text-xs tabular-nums select-none"
      style={{ fontFamily: 'var(--font-jetbrains), ui-monospace, monospace' }}
      aria-label="Current date and time"
    >
      <span className="text-ink-dim">{date}</span>
      <time className="text-ink-dim">{time}</time>
    </div>
  );
}

/* ── Workspace Switcher ──────────────────────────────────────────────────── */
function WorkspaceSwitcher() {
  const [active, setActive] = useState(1);
  return (
    <div className="flex items-center gap-1 shrink-0">
      {[1, 2, 3, 4, 5].map((num) => (
        <button
          key={num}
          onClick={() => setActive(num)}
          className={`flex items-center justify-center w-6 h-6 rounded-[2px] text-xs transition-colors border ${
            active === num
              ? 'bg-accent text-void border-accent'
              : 'border-line text-ink-dim hover:border-ink-dim hover:text-ink'
          }`}
          style={{ fontFamily: 'var(--font-jetbrains), ui-monospace, monospace' }}
        >
          {num}
        </button>
      ))}
    </div>
  );
}

/* ── System Load ─────────────────────────────────────────────────────────── */
function SystemLoad() {
  const { cpu, mem } = useSystemStats();

  return (
    <div 
      className="flex items-center gap-3 text-xs text-ink-dim shrink-0 px-1"
      style={{ fontFamily: 'var(--font-jetbrains), ui-monospace, monospace' }}
    >
      <span>cpu <span className="text-ink">{String(cpu).padStart(2, '0')}%</span></span>
      <span>mem <span className="text-ink">{String(mem).padStart(2, '0')}%</span></span>
    </div>
  );
}

/* ── Divider ─────────────────────────────────────────────────────────────── */
function Divider() {
  return <div className="w-px h-5 bg-line mx-1 shrink-0" aria-hidden="true" />;
}

/* ── Taskbar ─────────────────────────────────────────────────────────────── */
/**
 * Props
 * ─────
 * windows        – array of window descriptors from useWindowManager
 * activeWindowId – id of the current top-most non-minimized window (or null)
 * onWindowClick  – (win) => void  — called when a taskbar entry is clicked
 * onMenuClick    – () => void
 * onSimpleView   – () => void
 */
export default function Taskbar({
  windows,
  activeWindowId,
  onWindowClick,
  onMenuClick,
  onSimpleView,
}) {
  return (
    <div
      className="fixed bottom-0 inset-x-0 h-11 flex items-center px-2 gap-1
                 bg-panel border-t border-line select-none shadow-[0_-4px_20px_rgba(0,0,0,0.3)]"
      style={{ zIndex: 9999 }}
    >
      {/* ── Workspace Switcher ──────────────────────────────────────────── */}
      <WorkspaceSwitcher />

      <Divider />

      {/* ── Menu button ─────────────────────────────────────────────────── */}
      <button
        onClick={onMenuClick}
        className="flex items-center justify-center w-8 h-8 rounded
                   text-ink-dim hover:text-ink hover:bg-white/5 transition-colors shrink-0"
        aria-label="Open menu"
        title="Menu"
      >
        <i className="ti ti-layout-grid text-sm" aria-hidden="true" />
      </button>

      <Divider />

      {/* ── Window entries ───────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-0.5 flex-1 overflow-x-auto"
        style={{ scrollbarWidth: 'none' }}            /* hide scrollbar on Firefox */
      >
        {windows.map((win) => {
          const isActive = win.id === activeWindowId && !win.minimized;
          const isMin    = win.minimized;

          return (
            <button
              key={win.id}
              onClick={() => onWindowClick(win)}
              className={[
                'flex items-center gap-1.5 px-2.5 h-7 rounded-sm text-[11px]',
                'max-w-[144px] shrink-0 transition-colors whitespace-nowrap',
                isActive
                  ? 'text-ink bg-panel-raised'
                  : isMin
                    ? 'text-ink-faint opacity-60 hover:opacity-100 hover:text-ink-dim'
                    : 'text-ink-dim hover:text-ink hover:bg-white/5',
              ].join(' ')}
              style={{
                fontFamily:   'var(--font-jetbrains), ui-monospace, monospace',
                borderBottom: isActive
                  ? '2px solid var(--accent)'
                  : '2px solid transparent',
              }}
              title={win.title + (isMin ? ' (minimized)' : '')}
            >
              <span className="truncate">{win.title}</span>
              {/* Dot indicator on minimized entries */}
              {isMin && (
                <span
                  className="w-1 h-1 rounded-full bg-ink-faint shrink-0"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>

      <Divider />

      {/* ── System Load ──────────────────────────────────────────────────── */}
      <SystemLoad />

      <Divider />

      {/* ── Right cluster: system tray + clock ──────────────────────────────── */}
      <div className="flex items-center gap-4 pl-2 shrink-0 pr-2">
        {/* System Tray */}
        <div className="flex items-center gap-3 text-ink-dim opacity-70">
          <IconWifi size={14} title="connection: stable" />
          <IconBattery4 size={14} title="battery: 100%" className="text-green-500" />
          <IconVolume2 size={14} title="volume: 75%" />
        </div>
        <Clock />
      </div>
    </div>
  );
}
