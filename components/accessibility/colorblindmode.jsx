import { useState, useEffect } from 'react';
import { EyeIcon } from '@heroicons/react/24/outline';

const ColorBlindMode = () => {
  const [mode, setMode] = useState('none');

  const modes = [
    { id: 'none', name: 'Normal Vision' },
    { id: 'protanopia', name: 'Protanopia (Red-blind)' },
    { id: 'deuteranopia', name: 'Deuteranopia (Green-blind)' },
    { id: 'tritanopia', name: 'Tritanopia (Blue-blind)' },
  ];

  useEffect(() => {
    document.documentElement.classList.remove('protanopia', 'deuteranopia', 'tritanopia');
    if (mode !== 'none') {
      document.documentElement.classList.add(mode);
      localStorage.setItem('colorBlindMode', mode);
    }
  }, [mode]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2"><EyeIcon className="w-5 h-5 text-primary-500" /><span className="font-medium">Color Blind Mode</span></div>
      <div className="grid grid-cols-2 gap-2">
        {modes.map(m => (
          <button key={m.id} onClick={() => setMode(m.id)} className={`p-3 rounded-lg border-2 transition ${mode === m.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}>{m.name}</button>
        ))}
      </div>
    </div>
  );
};

export default ColorBlindMode;
