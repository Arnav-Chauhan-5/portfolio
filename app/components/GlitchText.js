'use client';

import { useEffect, useState, startTransition } from 'react';

/**
 * GlitchText
 *
 * Renders text three times stacked:
 *   1. Base layer — always visible, receives the parent's color
 *   2. Channel A  — colored --glitch-a (red), animated with glitch-a keyframe
 *   3. Channel B  — colored --glitch-b (cyan), animated with glitch-b keyframe
 *
 * Channels 2 & 3 are never mounted when prefers-reduced-motion is active
 * (checked both in JS and via the @keyframes override in globals.css).
 *
 * The parent element must supply its own font-size, font-family, and color;
 * this component adds only the stacking markup.
 *
 * Props
 * ─────
 * children   – text (or inline elements) to glitch
 * className  – forwarded to the outer wrapper span
 * style      – forwarded to the outer wrapper span
 */
export default function GlitchText({ children, className, style }) {
  /* Start with no glitch layers (server + first paint = no animation).
     useEffect enables them client-side if reduced-motion is not set.
     This avoids both SSR hydration mismatch and a flash for reduced-motion users. */
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    startTransition(() => setGlitch(!mq.matches));

    // Keep in sync if the user toggles OS-level reduced-motion at runtime
    const handler = (e) => startTransition(() => setGlitch(!e.matches));
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <span
      className={['relative inline-block', className].filter(Boolean).join(' ')}
      style={style}
    >
      {/* Layer 1 — base text, always visible */}
      <span>{children}</span>

      {/* Layer 2 — glitch channel A (red) */}
      {glitch && (
        <span
          aria-hidden="true"
          className="absolute top-0 left-0 pointer-events-none select-none"
          style={{
            color: 'var(--glitch-a)',
            animation: 'glitch-a 9s linear infinite',
            animationDelay: '1.8s',
          }}
        >
          {children}
        </span>
      )}

      {/* Layer 3 — glitch channel B (cyan), offset slightly from A */}
      {glitch && (
        <span
          aria-hidden="true"
          className="absolute top-0 left-0 pointer-events-none select-none"
          style={{
            color: 'var(--glitch-b)',
            animation: 'glitch-b 9s linear infinite',
            animationDelay: '1.95s',
          }}
        >
          {children}
        </span>
      )}
    </span>
  );
}
