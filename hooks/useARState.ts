import { useState, useCallback } from 'react';

export type FurnitureType = 'chair' | 'table' | 'sofa' | 'lamp';

type Vec3 = { x: number; y: number; z: number };

export interface PlacedObject {
  id: string;
  type: FurnitureType;
  position: Vec3;
  rotation: Vec3;
  scale: number;
  opacity?: number;
  /**
   * Full renderer configuration (colors/materials/geometry/etc) for 1:1 visuals.
   * Kept as `any` so palette items can carry arbitrary extra metadata/config safely.
   */
  modelConfig: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface ARState {
  selectedFurniture: FurnitureType | null;
  placedObjects: PlacedObject[];
  activeObjectId: string | null;
  cameraReady: boolean;
  message: string;
}

interface FurnitureTemplate {
  type: FurnitureType;
  rotation: Vec3;
  scale: number;
  opacity?: number;
  modelConfig: Record<string, any>;
  metadata?: Record<string, any>;
}

function deepClone<T>(value: T): T {
  // structuredClone keeps nested objects/arrays independent.
  // Fallback to JSON for older runtimes (templates are plain data).
  if (typeof structuredClone === 'function') return structuredClone(value);
  return JSON.parse(JSON.stringify(value)) as T;
}

export const FURNITURE_LIBRARY: Record<FurnitureType, FurnitureTemplate> = {
  chair: {
    type: 'chair',
    rotation: { x: 0, y: 0, z: 0 },
    scale: 1,
    opacity: 1,
    modelConfig: {
      seat: {
        geometry: { w: 0.4, h: 0.1, d: 0.4 },
        material: { color: 0x8b4513, roughness: 0.6 },
        position: { x: 0, y: 0.4, z: 0 },
      },
      backrest: {
        geometry: { w: 0.4, h: 0.6, d: 0.1 },
        material: { color: 0xa0522d, roughness: 0.6 },
        position: { x: 0, y: 0.7, z: -0.15 },
      },
      legs: {
        geometry: { w: 0.08, h: 0.4, d: 0.08 },
        material: { color: 0x654321, roughness: 0.5 },
        positions: [
          { x: 0.15, y: 0.2, z: 0.15 },
          { x: 0.15, y: 0.2, z: -0.15 },
          { x: -0.15, y: 0.2, z: 0.15 },
          { x: -0.15, y: 0.2, z: -0.15 },
        ],
      },
    },
    metadata: {},
  },
  table: {
    type: 'table',
    rotation: { x: 0, y: 0, z: 0 },
    scale: 1,
    opacity: 1,
    modelConfig: {
      top: {
        geometry: { w: 0.8, h: 0.08, d: 0.5 },
        material: { color: 0xd2691e, roughness: 0.4, metalness: 0.1 },
        position: { x: 0, y: 0.7, z: 0 },
      },
      legs: {
        geometry: { w: 0.1, h: 0.7, d: 0.1 },
        material: { color: 0x8b4513, roughness: 0.5 },
        positions: [
          { x: 0.3, y: 0.35, z: 0.15 },
          { x: 0.3, y: 0.35, z: -0.15 },
          { x: -0.3, y: 0.35, z: 0.15 },
          { x: -0.3, y: 0.35, z: -0.15 },
        ],
      },
    },
    metadata: {},
  },
  sofa: {
    type: 'sofa',
    rotation: { x: 0, y: 0, z: 0 },
    scale: 1,
    opacity: 1,
    modelConfig: {
      body: {
        geometry: { w: 1.2, h: 0.4, d: 0.6 },
        material: {
          color: 0xfffaad,
          roughness: 0.7,
          emissive: 0xf0e68c,
          emissiveIntensity: 0.2,
        },
        position: { x: 0, y: 0.3, z: 0 },
      },
      backrest: {
        geometry: { w: 1.2, h: 0.5, d: 0.2 },
        material: { color: 0xfff8dc, roughness: 0.7 },
        position: { x: 0, y: 0.6, z: -0.35 },
      },
      legs: {
        geometry: { w: 0.12, h: 0.3, d: 0.12 },
        material: { color: 0x696969, roughness: 0.5 },
        positions: [
          { x: 0.45, y: 0.15, z: 0.2 },
          { x: 0.45, y: 0.15, z: -0.2 },
          { x: -0.45, y: 0.15, z: 0.2 },
          { x: -0.45, y: 0.15, z: -0.2 },
        ],
      },
    },
    metadata: {},
  },
  lamp: {
    type: 'lamp',
    rotation: { x: 0, y: 0, z: 0 },
    scale: 1,
    opacity: 1,
    modelConfig: {
      base: {
        geometry: { radius: 0.25, height: 0.1, radialSegments: 32 },
        material: { color: 0x505050, roughness: 0.6 },
        position: { x: 0, y: 0.05, z: 0 },
      },
      pole: {
        geometry: { radiusTop: 0.03, radiusBottom: 0.03, height: 1.0, radialSegments: 16 },
        material: { color: 0x303030, metalness: 0.8, roughness: 0.3 },
        position: { x: 0, y: 0.5, z: 0 },
      },
      shade: {
        geometry: { radius: 0.2, height: 0.3, radialSegments: 32 },
        material: {
          color: 0xffa500,
          emissive: 0xff8c00,
          emissiveIntensity: 0.3,
          roughness: 0.4,
        },
        position: { x: 0, y: 1.15, z: 0 },
      },
    },
    metadata: {},
  },
};

export const FURNITURE_TYPES = [
  { id: 'chair' as const, name: 'Chair', icon: '🪑' },
  { id: 'table' as const, name: 'Table', icon: '🛋' },
  { id: 'sofa' as const, name: 'Sofa', icon: '🛏' },
  { id: 'lamp' as const, name: 'Lamp', icon: '💡' },
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
    const typedId = furnitureId as FurnitureType;
    const template = FURNITURE_LIBRARY[typedId];

    if (!template) {
      setState(prev => ({
        ...prev,
        selectedFurniture: null,
        message: 'Unknown selection. Please select again.',
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      selectedFurniture: typedId,
      message: `Selected ${FURNITURE_TYPES.find(f => f.id === furnitureId)?.name}. Tap on the camera to place.`,
    }));
  }, []);

