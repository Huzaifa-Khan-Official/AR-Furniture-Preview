'use client';

import { PlacedObject } from '@/hooks/useARState';
import { Trash2 } from 'lucide-react';

interface ControlsPanelProps {
  activeObject: PlacedObject | null;
  onDelete: () => void;
}

export function ControlsPanel({
  activeObject,
  onDelete,
}: ControlsPanelProps) {
  if (!activeObject) {
    return (
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 text-center">
        <p className="text-gray-600 font-medium">Select an object on camera to adjust</p>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900 capitalize">
          {activeObject.type}
        </h3>
        <button
          onClick={onDelete}
          className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
          title="Delete object"
        >
          <Trash2 size={24} />
        </button>
      </div>

      <div className="space-y-4">
        {/* Gesture Controls Guide */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 space-y-3 border border-blue-200">
          <p className="font-semibold text-gray-900 text-sm">Screen Gestures</p>
          <div className="space-y-2 text-xs text-gray-700">
            <div className="flex gap-2">
              <span className="font-medium text-blue-600 min-w-fit">SWIPE:</span>
              <span>Move furniture left/right</span>
            </div>
            <div className="flex gap-2">
              <span className="font-medium text-blue-600 min-w-fit">DRAG UP/DOWN:</span>
              <span>Rotate furniture</span>
            </div>
            <div className="flex gap-2">
              <span className="font-medium text-blue-600 min-w-fit">PINCH:</span>
              <span>Scale furniture (2 fingers)</span>
            </div>
          </div>
        </div>

        {/* Object Info */}
        <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-2 border border-gray-200">
          <div className="flex justify-between">
            <span className="text-gray-600">Position:</span>
            <span className="font-mono text-gray-900">({activeObject.position.x.toFixed(2)}, {activeObject.position.y.toFixed(2)})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Size:</span>
            <span className="font-mono text-gray-900">{activeObject.scale.toFixed(2)}x</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Rotation:</span>
            <span className="font-mono text-gray-900">{activeObject.rotation.z.toFixed(0)}°</span>
          </div>
        </div>
      </div>
    </div>
  );
}
