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
    <p className="text-base text-ink-dim mb-10 leading-relaxed" style={BODY}>
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

/* ── Project Details ───────────────────────────────────────────────────────── */
function ProjectDetails({ project }) {
  if (!project.problem && !project.role && (!project.decisions || project.decisions.length === 0)) return null;

  return (
    <div className="mt-6 border-t border-line pt-4">
      {/* Problem */}
      {project.problem && (
        <div className="pt-2">
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
        <div className="pt-2 mt-4">
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

      {/* Technical Decisions */}
      {project.decisions && project.decisions.length > 0 && (
        <div className="pt-2 mt-4">
          <div className="mb-4">
            <span
              className="text-[9px] text-accent tracking-[0.2em] uppercase border border-accent px-2 py-0.5 rounded-sm"
              style={MONO}
            >
              technical decisions
            </span>
          </div>
          <div className="flex flex-col gap-4">
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
  );
}

/* ── Featured project card (large) ──────────────────────────────────────── */
function FeaturedCard({ project }) {
  return (
    <div className="border border-line p-6 sm:p-8">
      {/* Badge */}
      <div className="mb-4">
        <span
          className="text-[9px] text-accent tracking-[0.2em] uppercase
                     border border-accent px-2 py-0.5 rounded-sm"
          style={MONO}
        >
          featured
        </span>
      </div>

      <h3 className="text-xl text-ink mb-1 leading-snug" style={MONO}>
        {project.name}
      </h3>
      <p className="text-xs text-ink-faint mb-5" style={MONO}>
        {project.tagline}
      </p>

      <p className="text-sm text-ink-dim leading-relaxed mb-5" style={BODY}>
        {project.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {project.tech.map((t) => <Tag key={t} label={t} />)}
      </div>

      {/* Links */}
      <div className="flex items-center gap-5 flex-wrap">
        <ProjLink
          href={project.links.demo}
          icon="ti-external-link"
          label="live demo"
          todolabel="demo — coming soon"
        />
        <ProjLink
          href={project.links.repo}
          icon="ti-brand-github"
          label="github repo"
          todolabel="repo — TODO"
        />
      </div>

      <ProjectDetails project={project} />
    </div>
  );
}

/* ── Secondary project card (smaller) ───────────────────────────────────── */
function SecondaryCard({ project }) {
  return (
    <div className="border-t border-line pt-6">
      <h3 className="text-sm text-ink mb-0.5 leading-snug" style={MONO}>
        {project.name}
      </h3>
      <p className="text-[11px] text-ink-faint mb-4" style={MONO}>
        {project.tagline}
      </p>

      <p className="text-[12px] text-ink-dim leading-relaxed mb-4" style={BODY}>
        {project.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.tech.map((t) => <Tag key={t} label={t} />)}
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        {project.type === 'native' && <ProjLink native />}
        <ProjLink
          href={project.links.repo}
          icon="ti-brand-github"
          label="github repo"
          todolabel="repo — TODO"
        />
      </div>

      <ProjectDetails project={project} />
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
  const featured = PROJECTS.find((p) => p.featured);
  const rest = PROJECTS.filter((p) => !p.featured);
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-void">

      {/* ── Nav ────────────────────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-50 bg-panel border-b border-line"
        aria-label="Site navigation"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-8 h-12 flex items-center justify-between">
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
      <div className="max-w-3xl mx-auto px-4 sm:px-8">

        {/* ── Hero ──────────────────────────────────────────────────── */}
        <section id="hero" aria-label="Introduction" className="py-20 sm:py-28">
          <p
            className="text-accent text-xs mb-5 tracking-widest select-none"
            style={MONO}
            aria-hidden="true"
          >
            arnav@dev:~$
          </p>
          <h1
            className="text-4xl sm:text-5xl text-ink mb-3 leading-tight"
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

        {/* ── Projects ──────────────────────────────────────────────── */}
        <section id="projects" aria-label="Projects" className="mb-20 sm:mb-28">
          <SectionRule label="projects" />

          {featured && <FeaturedCard project={featured} />}

          <div className="mt-6 flex flex-col gap-6">
            {rest.map((p) => <SecondaryCard key={p.id} project={p} />)}
          </div>
        </section>

        {/* ── Footer / Contact ──────────────────────────────────────── */}
        <footer
          aria-label="Contact"
          className="border-t border-line pt-10 pb-16"
        >
          <SectionRule label="contact" />

          {/* Terminal prompt */}
          <p
            className="flex items-center gap-1.5 mb-5 text-xs select-none"
            aria-hidden="true"
            style={MONO}
          >
            <span className="text-accent">arnav@dev:~$</span>
            <span className="text-ink">cat contact.txt</span>
          </p>

          <div className="mb-8">
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

          <p
            className="text-[10px] text-ink-faint opacity-25 leading-loose"
            style={MONO}
          >
            # arnav chauhan · {year}
          </p>
        </footer>
      </div>
    </div>
  );
}
