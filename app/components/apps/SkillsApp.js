'use client';

const MONO = { fontFamily: 'var(--font-jetbrains), ui-monospace, monospace' };

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
    </div>
  );
}
