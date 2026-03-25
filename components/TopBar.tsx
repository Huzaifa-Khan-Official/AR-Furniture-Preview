'use client';

import { RotateCcw, HelpCircle } from 'lucide-react';

interface TopBarProps {
  onReset: () => void;
  onHelp: () => void;
  message: string;
}

export function TopBar({ onReset, onHelp, message }: TopBarProps) {
  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/20">
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {message}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onHelp}
            className="p-2 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-600 transition-colors"
            title="Help"
          >
            <HelpCircle size={20} />
          </button>
          <button
            onClick={onReset}
            className="p-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-600 transition-colors"
            title="Reset all"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
