import { useState } from 'react';
import { LANGUAGES } from '../../config/constants';

const LanguageSelector = ({ onLanguageChange }) => {
  const [selected, setSelected] = useState('en');

  const handleChange = (lang) => {
    setSelected(lang.code);
    localStorage.setItem('language', lang.code);
    onLanguageChange?.(lang.code);
  };

  return (
    <div className="relative">
      <select value={selected} onChange={(e) => handleChange({ code: e.target.value })} className="p-2 border rounded-lg text-sm">
        {LANGUAGES.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
      </select>
    </div>
  );
};

export default LanguageSelector;
