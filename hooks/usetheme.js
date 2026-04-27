import { useState, useEffect, useCallback } from 'react';

export const useTheme = () => {
  const [theme, setThemeState] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'light';
  });
  
  const [systemTheme, setSystemTheme] = useState('light');
  const [autoTheme, setAutoTheme] = useState(true);

  // Detect system theme
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    const handler = (e) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
      if (autoTheme) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [autoTheme]);

  // Apply theme
  const applyTheme = useCallback((newTheme) => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
    
    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        newTheme === 'dark' ? '#1a202c' : '#667eea'
      );
    }
  }, []);

  // Set theme
  const setTheme = useCallback((newTheme) => {
    setThemeState(newTheme);
    setAutoTheme(false);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  }, [applyTheme]);

  // Toggle theme
  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }, [theme, setTheme]);

  // Enable auto theme
  const enableAutoTheme = useCallback(() => {
    setAutoTheme(true);
    localStorage.removeItem('theme');
    setThemeState(systemTheme);
    applyTheme(systemTheme);
  }, [systemTheme, applyTheme]);

  // Disable auto theme
  const disableAutoTheme = useCallback(() => {
    setAutoTheme(false);
  }, []);

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      setThemeState(savedTheme);
      setAutoTheme(false);
      applyTheme(savedTheme);
    } else {
      setThemeState(systemTheme);
      applyTheme(systemTheme);
    }
  }, [systemTheme, applyTheme]);

  // Get CSS variables for current theme
  const getThemeVariables = useCallback(() => {
    const isDark = (autoTheme ? systemTheme : theme) === 'dark';
    
    return {
      '--bg-primary': isDark ? '#1a202c' : '#ffffff',
      '--bg-secondary': isDark ? '#2d3748' : '#f7fafc',
      '--text-primary': isDark ? '#f7fafc' : '#2d3748',
      '--text-secondary': isDark ? '#a0aec0' : '#718096',
      '--border-color': isDark ? '#4a5568' : '#e2e8f0',
      '--primary-color': '#667eea',
      '--secondary-color': '#764ba2',
      '--success-color': '#4CAF50',
      '--danger-color': '#ff4757',
      '--warning-color': '#ffa502'
    };
  }, [theme, systemTheme, autoTheme]);

  // Get current theme colors
  const getThemeColors = useCallback(() => {
    const isDark = (autoTheme ? systemTheme : theme) === 'dark';
    
    return {
      background: isDark ? '#1a202c' : '#ffffff',
      surface: isDark ? '#2d3748' : '#f7fafc',
      text: isDark ? '#f7fafc' : '#2d3748',
      textSecondary: isDark ? '#a0aec0' : '#718096',
      border: isDark ? '#4a5568' : '#e2e8f0',
      primary: '#667eea',
      secondary: '#764ba2',
      success: '#4CAF50',
      danger: '#ff4757',
      warning: '#ffa502'
    };
  }, [theme, systemTheme, autoTheme]);

  return {
    // State
    theme: autoTheme ? systemTheme : theme,
    actualTheme: theme,
    systemTheme,
    autoTheme,
    
    // Actions
    setTheme,
    toggleTheme,
    enableAutoTheme,
    disableAutoTheme,
    
    // Utilities
    getThemeVariables,
    getThemeColors,
    
    // Helpers
    isDark: (autoTheme ? systemTheme : theme) === 'dark',
    isLight: (autoTheme ? systemTheme : theme) === 'light'
  };
};
