import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug log per instructions
console.log("Supabase Client Init - Key exists:", !!supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Supabase configuration error: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is undefined. " +
    "Check your .env file or Vercel environment variables."
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://missing-url.supabase.co',
  supabaseAnonKey || 'missing-key'
);
