'use client';

import { PlacedObject } from '@/hooks/useARState';
import { Trash2, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';

interface ControlsPanelProps {
  activeObject: PlacedObject | null;
  onRotate: (axis: 'x' | 'y' | 'z', angle: number) => void;
  onScale: (scale: number) => void;
  onDelete: () => void;
}

export function ControlsPanel({
  activeObject,
  onRotate,
  onScale,
  onDelete,
}: ControlsPanelProps) {
  if (!activeObject) {
    return (
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 text-center">
        <p className="text-gray-600 font-medium">Select an object to adjust</p>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900 capitalize">
          {activeObject.type}
        </h3>
        <button
          onClick={onDelete}
          className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
          title="Delete object"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <div className="space-y-4">
        {/* Rotation Controls */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Rotate
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['x', 'y', 'z'] as const).map(axis => (
              <div key={axis} className="space-y-2">
                <p className="text-xs font-medium text-gray-600 text-center capitalize">
                  {axis}-axis
                </p>
                <div className="flex gap-1">
                  <button
                    onClick={() => onRotate(axis, -15)}
                    className="flex-1 px-2 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold rounded-lg text-sm transition-colors"
                  >
                    −
                  </button>
                  <button
                    onClick={() => onRotate(axis, 15)}
                    className="flex-1 px-2 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold rounded-lg text-sm transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scale Controls */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Size: {activeObject.scale.toFixed(2)}x
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => onScale(Math.max(0.5, activeObject.scale - 0.2))}
              className="flex-1 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-600 font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <ZoomOut size={18} />
              Smaller
            </button>
            <button
              onClick={() => onScale(Math.min(2, activeObject.scale + 0.2))}
              className="flex-1 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-600 font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <ZoomIn size={18} />
              Larger
            </button>
          </div>
        </div>

        {/* Position Info */}
        <div className="bg-gray-50 rounded-lg p-3 text-xs font-mono text-gray-600 space-y-1">
          <p>
            Position: ({activeObject.position.x.toFixed(2)}, {activeObject.position.y.toFixed(2)})
          </p>
          <p>
            Rotation: ({activeObject.rotation.x.toFixed(0)}°, {activeObject.rotation.y.toFixed(0)}°,{' '}
            {activeObject.rotation.z.toFixed(0)}°)
          </p>
        </div>
      </div>
    </div>
  );
}
