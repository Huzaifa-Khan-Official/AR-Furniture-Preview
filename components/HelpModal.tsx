'use client';

import { X } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full max-h-96 overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">How to Use</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4 text-gray-700 text-sm leading-relaxed">
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900">1. Select Furniture</h3>
            <p>
              Choose a furniture item from the selector panel on the left. You'll see it highlighted in blue.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900">2. Place Objects</h3>
            <p>
              Tap anywhere on the camera view to place your selected furniture in the scene.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900">3. Adjust Objects</h3>
            <p>
              Click on a placed object to select it (it will turn blue). Use the controls panel to:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-1">
              <li>Rotate on X, Y, Z axes</li>
              <li>Scale up or down</li>
              <li>View position information</li>
              <li>Delete the object</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900">4. Reset Scene</h3>
            <p>
              Click the reset button in the top bar to clear all objects and start over.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-blue-900 text-xs">
            <p className="font-semibold mb-1">Tip:</p>
            <p>Use a well-lit area for best camera performance. Objects scale from 0.5x to 2x their original size.</p>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
