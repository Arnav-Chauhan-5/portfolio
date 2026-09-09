'use client';

import { useEffect, useRef, useState, startTransition } from 'react';

/**
 * useTypewriter
 *
 * Types `text` out one character at a time.
 * Immediately shows the full string and sets done=true when
 * prefers-reduced-motion is active.
 *
 * @param {string} text        Full string to type
 * @param {object} [opts]
 * @param {number} [opts.charDelay=40]    ms between characters
 * @param {number} [opts.startDelay=300]  ms before the first character appears
 * @returns {{ displayed: string, done: boolean }}
 */
export function useTypewriter(text, { charDelay = 40, startDelay = 300 } = {}) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone]           = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    // Reduced motion: immediately resolve without any animation
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      startTransition(() => {
        setDisplayed(text);
        setDone(true);
      });
      return;
    }

    // Reset for new text
    startTransition(() => {
      setDisplayed('');
      setDone(false);
    });

    let i = 0;

    const tick = () => {
      if (i <= text.length) {
        setDisplayed(text.slice(0, i));
        i++;
        timerRef.current = setTimeout(tick, charDelay);
      } else {
        setDone(true);
      }
    };

    timerRef.current = setTimeout(tick, startDelay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [text, charDelay, startDelay]);

  return { displayed, done };
}
