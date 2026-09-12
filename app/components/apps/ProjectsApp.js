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
          label="github repo"
          disabled={!project.links.repo}
          disabledLabel="repo — TODO"
        />
      </div>

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
        <div className="pt-2">
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
        <div className="pt-2">
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

import { IconCrown, IconTerminal2 } from '@tabler/icons-react';

/* ── Directory Listing ───────────────────────────────────────────────────── */
function DirectoryListing({ onSelectProject }) {
  return (
    <div className="flex-1 overflow-auto bg-void p-5">
      <div className="text-ink-faint text-[11px] mb-4 leading-relaxed" style={MONO}>
        total 16<br/>
        drwxr-xr-x  4 arnav  staff    128 Sep 10 03:00 .<br/>
        drwxr-xr-x  6 arnav  staff    192 Sep 10 02:50 ..
      </div>
      <div className="flex flex-col gap-0.5">
        {PROJECTS.map((p) => {
          let filename = p.id;
          let icon = null;
          let size = '4096';
          let perms = '-rw-r--r--';
          let date = 'Sep 10 03:00';
          
          if (p.id === 'chess') {
            filename = 'chess.bin';
            icon = <IconCrown size={14} className="text-accent" />;
            perms = '-rwxr-xr-x';
            size = '842M';
            date = 'Sep 08 14:23';
          } else if (p.id === 'cpp-shell') {
            filename = 'shell.cpp';
            icon = <IconTerminal2 size={14} className="text-accent" />;
            perms = '-rw-r--r--';
            size = '14K';
            date = 'Sep 09 11:05';
          }

          return (
            <button
              key={p.id}
              onClick={() => onSelectProject(p.id)}
              onDoubleClick={() => onSelectProject(p.id)}
              className="flex items-center w-full text-left hover:bg-white/5 px-2 py-1 -ml-2 rounded transition-colors group"
              style={MONO}
            >
              <span className="text-ink-dim text-[11px] whitespace-pre hidden sm:inline">
                {perms}  1 arnav  staff  {size.padStart(5, ' ')} {date}   
              </span>
              <span className="flex items-center gap-2 text-ink group-hover:text-accent transition-colors text-[11px]">
                {icon}
                {filename}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── ProjectsApp ─────────────────────────────────────────────────────────── */
export default function ProjectsApp() {
  const [view, setView] = useState('list'); // 'list' | 'detail'
  const [selectedId, setSelectedId] = useState(null);

  if (view === 'list') {
    return <DirectoryListing onSelectProject={(id) => {
      setSelectedId(id);
      setView('detail');
    }} />;
  }

  const project = PROJECTS.find((p) => p.id === selectedId) ?? PROJECTS[0];

  return (
    <div className="flex h-full overflow-hidden">
      {/* ── Left nav ──────────────────────────────────────────────────────── */}
      <nav
        className="w-44 shrink-0 border-r border-line flex flex-col h-full overflow-y-auto"
        aria-label="Project list"
      >
        {/* Back button */}
        <button
          onClick={() => setView('list')}
          className="px-3 py-2 text-[10px] text-ink-dim hover:text-accent tracking-widest uppercase
                     border-b border-line text-left flex items-center gap-1.5 transition-colors bg-panel-raised hover:bg-white/5 shrink-0"
          style={MONO}
        >
          <span aria-hidden="true" className="text-lg leading-none -translate-y-[1px]">←</span> projects/
        </button>

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
