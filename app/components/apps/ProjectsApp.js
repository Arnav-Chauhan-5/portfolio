'use client';

import { useState } from 'react';
import { PROJECTS } from '../../data/projects';

/* ── Shared inner styles ─────────────────────────────────────────────────── */
const MONO = { fontFamily: 'var(--font-jetbrains), ui-monospace, monospace' };
const BODY = { fontFamily: 'var(--font-inter), system-ui, sans-serif' };

/* ── Tech tag ────────────────────────────────────────────────────────────── */
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

/* ── Fake Terminal Frame ─────────────────────────────────────────────────── */
function FakeTerminalFrame() {
  const [error, setError] = useState(false);

  return (
    <div className="flex flex-col border border-line rounded-lg overflow-hidden bg-void my-4 w-full shrink-0 shadow-md">
      {/* Title bar */}
      <div
        className="flex items-center gap-2 px-3 shrink-0 border-b border-line bg-panel-raised select-none"
        style={{ height: '32px' }}
      >
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f57' }} aria-hidden="true" />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#febc2e' }} aria-hidden="true" />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#28c840' }} aria-hidden="true" />
        </div>
        <span
          className="flex-1 text-center text-[10px] text-ink-dim tracking-wide truncate pr-8"
          style={MONO}
        >
          shell — recorded session
        </span>
      </div>

      {/* Content */}
      <div className="w-full aspect-video bg-void relative flex items-center justify-center">
        {!error ? (
          // TODO: Supply the actual recording file at public/media/shell-demo.mp4.
          <video
            src="/media/shell-demo.mp4"
            muted
            loop
            autoPlay
            playsInline
            className="w-full h-full object-cover"
            onError={() => setError(true)}
          />
        ) : (
          <span className="text-[10px] text-ink-faint tracking-widest uppercase" style={MONO}>
            recording coming soon
          </span>
        )}
      </div>
    </div>
  );
}

/* ── Link row ────────────────────────────────────────────────────────────── */
function LinkRow({ href, icon, label, disabled, disabledLabel }) {
  if (disabled || !href) {
    return (
      <span
        className="flex items-center gap-1.5 text-[11px] text-ink-faint opacity-50 select-none"
        style={MONO}
      >
        <i className={`ti ${icon} text-xs`} aria-hidden="true" />
        {disabledLabel ?? label}
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

/* ── Detail pane ─────────────────────────────────────────────────────────── */
function Detail({ project }) {
  return (
    <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
      {/* Header */}
      <div>
        <h2 className="text-sm text-ink leading-snug mb-0.5" style={MONO}>
          {project.name}
        </h2>
        <p className="text-[11px] text-ink-faint" style={MONO}>
          {project.tagline}
        </p>
      </div>

      {/* Description */}
      <p
        className="text-[12px] text-ink-dim leading-relaxed"
        style={BODY}
      >
        {project.description}
      </p>

      {/* Native App Player */}
      {project.type === 'native' && <FakeTerminalFrame />}

      {/* Tech tags */}
      <div>
        <div
          className="text-[9px] text-ink-faint tracking-widest uppercase mb-2"
          style={MONO}
        >
          stack
        </div>
        <div className="flex flex-wrap gap-1.5">
          {project.tech.map((t) => <Tag key={t} label={t} />)}
        </div>
      </div>

      {/* Links */}
      <div className="border-t border-line pt-3 flex items-center gap-5 flex-wrap">
        {/* Demo */}
        {project.type !== 'native' && (
          <LinkRow
            href={project.links.demo}
            icon="ti-external-link"
            label="live demo"
            disabled={!project.links.demo}
            disabledLabel="demo — coming soon"
          />
        )}

        {/* Repo */}
        <LinkRow
          href={project.links.repo}
          icon="ti-brand-github"
          label="source"
          disabled={!project.links.repo}
          disabledLabel="repo — TODO"
        />
      </div>
    </div>
  );
}

/* ── ProjectsApp ─────────────────────────────────────────────────────────── */
export default function ProjectsApp() {
  const [selectedId, setSelectedId] = useState(
    PROJECTS.find((p) => p.featured)?.id ?? PROJECTS[0].id,
  );
  const project = PROJECTS.find((p) => p.id === selectedId) ?? PROJECTS[0];

  return (
    <div className="flex h-full overflow-hidden">
      {/* ── Left nav ──────────────────────────────────────────────────────── */}
      <nav
        className="w-44 shrink-0 border-r border-line flex flex-col h-full overflow-y-auto"
        aria-label="Project list"
      >
        {/* Section label */}
        <div
          className="px-3 py-2 text-[9px] text-ink-faint tracking-widest uppercase
                     border-b border-line"
          style={MONO}
        >
          projects/
        </div>

        {PROJECTS.map((p) => {
          const active = p.id === selectedId;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              className={[
                'flex items-center gap-2 w-full px-3 py-2.5 text-[11px] text-left transition-colors',
                active
                  ? 'text-ink bg-panel-raised'
                  : 'text-ink-dim hover:text-ink hover:bg-white/5',
              ].join(' ')}
              style={{
                ...MONO,
                borderLeft: active ? '2px solid var(--accent)' : '2px solid transparent',
              }}
              aria-current={active ? 'true' : undefined}
            >
              <i
                className={`ti ti-file-code text-[11px] shrink-0 ${active ? 'text-accent' : ''}`}
                aria-hidden="true"
              />
              <span className="truncate leading-tight">{p.name}</span>
            </button>
          );
        })}
      </nav>

      {/* ── Right detail pane ─────────────────────────────────────────────── */}
      <Detail project={project} />
    </div>
  );
}
