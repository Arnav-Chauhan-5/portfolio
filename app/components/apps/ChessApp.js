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
      {/* ── Top Preview Image ───────────────────────────────────────────── */}
      <div className="w-full shrink-0 border-b border-line p-4">
        <div className="w-full aspect-video bg-void rounded border border-line overflow-hidden flex items-center justify-center relative">
          {/* TODO: Swap placeholder path with a real screenshot of the live chess app later */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/media/chess-preview.png" 
            alt="Chess Preview Placeholder" 
            className="w-full h-full object-cover opacity-70"
            onError={(e) => {
              // Fallback if image doesn't exist yet
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling.style.display = 'flex';
            }}
          />
          <div className="absolute inset-0 hidden items-center justify-center text-ink-faint text-xs" style={MONO}>
            [ chess-preview.png ]
          </div>
        </div>
      </div>

      {/* ── Content & Info ──────────────────────────────────────────────── */}
      <div className="p-5 flex flex-col gap-4 flex-1">
        <div>
          <h2 className="text-lg font-bold text-ink leading-snug mb-1" style={BODY}>
            {project.name} — realtime multiplayer
          </h2>
          <p className="text-xs text-ink-dim leading-relaxed" style={BODY}>
            {project.description}
          </p>
        </div>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.tech.map((t) => <Tag key={t} label={t} />)}
        </div>

        <div className="mt-auto pt-4 flex justify-end">
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
