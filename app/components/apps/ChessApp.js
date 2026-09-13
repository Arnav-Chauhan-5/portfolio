'use client';

import { PROJECTS } from '../../data/projects';

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

/* ── ChessApp Launcher ───────────────────────────────────────────────────── */
export default function ChessApp() {
  const project = PROJECTS.find((p) => p.id === 'chess');

  if (!project) return null;

  return (
    <div className="flex flex-col h-full bg-panel overflow-y-auto">
      {/* ── Content & Info ──────────────────────────────────────────────── */}
      <div className="p-6 flex flex-col gap-5 flex-1">
        <div className="mt-2">
          <h2 className="text-xl font-bold text-ink leading-snug mb-2" style={BODY}>
            {project.name} — realtime multiplayer
          </h2>
          <p className="text-sm text-ink-dim leading-relaxed" style={BODY}>
            {project.description}
          </p>
        </div>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-2">
          {project.tech.map((t) => <Tag key={t} label={t} />)}
        </div>

        <div className="mt-auto pt-6 flex justify-end">
          <a
            href={project.links.demo}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2 bg-accent text-accent-dim rounded text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-panel focus-visible:ring-accent"
            style={MONO}
          >
            launch game →
          </a>
        </div>
      </div>
    </div>
  );
}
