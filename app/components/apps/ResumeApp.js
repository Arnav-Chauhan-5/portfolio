'use client';

const MONO = { fontFamily: 'var(--font-jetbrains), ui-monospace, monospace' };
const BODY = { fontFamily: 'var(--font-inter), system-ui, sans-serif' };

/* ── Key-value row ───────────────────────────────────────────────────────── */
function KV({ k, v }) {
  return (
    <div className="flex items-baseline gap-0 mb-1" style={MONO}>
      <span className="w-24 shrink-0 text-[11px] text-ink-faint">{k}</span>
      <span className="text-xs text-ink-dim">{v}</span>
    </div>
  );
}

/* ── Section Header ──────────────────────────────────────────────────────── */
function SectionHeader({ title }) {
  return (
    <div
      className="text-[10px] font-bold text-accent tracking-[0.25em] uppercase mt-6 mb-3 border-b border-line pb-1"
      style={MONO}
    >
      {title}
    </div>
  );
}

/* ── ResumeApp ───────────────────────────────────────────────────────────── */
export default function ResumeApp() {
  return (
    <div className="h-full overflow-y-auto p-6 bg-panel">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-xl font-bold text-ink mb-1" style={BODY}>Arnav Chauhan</h1>
          <p className="text-sm text-ink-dim" style={BODY}>Full-stack Developer & Systems Programmer</p>
          <div className="mt-3">
            <KV k="Location" v="Chandigarh University, India" />
            <KV k="Contact" v="open contact app" />
          </div>
        </div>

        {/* Download PDF Button */}
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 border border-line rounded text-xs text-ink hover:text-accent hover:border-accent transition-colors"
          style={MONO}
          title="Download PDF"
        >
          <i className="ti ti-download" aria-hidden="true" />
          PDF
        </a>
      </div>

      {/* Experience / Projects */}
      <SectionHeader title="Experience & Key Projects" />
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-sm font-semibold text-ink" style={BODY}>C++ Terminal Shell</h3>
          <p className="text-[11px] text-ink-dim mb-1" style={MONO}>Systems Programming</p>
          <p className="text-xs text-ink-faint leading-relaxed" style={BODY}>
            Developed a custom shell environment demonstrating robust file system operations and
            native command implementations using low-level C++ standard libraries.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-ink" style={BODY}>Real-time Chat App</h3>
          <p className="text-[11px] text-ink-dim mb-1" style={MONO}>Full-stack • WebSockets</p>
          <p className="text-xs text-ink-faint leading-relaxed" style={BODY}>
            Built a scalable chat architecture featuring real-time event broadcasting and
            secure session management, bridging the gap between front-end UI and backend load.
          </p>
        </div>
      </div>

      {/* Education */}
      <SectionHeader title="Education" />
      <div>
        <h3 className="text-sm font-semibold text-ink" style={BODY}>Chandigarh University</h3>
        <p className="text-[11px] text-ink-dim mb-1" style={MONO}>Bachelor of Engineering in Computer Science</p>
        <p className="text-xs text-ink-faint leading-relaxed" style={BODY}>
          Focused on core computer science fundamentals, data structures, and system design architecture.
        </p>
      </div>

      {/* Skills */}
      <SectionHeader title="Technical Skills" />
      <div className="grid grid-cols-2 gap-2 text-xs text-ink-dim" style={MONO}>
        <div>• JavaScript / TypeScript</div>
        <div>• React / Next.js</div>
        <div>• Node.js / Express</div>
        <div>• PostgreSQL / MongoDB</div>
        <div>• C++20 / Systems</div>
        <div>• WebSocket / Real-time</div>
      </div>
    </div>
  );
}
