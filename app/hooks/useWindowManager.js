'use client';

import { useCallback, useReducer } from 'react';

/* ── Per-app defaults ───────────────────────────────────────────────────────
   Add or update a record here whenever a real app window is built.
   title   – shown in the title bar and the taskbar entry
   w / h   – initial window size in px
   ────────────────────────────────────────────────────────────────────────── */
const APP_DEFAULTS = {
  // ── Real portfolio apps ─────────────────────────────────────────────────
  welcome:  { title: 'readme.txt', w: 460, h: 320 },
  projects: { title: 'Projects', w: 560, h: 440 },
  about:    { title: 'About Me', w: 460, h: 380 },
  skills:   { title: 'Skills',   w: 480, h: 400 },
  contact:  { title: 'Contact',  w: 420, h: 340 },

  // ── Dev placeholders (remove when real content ships) ───────────────────
  placeholder_red:   { title: 'Red Window',   w: 420, h: 300 },
  placeholder_green: { title: 'Green Window', w: 420, h: 300 },
  placeholder_blue:  { title: 'Blue Window',  w: 420, h: 300 },
};

const BASE_X       = 140; // first window's left offset (px)
const BASE_Y       = 90;  // first window's top offset  (px)
const CASCADE_STEP = 36;  // each subsequent window is offset by this much
const CASCADE_WRAP = 8;   // reset after this many cascaded windows

const INITIAL_Z    = 10;

/* ── Reducer ─────────────────────────────────────────────────────────────── */
function reducer(state, action) {
  switch (action.type) {

    case 'OPEN': {
      const { appId, defaults } = action;
      const existing = state.windows.find(w => w.appId === appId);

      if (existing) {
        // Restore if minimized and bring to front
        const topZ = state.topZ + 1;
        return {
          ...state,
          topZ,
          windows: state.windows.map(w =>
            w.id === existing.id
              ? { ...w, minimized: false, z: topZ }
              : w,
          ),
        };
      }

      const slot  = state.cascade % CASCADE_WRAP;
      const topZ  = state.topZ + 1;
      const newWin = {
        id:        `${appId}-${Date.now()}`,
        appId,
        title:     defaults.title,
        x:         BASE_X + slot * CASCADE_STEP,
        y:         BASE_Y + slot * CASCADE_STEP,
        w:         defaults.w,
        h:         defaults.h,
        z:         topZ,
        minimized: false,
      };

      return {
        ...state,
        topZ,
        cascade: state.cascade + 1,
        windows: [...state.windows, newWin],
      };
    }

    case 'CLOSE':
      return { ...state, windows: state.windows.filter(w => w.id !== action.id) };

    case 'MINIMIZE':
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.id ? { ...w, minimized: true } : w,
        ),
      };

    case 'FOCUS': {
      const topZ = state.topZ + 1;
      return {
        ...state,
        topZ,
        windows: state.windows.map(w =>
          w.id === action.id ? { ...w, z: topZ } : w,
        ),
      };
    }

    case 'MOVE':
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.id ? { ...w, x: action.x, y: action.y } : w,
        ),
      };

    default:
      return state;
  }
}

const initialState = { windows: [], topZ: INITIAL_Z, cascade: 0 };

/* ── Hook ────────────────────────────────────────────────────────────────── */
export function useWindowManager() {
  const [state, dispatch] = useReducer(reducer, initialState);

  /** Open a window for appId, or refocus/restore if one already exists. */
  const openApp = useCallback((appId) => {
    const defaults = APP_DEFAULTS[appId] ?? { title: appId, w: 420, h: 300 };
    dispatch({ type: 'OPEN', appId, defaults });
  }, []);

  const closeWindow    = useCallback((id)       => dispatch({ type: 'CLOSE',    id }),    []);
  const minimizeWindow = useCallback((id)       => dispatch({ type: 'MINIMIZE', id }),    []);
  const focusWindow    = useCallback((id)       => dispatch({ type: 'FOCUS',    id }),    []);
  const moveWindow     = useCallback((id, x, y) => dispatch({ type: 'MOVE', id, x, y }), []);

  return {
    windows: state.windows,
    openApp,
    closeWindow,
    minimizeWindow,
    focusWindow,
    moveWindow,
  };
}
