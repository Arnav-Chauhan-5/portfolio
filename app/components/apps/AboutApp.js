'use client';

const MONO = { fontFamily: 'var(--font-jetbrains), ui-monospace, monospace' };
const BODY = { fontFamily: 'var(--font-inter), system-ui, sans-serif' };

/* ── Terminal prompt ─────────────────────────────────────────────────────── */
function Prompt({ cmd }) {
  return (
    <div className="flex items-center gap-1.5 mb-5" style={MONO}>
      <span className="text-accent text-xs select-none">arnav@dev:~$</span>
      <span className="text-ink text-xs">{cmd}</span>
      <span
        aria-hidden="true"
        className="inline-block align-middle bg-ink-dim"
        style={{
          width:     '0.5em',
          height:    '1.1em',
          animation: 'caret-blink 1s step-start infinite',
        }}
      />
    </div>
  );
}

/* ── Key-value row ───────────────────────────────────────────────────────── */
function KV({ k, v }) {
  return (
    <div className="flex items-baseline gap-0" style={MONO}>
      <span className="w-24 shrink-0 text-[11px] text-ink-faint">{k}</span>
      <span className="text-xs text-ink-dim">{v}</span>
    </div>
  );
}

/* ── Interest row ────────────────────────────────────────────────────────── */
function Interest({ label }) {
  return (
    <div className="flex items-center gap-2" style={MONO}>
      <span className="text-accent text-xs select-none">→</span>
      <span className="text-[11px] text-ink-dim">{label}</span>
    </div>
  );
}

/* ── AboutApp ────────────────────────────────────────────────────────────── */
export default function AboutApp() {
  return (
    <div className="h-full overflow-y-auto p-5">
      <Prompt cmd="cat about.txt" />

      {/* Identity block */}
      <div className="flex flex-col gap-1.5 mb-5 pl-1">
        <KV k="Name" v="Arnav Chauhan" />
        <KV k="Location" v="Chandigarh University, India" />
        <KV k="Focus" v="Full-stack development & systems programming" />
      </div>

      {/* Horizontal rule */}
      <div className="border-t border-line mb-5" />

      {/* Bio paragraphs — Inter for readability */}
      <div className="flex flex-col gap-3 mb-5 pl-1">
        <p className="text-[12px] text-ink-dim leading-relaxed" style={BODY}>
          Full-stack Computer Science student focused on building complete,
          production-grade systems — from database schema to deployment pipeline.
        </p>
        <p className="text-[12px] text-ink-dim leading-relaxed" style={BODY}>
          Interested in the parts that scale and the parts that break: real-time
          synchronization, authentication architecture, and the gap between
          &ldquo;it works locally&rdquo; and &ldquo;it works at 3 am under load&rdquo;.
        </p>
        <p className="text-[12px] text-ink-dim leading-relaxed" style={BODY}>
          Not just UI. Comfortable going deep into the stack — PostgreSQL schemas,
          C++20 system calls, OAuth flows — wherever the actual complexity lives.
        </p>
      </div>

      {/* Interests */}
      <div>
        <div
          className="text-[10px] font-bold text-accent tracking-[0.25em] uppercase mb-3 pl-1"
          style={MONO}
        >
          interests
        </div>
        <div className="flex flex-col gap-1.5 pl-1">
          <Interest label="Real-time systems — WebSockets, event-driven architecture" />
          <Interest label="Authentication & OAuth — Passport.js, session management" />
          <Interest label="Systems programming — C++20, memory, filesystem" />
          <Interest label="Deployment & infra — Vercel, CI/CD, environment parity" />
        </div>
      </div>
    </div>
  );
}
