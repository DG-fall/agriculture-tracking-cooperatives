import { createClient } from '@supabase/supabase-js';

// Utilisez les variables d'environnement ou remplacez par vos valeurs
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'your-supabase-url';
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

// Provide a WebSocket constructor so realtime-js doesn't throw during
// Node-based web export (Node < 22 has no global WebSocket).
const wsCtor =
  (globalThis as any).WebSocket ||
  class {
    constructor() { /* no-op stub for build-time only */ }
    close() {}
    addEventListener() {}
    removeEventListener() {}
    send() {}
  };

const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: { transport: wsCtor as any },
  auth: { persistSession: true, autoRefreshToken: true },
});

export { supabase };
