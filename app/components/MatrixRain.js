'use client';

import { useEffect, useRef } from 'react';

/* ── Config ──────────────────────────────────────────────────────────────── */
const FONT_SIZE = 14;         // px — column width and row height
const FRAME_SKIP = 2;         // draw every Nth RAF tick (~30 fps at 60 Hz)
const RESET_CHANCE = 0.975;   // probability a column resets after leaving screen

// Katakana block + a smattering of numerals for the classic look
const CHARS =
  'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン' +
  '01234567890ABCDEF';

const HEAD_COLOR  = '#ccffcc';   // bright head character
const TRAIL_COLOR = '#1d9e75';   // saturated green for trailing characters
const FADE_ALPHA  = 0.12;        // opacity of the per-frame void overlay

/* ── Component ───────────────────────────────────────────────────────────── */
export default function MatrixRain({ isIdle = false }) {
  const canvasRef = useRef(null);
  const isIdleRef = useRef(isIdle);

  useEffect(() => {
    isIdleRef.current = isIdle;
  }, [isIdle]);

  useEffect(() => {
    // Honour reduced motion — skip entirely
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let drops = [];      // y position (in rows) for each column
    let rafId;
    let tick = 0;

    /* Initialise / reinitialise columns on resize */
    const init = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const cols = Math.floor(canvas.width / FONT_SIZE);
      // Stagger starting positions so columns don't all arrive at once
      drops = Array.from({ length: cols }, () =>
        Math.floor(Math.random() * -80),
      );
    };

    const draw = () => {
      const idle = isIdleRef.current;
      const fadeAlpha = idle ? 0.05 : FADE_ALPHA;

      // Semi-transparent void overlay → creates the fade trail
      ctx.fillStyle = `rgba(8,9,11,${fadeAlpha})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${FONT_SIZE}px "JetBrains Mono", monospace`;

      const resetChance = idle ? 0.3 : RESET_CHANCE;

      for (let i = 0; i < drops.length; i++) {
        const y = drops[i];
        if (y < 0) { drops[i]++; continue; } // still off-screen — advance silently

        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const px   = i * FONT_SIZE;
        const py   = y * FONT_SIZE;

        // Bright head, dimmer trail
        ctx.fillStyle = y === Math.floor(drops[i]) ? HEAD_COLOR : TRAIL_COLOR;
        ctx.fillText(char, px, py);

        // Reset column randomly after it exits the bottom
        if (py > canvas.height && Math.random() > resetChance) {
          drops[i] = idle ? Math.floor(Math.random() * -5) : Math.floor(Math.random() * -30);
        } else {
          drops[i]++;
        }
      }
    };

    const animate = () => {
      tick++;
      const skip = isIdleRef.current ? 1 : FRAME_SKIP;
      if (tick % skip === 0) draw();
      rafId = requestAnimationFrame(animate);
    };

    init();
    animate();

    const handleResize = () => init();
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity ${
        isIdle ? 'opacity-100 duration-1000' : 'opacity-40 duration-0'
      }`}
      aria-hidden="true"
    />
  );
}
