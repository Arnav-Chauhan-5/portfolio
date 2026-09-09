'use client';

import { useEffect, useState, startTransition } from 'react';
import { IconWifi, IconBattery4, IconVolume2 } from '@tabler/icons-react';

/* ── Live clock ──────────────────────────────────────────────────────────── */
function Clock() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    startTransition(() => setTime(fmt()));
    const id = setInterval(() => startTransition(() => setTime(fmt())), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <time
      className="text-xs text-ink-dim tabular-nums select-none"
      style={{ fontFamily: 'var(--font-jetbrains), ui-monospace, monospace' }}
      aria-label="Current time"
    >
      {time}
    </time>
  );
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

      {/* Divider */}
      <div className="w-px h-5 bg-line mx-1 shrink-0" aria-hidden="true" />

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

      {/* ── Right cluster: system tray + clock ──────────────────────────────── */}
      <div className="flex items-center gap-4 ml-auto pl-3 shrink-0 pr-2">
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
