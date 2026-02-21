import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug log to verify if the key is present in the build
console.log("Supabase Client Init - Key exists:", !!supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  const errorMsg = "Supabase environment variables are missing! Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel.";
  console.error(errorMsg);
}

// Fallback values prevent the client from crashing on initialization if keys are missing, 
// though requests will still fail with a 401/403 or "No apikey" error.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      storage: window.sessionStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);

