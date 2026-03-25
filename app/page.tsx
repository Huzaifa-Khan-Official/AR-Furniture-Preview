'use client';

import { useState } from 'react';
import { useARState, PlacedObject } from '@/hooks/useARState';
import { ARViewer } from '@/components/ARViewer';
import { ControlsPanel } from '@/components/ControlsPanel';
import { FurnitureSelector } from '@/components/FurnitureSelector';
import { TopBar } from '@/components/TopBar';
import { HelpModal } from '@/components/HelpModal';

export default function Home() {
  const {
    state,
    selectFurniture,
    placeObject,
    updateObject,
    deleteObject,
    setActiveObject,
    reset,
    setCameraReady,
    furnitureTypes,
  } = useARState();

  const [showHelp, setShowHelp] = useState(false);

  const activeObject = state.placedObjects.find(obj => obj.id === state.activeObjectId);

  const handleRotate = (axis: 'x' | 'y' | 'z', angle: number) => {
    if (activeObject) {
      const newRotation = { ...activeObject.rotation };
      newRotation[axis] = (newRotation[axis] + angle) % 360;
      updateObject(activeObject.id, { rotation: newRotation });
    }
  };

  const handleScale = (scale: number) => {
    if (activeObject) {
      updateObject(activeObject.id, { scale });
    }
  };

  const handleDelete = () => {
    if (activeObject) {
      deleteObject(activeObject.id);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          AR Furniture Preview
        </h1>
        <p className="text-gray-600">
          Visualize furniture in your space with augmented reality
        </p>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {/* Left Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <TopBar
            onReset={reset}
            onHelp={() => setShowHelp(true)}
            message={state.message}
          />
          <FurnitureSelector
            items={furnitureTypes}
            selected={state.selectedFurniture}
            onSelect={selectFurniture}
          />
          <ControlsPanel
            activeObject={activeObject || null}
            onRotate={handleRotate}
            onScale={handleScale}
            onDelete={handleDelete}
          />
        </div>

        {/* Main AR Viewer */}
        <div className="lg:col-span-3 aspect-video lg:aspect-auto lg:h-96 rounded-2xl overflow-hidden">
          <ARViewer
            placedObjects={state.placedObjects}
            activeObjectId={state.activeObjectId}
            onPlaceObject={placeObject}
            onCameraReady={setCameraReady}
            onObjectSelect={setActiveObject}
          />
        </div>
      </div>

      {/* Scene Summary */}
      <div className="mt-6 bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{state.placedObjects.length}</p>
            <p className="text-sm text-gray-600">Objects Placed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {state.selectedFurniture
                ? furnitureTypes.find(f => f.id === state.selectedFurniture)?.name || 'None'
                : 'None'}
            </p>
            <p className="text-sm text-gray-600">Selected</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {activeObject ? activeObject.type : 'None'}
            </p>
            <p className="text-sm text-gray-600">Active Object</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-amber-600">
              {state.cameraReady ? 'Ready' : 'Loading...'}
            </p>
            <p className="text-sm text-gray-600">Camera Status</p>
          </div>
        </div>
      </div>

      {/* Help Modal */}
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </main>
  );
}
