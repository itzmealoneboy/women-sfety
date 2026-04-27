import { useState, useEffect } from 'react';
import { EyeIcon } from '@heroicons/react/24/outline';

const FocusIndicator = () => {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (enabled) {
      document.documentElement.classList.add('show-focus');
      localStorage.setItem('focusIndicator', 'true');
    } else {
      document.documentElement.classList.remove('show-focus');
      localStorage.setItem('focusIndicator', 'false');
    }
  }, [enabled]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3"><EyeIcon className="w-6 h-6 text-primary-500" /><div><p className="font-medium">Focus Indicator</p><p className="text-xs text-gray-500">Highlight focused elements for keyboard navigation</p></div></div>
        <button onClick={() => setEnabled(!enabled)} className={`relative w-12 h-6 rounded-full transition ${enabled ? 'bg-primary-500' : 'bg-gray-300'}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${enabled ? 'right-1' : 'left-1'}`} /></button>
      </div>
      <div className="bg-primary-50 p-3 rounded-lg text-center text-sm">Try pressing Tab to see focus indicator</div>
    </div>
  );
};

export default FocusIndicator;
