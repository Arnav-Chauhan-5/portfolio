'use client';

import { useState, useRef, useEffect } from 'react';

const HELP_TEXT = [
  'Available commands:',
  '  help      - show this message',
  '  whoami    - display user info',
  '  about     - open about window',
  '  projects  - open projects window',
  '  skills    - open skills window',
  '  contact   - open contact window',
  '  clear     - clear terminal output',
];

export default function TerminalApp({ openApp }) {
  const [history, setHistory] = useState([
    { type: 'output', text: 'Type "help" for a list of available commands.' }
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom whenever history changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [history]);

  // Keep focus on the hidden input when clicking anywhere in the terminal
  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = input.trim().toLowerCase();
      
      const newHistory = [...history, { type: 'command', text: `arnav@dev:~$ ${input}` }];
      setInput('');

      if (!cmd) {
        setHistory(newHistory);
        return;
      }

      switch (cmd) {
        case 'help':
          newHistory.push(...HELP_TEXT.map(text => ({ type: 'output', text })));
          break;
        case 'whoami':
          newHistory.push({ type: 'output', text: 'visitor \u2014 exploring arnav.dev' });
          break;
        case 'about':
        case 'projects':
        case 'skills':
        case 'contact':
          newHistory.push({ type: 'output', text: `launching ${cmd} ... ok` });
          openApp?.(cmd);
          break;
        case 'clear':
          setHistory([]);
          return; // Skip adding the command itself to history after clearing
        default:
          newHistory.push({ type: 'output', text: `command not found: ${cmd}` });
          break;
      }

      setHistory(newHistory);
    }
  };

  return (
    <div 
      className="h-full bg-void p-4 overflow-y-auto cursor-text select-text"
      onClick={handleTerminalClick}
      style={{ fontFamily: 'var(--font-jetbrains), ui-monospace, monospace' }}
    >
      <div className="flex flex-col gap-1 max-w-3xl">
        {history.map((line, i) => (
          <div
            key={i}
            className={`${line.type === 'command' ? 'text-accent' : 'text-ink-dim'} text-sm leading-relaxed`}
          >
            {/* Preserve whitespace for command formatting like help indentations */}
            <span style={{ whiteSpace: 'pre-wrap' }}>{line.text}</span>
          </div>
        ))}

        {/* Input line */}
        <div className="text-accent text-sm leading-relaxed flex items-center">
          <span className="shrink-0 mr-2">arnav@dev:~$</span>
          
          <div className="relative flex-1 flex items-center">
            {/* The visible text + caret */}
            <span className="whitespace-pre">
              {input}
              <span
                className="inline-block bg-accent align-text-bottom ml-px"
                style={{
                  width: '0.55em',
                  height: '1.1em',
                  animation: 'caret-blink 1s step-start infinite',
                }}
                aria-hidden="true"
              />
            </span>
            
            {/* Hidden actual input to capture typing nicely on mobile and desktop */}
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleCommand}
              className="absolute inset-0 opacity-0 cursor-text outline-none"
              autoFocus
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
            />
          </div>
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
