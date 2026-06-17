import { createClient } from '@supabase/supabase-js';

// Utilisez les variables d'environnement ou remplacez par vos valeurs.
// Les valeurs de repli sont des placeholders VALIDES afin que le build web
// (rendu statique) n'échoue pas lorsque les variables d'env sont absentes.
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'public-anon-key-placeholder';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
