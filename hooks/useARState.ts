import { useState, useCallback } from 'react';

export interface PlacedObject {
  id: string;
  type: 'chair' | 'table' | 'sofa' | 'lamp';
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: number;
}

export interface ARState {
  selectedFurniture: string | null;
  placedObjects: PlacedObject[];
  activeObjectId: string | null;
  cameraReady: boolean;
  message: string;
}

const FURNITURE_TYPES = [
  { id: 'chair', name: 'Chair', icon: '🪑' },
  { id: 'table', name: 'Table', icon: '🛋' },
  { id: 'sofa', name: 'Sofa', icon: '🛏' },
  { id: 'lamp', name: 'Lamp', icon: '💡' },
];

export function useARState() {
  const [state, setState] = useState<ARState>({
    selectedFurniture: null,
    placedObjects: [],
    activeObjectId: null,
    cameraReady: false,
    message: 'Ready to place furniture',
  });

  const selectFurniture = useCallback((furnitureId: string) => {
    setState(prev => ({
      ...prev,
      selectedFurniture: furnitureId,
      message: `Selected ${FURNITURE_TYPES.find(f => f.id === furnitureId)?.name}. Tap on the camera to place.`,
    }));
  }, []);

  const placeObject = useCallback((x: number, y: number) => {
    setState(prev => {
      if (!prev.selectedFurniture) {
        return { ...prev, message: 'Select a furniture item first' };
      }

      const newObject: PlacedObject = {
        id: `${prev.selectedFurniture}-${Date.now()}`,
        type: prev.selectedFurniture as any,
        position: { x, y, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: 1,
      };

      return {
        ...prev,
        placedObjects: [...prev.placedObjects, newObject],
        activeObjectId: newObject.id,
        message: `Placed ${FURNITURE_TYPES.find(f => f.id === prev.selectedFurniture)?.name}. Use controls to adjust.`,
      };
    });
  }, []);

  const updateObject = useCallback(
    (id: string, updates: Partial<PlacedObject>) => {
      setState(prev => ({
        ...prev,
        placedObjects: prev.placedObjects.map(obj =>
          obj.id === id ? { ...obj, ...updates } : obj
        ),
      }));
    },
    []
  );

  const deleteObject = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      placedObjects: prev.placedObjects.filter(obj => obj.id !== id),
      activeObjectId: prev.activeObjectId === id ? null : prev.activeObjectId,
      message: 'Object deleted',
    }));
  }, []);

  const setActiveObject = useCallback((id: string | null) => {
    setState(prev => ({
      ...prev,
      activeObjectId: id,
      message: id ? 'Object selected' : 'No object selected',
    }));
  }, []);

  const reset = useCallback(() => {
    setState({
      selectedFurniture: null,
      placedObjects: [],
      activeObjectId: null,
      cameraReady: false,
      message: 'Reset. Ready to place furniture',
    });
  }, []);

  const setCameraReady = useCallback((ready: boolean) => {
    setState(prev => ({
      ...prev,
      cameraReady: ready,
      message: ready ? 'Camera ready' : 'Initializing camera...',
    }));
  }, []);

  const setMessage = useCallback((message: string) => {
    setState(prev => ({ ...prev, message }));
  }, []);

  return {
    state,
    selectFurniture,
    placeObject,
    updateObject,
    deleteObject,
    setActiveObject,
    reset,
    setCameraReady,
    setMessage,
    furnitureTypes: FURNITURE_TYPES,
  };
}
