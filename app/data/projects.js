/**
 * Shared project data — consumed by both the desktop window apps and
 * the simple view (Prompt 6). Modify here; all views stay in sync.
 *
 * Link rules
 * ──────────
 * demo: null  → native app or not yet deployed (never fabricate a URL)
 * repo: null  → TODO — add the GitHub URL when the repo is public
 */
export const PROJECTS = [
  {
    id: 'chess',
    name: 'Chess',
    tagline: 'Full-Stack Multiplayer Chess Platform',
    description:
      'Real-time multiplayer chess platform built with PostgreSQL, Express, React, and ' +
      'Node.js. Features live game synchronization via Socket.io, server-side move ' +
      'validation to prevent cheating, AI opponents, multi-provider OAuth (Google + ' +
      'GitHub via Passport.js), and a matchmaking system design.',
    tech: ['PostgreSQL', 'Express', 'React', 'Node.js', 'Socket.io', 'Passport.js', 'OAuth'],
    links: {
      demo: 'https://chess-brown-beta.vercel.app',
      repo: null, // TODO: add GitHub repo URL
    },
    type: 'web',      // 'web' | 'native'
    featured: true,
  },
  {
    id: 'cpp-shell',
    name: 'C++20 Interactive Developer Shell',
    tagline: 'Responsive TUI Terminal Emulator',
    description:
      'A responsive Text-Based User Interface (TUI) terminal emulator built from scratch ' +
      'in C++20, using FTXUI for the interface layer and CMake to manage build ' +
      'configuration across environments. Features include tab auto-completion, command ' +
      'history, and cross-platform file navigation using the C++20 <filesystem> library.',
    tech: ['C++20', 'FTXUI', 'CMake', '<filesystem>'],
    links: {
      demo: null,  // Native terminal application — no browser demo
      repo: null,  // TODO: add GitHub repo URL
    },
    type: 'native',
    featured: false,
  },
];
