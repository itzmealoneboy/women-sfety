import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,

      // Set user
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        isLoading: false 
      }),

      // Set loading
      setLoading: (isLoading) => set({ isLoading }),
      
      // Set error
      setError: (error) => set({ error }),

      // Clear error
      clearError: () => set({ error: null }),

      // Login with email/password
      login: async (email, password, additionalData = {}) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/login', { 
            email, 
            password,
            ...additionalData 
          });
          
          const { user, token } = response.data.data;
          localStorage.setItem('token', token);
          
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false,
            error: null
          });
          return { success: true, user };
        } catch (error) {
          // Fallback to mock login if backend is unreachable
          if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
            console.warn('Backend is unreachable, using mock login for development.');
            const mockUser = { id: 'mock-1', name: 'Demo User', email: email || 'demo@gmail.com' };
            localStorage.setItem('token', 'mock-token');
            set({ user: mockUser, isAuthenticated: true, isLoading: false, error: null });
            return { success: true, user: mockUser };
          }
          
          const errorMessage = error.response?.data?.message || 'Login failed';
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      // Register new user
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post('/auth/register', userData);
          
          const { user, token } = response.data.data;
          localStorage.setItem('token', token);
          
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false,
            error: null
          });
          return { success: true, user };
        } catch (error) {
          console.error('Register error:', error);
          const errorMessage = error.response?.data?.message || 'Registration failed';
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      // Logout
      logout: async () => {
        set({ isLoading: true });
        try {
          localStorage.removeItem('token');
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false,
            error: null 
          });
          return { success: true };
        } catch (error) {
          console.error('Logout error:', error);
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // Reset Password
      resetPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          await api.post('/auth/reset-password', { email });
          set({ isLoading: false });
          return { success: true };
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Reset password failed';
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      // Google Login
      googleLogin: async () => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would involve a popup and then sending the token to our backend
          // For now, we'll simulate it or use a redirect
          window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
          return { success: true };
        } catch (error) {
          console.error('Google login error:', error);
          set({ error: 'Google login failed', isLoading: false });
          return { success: false, error: 'Google login failed' };
        }
      },

      // Update Profile
      updateProfile: async (profileData) => {
        if (!get().user) return { success: false, error: 'User not authenticated' };
        
        set({ isLoading: true, error: null });
        try {
          const response = await api.put('/auth/profile', profileData);
          const updatedUser = response.data.data;
          
          set({ user: updatedUser, isLoading: false });
          return { success: true, user: updatedUser };
        } catch (error) {
          console.error('Update profile error:', error);
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // Initialize auth listener
      initAuthListener: () => {
        const token = localStorage.getItem('token');
        if (token === 'mock-token') {
          // Bypass backend verification if using mock token
          set({ 
            user: { id: 'mock-1', name: 'Demo User', email: 'demo@gmail.com' }, 
            isAuthenticated: true, 
            isLoading: false 
          });
          return () => {};
        }

        if (token) {
          // Verify token and get user data
          api.get('/auth/me')
            .then(response => {
              set({ 
                user: response.data.data, 
                isAuthenticated: true, 
                isLoading: false 
              });
            })
            .catch(() => {
              localStorage.removeItem('token');
              set({ user: null, isAuthenticated: false, isLoading: false });
            });
        } else {
          set({ isLoading: false });
        }
        return () => {};
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);

export { useAuthStore };
