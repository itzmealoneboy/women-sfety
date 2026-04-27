import React, { useState, useEffect, useRef } from 'react';

const LanguageSelector = ({ 
  languages = [],
  defaultLanguage = 'en',
  onLanguageChange,
  showFlags = true,
  showNativeNames = true,
  position = 'bottom',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const dropdownRef = useRef(null);

  // Default languages if none provided
  const defaultLanguages = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', direction: 'ltr' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', direction: 'ltr' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', direction: 'ltr' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', direction: 'ltr' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', direction: 'ltr' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', direction: 'ltr' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', direction: 'ltr' },
    { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', direction: 'ltr' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', direction: 'ltr' },
    { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', direction: 'ltr' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', direction: 'rtl' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', direction: 'ltr' }
  ];

  const languageList = languages.length > 0 ? languages : defaultLanguages;

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('selected_language');
    const initialLanguage = savedLanguage || defaultLanguage;
    const language = languageList.find(lang => lang.code === initialLanguage);
    if (language) {
      setSelectedLanguage(language);
      applyLanguage(language);
    }
  }, []);

  useEffect(() => {
    // Handle click outside to close dropdown
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const applyLanguage = (language) => {
    // Update HTML direction for RTL support
    document.documentElement.dir = language.direction || 'ltr';
    document.documentElement.lang = language.code;
    
    // Save to localStorage
    localStorage.setItem('selected_language', language.code);
    
    // In a real app, you would update i18n library here
    if (window.i18n) {
      window.i18n.changeLanguage(language.code);
    }
    
    // Callback
    if (onLanguageChange) {
      onLanguageChange(language);
    }
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    applyLanguage(language);
    setIsOpen(false);
  };

  const getPositionClass = () => {
    switch (position) {
      case 'top':
        return 'dropdown-top';
      case 'bottom':
        return 'dropdown-bottom';
      case 'left':
        return 'dropdown-left';
      case 'right':
        return 'dropdown-right';
      default:
        return 'dropdown-bottom';
    }
  };

  return (
    <div className={`language-selector ${className}`} ref={dropdownRef}>
      <button 
        className="language-selector-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select language"
      >
        {showFlags && selectedLanguage && (
          <span className="language-flag">{selectedLanguage.flag}</span>
        )}
        <span className="language-name">
          {showNativeNames && selectedLanguage?.nativeName 
            ? selectedLanguage.nativeName 
            : selectedLanguage?.name}
        </span>
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className={`language-dropdown ${getPositionClass()}`}>
          <div className="dropdown-header">
            <h4>Select Language</h4>
          </div>
          <ul className="language-list">
            {languageList.map((language) => (
              <li key={language.code}>
                <button
                  className={`language-option ${selectedLanguage?.code === language.code ? 'active' : ''}`}
                  onClick={() => handleLanguageSelect(language)}
                >
                  {showFlags && (
                    <span className="language-flag">{language.flag}</span>
                  )}
                  <span className="language-info">
                    <span className="language-name">
                      {showNativeNames && language.nativeName 
                        ? language.nativeName 
                        : language.name}
                    </span>
                    {showNativeNames && language.nativeName !== language.name && (
                      <span className="language-name-secondary">
                        {language.name}
                      </span>
                    )}
                  </span>
                  {selectedLanguage?.code === language.code && (
                    <span className="checkmark">✓</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <style jsx>{`
        .language-selector {
          position: relative;
          display: inline-block;
        }

        .language-selector-trigger {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
          font-family: inherit;
        }

        .language-selector-trigger:hover {
          background: #f7fafc;
          border-color: #cbd5e0;
        }

        .language-flag {
          font-size: 18px;
        }

        .language-name {
          color: #2d3748;
          font-weight: 500;
        }

        .dropdown-arrow {
          font-size: 10px;
          transition: transform 0.2s;
          color: #718096;
        }

        .dropdown-arrow.open {
          transform: rotate(180deg);
        }

        .language-dropdown {
          position: absolute;
          min-width: 200px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          overflow: hidden;
          animation: dropdownFadeIn 0.2s ease;
        }

        .dropdown-bottom {
          top: 100%;
          margin-top: 8px;
        }

        .dropdown-top {
          bottom: 100%;
          margin-bottom: 8px;
        }

        .dropdown-left {
          right: 0;
        }

        .dropdown-right {
          left: 0;
        }

        .dropdown-header {
          padding: 12px 16px;
          background: #f7fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .dropdown-header h4 {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
          color: #2d3748;
        }

        .language-list {
          list-style: none;
          margin: 0;
          padding: 8px 0;
          max-height: 300px;
          overflow-y: auto;
        }

        .language-option {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 10px 16px;
          border: none;
          background: none;
          cursor: pointer;
          transition: background 0.2s;
          font-family: inherit;
          font-size: 14px;
        }

        .language-option:hover {
          background: #f7fafc;
        }

        .language-option.active {
          background: #ebf8ff;
          color: #3182ce;
        }

        .language-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }

        .language-name-secondary {
          font-size: 12px;
          color: #718096;
        }

        .checkmark {
          color: #48bb78;
          font-weight: bold;
        }

        @keyframes dropdownFadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Scrollbar styling */
        .language-list::-webkit-scrollbar {
          width: 6px;
        }

        .language-list::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        .language-list::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 3px;
        }

        .language-list::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .language-dropdown {
            position: fixed;
            top: auto;
            bottom: auto;
            left: 50%;
            transform: translateX(-50%);
            width: calc(100% - 32px);
            max-width: 300px;
          }

          .dropdown-bottom, .dropdown-top {
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
};

// Simple language selector without dropdown (for mobile)
export const SimpleLanguageSelector = ({ languages = [], onLanguageChange }) => {
  const [selectedCode, setSelectedCode] = useState('en');

  useEffect(() => {
    const saved = localStorage.getItem('selected_language');
    if (saved) setSelectedCode(saved);
  }, []);

  const handleChange = (e) => {
    const code = e.target.value;
    setSelectedCode(code);
    const language = languages.find(l => l.code === code);
    if (language) {
      localStorage.setItem('selected_language', code);
      if (onLanguageChange) onLanguageChange(language);
    }
  };

  return (
    <select 
      className="simple-language-selector"
      value={selectedCode}
      onChange={handleChange}
    >
      {languages.map(lang => (
        <option key={lang.code} value={lang.code}>
          {lang.flag} {lang.name}
        </option>
      ))}

      <style jsx>{`
        .simple-language-selector {
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: white;
          font-size: 14px;
          cursor: pointer;
          font-family: inherit;
        }
      `}</style>
    </select>
  );
};

// Language context provider for app-wide language management
export const LanguageContext = React.createContext();

export const LanguageProvider = ({ children, languages = [], defaultLanguage = 'en' }) => {
  const [currentLanguage, setCurrentLanguage] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('selected_language');
    const langCode = saved || defaultLanguage;
    const language = languages.find(l => l.code === langCode) || languages[0];
    if (language) {
      setCurrentLanguage(language);
    }
  }, []);

  const changeLanguage = (language) => {
    setCurrentLanguage(language);
    localStorage.setItem('selected_language', language.code);
    document.documentElement.dir = language.direction || 'ltr';
    document.documentElement.lang = language.code;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, languages }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook for using language in components
export const useLanguage = () => {
  const context = React.useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export default LanguageSelector;
