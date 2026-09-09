'use client';

import { useEffect, useState, startTransition } from 'react';

let cpu = 12;
let mem = 35;
let net = 120; // KB/s
let listeners = new Set();
let intervalId = null;

function tick() {
  cpu = Math.max(5, Math.min(40, cpu + Math.floor(Math.random() * 9) - 4));
  mem = Math.max(20, Math.min(60, mem + Math.floor(Math.random() * 5) - 2));
  net = Math.max(0, Math.min(999, net + Math.floor(Math.random() * 51) - 25));
  
  startTransition(() => {
    for (const listener of listeners) {
      listener({ cpu, mem, net });
    }
  });
}

export function useSystemStats() {
  const [stats, setStats] = useState({ cpu, mem, net });

  useEffect(() => {
    listeners.add(setStats);
    
    if (listeners.size === 1) {
      intervalId = setInterval(tick, 2500);
    }
    
    return () => {
      listeners.delete(setStats);
      if (listeners.size === 0 && intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };
  }, []);

  return stats;
}
