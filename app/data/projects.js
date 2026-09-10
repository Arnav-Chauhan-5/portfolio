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
    problem: "Real-time multiplayer games need moves to sync instantly between players, but the client can never be trusted to enforce chess rules on its own — a modified client could otherwise cheat.",
    role: "Full-stack developer — drove the architecture and feature decisions (multi-provider OAuth, input validation strategy, matchmaking design), implemented the real-time game layer, and debugged issues across authentication, synchronization, and game state through iterative testing, using AI-assisted tooling to accelerate implementation.",
    decisions: [
      {
        title: "Server-side move validation with chess.js",
        detail: "The server re-validates every move with chess.js rather than trusting the client — the client only renders the board; the server is the single source of truth for legality, check/checkmate, and game state."
      },
      {
        title: "Socket.io over polling",
        detail: "Matches, matchmaking, and spectating all need sub-second updates across multiple clients. Socket.io keeps a persistent connection open per player instead of repeatedly polling for state."
      },
      {
        title: "Split deployment: Vercel (frontend) + Render (backend)",
        detail: "Socket.io connections and Passport's session-based auth don't survive on Vercel's serverless functions, which spin down between requests. The backend needed a persistent server, which is what actually drove the move to Render rather than running everything on Vercel."
      },
      {
        title: "Zod for runtime validation",
        detail: "Every socket payload and API request is validated with Zod before it reaches game logic, since malformed or malicious payloads over a live socket connection are a real attack surface a typed frontend alone can't guard against."
      }
    ],
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
    problem: "Command-line tools are often either bare-bones — no autocomplete, no history — or tied to a single platform's filesystem APIs.",
    role: "Built solo from scratch — designed the TUI rendering layer, the CMake build configuration across environments, and the file-navigation logic.",
    decisions: [
      {
        title: "FTXUI for the interface layer",
        detail: "Handles rendering a responsive terminal UI without hand-rolling ANSI escape sequences directly."
      },
      {
        title: "C++20 <filesystem> for cross-platform navigation",
        detail: "Lets file browsing work the same way across operating systems using the standard library instead of writing separate, platform-specific filesystem code."
      },
      {
        title: "CMake for build configuration",
        detail: "Manages the build across different environments without a hand-written, environment-specific Makefile per platform."
      }
    ],
    links: {
      demo: null,  // Native terminal application — no browser demo
      repo: null,  // TODO: add GitHub repo URL
    },
    type: 'native',
    featured: false,
  },
];
