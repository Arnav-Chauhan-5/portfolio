'use client';

import { useEffect, useRef, useState } from 'react';
import {
  IconFolder,
  IconUser,
  IconCode,
  IconMail,
  IconTerminal,
  IconFileText,
  IconTrash,
  IconRefresh,
  IconLayoutList,
  IconCrown,
} from '@tabler/icons-react';

const APP_ITEMS = [
  { id: 'projects', label: 'Projects', Icon: IconFolder },
  { id: 'about',    label: 'About',    Icon: IconUser },
  { id: 'skills',   label: 'Skills',   Icon: IconCode },
  { id: 'contact',  label: 'Contact',  Icon: IconMail },
  { id: 'terminal', label: 'Terminal', Icon: IconTerminal },
  { id: 'resume',   label: 'Resume',   Icon: IconFileText },
  { id: 'trash',    label: 'Trash',    Icon: IconTrash },
  { id: 'chess',    label: 'Chess',    Icon: IconCrown },
];

export default function StartMenu({ isOpen, onClose, onOpenApp, onSimpleView }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef(null);

  // Total items = apps + 2 utility items
  const totalItems = APP_ITEMS.length + 2;

  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0);
      menuRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % totalItems);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + totalItems) % totalItems);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleSelect(selectedIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, totalItems, onClose]);

  const handleSelect = (index) => {
    if (index < APP_ITEMS.length) {
      onOpenApp(APP_ITEMS[index].id);
    } else if (index === APP_ITEMS.length) {
      handleReplayBoot();
    } else if (index === APP_ITEMS.length + 1) {
      onSimpleView();
    }
    onClose();
  };

  const handleReplayBoot = () => {
    localStorage.removeItem('portfolio-booted');
    window.location.reload();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Invisible overlay to catch outside clicks */}
      <div 
        className="fixed inset-0 z-[9998]" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      {/* Menu Panel */}
      <div
        ref={menuRef}
        tabIndex={-1}
        className="fixed bottom-[44px] left-2 w-64 bg-panel border border-line rounded-t-lg shadow-lg z-[9999] flex flex-col py-2 outline-none"
        style={{ 
          fontFamily: 'var(--font-jetbrains), ui-monospace, monospace',
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.4)'
        }}
      >
        {/* App list */}
        {APP_ITEMS.map((item, i) => (
          <button
            key={item.id}
            onClick={() => handleSelect(i)}
            onMouseEnter={() => setSelectedIndex(i)}
            className={`flex items-center gap-3 px-4 py-2 w-full text-left text-sm transition-colors focus:outline-none ${
              selectedIndex === i ? 'bg-white/10 text-ink ring-1 ring-inset ring-accent z-10 relative' : 'text-ink-dim hover:bg-white/5 hover:text-ink'
            }`}
          >
            <item.Icon size={18} stroke={1.5} />
            <span>{item.label}</span>
          </button>
        ))}

        {/* Divider */}
        <div className="h-px bg-line my-2 mx-4" />

        {/* Utility items */}
        <button
          onClick={() => handleSelect(APP_ITEMS.length)}
          onMouseEnter={() => setSelectedIndex(APP_ITEMS.length)}
          className={`flex items-center gap-3 px-4 py-2 w-full text-left text-sm transition-colors focus:outline-none ${
            selectedIndex === APP_ITEMS.length ? 'bg-white/10 text-ink ring-1 ring-inset ring-accent z-10 relative' : 'text-ink-dim hover:bg-white/5 hover:text-ink'
          }`}
        >
          <IconRefresh size={18} stroke={1.5} />
          <span>Replay Boot Sequence</span>
        </button>

        <button
          onClick={() => handleSelect(APP_ITEMS.length + 1)}
          onMouseEnter={() => setSelectedIndex(APP_ITEMS.length + 1)}
          className={`flex items-center gap-3 px-4 py-2 w-full text-left text-sm transition-colors focus:outline-none ${
            selectedIndex === APP_ITEMS.length + 1 ? 'bg-white/10 text-ink ring-1 ring-inset ring-accent z-10 relative' : 'text-ink-dim hover:bg-white/5 hover:text-ink'
          }`}
        >
          <IconLayoutList size={18} stroke={1.5} />
          <span>Switch to Simple View</span>
        </button>
      </div>
    </>
  );
}
