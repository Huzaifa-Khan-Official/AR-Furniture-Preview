'use client';

import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { PlacedObject } from '@/hooks/useARState';

interface ARViewerProps {
  placedObjects: PlacedObject[];
  activeObjectId: string | null;
  onPlaceObject: (x: number, y: number) => void;
  onCameraReady: (ready: boolean) => void;
  onObjectSelect: (id: string) => void;
  onMoveObject?: (id: string, x: number, y: number) => void;
  onRotateObject?: (id: string, angle: number) => void;
  onScaleObject?: (id: string, scale: number) => void;
}

// Furniture model creation functions
const createStandardMaterial = (
  params: Record<string, any>,
  globalOpacity: number
) => {
  const opacity =
    typeof params?.opacity === 'number' ? params.opacity : globalOpacity;

  const materialParams: Record<string, any> = {
    color: params.color,
  };

  if (typeof params.roughness === 'number') materialParams.roughness = params.roughness;
  if (typeof params.metalness === 'number') materialParams.metalness = params.metalness;
  if (typeof params.emissive === 'number') materialParams.emissive = params.emissive;
  if (typeof params.emissiveIntensity === 'number') materialParams.emissiveIntensity = params.emissiveIntensity;

  const material = new THREE.MeshStandardMaterial(materialParams);

  if (typeof opacity === 'number' && opacity < 1) {
    material.transparent = true;
    material.opacity = opacity;
  }

  return material;
};

const createChair = (config: Record<string, any>, globalOpacity: number) => {
  const group = new THREE.Group();

  // Seat
  const seatGeometry = new THREE.BoxGeometry(
    config.seat.geometry.w,
    config.seat.geometry.h,
    config.seat.geometry.d
  );
  const seatMaterial = createStandardMaterial(config.seat.material, globalOpacity);
  const seat = new THREE.Mesh(seatGeometry, seatMaterial);
  seat.position.set(
    config.seat.position.x,
    config.seat.position.y,
    config.seat.position.z
  );
  group.add(seat);

  // Backrest
  const backGeometry = new THREE.BoxGeometry(
    config.backrest.geometry.w,
    config.backrest.geometry.h,
    config.backrest.geometry.d
  );
  const backMaterial = createStandardMaterial(config.backrest.material, globalOpacity);
  const back = new THREE.Mesh(backGeometry, backMaterial);
  back.position.set(
    config.backrest.position.x,
    config.backrest.position.y,
    config.backrest.position.z
  );
  group.add(back);

  // Legs
  const legGeometry = new THREE.BoxGeometry(
    config.legs.geometry.w,
    config.legs.geometry.h,
    config.legs.geometry.d
  );
  const legMaterial = createStandardMaterial(config.legs.material, globalOpacity);
  const legPositions: Array<{ x: number; y: number; z: number }> = config.legs.positions;

  legPositions.forEach(({ x, y, z }) => {
    const leg = new THREE.Mesh(legGeometry, legMaterial);
    leg.position.set(x, y, z);
    group.add(leg);
  });

  return group;
};

const createTable = (config: Record<string, any>, globalOpacity: number) => {
  const group = new THREE.Group();

  // Top
  const topGeometry = new THREE.BoxGeometry(
    config.top.geometry.w,
    config.top.geometry.h,
    config.top.geometry.d
  );
  const topMaterial = createStandardMaterial(config.top.material, globalOpacity);
  const top = new THREE.Mesh(topGeometry, topMaterial);
  top.position.set(
    config.top.position.x,
    config.top.position.y,
    config.top.position.z
  );
  group.add(top);

  // Legs
  const legGeometry = new THREE.BoxGeometry(
    config.legs.geometry.w,
    config.legs.geometry.h,
    config.legs.geometry.d
  );
  const legMaterial = createStandardMaterial(config.legs.material, globalOpacity);
  const legPositions: Array<{ x: number; y: number; z: number }> = config.legs.positions;

  legPositions.forEach(({ x, y, z }) => {
    const leg = new THREE.Mesh(legGeometry, legMaterial);
    leg.position.set(x, y, z);
    group.add(leg);
  });

  return group;
};

