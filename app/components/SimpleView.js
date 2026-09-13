'use client';

import { PROJECTS } from '../data/projects';
import GlitchText from './GlitchText';
import { useTypewriter } from '../hooks/useTypewriter';

const MONO = { fontFamily: 'var(--font-jetbrains), ui-monospace, monospace' };
const BODY = { fontFamily: 'var(--font-inter), system-ui, sans-serif' };

/* ── Hero subtitle with typewriter reveal ────────────────────────────────── */
const SUBTITLE = 'Full-stack developer & systems engineer. Building things that work at 3 am.';

function TypedSubtitle() {
  const { displayed, done } = useTypewriter(SUBTITLE, {
    charDelay: 26,
    startDelay: 500,  // brief pause after the name loads
  });

  return (
    <p className="text-base text-ink-dim mb-10 leading-relaxed max-w-xl" style={BODY}>
      {displayed}
      {/* Blinking bar cursor — hidden once typing is done */}
      {!done && (
        <span
          aria-hidden="true"
          className="inline-block align-middle ml-0.5 bg-ink-dim"
          style={{
            width: '2px',
            height: '1.1em',
            animation: 'caret-blink 1s step-start infinite',
          }}
        />
      )}
    </p>
  );
}

/* ── Helpers ─────────────────────────────────────────────────────────────── */

function Tag({ label }) {
  return (
    <span
      className="px-2 py-0.5 text-[10px] border border-line text-accent rounded-sm tracking-wide"
      style={MONO}
    >
      {label}
    </span>
  );
}

function SectionRule({ label }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <span
        className="text-[9px] text-ink-faint tracking-[0.25em] uppercase shrink-0"
        style={MONO}
      >
        {label}
      </span>
      <div className="flex-1 border-t border-line" />
    </div>
  );
}

