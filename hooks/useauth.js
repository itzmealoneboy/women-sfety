import { useEffect } from 'react';
import { useAuthStore } from '../store/authstores';

export const useAuth = () => {
  const {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    googleLogin,
    resetPassword,
    updateProfile,
    updateSettings,
    uploadProfilePhoto,
    clearError
  } = useAuthStore();

  // Initialize auth on mount
  useEffect(() => {
    useAuthStore.getState().initAuthListener();
  }, []);

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  // Check if email is verified
  const isEmailVerified = user?.emailVerified || false;

  // Get user display name
  const displayName = user?.name || user?.email?.split('@')[0] || 'User';

  // Get user initials
  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Check if user has completed profile
  const hasCompletedProfile = () => {
    return !!(
      user?.name &&
      user?.phone &&
      user?.settings
    );
  };

  // Get user settings
  const getUserSettings = () => {
    return user?.settings || {};
  };

  // Update user setting
  const updateUserSetting = async (key, value) => {
    const settings = getUserSettings();
    return await updateSettings({
      ...settings,
      [key]: value
    });
  };

  return {
    // State
    user,
    loading: isLoading,
    error,
    
    // Getters
    isAuthenticated,
    isAdmin,
    isEmailVerified,
    displayName,
    getUserInitials,
    hasCompletedProfile,
    getUserSettings,
    
    // Actions
    login,
    register,
    logout,
    googleLogin,
    forgotPassword: resetPassword,
    updateProfile,
    updateSettings,
    updateUserSetting,
    uploadProfilePhoto,
    clearError
  };
};