const createSofa = (config: Record<string, any>, globalOpacity: number) => {
  const group = new THREE.Group();

  // Main body
  const bodyGeometry = new THREE.BoxGeometry(
    config.body.geometry.w,
    config.body.geometry.h,
    config.body.geometry.d
  );
  const bodyMaterial = createStandardMaterial(config.body.material, globalOpacity);
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.set(
    config.body.position.x,
    config.body.position.y,
    config.body.position.z
  );
  group.add(body);

  // Backrest
  const backGeometry = new THREE.BoxGeometry(
    config.backrest.geometry.w,
    config.backrest.geometry.h,
    config.backrest.geometry.d
  );
  const backMaterial = createStandardMaterial(config.backrest.material, globalOpacity);
  const back = new THREE.Mesh(backGeometry, backMaterial);
  back.position.set(
    config.backrest.position.x,
    config.backrest.position.y,
    config.backrest.position.z
  );
  group.add(back);

  // Legs
  const legGeometry = new THREE.BoxGeometry(
    config.legs.geometry.w,
    config.legs.geometry.h,
    config.legs.geometry.d
  );
  const legMaterial = createStandardMaterial(config.legs.material, globalOpacity);
  const legPositions: Array<{ x: number; y: number; z: number }> = config.legs.positions;

  legPositions.forEach(({ x, y, z }) => {
    const leg = new THREE.Mesh(legGeometry, legMaterial);
    leg.position.set(x, y, z);
    group.add(leg);
  });

  return group;
};

const createLamp = (config: Record<string, any>, globalOpacity: number) => {
  const group = new THREE.Group();

  // Base
  const baseGeometry = new THREE.ConeGeometry(
    config.base.geometry.radius,
    config.base.geometry.height,
    config.base.geometry.radialSegments
  );
  const baseMaterial = createStandardMaterial(config.base.material, globalOpacity);
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  base.position.set(
    config.base.position.x,
    config.base.position.y,
    config.base.position.z
  );
  group.add(base);

  // Pole
  const poleGeometry = new THREE.CylinderGeometry(
    config.pole.geometry.radiusTop,
    config.pole.geometry.radiusBottom,
    config.pole.geometry.height,
    config.pole.geometry.radialSegments
  );
  const poleMaterial = createStandardMaterial(config.pole.material, globalOpacity);
  const pole = new THREE.Mesh(poleGeometry, poleMaterial);
  pole.position.set(
    config.pole.position.x,
    config.pole.position.y,
    config.pole.position.z
  );
  group.add(pole);

  // Shade
  const shadeGeometry = new THREE.ConeGeometry(
    config.shade.geometry.radius,
    config.shade.geometry.height,
    config.shade.geometry.radialSegments
  );
  const shadeMaterial = createStandardMaterial(config.shade.material, globalOpacity);
  const shade = new THREE.Mesh(shadeGeometry, shadeMaterial);
  shade.position.set(
    config.shade.position.x,
    config.shade.position.y,
    config.shade.position.z
  );
  group.add(shade);

  return group;
};

const createFurnitureModel = (obj: PlacedObject) => {
  const globalOpacity = typeof obj.opacity === 'number' ? obj.opacity : 1;
  const config = obj.modelConfig ?? {};

  switch (obj.type) {
    case 'chair':
      return createChair(config, globalOpacity);
    case 'table':
      return createTable(config, globalOpacity);
    case 'sofa':
      return createSofa(config, globalOpacity);
    case 'lamp':
      return createLamp(config, globalOpacity);
    default:
      // Should never happen: placement prevents unknown types.
      return new THREE.Group();
  }
};

