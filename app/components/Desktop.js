'use client';

import { useEffect, useState } from 'react';
import MatrixRain from './MatrixRain';
import Taskbar from './Taskbar';
import Window from './Window';
import StartMenu from './StartMenu';
import ContextMenu from './ContextMenu';
import { useWindowManager } from '../hooks/useWindowManager';
import ProjectsApp from './apps/ProjectsApp';
import AboutApp    from './apps/AboutApp';
import SkillsApp   from './apps/SkillsApp';
import ContactApp  from './apps/ContactApp';
import WelcomeApp  from './apps/WelcomeApp';
import TerminalApp from './apps/TerminalApp';
import ResumeApp   from './apps/ResumeApp';
import TrashApp    from './apps/TrashApp';
import AboutBuildApp from './apps/AboutBuildApp';
import ChessApp    from './apps/ChessApp';
import NeofetchWidget from './NeofetchWidget';

import { IconFolder, IconUser, IconCode, IconMail, IconTool, IconLayoutList, IconTerminal2, IconFileText, IconTrash, IconCrown } from '@tabler/icons-react';

/* ── Icon definitions ────────────────────────────────────────────────────── */
const ICONS = [
  { appId: 'projects', Icon: IconFolder, label: 'projects' },
  { appId: 'about',    Icon: IconUser,   label: 'about'    },
  { appId: 'skills',   Icon: IconCode,   label: 'skills'   },
  { appId: 'contact',  Icon: IconMail,   label: 'contact'  },
  { appId: 'terminal', Icon: IconTerminal2,label: 'terminal' },
  { appId: 'resume',   Icon: IconFileText, label: 'resume.pdf' },
  { appId: 'chess',    Icon: IconCrown,    label: 'chess'    },
];

/* ── Desktop icon ────────────────────────────────────────────────────────── */
/**
 * Mouse: double-click to open
 * Touch: single tap to open (e.preventDefault stops the synthetic click)
 */
function DesktopIcon({ Icon, label, onOpen }) {
  return (
    <button
      onDoubleClick={onOpen}
      onTouchEnd={(e) => { e.preventDefault(); onOpen(); }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen();
        }
      }}
      className="flex flex-col items-center gap-2 p-3 w-[76px] rounded
                 hover:bg-white/5 group select-none cursor-default
                 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
      aria-label={`Open ${label}`}
    >
      <Icon
        className="w-8 h-8 text-ink-dim group-hover:text-ink transition-colors"
        stroke={1.5}
        aria-hidden="true"
      />
      <span
        className="text-[10px] text-ink-dim group-hover:text-ink
                   tracking-[0.18em] uppercase transition-colors leading-tight text-center"
        style={{ fontFamily: 'var(--font-jetbrains), ui-monospace, monospace' }}
      >
        {label}
      </span>
    </button>
  );
}

/* ── App content router ─────────────────────────────────────────────────── */
function getAppContent(appId, openApp) {
  switch (appId) {
    case 'welcome':  return <WelcomeApp />;
    case 'projects': return <ProjectsApp />;
    case 'about':    return <AboutApp />;
    case 'skills':   return <SkillsApp />;
    case 'contact':  return <ContactApp />;
    case 'terminal': return <TerminalApp openApp={openApp} />;
    case 'resume':   return <ResumeApp />;
    case 'trash':    return <TrashApp />;
    case 'about-build': return <AboutBuildApp />;
    case 'chess':    return <ChessApp />;
    default:
      return (
        <div className="h-full flex flex-col items-center justify-center gap-2">
          <i className="ti ti-tool text-xl text-ink-faint opacity-40" aria-hidden="true" />
          <span
            className="text-xs text-ink-faint tracking-[0.2em] uppercase opacity-50"
            style={{ fontFamily: 'var(--font-jetbrains), ui-monospace, monospace' }}
          >
            {appId}
          </span>
        </div>
      );
  }
}