  const placeObject = useCallback((x: number, y: number) => {
    setState(prev => {
      if (!prev.selectedFurniture) {
        return { ...prev, message: 'Select a furniture item first' };
      }

      const template = FURNITURE_LIBRARY[prev.selectedFurniture];
      if (!template) {
        // Prevent unexpected defaults: if selection is unknown, do not place anything.
        return { ...prev, message: 'Unknown selection. Please select again.' };
      }

      // Deep clone selected template so edits to placed state never mutate palette/library data.
      const clonedTemplate = deepClone(template);

      const rotation = clonedTemplate.rotation ?? { x: 0, y: 0, z: 0 };
      const opacity =
        typeof clonedTemplate.opacity === 'number' ? clonedTemplate.opacity : 1;
      const modelConfig =
        clonedTemplate.modelConfig ?? ({} as Record<string, any>);

      const newObject: PlacedObject = {
        id: `${clonedTemplate.type}-${Date.now()}`,
        type: clonedTemplate.type,
        position: { x, y, z: 0 },
        // Ensure no undefined/NaN transforms sneak into renderer.
        rotation: {
          x: typeof rotation.x === 'number' ? rotation.x : 0,
          y: typeof rotation.y === 'number' ? rotation.y : 0,
          z: typeof rotation.z === 'number' ? rotation.z : 0,
        },
        scale: clonedTemplate.scale,
        opacity,
        modelConfig,
        metadata: clonedTemplate.metadata,
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

  const moveObject = useCallback(
    (id: string, x: number, y: number) => {
      setState(prev => ({
        ...prev,
        placedObjects: prev.placedObjects.map(obj =>
          obj.id === id ? { ...obj, position: { ...obj.position, x, y } } : obj
        ),
      }));
    },
    []
  );

  const rotateObject = useCallback(
    (id: string, angle: number) => {
      setState(prev => ({
        ...prev,
        placedObjects: prev.placedObjects.map(obj =>
          obj.id === id 
            ? { ...obj, rotation: { ...obj.rotation, z: (obj.rotation.z + angle) % 360 } } 
            : obj
        ),
      }));
    },
    []
  );

  const scaleObject = useCallback(
    (id: string, scale: number) => {
      setState(prev => ({
        ...prev,
        placedObjects: prev.placedObjects.map(obj =>
          obj.id === id ? { ...obj, scale } : obj
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
    moveObject,
    rotateObject,
    scaleObject,
    setActiveObject,
    reset,
    setCameraReady,
    setMessage,
    furnitureTypes: FURNITURE_TYPES,
  };
}
