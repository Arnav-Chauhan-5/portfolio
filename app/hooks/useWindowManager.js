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
  projects: { title: 'projects/', w: 560, h: 440 },
  about:    { title: 'About Me', w: 460, h: 380 },
  skills:   { title: 'Skills',   w: 480, h: 400 },
  contact:  { title: 'Contact',  w: 420, h: 340 },
  dsa:      { title: 'dsa_stats', w: 480, h: 360 },

  // ── Dev placeholders (remove when real content ships) ───────────────────
  placeholder_red:   { title: 'Red Window',   w: 420, h: 300 },
  placeholder_green: { title: 'Green Window', w: 420, h: 300 },
  placeholder_blue:  { title: 'Blue Window',  w: 420, h: 300 },
};

const INITIAL_Z    = 10;

/* ── Spawn Logic ─────────────────────────────────────────────────────────── */
function getSpawnPosition(cascadeIndex, winWidth, winHeight) {
  if (typeof window === 'undefined') return { x: 140, y: 90 };

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // 5 distinct regions to prevent visual overlap stacking
  const REGIONS = [
    { x: vw * 0.35, y: 80 },  // top-center
    { x: vw * 0.60, y: 140 }, // right-of-center
    { x: vw * 0.45, y: 220 }, // lower-center-right
    { x: vw * 0.70, y: 90 },  // far-right
    { x: vw * 0.25, y: 180 }, // secondary-cascade
  ];

  const regionIndex = cascadeIndex % REGIONS.length;
  // Advance internal cascade only when returning to the same region
  const internalIndex = Math.floor(cascadeIndex / REGIONS.length) % 6; 
  const CASCADE_STEP = 34;

  let x = REGIONS[regionIndex].x + (internalIndex * CASCADE_STEP);
  let y = REGIONS[regionIndex].y + (internalIndex * CASCADE_STEP);

  // Safe boundaries (excluding icon column, top bar, and taskbar)
  const TOP_BAR_H = 32;
  const TASKBAR_H = 48;
  const ICON_COL_W = 100;

  // Clamp right/bottom first
  if (x + winWidth > vw) x = vw - winWidth - 10;
  if (y + winHeight > vh - TASKBAR_H) y = vh - TASKBAR_H - winHeight - 10;
  
  // Clamp left/top as absolute priority if window is huge
  if (x < ICON_COL_W) x = ICON_COL_W + 10;
  if (y < TOP_BAR_H) y = TOP_BAR_H + 10;

  return { x: Math.floor(x), y: Math.floor(y) };
}

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

      const { x, y } = getSpawnPosition(state.cascade, defaults.w, defaults.h);
      const topZ  = state.topZ + 1;
      const newWin = {
        id:        `${appId}-${Date.now()}`,
        appId,
        title:     defaults.title,
        x,
        y,
        w:         defaults.w,
        h:         defaults.h,
        homeX:     x,
        homeY:     y,
        homeW:     defaults.w,
        homeH:     defaults.h,
        preEnlarge: null,
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

    case 'UPDATE_BOUNDS':
      return {
        ...state,
        windows: state.windows.map(w =>
          w.id === action.id ? { ...w, ...action.bounds } : w,
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

  const closeWindow        = useCallback((id)       => dispatch({ type: 'CLOSE',    id }),    []);
  const minimizeWindow     = useCallback((id)       => dispatch({ type: 'MINIMIZE', id }),    []);
  const focusWindow        = useCallback((id)       => dispatch({ type: 'FOCUS',    id }),    []);
  const moveWindow         = useCallback((id, x, y) => dispatch({ type: 'MOVE', id, x, y }), []);
  const updateWindowBounds = useCallback((id, bounds) => dispatch({ type: 'UPDATE_BOUNDS', id, bounds }), []);

  return {
    windows: state.windows,
    openApp,
    closeWindow,
    minimizeWindow,
    focusWindow,
    moveWindow,
    updateWindowBounds,
  };
}