/* ── Top Bar ─────────────────────────────────────────────────────────────── */
function TopBar({ onSimpleView }) {
  return (
    <div
      className="fixed top-0 inset-x-0 h-10 bg-panel border-b border-line flex items-center justify-between px-4 select-none shadow-md"
      style={{ zIndex: 9999 }}
    >
      <span
        className="text-[10px] text-ink-faint tracking-widest uppercase opacity-60"
        style={{ fontFamily: 'var(--font-jetbrains), ui-monospace, monospace' }}
      >
        arnav.dev
      </span>
      <button
        onClick={onSimpleView}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-line
                   text-[10px] font-bold text-accent tracking-wide uppercase
                   hover:bg-white/5 hover:border-ink-dim hover:text-ink transition-colors"
        style={{ fontFamily: 'var(--font-jetbrains), ui-monospace, monospace' }}
        title="Switch to simple view"
      >
        <IconLayoutList size={14} />
        switch to simple view
      </button>
    </div>
  );
}

/* ── Desktop ─────────────────────────────────────────────────────────────── */
/**
 * Props
 * ─────
 * onSimpleView – () => void — called when the taskbar "simple_view" is clicked
 */
export default function Desktop({ onSimpleView }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState({ isOpen: false, x: 0, y: 0 });
  const {
    windows,
    openApp,
    closeWindow,
    minimizeWindow,
    focusWindow,
    moveWindow,
  } = useWindowManager();

  /* Auto-open welcome window on mount */
  useEffect(() => {
    openApp('welcome');
  }, [openApp]);

  /* Highest-z non-minimized window is the "active" one */
  const activeWindowId =
    windows
      .filter((w) => !w.minimized)
      .sort((a, b) => b.z - a.z)[0]?.id ?? null;

  /* Taskbar entry click: restore minimized windows, refocus open ones */
  const handleTaskbarClick = (win) => {
    if (win.minimized) {
      openApp(win.appId); // openApp un-minimizes + focuses existing window
    } else {
      focusWindow(win.id);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-void overflow-hidden"
      onContextMenu={(e) => {
        if (e.target === e.currentTarget) {
          e.preventDefault();
          setContextMenu({ isOpen: true, x: e.clientX, y: e.clientY });
        }
      }}
    >
      <TopBar onSimpleView={onSimpleView} />

      {/* ── Layer -1: Dot Grid Texture ──────────────────────────────────── */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* ── Layer 0: Matrix rain (canvas, absolute, pointer-events-none) ── */}
      <MatrixRain />

      {/* ── Layer 0.5: Decorative Widgets ───────────────────────────────── */}
      <NeofetchWidget />

      {/* ── Layer 1: Desktop icons — top-left column ────────────────────── */}
      <div
        className="absolute top-14 left-4 flex flex-col gap-1"
        style={{ zIndex: 10 }}
      >
        {ICONS.map(({ appId, Icon, label }) => (
          <DesktopIcon
            key={appId}
            Icon={Icon}
            label={label}
            onOpen={() => openApp(appId)}
          />
        ))}
      </div>

      {/* ── Layer 1.5: Desktop icons — isolated trash ─────────────────────── */}
      <div
        className="absolute bottom-16 left-4"
        style={{ zIndex: 10 }}
      >
        <DesktopIcon
          Icon={IconTrash}
          label="trash"
          onOpen={() => openApp('trash')}
        />
      </div>

      {/* ── Layer 2: Windows (each manages its own z-index) ─────────────── */}
      {windows.map((win) => (
        <Window
          key={win.id}
          win={win}
          onClose={()        => closeWindow(win.id)}
          onMinimize={()     => minimizeWindow(win.id)}
          onFocus={()        => focusWindow(win.id)}
          onMove={(x, y)     => moveWindow(win.id, x, y)}
        >
          {getAppContent(win.appId, openApp)}
        </Window>
      ))}

      {/* ── Layer 3: Taskbar (fixed bottom, z-9999) ──────────────────────── */}
      <Taskbar
        windows={windows}
        activeWindowId={activeWindowId}
        onWindowClick={handleTaskbarClick}
        onMenuClick={() => setIsMenuOpen((prev) => !prev)}
        onSimpleView={onSimpleView}
      />

      {/* ── Layer 4: Start Menu ───────────────────────────────────────────── */}
      <StartMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onOpenApp={(appId) => {
          openApp(appId);
        }}
        onSimpleView={onSimpleView}
      />

      {/* ── Layer 5: Context Menu ─────────────────────────────────────────── */}
      <ContextMenu
        isOpen={contextMenu.isOpen}
        x={contextMenu.x}
        y={contextMenu.y}
        onClose={() => setContextMenu((prev) => ({ ...prev, isOpen: false }))}
        onOpenApp={(appId) => openApp(appId)}
      />
    </div>
  );
}
