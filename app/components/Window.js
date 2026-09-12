'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

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
export default function Window({ win, onClose, onMinimize, onFocus, onMove, onUpdateBounds, children }) {
  /* Refs keep drag handler and latest callbacks stable across renders
     so the document event listener effect only mounts/unmounts once.     */
  const dragRef           = useRef(null);   // { startMX, startMY, startWX, startWY }
  const winRef            = useRef(win);
  const onMoveRef         = useRef(onMove);
  const onFocusRef        = useRef(onFocus);
  const onUpdateBoundsRef = useRef(onUpdateBounds);

  const [snapPreview, setSnapPreview] = useState(null);
  const snapPreviewRef = useRef(null);

  useEffect(() => { winRef.current    = win;     });
  useEffect(() => { onMoveRef.current = onMove;  });
  useEffect(() => { onFocusRef.current = onFocus; });
  useEffect(() => { onUpdateBoundsRef.current = onUpdateBounds; });

  /* Document-level drag tracking — attached once, reads latest refs */
  useEffect(() => {
    const getClient = (e) =>
      e.touches ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
                : { x: e.clientX,            y: e.clientY            };

    const updateSnapPreview = (val) => {
      if (snapPreviewRef.current !== val) {
        snapPreviewRef.current = val;
        setSnapPreview(val);
      }
    };

    const handleMove = (e) => {
      if (!dragRef.current) return;
      const { x, y } = getClient(e);

      // Check snap threshold
      if (x < 20) {
        updateSnapPreview('left');
      } else if (x > window.innerWidth - 20) {
        updateSnapPreview('right');
      } else {
        updateSnapPreview(null);
      }

      const dx = x - dragRef.current.startMX;
      const dy = y - dragRef.current.startMY;
      onMoveRef.current(
        Math.max(0, dragRef.current.startWX + dx),
        Math.max(0, dragRef.current.startWY + dy),
      );
    };

    const handleUp = () => {
      if (!dragRef.current) return;
      const snap = snapPreviewRef.current;
      dragRef.current = null;
      updateSnapPreview(null);

      if (snap) {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const TOP_BAR_H = 40; // bg-panel h-10 = 40px
        const TASKBAR_H = 48; // bottom-0 h-12 = 48px

        const wLeft = Math.floor(vw / 2);
        const wRight = vw - wLeft;

        if (snap === 'left') {
          onUpdateBoundsRef.current({
            x: 0,
            y: TOP_BAR_H,
            w: wLeft,
            h: vh - TOP_BAR_H - TASKBAR_H
          });
        } else if (snap === 'right') {
          onUpdateBoundsRef.current({
            x: wLeft,
            y: TOP_BAR_H,
            w: wRight,
            h: vh - TOP_BAR_H - TASKBAR_H
          });
        }
      }
    };

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
    <>
      {/* ── Snap Preview Overlay ───────────────────────────────────────── */}
      {snapPreview && (
        <div
          className="fixed bg-accent/10 border-2 border-accent/40 pointer-events-none backdrop-blur-sm shadow-2xl transition-all duration-150"
          style={{
            zIndex: 9998,
            top: 40,
            bottom: 48,
            left: snapPreview === 'left' ? 0 : '50%',
            right: snapPreview === 'right' ? 0 : '50%',
          }}
        />
      )}

      <div
        role="region"
        aria-label={win.title}
        className="fixed flex flex-col border border-line rounded-lg overflow-hidden bg-panel shadow-2xl transition-transform"
        style={{
          left:   win.x,
          top:    win.y,
          width:  win.w,
          height: win.h,
          zIndex: win.z,
        }}
        onMouseDown={onFocus}          /* focus when clicking anywhere in the window */
        onContextMenu={(e) => e.stopPropagation()}
      >
      {/* ── Title bar ──────────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-2 px-3 shrink-0 border-b border-line bg-panel-raised select-none cursor-grab active:cursor-grabbing"
        style={{ height: '36px' }}
        onMouseDown={handleTitleDown}
        onTouchStart={handleTitleDown}
        onDoubleClick={(e) => { e.stopPropagation(); onMinimize(); }}
        onContextMenu={(e) => e.stopPropagation()}
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
          onClick={(e) => { 
            e.stopPropagation(); 
            onUpdateBounds({ x: win.homeX, y: win.homeY, w: win.homeW, h: win.homeH, preEnlarge: null }); 
          }}
          aria-label={`Reset ${win.title}`}
        />
        <button
          className="w-3 h-3 rounded-full shrink-0 transition-opacity hover:opacity-80
                     focus-visible:outline-none focus-visible:ring-2
                     focus-visible:ring-white/60 focus-visible:ring-offset-1
                     focus-visible:ring-offset-panel-raised"
          style={{ background: DOT_DECO }}
          onClick={(e) => {
            e.stopPropagation();
            if (win.preEnlarge) {
              onUpdateBounds({
                x: win.preEnlarge.x,
                y: win.preEnlarge.y,
                w: win.preEnlarge.w,
                h: win.preEnlarge.h,
                preEnlarge: null
              });
            } else {
              const vw = window.innerWidth;
              const vh = window.innerHeight;
              const TOP_BAR_H = 40;
              const TASKBAR_H = 48;
              const usableH = vh - TOP_BAR_H - TASKBAR_H;
              const w = Math.floor(vw * 0.85);
              const h = Math.floor(usableH * 0.85);
              const x = Math.floor((vw - w) / 2);
              const y = Math.floor(TOP_BAR_H + (usableH - h) / 2);
              onUpdateBounds({
                preEnlarge: { x: win.x, y: win.y, w: win.w, h: win.h },
                x, y, w, h
              });
            }
          }}
          aria-label={`Toggle Enlarge ${win.title}`}
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
    </>
  );
}