/* ── Project link element ────────────────────────────────────────────────── */
function ProjLink({ href, icon, label, todo, todolabel, native }) {
  if (native) {
    return (
      <span className="text-[11px] text-ink-faint italic" style={BODY}>
        native app — no browser demo
      </span>
    );
  }
  if (todo || !href) {
    return (
      <span
        className="flex items-center gap-1.5 text-[11px] text-ink-faint opacity-50 select-none"
        style={MONO}
      >
        <i className={`ti ${icon} text-xs`} aria-hidden="true" />
        {todolabel ?? label}
      </span>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 text-[11px] text-accent hover:underline"
      style={MONO}
    >
      <i className={`ti ${icon} text-xs`} aria-hidden="true" />
      {label}
    </a>
  );
}

/* ── Project Card (Reusable 2-column layout) ────────────────────────────── */
function ProjectCard({ project, featured }) {
  const hasDecisions = project.decisions && project.decisions.length > 0;
  
  return (
    <div className={`border border-line ${featured ? 'p-6 sm:p-10' : 'p-6 sm:p-8'}`}>
      <div className={`grid ${hasDecisions ? 'lg:grid-cols-2' : 'lg:grid-cols-1'} gap-8 lg:gap-0`}>
        
        {/* ── Left Column: Overview, Problem, Role ── */}
        <div className="flex flex-col lg:pr-10">
          {/* Badge */}
          {featured && (
            <div className="mb-5">
              <span
                className="text-[9px] text-accent tracking-[0.2em] uppercase
                           border border-accent px-2 py-0.5 rounded-sm"
                style={MONO}
              >
                featured
              </span>
            </div>
          )}

          <h3 className={`${featured ? 'text-2xl' : 'text-xl'} text-ink mb-2 leading-snug`} style={MONO}>
            {project.name}
          </h3>
          <p className="text-xs text-ink-faint mb-6" style={MONO}>
            {project.tagline}
          </p>

          <p className="text-sm text-ink-dim leading-relaxed mb-6" style={BODY}>
            {project.description}
          </p>

          {/* Problem */}
          {project.problem && (
            <div className="mb-5">
              <div className="mb-3">
                <span
                  className="text-[9px] text-accent tracking-[0.2em] uppercase border border-accent px-2 py-0.5 rounded-sm"
                  style={MONO}
                >
                  problem
                </span>
              </div>
              <p className="text-[12px] text-ink-dim leading-relaxed" style={BODY}>
                {project.problem}
              </p>
            </div>
          )}

          {/* Role */}
          {project.role && (
            <div className="mb-6">
              <div className="mb-3">
                <span
                  className="text-[9px] text-accent tracking-[0.2em] uppercase border border-accent px-2 py-0.5 rounded-sm"
                  style={MONO}
                >
                  role
                </span>
              </div>
              <p className="text-[12px] text-ink-dim leading-relaxed" style={BODY}>
                {project.role}
              </p>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tech.map((t) => <Tag key={t} label={t} />)}
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 flex-wrap mt-auto">
            {project.type === 'native' && <ProjLink native />}
            {(!project.type || project.type !== 'native') && (
              <ProjLink
                href={project.links?.demo}
                icon="ti-external-link"
                label="live demo"
                todolabel="demo — coming soon"
              />
            )}
            <ProjLink
              href={project.links?.repo}
              icon="ti-brand-github"
              label="github repo"
              todolabel="repo — TODO"
            />
          </div>
        </div>

        {/* ── Right Column: Technical Decisions ── */}
        {hasDecisions && (
          <div className="pt-6 lg:pt-0 border-t lg:border-t-0 lg:border-l border-line lg:pl-10 flex flex-col">
            <div className="mb-5 lg:pt-0">
              <span
                className="text-[9px] text-accent tracking-[0.2em] uppercase border border-accent px-2 py-0.5 rounded-sm"
                style={MONO}
              >
                technical decisions
              </span>
            </div>
            
            <div className="flex flex-col gap-5">
              {project.decisions.map((decision, i) => (
                <div key={i}>
                  <h4 className="text-[12px] font-bold text-ink mb-1" style={BODY}>
                    {decision.title}
                  </h4>
                  <p className="text-[12px] text-ink-dim leading-relaxed" style={BODY}>
                    {decision.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Contact row ─────────────────────────────────────────────────────────── */
function ContactRow({ label, href, display, todo }) {
  return (
    <div className="flex items-start gap-6 py-2 border-b border-line last:border-0" style={MONO}>
      <span className="w-20 shrink-0 text-[11px] text-ink-faint">{label}</span>
      {todo ? (
        <span className="text-[11px] text-ink-faint opacity-40 italic">{display}</span>
      ) : (
        <a
          href={href}
          target={href.startsWith('http') ? '_blank' : undefined}
          rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="text-[11px] text-accent hover:underline break-all"
        >
          {display}
        </a>
      )}
    </div>
  );
}

/* ── SimpleView ──────────────────────────────────────────────────────────── */
/**
 * Props
 * ─────
 * onEnterDesktop – () => void  called when user wants the floating-window UI
 */
export default function SimpleView({ onEnterDesktop }) {
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-void">

      {/* ── Nav ────────────────────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-50 bg-panel border-b border-line"
        aria-label="Site navigation"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-8 h-12 flex items-center justify-between">
          <span className="text-xs text-ink" style={MONO}>
            arnav
          </span>
          <button
            onClick={onEnterDesktop}
            className="text-[11px] text-ink-faint hover:text-ink transition-colors"
            style={MONO}
          >
            enter desktop mode →
          </button>
        </div>
      </nav>

      {/* ── Scrollable content ─────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8">

        {/* ── Hero & Contact ─────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-8 items-center py-20 sm:py-28 lg:py-32">
          
          <section id="hero" aria-label="Introduction" className="lg:col-span-7 xl:col-span-8">
            <p
              className="text-accent text-xs mb-5 tracking-widest select-none"
              style={MONO}
              aria-hidden="true"
            >
              arnav@dev:~$
            </p>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl text-ink mb-4 leading-tight"
              style={MONO}
            >
              <GlitchText>Arnav Chauhan</GlitchText>
            </h1>
            <TypedSubtitle />

            <div className="flex items-center gap-3 flex-wrap">
              {/* View work — scrolls to projects section */}
              <a
                href="#projects"
                className="px-4 py-2 text-xs border border-accent text-accent
                           hover:bg-accent-dim transition-colors"
                style={MONO}
              >
                view work ↓
              </a>

              {/* Resume */}
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-xs border border-line text-ink hover:text-accent hover:border-accent transition-colors"
                style={MONO}
                title="Download Resume"
              >
                download resume
              </a>
            </div>
          </section>

          <aside aria-label="Contact" className="lg:col-span-5 xl:col-span-4 lg:pl-10 lg:border-l border-line">
            <p
              className="flex items-center gap-1.5 mb-6 text-xs select-none"
              aria-hidden="true"
              style={MONO}
            >
              <span className="text-accent">arnav@dev:~$</span>
              <span className="text-ink">cat contact.txt</span>
            </p>

            <div className="flex flex-col">
              <ContactRow
                label="email"
                href="mailto:arnavchauhan852@gmail.com"
                display="arnavchauhan852@gmail.com"
              />
              <ContactRow
                label="github"
                href="https://github.com/Arnav-Chauhan-5"
                display="github.com/Arnav-Chauhan-5"
              />
              <ContactRow
                label="linkedin"
                href="https://www.linkedin.com/in/arnav-chauhan-b4033028b"
                display="linkedin.com/in/arnav-chauhan-b4033028b"
              />
              <ContactRow
                label="resume"
                href="/resume.pdf"
                display="resume.pdf"
              />
            </div>
          </aside>
        </div>

        {/* ── Projects ──────────────────────────────────────────────── */}
        <section id="projects" aria-label="Projects" className="mb-20 sm:mb-28">
          <SectionRule label="projects" />

          <div className="flex flex-col gap-12">
            {PROJECTS.map((p) => (
              <ProjectCard key={p.id} project={p} featured={p.featured} />
            ))}
          </div>
        </section>

        {/* ── Footer ────────────────────────────────────────────────── */}
        <footer className="border-t border-line pt-10 pb-16 text-center">
          <p
            className="text-[10px] text-ink-faint opacity-25 leading-loose tracking-widest uppercase"
            style={MONO}
          >
            # arnav chauhan · {year}
          </p>
        </footer>
      </div>
    </div>
  );
}
