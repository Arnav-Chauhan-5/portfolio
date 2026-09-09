'use client';

const MONO = { fontFamily: 'var(--font-jetbrains), ui-monospace, monospace' };

/* ── Terminal prompt ─────────────────────────────────────────────────────── */
function Prompt({ cmd }) {
  return (
    <div className="flex items-center gap-1.5 mb-5" style={MONO}>
      <span className="text-accent text-xs select-none">arnav@dev:~$</span>
      <span className="text-ink text-xs">{cmd}</span>
    </div>
  );
}

/* ── Contact row ─────────────────────────────────────────────────────────── */
function Row({ label, href, display, todo }) {
  const labelEl = (
    <span className="w-20 shrink-0 text-[11px] text-ink-faint">{label}</span>
  );

  const valueEl = todo ? (
    <span className="text-[11px] text-ink-faint opacity-40 italic">
      {display}
    </span>
  ) : (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      className="text-[11px] text-accent hover:underline break-all"
    >
      {display}
    </a>
  );

  return (
    <div className="flex items-start gap-2 py-1.5" style={MONO}>
      {labelEl}
      {valueEl}
    </div>
  );
}

/* ── ContactApp ──────────────────────────────────────────────────────────── */
export default function ContactApp() {
  return (
    <div className="h-full overflow-y-auto p-5">
      <Prompt cmd="cat contact.txt" />

      <div className="flex flex-col divide-y divide-line">
        <Row
          label="email"
          href="mailto:arnavchauhan852@gmail.com"
          display="arnavchauhan852@gmail.com"
        />
        <Row
          label="github"
          href="https://github.com/Arnav-Chauhan-5"
          display="github.com/Arnav-Chauhan-5"
        />
        <Row
          label="linkedin"
          href="https://www.linkedin.com/in/arnav-chauhan-b4033028b"
          display="linkedin.com/in/arnav-chauhan-b4033028b"
        />
        <Row
          label="resume"
          href="#"
          display="[TODO — host the PDF and link it here]"
          todo
        />
      </div>

      {/* Footer hint */}
      <p
        className="mt-6 text-[10px] text-ink-faint opacity-40 leading-relaxed"
        style={MONO}
      >
        # best reached via email or linkedin
      </p>
    </div>
  );
}
