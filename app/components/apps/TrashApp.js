'use client';

export default function TrashApp() {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-void p-6">
      <div className="text-center">
        <i className="ti ti-trash text-4xl text-ink-faint opacity-30 mb-4 inline-block" aria-hidden="true" />
        <p 
          className="text-xs text-ink-dim tracking-wide"
          style={{ fontFamily: 'var(--font-jetbrains), ui-monospace, monospace' }}
        >
          empty. no bugs in here<br/>(that we know of).
        </p>
      </div>
    </div>
  );
}
