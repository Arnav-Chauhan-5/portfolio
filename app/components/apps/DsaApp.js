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
          <div key={item.id} className="flex flex-col py-3.5 border-b border-line last:border-0 gap-2">
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
              <span className="text-[12px] font-medium text-ink shrink-0" style={BODY}>
                {item.platform}
              </span>
              <span className="text-[12px] text-ink-dim hidden sm:inline" style={BODY}>—</span>
              <span className="text-[12px] text-ink-dim leading-relaxed" style={BODY}>
                {item.desc}
              </span>
            </div>
            {item.hasLink && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[11px] text-accent hover:underline w-fit ml-2"
                style={MONO}
                title={item.title}
              >
                <i className="ti ti-external-link text-xs" aria-hidden="true" />
                view profile
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
