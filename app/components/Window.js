'use client';

import { useCallback, useEffect, useRef } from 'react';

/* ── Traffic-light dot colours (macOS-inspired, flat) ─────────────────────── */
const DOT_CLOSE    = '#ff5f57';
const DOT_MINIMIZE = '#febc2e';
const DOT_DECO     = '#28c840';

/* ── Window component ────────────────────────────────────────────────────────
   Props
   ─────
   win      – window descriptor from useWindowManager
   onClose  – () => void
   onMinimize – () => void
   onFocus  – () => void
   onMove   – (x: number, y: number) => void
   children – content rendered inside the scrollable content area
   ──────────────────────────────────────────────────────────────────────────── */
export default function Window({ win, onClose, onMinimize, onFocus, onMove, children }) {
  /* Refs keep drag handler and latest callbacks stable across renders
     so the document event listener effect only mounts/unmounts once.     */
  const dragRef    = useRef(null);   // { startMX, startMY, startWX, startWY }
  const winRef     = useRef(win);
  const onMoveRef  = useRef(onMove);
  const onFocusRef = useRef(onFocus);

  useEffect(() => { winRef.current    = win;     });
  useEffect(() => { onMoveRef.current = onMove;  });
  useEffect(() => { onFocusRef.current = onFocus; });

  /* Document-level drag tracking — attached once, reads latest refs */
  useEffect(() => {
    const getClient = (e) =>
      e.touches ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
                : { x: e.clientX,            y: e.clientY            };

    const handleMove = (e) => {
      if (!dragRef.current) return;
      const { x, y } = getClient(e);
      const dx = x - dragRef.current.startMX;
      const dy = y - dragRef.current.startMY;
      onMoveRef.current(
        Math.max(0, dragRef.current.startWX + dx),
        Math.max(0, dragRef.current.startWY + dy),
      );
    };

    const handleUp = () => { dragRef.current = null; };

    document.addEventListener('mousemove',  handleMove);
    document.addEventListener('mouseup',    handleUp);
    document.addEventListener('touchmove',  handleMove, { passive: false });
    document.addEventListener('touchend',   handleUp);

    return () => {
      document.removeEventListener('mousemove',  handleMove);
      document.removeEventListener('mouseup',    handleUp);
      document.removeEventListener('touchmove',  handleMove);
      document.removeEventListener('touchend',   handleUp);
    };
  }, []); // intentionally empty — stable via refs

  /* Title-bar pointer-down: focus + start drag */
  const handleTitleDown = useCallback((e) => {
    if (e.button !== undefined && e.button !== 0) return; // only primary button
    e.stopPropagation(); // don't bubble to the outer div's onMouseDown
    e.preventDefault();  // prevent text selection while dragging
    onFocusRef.current();
    const src = e.touches ? e.touches[0] : e;
    dragRef.current = {
      startMX: src.clientX,
      startMY: src.clientY,
      startWX: winRef.current.x,
      startWY: winRef.current.y,
    };
  }, []);

  if (win.minimized) return null;

  return (
    <div
      role="region"
      aria-label={win.title}
      className="fixed flex flex-col border border-line rounded-lg overflow-hidden bg-panel shadow-2xl"
      style={{
        left:   win.x,
        top:    win.y,
        width:  win.w,
        height: win.h,
        zIndex: win.z,
      }}
      onMouseDown={onFocus}          /* focus when clicking anywhere in the window */
    >
      {/* ── Title bar ──────────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-2 px-3 shrink-0 border-b border-line bg-panel-raised select-none cursor-grab active:cursor-grabbing"
        style={{ height: '36px' }}
        onMouseDown={handleTitleDown}
        onTouchStart={handleTitleDown}
      >
        {/* Traffic lights */}
        <button
          className="w-3 h-3 rounded-full shrink-0 transition-opacity hover:opacity-80
                     focus-visible:outline-none focus-visible:ring-2
                     focus-visible:ring-white/60 focus-visible:ring-offset-1
                     focus-visible:ring-offset-panel-raised"
          style={{ background: DOT_CLOSE }}
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          aria-label={`Close ${win.title}`}
        />
        <button
          className="w-3 h-3 rounded-full shrink-0 transition-opacity hover:opacity-80
                     focus-visible:outline-none focus-visible:ring-2
                     focus-visible:ring-white/60 focus-visible:ring-offset-1
                     focus-visible:ring-offset-panel-raised"
          style={{ background: DOT_MINIMIZE }}
          onClick={(e) => { e.stopPropagation(); onMinimize(); }}
          aria-label={`Minimize ${win.title}`}
        />
        {/* Decorative dot — no action */}
        <span
          className="w-3 h-3 rounded-full shrink-0"
          style={{ background: DOT_DECO }}
          aria-hidden="true"
        />

        {/* Centred title — the pr-8 counterbalances the three dots on the left */}
        <span
          className="flex-1 text-center text-xs text-ink-dim tracking-wide truncate pr-8"
          style={{ fontFamily: 'var(--font-jetbrains), ui-monospace, monospace' }}
        >
          {win.title}
        </span>
      </div>

      {/* ── Scrollable content area ─────────────────────────────────────── */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