export function ARViewer({
  placedObjects,
  activeObjectId,
  onPlaceObject,
  onCameraReady,
  onObjectSelect,
  onMoveObject,
  onRotateObject,
  onScaleObject,
}: ARViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const objectsRef = useRef<Record<string, THREE.Group>>({});
  const [isInitialized, setIsInitialized] = useState(false);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 0, height: 0 });
  const touchStateRef = useRef<{
    objectId: string;
    startX: number;
    startY: number;
    type: 'move' | 'scale' | 'rotate';
    initialScale?: number;
    initialDistance?: number;
  } | null>(null);

  // Initialize Three.js scene
  useEffect(() => {
    if (!canvasRef.current) return;

    const width = canvasRef.current.clientWidth;
    const height = canvasRef.current.clientHeight;
    setCanvasDimensions({ width, height });

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1e293b);
    sceneRef.current = scene;

    // Camera setup - orthographic for 2D AR overlay feel
    const camera = new THREE.OrthographicCamera(
      -width / 200,
      width / 200,
      height / 200,
      -height / 200,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(typeof window !== 'undefined' ? window.devicePixelRatio : 1);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    // Initialize camera
    const initializeAR = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setIsInitialized(true);
          onCameraReady(true);
        }
      } catch (err) {
        console.error('[v0] Camera error:', err);
        onCameraReady(false);
      }
    };

    initializeAR();

    // Create video texture for background
    let videoTexture: THREE.VideoTexture | null = null;
    let backgroundPlane: THREE.Mesh | null = null;

    const setupVideoBackground = () => {
      if (videoRef.current && !videoTexture) {
        videoTexture = new THREE.VideoTexture(videoRef.current);
        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;
        
        // Create a background plane with the video texture
        const planeGeometry = new THREE.PlaneGeometry(width / 100, height / 100);
        const planeMaterial = new THREE.MeshBasicMaterial({
          map: videoTexture,
          side: THREE.DoubleSide,
          depthTest: false,
          depthWrite: false
        });
        backgroundPlane = new THREE.Mesh(planeGeometry, planeMaterial);
        backgroundPlane.position.z = -10; // Place behind all objects
        backgroundPlane.renderOrder = -1; // Render first
        scene.add(backgroundPlane);
      }
    };

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        // Setup video background on first frame
        if (!videoTexture) {
          setupVideoBackground();
        }
        // Video texture updates automatically
      }

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
      
      // Dispose of video texture and background plane
      if (videoTexture) {
        videoTexture.dispose();
      }
      if (backgroundPlane) {
        if (backgroundPlane.geometry) backgroundPlane.geometry.dispose();
        if (backgroundPlane.material) {
          if (Array.isArray(backgroundPlane.material)) {
            backgroundPlane.material.forEach(mat => mat.dispose());
          } else {
            backgroundPlane.material.dispose();
          }
        }
        scene.remove(backgroundPlane);
      }
      
      // Dispose of renderer
      renderer.dispose();
    };
  }, [onCameraReady]);

  // Update objects in scene
  useEffect(() => {
    if (!sceneRef.current) return;

    // Remove old objects
    Object.values(objectsRef.current).forEach(obj => {
      sceneRef.current?.remove(obj);
    });
    objectsRef.current = {};

    // Add new objects
    placedObjects.forEach((obj) => {
      const model = createFurnitureModel(obj);
      model.position.x = (obj.position.x + 0.5) * 3;
      model.position.y = -(obj.position.y - 0.5) * 3;
      model.rotation.x = (obj.rotation.x * Math.PI) / 180;
      model.rotation.y = (obj.rotation.y * Math.PI) / 180;
      model.rotation.z = (obj.rotation.z * Math.PI) / 180;
      model.scale.multiplyScalar(obj.scale);

      // Highlight active object
      if (obj.id === activeObjectId) {
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const originalMaterial = child.material as any;
            if (typeof originalMaterial?.clone === 'function') {
              const highlightMaterial = originalMaterial.clone();
              // Keep all original material properties; only add glow highlight.
              if ('emissive' in highlightMaterial) {
                highlightMaterial.emissive = new THREE.Color(0x44ff88);
              }
              if ('emissiveIntensity' in highlightMaterial) {
                highlightMaterial.emissiveIntensity = 0.4;
              }
              child.material = highlightMaterial;
            }
          }
        });
      }

      sceneRef.current?.add(model);
      objectsRef.current[obj.id] = model;
    });
  }, [placedObjects, activeObjectId]);

  const getObjectAtPosition = (canvasX: number, canvasY: number): PlacedObject | null => {
    const normalizedX = canvasX / canvasDimensions.width - 0.5;
    const normalizedY = canvasY / canvasDimensions.height - 0.5;

    for (const obj of placedObjects) {
      const dx = Math.abs(obj.position.x - normalizedX);
      const dy = Math.abs(obj.position.y - normalizedY);
      const size = 0.15 * obj.scale;
      if (dx < size && dy < size) {
        return obj;
      }
    }
    return null;
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;

    const clickedObject = getObjectAtPosition(canvasX, canvasY);
    if (clickedObject) {
      onObjectSelect(clickedObject.id);
    } else {
      const x = canvasX / rect.width - 0.5;
      const y = canvasY / rect.height - 0.5;
      onPlaceObject(x, y);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();

    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const canvasX = touch.clientX - rect.left;
      const canvasY = touch.clientY - rect.top;
      const touchedObject = getObjectAtPosition(canvasX, canvasY);

      if (touchedObject && touchedObject.id === activeObjectId) {
        touchStateRef.current = {
          objectId: touchedObject.id,
          startX: canvasX,
          startY: canvasY,
          type: 'move',
        };
      } else if (touchedObject) {
        onObjectSelect(touchedObject.id);
        touchStateRef.current = {
          objectId: touchedObject.id,
          startX: canvasX,
          startY: canvasY,
          type: 'move',
        };
      }
    } else if (e.touches.length === 2 && activeObjectId) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      const activeObj = placedObjects.find(obj => obj.id === activeObjectId);
      if (activeObj) {
        touchStateRef.current = {
          objectId: activeObjectId,
          startX: 0,
          startY: 0,
          type: 'scale',
          initialScale: activeObj.scale,
          initialDistance: distance,
        };
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!touchStateRef.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();

    if (e.touches.length === 1 && touchStateRef.current.type === 'move') {
      const touch = e.touches[0];
      const canvasX = touch.clientX - rect.left;
      const canvasY = touch.clientY - rect.top;

      const deltaX = canvasX - touchStateRef.current.startX;
      const deltaY = canvasY - touchStateRef.current.startY;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (onMoveObject) {
          const activeObj = placedObjects.find(obj => obj.id === touchStateRef.current!.objectId);
          if (activeObj) {
            const normalizedDeltaX = (deltaX / rect.width) * 0.15;
            onMoveObject(
              touchStateRef.current.objectId,
              activeObj.position.x + normalizedDeltaX,
              activeObj.position.y
            );
            touchStateRef.current.startX = canvasX;
          }
        }
      } else {
        if (onRotateObject) {
          const rotation = (deltaY / rect.height) * 180;
          onRotateObject(touchStateRef.current.objectId, rotation);
          touchStateRef.current.startY = canvasY;
        }
      }
    } else if (e.touches.length === 2 && touchStateRef.current.type === 'scale') {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );

      if (touchStateRef.current.initialDistance && onScaleObject && touchStateRef.current.initialScale) {
        const scaleFactor = distance / touchStateRef.current.initialDistance;
        const newScale = Math.max(0.5, Math.min(2.5, touchStateRef.current.initialScale * scaleFactor));
        onScaleObject(touchStateRef.current.objectId, newScale);
      }
    }
  };

  const handleTouchEnd = () => {
    touchStateRef.current = null;
  };

  return (
    <div className="relative w-full h-full bg-linear-to-br from-slate-900 to-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
      />
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
      />

      {!isInitialized && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="text-white text-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-lg font-semibold">Initializing camera...</p>
          </div>
        </div>
      )}

      <div className="absolute bottom-4 left-4 right-4 text-white text-xs bg-black/40 backdrop-blur-sm rounded-lg p-3 space-y-1">
        <p>TAP: Select • SWIPE: Move • DRAG UP/DOWN: Rotate • PINCH: Scale</p>
      </div>
    </div>
  );
}
