'use client';

import { DSA_DATA } from '../../data/dsa';

const MONO = { fontFamily: 'var(--font-jetbrains), ui-monospace, monospace' };
const BODY = { fontFamily: 'var(--font-inter), system-ui, sans-serif' };

function Prompt({ cmd }) {
  return (
    <div className="flex items-center gap-1.5 mb-5" style={MONO}>
      <span className="text-accent text-xs select-none">arnav@dev:~$</span>
      <span className="text-ink text-xs">{cmd}</span>
    </div>
  );
}

export default function DsaApp() {
  return (
    <div className="h-full overflow-y-auto p-5">
      <Prompt cmd="./dsa_stats --verbose" />

      <div className="flex flex-col">
        {DSA_DATA.map((item) => (
          <div key={item.id} className="flex items-center justify-between py-3 border-b border-line last:border-0">
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
              <span className="text-[12px] font-medium text-ink" style={BODY}>{item.platform}</span>
              <span className="text-[12px] text-ink-dim hidden sm:inline" style={BODY}>—</span>
              <span className="text-[12px] text-ink-dim" style={BODY}>{item.desc}</span>
            </div>
            {item.hasLink && (
              <a 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="shrink-0 ml-4 hover:opacity-70 transition-opacity" 
                title={item.title}
              >
                <i className="ti ti-external-link text-[14px] text-accent" aria-hidden="true" />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
