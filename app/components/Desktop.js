'use client';

import { useEffect, useState, useCallback } from 'react';
import MatrixRain from './MatrixRain';
import Taskbar from './Taskbar';
import Window from './Window';
import StartMenu from './StartMenu';
import ContextMenu from './ContextMenu';
import { useWindowManager } from '../hooks/useWindowManager';
import ProjectsApp from './apps/ProjectsApp';
import AboutApp from './apps/AboutApp';
import SkillsApp from './apps/SkillsApp';
import ContactApp from './apps/ContactApp';
import WelcomeApp from './apps/WelcomeApp';
import TerminalApp from './apps/TerminalApp';
import ResumeApp from './apps/ResumeApp';
import TrashApp from './apps/TrashApp';
import AboutBuildApp from './apps/AboutBuildApp';
import ChessApp from './apps/ChessApp';
import DsaApp from './apps/DsaApp';
import NeofetchWidget from './NeofetchWidget';
import GitHubWidget from './GitHubWidget';
import ProcessWidget from './ProcessWidget';

import { IconFolder, IconUser, IconCode, IconMail, IconTool, IconLayoutList, IconTerminal2, IconFileText, IconTrash, IconCrown, IconBinaryTree, IconBrandGithub, IconBrandLinkedin } from '@tabler/icons-react';

/* ── Icon definitions ────────────────────────────────────────────────────── */
const ICONS = [
  { appId: 'projects', Icon: IconFolder, label: 'projects' },
  { appId: 'about', Icon: IconUser, label: 'about' },
  { appId: 'skills', Icon: IconCode, label: 'skills' },
  { appId: 'contact', Icon: IconMail, label: 'contact' },
  { appId: 'github', Icon: IconBrandGithub, label: 'github', url: 'https://github.com/Arnav-Chauhan-5' },
  { appId: 'linkedin', Icon: IconBrandLinkedin, label: 'linkedin', url: 'https://linkedin.com/in/arnav-chauhan-b4033028b' },
  { appId: 'terminal', Icon: IconTerminal2, label: 'terminal' },
  { appId: 'resume', Icon: IconFileText, label: 'resume.pdf', url: '/resume.pdf' },
  { appId: 'chess', Icon: IconCrown, label: 'chess' },
  { appId: 'dsa', Icon: IconBinaryTree, label: 'dsa' },
];

/* ── Desktop icon ────────────────────────────────────────────────────────── */
/**
 * Mouse: double-click to open
 * Touch: single tap to open (e.preventDefault stops the synthetic click)
 */
