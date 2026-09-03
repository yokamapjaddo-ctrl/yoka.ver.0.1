import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// anon key 以外の秘密鍵はフロントに置かない。
export const supabase = url && anonKey ? createClient(url, anonKey) : null;
