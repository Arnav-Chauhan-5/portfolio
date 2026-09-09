'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/* ── Script ─────────────────────────────────────────────────────────────── */
const LINES = [
  'arnav@dev:~$ whoami',
  'full-stack developer \u2014 chandigarh university',
  'arnav@dev:~$ ./load_portfolio.sh',
  'mounting projects ... ok',
  'mounting skills ... ok',
  'starting window manager ... ok',
];

const CHAR_DELAY  = 35;   // ms between characters
const LINE_DELAY  = 200;  // ms pause before the next line starts
const DONE_PAUSE  = 900;  // ms after last line before auto-advance

/* ── Component ──────────────────────────────────────────────────────────── */
export default function BootSequence({ onDone }) {
  // Each entry is the visible text for that line (grows char-by-char)
  const [displayedLines, setDisplayedLines] = useState(['']);
  // True once all lines are fully rendered (cursor stays but stops driving state)
  const [allDone, setAllDone] = useState(false);

  // Stable refs so callbacks never close over stale values
  const calledRef  = useRef(false);   // guard: onDone fires at most once
  const timerRef   = useRef(null);
  const onDoneRef  = useRef(onDone);
  useEffect(() => { onDoneRef.current = onDone; });

  /** Immediately complete the sequence and schedule onDone. */
  const finish = useCallback(() => {
    if (calledRef.current) return;
    calledRef.current = true;
    clearTimeout(timerRef.current);
    setDisplayedLines(LINES);
    setAllDone(true);
    // Brief pause so the completed terminal is visible before unmount
    timerRef.current = setTimeout(() => onDoneRef.current?.(), 120);
  }, []);

  /* ── Typing engine ──────────────────────────────────────────────────── */
  useEffect(() => {
    // Honour reduced-motion: skip the show entirely
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish();
      return;
    }

    let lineIdx = 0;
    let charIdx = 0;

    const tick = () => {
      if (calledRef.current) return;

      const line = LINES[lineIdx];

      if (charIdx <= line.length) {
        // Still typing the current line
        const col = charIdx;
        const row = lineIdx;
        setDisplayedLines(prev => {
          const next = [...prev];
          next[row] = line.slice(0, col);
          return next;
        });
        charIdx++;
        timerRef.current = setTimeout(tick, CHAR_DELAY);
      } else {
        // Current line finished — move to next
        lineIdx++;
        if (lineIdx >= LINES.length) {
          // All lines typed
          setAllDone(true);
          timerRef.current = setTimeout(() => {
            if (!calledRef.current) {
              calledRef.current = true;
              onDoneRef.current?.();
            }
          }, DONE_PAUSE);
        } else {
          // Append placeholder for the next line and start typing it
          charIdx = 0;
          setDisplayedLines(prev => [...prev, '']);
          timerRef.current = setTimeout(tick, LINE_DELAY);
        }
      }
    };

    // Small initial delay before the first character appears
    timerRef.current = setTimeout(tick, 400);
    return () => clearTimeout(timerRef.current);
  }, [finish]);

  /* ── Render ─────────────────────────────────────────────────────────── */
  return (
    <div className="fixed inset-0 z-50 bg-void flex flex-col">

      {/* Terminal lines — centred vertically */}
      <div className="flex-1 flex flex-col justify-center px-10 md:px-24 max-w-3xl">
        {displayedLines.map((text, i) => {
          const isLastRow = i === displayedLines.length - 1;
          return (
            <div
              key={i}
              className="text-accent text-sm leading-loose"
              style={{ fontFamily: 'var(--font-jetbrains), ui-monospace, monospace' }}
            >
              {text}
              {/* Blinking block cursor — always on the active / last row */}
              {isLastRow && (
                <span
                  className="inline-block bg-accent align-text-bottom ml-px"
                  style={{
                    width: '0.55em',
                    height: '1.1em',
                    animation: 'caret-blink 1s step-start infinite',
                  }}
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Skip button — fixed bottom-right, always reachable */}
      <button
        onClick={finish}
        className="fixed bottom-6 right-6 text-ink-faint text-xs tracking-widest uppercase
                   hover:text-ink transition-colors cursor-pointer"
        style={{ fontFamily: 'var(--font-jetbrains), ui-monospace, monospace' }}
        aria-label="Skip boot sequence"
      >
        skip →
      </button>
    </div>
  );
}
