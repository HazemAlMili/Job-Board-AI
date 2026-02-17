import { supabase } from '../lib/supabaseClient';
import type { User, LoginDTO, RegisterDTO } from '../types';

const mapSupabaseUser = (user: any): User => {
  return {
    id: user.id,
    email: user.email || '',
    full_name: user.user_metadata?.full_name || '',
    role: user.user_metadata?.role || 'applicant',
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

    if (error) throw error;
    
    const user = mapSupabaseUser(data.user);
    // Mimic the old response structure
    return { user, token: data.session?.access_token };
  },

  // Register new applicant
  register: async (userData: RegisterDTO) => {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          full_name: userData.full_name,
          role: 'applicant', // Default role
        },
      },
    });

    if (error) throw error;

    // If email confirmation is enabled, user might be null or session null
    if (!data.user) throw new Error('Registration failed');

    const user = mapSupabaseUser(data.user);
    return { user, token: data.session?.access_token };
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw error || new Error('No user found');
    return mapSupabaseUser(user);
  },

  // Logout
  logout: async () => {
    await supabase.auth.signOut();
    sessionStorage.removeItem('token'); // Keep cleaning up just in case
    sessionStorage.removeItem('user');
  },

  // Get token (Supabase handles this internally, but for compatibility)
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
  updateProfile: async (data: { full_name?: string; email?: string; password?: string, current_password?: string }) => {
    const updates: any = {};
    if (data.email) updates.email = data.email;
    if (data.password) updates.password = data.password;
    if (data.full_name) updates.data = { full_name: data.full_name };

    const { data: { user }, error } = await supabase.auth.updateUser(updates);

    if (error) throw error;
    if (!user) throw new Error('Update failed');

    return { user: mapSupabaseUser(user), token: (await supabase.auth.getSession()).data.session?.access_token };
  },
};