function DesktopIcon({ Icon, label, onOpen, url }) {
  const content = (
    <>
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
    </>
  );

  const baseClasses = "flex flex-col items-center gap-2 p-3 w-[76px] rounded hover:bg-white/5 group select-none focus:outline-none focus-visible:ring-1 focus-visible:ring-accent";

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClasses} cursor-pointer`}
        aria-label={`Visit ${label}`}
      >
        {content}
      </a>
    );
  }

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
      className={`${baseClasses} cursor-default`}
      aria-label={`Open ${label}`}
    >
      {content}
    </button>
  );
}

/* ── App content router ─────────────────────────────────────────────────── */
function getAppContent(appId, openApp) {
  switch (appId) {
    case 'welcome': return <WelcomeApp />;
    case 'projects': return <ProjectsApp />;
    case 'about': return <AboutApp />;
    case 'skills': return <SkillsApp />;
    case 'contact': return <ContactApp />;
    case 'terminal': return <TerminalApp openApp={openApp} />;
    case 'resume': return <ResumeApp />;
    case 'trash': return <TrashApp />;
    case 'about-build': return <AboutBuildApp />;
    case 'chess': return <ChessApp />;
    case 'dsa': return <DsaApp />;
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
      className="fixed top-0 inset-x-0 h-10 bg-panel border-b border-line flex items-center px-4 select-none shadow-md"
      style={{ zIndex: 9999 }}
    >
      {/* Left column */}
      <div className="flex-1 flex justify-start">
        <span
          className="text-[10px] text-ink-faint tracking-widest uppercase opacity-60"
          style={{ fontFamily: 'var(--font-jetbrains), ui-monospace, monospace' }}
        >
          arnav.dev
        </span>
      </div>

      {/* Center column */}
      <div className="flex-1 flex justify-center">
        <button
          onClick={onSimpleView}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-line
                     text-[10px] font-bold text-accent tracking-wide uppercase
                     hover:bg-white/5 hover:border-ink-dim hover:text-ink transition-colors"
          style={{ fontFamily: 'var(--font-jetbrains), ui-monospace, monospace' }}
          title="Switch to quick view"
        >
          <IconLayoutList size={14} />
          switch to quick view
        </button>
      </div>

      {/* Right column */}
      <div className="flex-1 flex justify-end">
        <span
          className="text-[10px] text-ink-faint hidden sm:inline-block opacity-60"
          style={{ fontFamily: 'var(--font-jetbrains), ui-monospace, monospace' }}
        >
          # stay idle for a while
        </span>
      </div>
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
  const [toasts, setToasts] = useState([]);
  const {
    windows,
    openApp,
    closeWindow,
    minimizeWindow,
    focusWindow,
    moveWindow,
    updateWindowBounds,
  } = useWindowManager();

  const [isIdle, setIsIdle] = useState(false);
  const [showIdleMessage, setShowIdleMessage] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let idleTimeout;
    let messageTimeout;

    const resetIdle = () => {
      setIsIdle(false);
      setShowIdleMessage(false);
      clearTimeout(idleTimeout);
      clearTimeout(messageTimeout);
      if (!isMenuOpen && !contextMenu.isOpen) {
        idleTimeout = setTimeout(() => {
          setIsIdle(true);
          setShowIdleMessage(true);
          messageTimeout = setTimeout(() => {
            setShowIdleMessage(false);
          }, 5000);
        }, 15000);
      }
    };

    window.addEventListener('mousemove', resetIdle);
    window.addEventListener('mousedown', resetIdle);
    window.addEventListener('keydown', resetIdle);
    window.addEventListener('touchstart', resetIdle);

    resetIdle();

    return () => {
      clearTimeout(idleTimeout);
      clearTimeout(messageTimeout);
      window.removeEventListener('mousemove', resetIdle);
      window.removeEventListener('mousedown', resetIdle);
      window.removeEventListener('keydown', resetIdle);
      window.removeEventListener('touchstart', resetIdle);
    };
  }, [isMenuOpen, contextMenu.isOpen]);

  const addToast = useCallback((msg, icon) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, msg, icon }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const handleOpenApp = useCallback((appId) => {
    openApp(appId);
    if (appId === 'chess') addToast('launching chess.exe...', IconCrown);
    else if (appId === 'terminal') addToast('shell session started', IconTerminal2);
    else if (appId === 'trash') addToast('empty. no bugs in here (that we know of).', IconTrash);
  }, [openApp, addToast]);

  /* Auto-open welcome window on mount */
  useEffect(() => {
    handleOpenApp('welcome');
  }, [handleOpenApp]);

  /* Highest-z non-minimized window is the "active" one */
  const activeWindowId =
    windows
      .filter((w) => !w.minimized)
      .sort((a, b) => b.z - a.z)[0]?.id ?? null;

  /* Taskbar entry click: restore minimized windows, refocus open ones */
  const handleTaskbarClick = (win) => {
    if (win.minimized) {
      handleOpenApp(win.appId); // handleOpenApp un-minimizes + focuses existing window
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
      {/* ── Layer -1: Dot Grid Texture ──────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* ── Layer 0: Matrix rain (canvas, absolute, pointer-events-none) ── */}
      <MatrixRain isIdle={isIdle} />

      {/* ── Layer 0.1: Idle Message ─────────────────────────────────────── */}
      <div
        className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity ${showIdleMessage ? 'opacity-100 duration-500' : isIdle ? 'opacity-0 duration-1000' : 'opacity-0 duration-0'
          }`}
        style={{ zIndex: 5 }}
      >
        <div
          className="text-accent text-lg sm:text-xl"
          style={{ fontFamily: 'var(--font-jetbrains), ui-monospace, monospace' }}
        >
          still here?
          <span
            className="inline-block bg-accent align-text-bottom ml-1.5"
            style={{
              width: '0.55em',
              height: '1.1em',
              animation: 'caret-blink 1s step-start infinite',
            }}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* ── Dimming Wrapper for Idle Screensaver ────────────────────────── */}
      <div className={`absolute inset-0 transition-opacity ${isIdle ? 'opacity-10 pointer-events-none duration-1000' : 'opacity-100 duration-0'}`}>
        <TopBar onSimpleView={onSimpleView} />

        {/* ── Layer 0.5: Decorative Widgets ───────────────────────────────── */}
        <NeofetchWidget />
        <GitHubWidget />
        <ProcessWidget />

        {/* ── Layer 1: Desktop icons ────────────────────── */}
        <div
          className="absolute top-14 left-4 flex gap-2"
          style={{ zIndex: 10 }}
        >
          {/* Column 1 */}
          <div className="flex flex-col gap-1">
            {ICONS.slice(0, 8).map(({ appId, Icon, label, url }) => (
              <DesktopIcon
                key={appId}
                Icon={Icon}
                label={label}
                onOpen={() => handleOpenApp(appId)}
                url={url}
              />
            ))}

            {/* ── Desktop icons — isolated trash ─────────────────────── */}
            <div className="mt-6">
              <DesktopIcon
                Icon={IconTrash}
                label="trash"
                onOpen={() => handleOpenApp('trash')}
              />
            </div>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-1">
            {ICONS.slice(8).map(({ appId, Icon, label, url }) => (
              <DesktopIcon
                key={appId}
                Icon={Icon}
                label={label}
                onOpen={() => handleOpenApp(appId)}
                url={url}
              />
            ))}
          </div>
        </div>

        {/* ── Layer 2: Windows (each manages its own z-index) ─────────────── */}
        {windows.map((win) => (
          <Window
            key={win.id}
            win={win}
            onClose={() => closeWindow(win.id)}
            onMinimize={() => minimizeWindow(win.id)}
            onFocus={() => focusWindow(win.id)}
            onMove={(x, y) => moveWindow(win.id, x, y)}
            onUpdateBounds={(bounds) => updateWindowBounds(win.id, bounds)}
          >
            {getAppContent(win.appId, handleOpenApp)}
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
      </div>

      {/* ── Layer 4: Start Menu ───────────────────────────────────────────── */}
      <StartMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onOpenApp={(appId) => {
          handleOpenApp(appId);
        }}
        onSimpleView={onSimpleView}
      />

      {/* ── Layer 5: Context Menu ─────────────────────────────────────────── */}
      <ContextMenu
        isOpen={contextMenu.isOpen}
        x={contextMenu.x}
        y={contextMenu.y}
        onClose={() => setContextMenu((prev) => ({ ...prev, isOpen: false }))}
        onOpenApp={(appId) => handleOpenApp(appId)}
        addToast={addToast}
      />

      {/* ── Layer 6: Toasts ─────────────────────────────────────────────── */}
      <div
        className="fixed top-12 right-4 z-[5000] flex flex-col gap-2 pointer-events-none"
        aria-live="polite"
      >
        {toasts.map(t => {
          const IconComponent = t.icon;
          return (
            <div
              key={t.id}
              className="bg-panel border border-line rounded px-3 py-2 flex items-center gap-2 shadow-lg transition-all duration-300 animate-[toast-slide-in_0.3s_ease-out]"
            >
              {IconComponent && <IconComponent size={16} className="text-accent shrink-0" stroke={1.5} />}
              <span
                className="text-[11px] text-ink-dim tracking-wide"
                style={{ fontFamily: 'var(--font-jetbrains), ui-monospace, monospace' }}
              >
                {t.msg}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
