import api from './api';
import type { User, LoginDTO, RegisterDTO } from '../types';


export const authService = {
  // Login user
  login: async (credentials: LoginDTO) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      sessionStorage.setItem('token', response.data.token);
      sessionStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Register new applicant
  register: async (userData: RegisterDTO) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      sessionStorage.setItem('token', response.data.token);
      sessionStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    sessionStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  },

  // Logout
  logout: () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  },

  // Get token from localStorage
  getToken: (): string | null => {
    return sessionStorage.getItem('token');
  },

  // Get user from localStorage
  getStoredUser: (): User | null => {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!sessionStorage.getItem('token');
  },

  // Check if user is HR
  isHR: (): boolean => {
    const user = authService.getStoredUser();
    return user?.role === 'hr';
  },
};
