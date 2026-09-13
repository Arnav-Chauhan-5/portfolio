'use client';

import { useEffect, useState, startTransition } from 'react';
import Desktop     from './components/Desktop';
import SimpleView  from './components/SimpleView';

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
   * viewMode null  → not yet determined (render nothing to avoid flash)
   *          'desktop' | 'simple'
   */
  const [viewMode, setViewMode] = useState(null);

  /* One-time client-side init */
  useEffect(() => {
    startTransition(() => {
      setViewMode(resolveViewMode());
    });
  }, []);

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
  // This prevents a flash of the desktop on first visits to mobile devices.
  if (viewMode === null) return null;

  if (viewMode === 'simple') {
    return <SimpleView onEnterDesktop={switchToDesktop} />;
  }

  return <Desktop onSimpleView={switchToSimple} />;
}
