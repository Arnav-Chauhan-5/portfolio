'use client';

import { useEffect, useRef, useState } from 'react';
import { IconRefresh, IconTerminal2, IconPalette, IconInfoCircle } from '@tabler/icons-react';

const ACCENTS = ['#5dcaa5', '#a78bfa', '#fbbf24']; // Teal, Violet, Amber

export default function ContextMenu({ isOpen, x, y, onClose, onOpenApp }) {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [[renderX, renderY], setRenderPos] = useState([x, y]);
  const menuRef = useRef(null);

  useEffect(() => {
    if (isOpen && menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      let rx = x;
      let ry = y;
      
      // Prevent overflowing off the right or bottom edges
      if (rx + rect.width > window.innerWidth) {
        rx = window.innerWidth - rect.width - 8;
      }
      if (ry + rect.height > window.innerHeight) {
        ry = window.innerHeight - rect.height - 8;
      }
      
      setRenderPos([rx, ry]);
      setSelectedIndex(-1);
      menuRef.current.focus();
    }
  }, [isOpen, x, y]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % 4);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + 4) % 4);
      } else if (e.key === 'Enter') {
        if (selectedIndex !== -1) {
          e.preventDefault();
          handleSelect(selectedIndex);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, onClose]);

  const handleSelect = (index) => {
    switch (index) {
      case 0:
        window.location.reload();
        break;
      case 1:
        onOpenApp('terminal');
        break;
      case 2:
        cycleAccentColor();
        break;
      case 3:
        onOpenApp('about-build');
        break;
      default:
        break;
    }
    onClose();
  };

  const cycleAccentColor = () => {
    const root = document.documentElement;
    // Get the current computed style or inline style
    const currentStyle = root.style.getPropertyValue('--accent').trim();
    let nextIndex = 0;
    
    if (currentStyle) {
      const idx = ACCENTS.indexOf(currentStyle);
      if (idx !== -1) nextIndex = (idx + 1) % ACCENTS.length;
    } else {
      // Default is the first one (teal), so next is violet (1)
      nextIndex = 1;
    }
    
    root.style.setProperty('--accent', ACCENTS[nextIndex]);
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-[9998]" 
        onClick={onClose} 
        onContextMenu={(e) => { e.preventDefault(); onClose(); }} 
        aria-hidden="true" 
      />
      
      <div
        ref={menuRef}
        tabIndex={-1}
        className="fixed bg-panel border border-line rounded shadow-lg z-[9999] flex flex-col py-1 outline-none w-56"
        style={{ 
          left: renderX, 
          top: renderY,
          fontFamily: 'var(--font-jetbrains), ui-monospace, monospace' 
        }}
      >
        <ContextItem 
          icon={IconRefresh} label="refresh" isSelected={selectedIndex === 0} 
          onClick={() => handleSelect(0)} onHover={() => setSelectedIndex(0)} 
        />
        <ContextItem 
          icon={IconTerminal2} label="open terminal" isSelected={selectedIndex === 1} 
          onClick={() => handleSelect(1)} onHover={() => setSelectedIndex(1)} 
        />
        <ContextItem 
          icon={IconPalette} label="cycle accent color" isSelected={selectedIndex === 2} 
          onClick={() => handleSelect(2)} onHover={() => setSelectedIndex(2)} 
        />
        
        <div className="h-px bg-line my-1 mx-2" />
        
        <ContextItem 
          icon={IconInfoCircle} label="about this build" isSelected={selectedIndex === 3} 
          onClick={() => handleSelect(3)} onHover={() => setSelectedIndex(3)} 
        />
      </div>
    </>
  );
}

function ContextItem({ icon: Icon, label, isSelected, onClick, onHover }) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onHover}
      className={`flex items-center gap-3 px-3 py-1.5 w-full text-left text-xs transition-colors focus:outline-none ${
        isSelected ? 'bg-white/10 text-ink ring-1 ring-inset ring-accent z-10 relative' : 'text-ink-dim hover:bg-white/5 hover:text-ink'
      }`}
    >
      <Icon size={16} stroke={1.5} />
      <span>{label}</span>
    </button>
  );
}
