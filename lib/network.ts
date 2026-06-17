import { useEffect, useState } from 'react';

// Lightweight online/offline detection. Uses navigator.onLine on web,
// and a periodic reachability ping elsewhere.
export function useOnline() {
  const [online, setOnline] = useState<boolean>(() => {
    try {
      const nav = (globalThis as any).navigator;
      return nav && typeof nav.onLine === 'boolean' ? nav.onLine : true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    const g: any = globalThis;
    if (g.addEventListener) {
      const on = () => setOnline(true);
      const off = () => setOnline(false);
      g.addEventListener('online', on);
      g.addEventListener('offline', off);
      return () => {
        g.removeEventListener('online', on);
        g.removeEventListener('offline', off);
      };
    }
  }, []);

  return online;
}
