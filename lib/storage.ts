// Cross-platform key/value cache (offline-first).
// Uses localStorage on web; falls back to in-memory map elsewhere.
const mem = new Map<string, string>();

function hasLocalStorage() {
  try {
    return typeof globalThis !== 'undefined' && !!(globalThis as any).localStorage;
  } catch {
    return false;
  }
}

export const storage = {
  get(key: string): string | null {
    if (hasLocalStorage()) return (globalThis as any).localStorage.getItem(key);
    return mem.has(key) ? (mem.get(key) as string) : null;
  },
  set(key: string, value: string) {
    if (hasLocalStorage()) {
      try { (globalThis as any).localStorage.setItem(key, value); return; } catch {}
    }
    mem.set(key, value);
  },
  remove(key: string) {
    if (hasLocalStorage()) {
      try { (globalThis as any).localStorage.removeItem(key); return; } catch {}
    }
    mem.delete(key);
  },
  getJSON<T>(key: string, fallback: T): T {
    const v = this.get(key);
    if (!v) return fallback;
    try { return JSON.parse(v) as T; } catch { return fallback; }
  },
  setJSON(key: string, value: unknown) {
    this.set(key, JSON.stringify(value));
  },
};

// Keys
export const K = {
  lots: (coopId: string) => `traceagri.lots.${coopId}`,
  pending: 'traceagri.pending',
};

// Pending action queue (offline writes)
export type PendingAction = {
  id: string;
  kind: 'update_status' | 'add_history' | 'create_lot';
  payload: any;
  ts: string;
};

export function getPending(): PendingAction[] {
  return storage.getJSON<PendingAction[]>(K.pending, []);
}
export function pushPending(a: PendingAction) {
  const list = getPending();
  list.push(a);
  storage.setJSON(K.pending, list);
}
export function clearPending() {
  storage.setJSON(K.pending, []);
}
export function setPending(list: PendingAction[]) {
  storage.setJSON(K.pending, list);
}
