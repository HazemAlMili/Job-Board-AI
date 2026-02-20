import { supabase } from '../lib/supabaseClient';
import type { User, LoginDTO, RegisterDTO } from '../types';

/**
 * Role resolution priority:
 * 1. profiles table (most authoritative — set by DB trigger or admin)
 * 2. user_metadata.role (set during signUp — works before profiles table exists)
 * 3. 'applicant' (safe default)
 */
const fetchUserRole = async (userId: string, metadataRole?: string): Promise<'applicant' | 'hr'> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (!error && data?.role) {
      return data.role as 'applicant' | 'hr';
    }
  } catch (_) {
    // profiles table not yet configured — fall through
  }
  // Fallback: use the role that was stored in user_metadata at signup
  if (metadataRole === 'hr') return 'hr';
  return 'applicant';
};

const mapSupabaseUser = async (user: any): Promise<User> => {
  const metadataRole = user.user_metadata?.role as string | undefined;
  const role = await fetchUserRole(user.id, metadataRole);
  return {
    id: user.id,
    email: user.email || '',
    full_name: user.user_metadata?.full_name || '',
    role,
    created_at: user.created_at,
  };
};

export const authService = {
  // Login user
  login: async (credentials: LoginDTO) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      console.error('Login attempt failed:', error.message);
      throw error;
    }

    const user = await mapSupabaseUser(data.user);
    return { user, token: data.session?.access_token };
  },

  // Register new user (applicant or hr)
  register: async (userData: RegisterDTO) => {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          full_name: userData.full_name,
          role: userData.role || 'applicant',
        },
      },
    });

    if (error) throw error;
    if (!data.user) throw new Error('Registration failed');

    const user = await mapSupabaseUser(data.user);
    return { user, token: data.session?.access_token };
  },

  // Get current authenticated user (always fetches fresh role)
  getCurrentUser: async (): Promise<User> => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw error || new Error('No user found');
    return await mapSupabaseUser(user);
  },

  // Logout
  logout: async () => {
    await supabase.auth.signOut();
  },

  // Get current session token
  getToken: async (): Promise<string | null> => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || null;
  },

  // Check if user is authenticated
  isAuthenticated: async (): Promise<boolean> => {
    const { data } = await supabase.auth.getSession();
    return !!data.session;
  },

  // Update profile
  updateProfile: async (data: { full_name?: string; email?: string; password?: string; current_password?: string }) => {
    const updates: any = {};
    if (data.email) updates.email = data.email;
    if (data.password) updates.password = data.password;
    if (data.full_name) updates.data = { full_name: data.full_name };

    const { data: { user }, error } = await supabase.auth.updateUser(updates);

    if (error) throw error;
    if (!user) throw new Error('Update failed');

    const mappedUser = await mapSupabaseUser(user);
    const { data: sessionData } = await supabase.auth.getSession();
    return { user: mappedUser, token: sessionData.session?.access_token };
  },
};
