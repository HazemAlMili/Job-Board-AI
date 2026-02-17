import { createClient } from '@supabase/supabase-js';

const initSupabase = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

  console.log("Supabase Client Pre-Init Check:");
  console.log("- URL exists:", !!url);
  console.log("- Key exists:", !!key);

  if (!url || !key) {
    console.error("Supabase credentials missing during initialization!");
  }

  // Fallback values prevent the client from crashing on initialization if keys are missing,
  // though requests will still fail with a 401/403 or "No apikey" error.
  return createClient(
    url || 'https://missing-url.supabase.co',
    key || 'missing-key'
  );
};

export const supabase = initSupabase();
