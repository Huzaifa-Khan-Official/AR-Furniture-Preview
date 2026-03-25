'use client';

import { cn } from '@/lib/utils';
import { FurniturePreview } from './FurniturePreview';
import type { FurnitureType } from '@/hooks/useARState';

interface FurnitureItem {
  id: string;
  name: string;
}

interface FurnitureSelectorProps {
  items: FurnitureItem[];
  selected: string | null;
  onSelect: (id: string) => void;
}

export function FurnitureSelector({
  items,
  selected,
  onSelect,
}: FurnitureSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-gray-900">Select Furniture</h3>
      <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={cn(
              'flex flex-col items-center gap-2 p-2 rounded-xl border-2 transition-all',
              selected === item.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-gray-300'
            )}
          >
            <div className="w-full aspect-square overflow-hidden rounded-lg">
              <FurniturePreview type={item.id as FurnitureType} />
            </div>
            <span className="text-xs font-semibold text-gray-700 capitalize">
              {item.name}
            </span>
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500 text-center italic">
        {selected ? 'Tap camera to place' : 'Select an item to begin'}
      </p>
    </div>
  );
}
