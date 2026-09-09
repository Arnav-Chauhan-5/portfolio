'use client';

import { useEffect, useState, startTransition } from 'react';
import BootSequence from './components/BootSequence';
import Desktop     from './components/Desktop';
import SimpleView  from './components/SimpleView';

const BOOT_FLAG  = 'portfolio-booted';
const MODE_KEY   = 'view-mode';         // sessionStorage — resets each browser session

/* ── Mobile-touch detection ──────────────────────────────────────────────────
   Returns true when the viewport is narrow AND the primary input is coarse
   (touch / stylus — no fine pointer). Both conditions must hold so that wide
   touch-screen monitors (e.g. drawing tablets at 1920px) still get the
   desktop by default.
   ──────────────────────────────────────────────────────────────────────────── */
function isMobileTouch() {
  return window.matchMedia('(max-width: 768px) and (pointer: coarse)').matches;
}

/* ── View-mode resolution ────────────────────────────────────────────────────
   Priority:
   1. Explicit user choice saved in sessionStorage  (highest — honours toggle)
   2. Device heuristic: narrow + coarse → 'simple', everything else → 'desktop'
   ──────────────────────────────────────────────────────────────────────────── */
function resolveViewMode() {
  const saved = sessionStorage.getItem(MODE_KEY);
  if (saved === 'simple' || saved === 'desktop') return saved;
  return isMobileTouch() ? 'simple' : 'desktop';
}

/* ── Root page ───────────────────────────────────────────────────────────── */
export default function Home() {
  /**
   * booted   null  → localStorage not checked yet (render nothing)
   *          false → first visit → run BootSequence
   *          true  → already booted → go straight to viewMode
   *
   * viewMode null  → not yet determined (render nothing to avoid flash)
   *          'desktop' | 'simple'
   */
  const [booted,   setBooted]   = useState(null);
  const [viewMode, setViewMode] = useState(null);

  /* One-time client-side init */
  useEffect(() => {
    const isBooted = localStorage.getItem(BOOT_FLAG) === '1';
    startTransition(() => {
      if (isBooted) {
        // Already past the boot sequence — pick the view directly
        setViewMode(resolveViewMode());
      }
      setBooted(isBooted);
    });
  }, []);

  /* Called by BootSequence when animation finishes or is skipped */
  function handleBootDone() {
    localStorage.setItem(BOOT_FLAG, '1');
    setViewMode(resolveViewMode());  // device check happens here on first visit
    setBooted(true);
  }

  /* Mode switches — also persist the explicit choice so the next tab/refresh
     in the same session respects the user's preference over the device default */
  function switchToSimple() {
    sessionStorage.setItem(MODE_KEY, 'simple');
    setViewMode('simple');
  }

  function switchToDesktop() {
    sessionStorage.setItem(MODE_KEY, 'desktop');
    setViewMode('desktop');
  }

  /* ── Render ─────────────────────────────────────────────────────────── */

  // Suppress everything until the client-side checks have run.
  // This prevents both a flash of the boot sequence on repeat visits AND
  // a flash of the desktop on first visits to mobile devices.
  if (booted === null || (booted && viewMode === null)) return null;

  if (!booted) return <BootSequence onDone={handleBootDone} />;

  if (viewMode === 'simple') {
    return <SimpleView onEnterDesktop={switchToDesktop} />;
  }

  return <Desktop onSimpleView={switchToSimple} />;
}
