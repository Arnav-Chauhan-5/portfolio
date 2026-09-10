'use client';

const MONO = { fontFamily: 'var(--font-jetbrains), ui-monospace, monospace' };
const BODY = { fontFamily: 'var(--font-inter), system-ui, sans-serif' };

import { DSA_DATA } from '../../data/dsa';

/* ── Syntax tokens ───────────────────────────────────────────────────────── */
const K = ({ children }) => <span className="text-accent">{children}</span>;       // keys
const S = ({ children }) => <span className="text-ink">{children}</span>;          // strings
const P = ({ children }) => <span className="text-ink-faint">{children}</span>;    // punctuation
const C = ({ children }) => <span className="text-ink-faint opacity-60">{children}</span>; // comma

/* ── Skills data ─────────────────────────────────────────────────────────── */
const SKILLS = [
  {
    group: 'Languages',
    items: ['C', 'C++', 'SQL', 'HTML', 'CSS', 'JavaScript'],
  },
  {
    group: 'Frameworks & Libraries',
    items: ['React', 'Node.js', 'Express.js', 'PostgreSQL', 'Socket.io', 'FTXUI'],
  },
  {
    group: 'Tools & Concepts',
    items: ['Data Structures & Algorithms', 'CMake', 'Systems Architecture'],
  },
];

/* ── Terminal prompt ─────────────────────────────────────────────────────── */
function Prompt({ cmd }) {
  return (
    <div className="flex items-center gap-1.5 mb-5" style={MONO}>
      <span className="text-accent text-xs select-none">arnav@dev:~$</span>
      <span className="text-ink text-xs">{cmd}</span>
    </div>
  );
}

/* ── SkillsApp ───────────────────────────────────────────────────────────── */
export default function SkillsApp() {
  return (
    <div className="h-full overflow-y-auto p-5">
      <Prompt cmd="cat skills.json" />

      {/* Syntax-highlighted JSON output */}
      <pre
        className="text-xs leading-6 whitespace-pre-wrap"
        style={MONO}
        aria-label="Skills as JSON"
      >
        <P>{'{'}{'\n'}</P>
        {SKILLS.map((group, gi) => {
          const isLast = gi === SKILLS.length - 1;
          return (
            <span key={group.group}>
              {'  '}<K>&quot;{group.group}&quot;</K><P>: [</P>{'\n'}
              {group.items.map((item, ii) => {
                const itemLast = ii === group.items.length - 1;
                return (
                  <span key={item}>
                    {'    '}<S>&quot;{item}&quot;</S>
                    {!itemLast && <C>,</C>}
                    {'\n'}
                  </span>
                );
              })}
              {'  '}<P>]</P>
              {!isLast && <C>,</C>}
              {'\n'}
            </span>
          );
        })}
        <P>{'}'}</P>
      </pre>

      {/* Problem Solving Callout Card */}
      <div className="mt-8 border border-line p-5 rounded-sm">
        <div
          className="text-[10px] font-bold text-ink tracking-[0.2em] uppercase mb-4"
          style={MONO}
        >
          problem solving & dsa
        </div>
        
        <div className="flex flex-col">
          {DSA_DATA.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3 border-b border-line last:border-0">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                <span className="text-[12px] font-medium text-ink" style={BODY}>{item.platform}</span>
                <span className="text-[12px] text-ink-dim hidden sm:inline" style={BODY}>—</span>
                <span className="text-[12px] text-ink-dim" style={BODY}>{item.desc}</span>
              </div>
              {item.hasLink && (
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="shrink-0 ml-4 hover:opacity-70 transition-opacity" 
                  title={item.title}
                >
                  <i className="ti ti-external-link text-[14px] text-accent" aria-hidden="true" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
