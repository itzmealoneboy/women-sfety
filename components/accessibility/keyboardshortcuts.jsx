import { useState, useEffect } from 'react';
import { KeyboardIcon, CommandLineIcon } from '@heroicons/react/24/outline';

const KeyboardShortcuts = () => {
  const [showHelp, setShowHelp] = useState(false);

  const shortcuts = [
    { key: 'Ctrl + H', action: 'Show help / shortcuts' },
    { key: 'Ctrl + S', action: 'Trigger SOS emergency' },
    { key: 'Ctrl + T', action: 'Start live tracking' },
    { key: 'Ctrl + F', action: 'Open fake call' },
    { key: 'Ctrl + L', action: 'Go to legal hub' },
    { key: 'Ctrl + M', action: 'Toggle silent mode' },
    { key: 'Esc', action: 'Close modal / Cancel' },
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'h') {
        e.preventDefault();
        setShowHelp(!showHelp);
      }
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        window.location.href = '/sos';
      }
      if (e.ctrlKey && e.key === 't') {
        e.preventDefault();
        window.location.href = '/live-tracking';
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showHelp]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3"><KeyboardIcon className="w-6 h-6 text-primary-500" /><div><p className="font-medium">Keyboard Shortcuts</p><p className="text-xs text-gray-500">Press Ctrl+H to view shortcuts</p></div></div>
        <button onClick={() => setShowHelp(!showHelp)} className="px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm">Show</button>
      </div>
      {showHelp && (
        <div className="p-4 bg-gray-50 rounded-lg space-y-2">
          {shortcuts.map(s => (
            <div key={s.key} className="flex justify-between text-sm"><kbd className="px-2 py-1 bg-gray-200 rounded font-mono text-xs">{s.key}</kbd><span>{s.action}</span></div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KeyboardShortcuts;
