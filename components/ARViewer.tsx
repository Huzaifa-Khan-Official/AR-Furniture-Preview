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
const createChair = () => {
  const group = new THREE.Group();

  // Seat
  const seatGeometry = new THREE.BoxGeometry(0.4, 0.1, 0.4);
  const seatMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.6 });
  const seat = new THREE.Mesh(seatGeometry, seatMaterial);
  seat.position.y = 0.4;
  group.add(seat);

  // Backrest
  const backGeometry = new THREE.BoxGeometry(0.4, 0.6, 0.1);
  const backMaterial = new THREE.MeshStandardMaterial({ color: 0xA0522D, roughness: 0.6 });
  const back = new THREE.Mesh(backGeometry, backMaterial);
  back.position.y = 0.7;
  back.position.z = -0.15;
  group.add(back);

  // Legs
  const legGeometry = new THREE.BoxGeometry(0.08, 0.4, 0.08);
  const legMaterial = new THREE.MeshStandardMaterial({ color: 0x654321, roughness: 0.5 });
  const legPositions = [
    [0.15, 0.2, 0.15],
    [0.15, 0.2, -0.15],
    [-0.15, 0.2, 0.15],
    [-0.15, 0.2, -0.15],
  ];

  legPositions.forEach(([x, y, z]) => {
    const leg = new THREE.Mesh(legGeometry, legMaterial);
    leg.position.set(x, y, z);
    group.add(leg);
  });

  return group;
};

const createTable = () => {
  const group = new THREE.Group();

  // Top
  const topGeometry = new THREE.BoxGeometry(0.8, 0.08, 0.5);
  const topMaterial = new THREE.MeshStandardMaterial({ color: 0xD2691E, roughness: 0.4, metalness: 0.1 });
  const top = new THREE.Mesh(topGeometry, topMaterial);
  top.position.y = 0.7;
  group.add(top);

  // Legs
  const legGeometry = new THREE.BoxGeometry(0.1, 0.7, 0.1);
  const legMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.5 });
  const legPositions = [
    [0.3, 0.35, 0.15],
    [0.3, 0.35, -0.15],
    [-0.3, 0.35, 0.15],
    [-0.3, 0.35, -0.15],
  ];

  legPositions.forEach(([x, y, z]) => {
    const leg = new THREE.Mesh(legGeometry, legMaterial);
    leg.position.set(x, y, z);
    group.add(leg);
  });

  return group;
};

const createSofa = () => {
  const group = new THREE.Group();

  // Main body
  const bodyGeometry = new THREE.BoxGeometry(1.2, 0.4, 0.6);
  const bodyMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xFFFAAD, 
    roughness: 0.7,
    emissive: 0xF0E68C,
    emissiveIntensity: 0.2
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.y = 0.3;
  group.add(body);

  // Backrest
  const backGeometry = new THREE.BoxGeometry(1.2, 0.5, 0.2);
  const backMaterial = new THREE.MeshStandardMaterial({ color: 0xFFF8DC, roughness: 0.7 });
  const back = new THREE.Mesh(backGeometry, backMaterial);
  back.position.y = 0.6;
  back.position.z = -0.35;
  group.add(back);

  // Legs
  const legGeometry = new THREE.BoxGeometry(0.12, 0.3, 0.12);
  const legMaterial = new THREE.MeshStandardMaterial({ color: 0x696969, roughness: 0.5 });
  const legPositions = [
    [0.45, 0.15, 0.2],
    [0.45, 0.15, -0.2],
    [-0.45, 0.15, 0.2],
    [-0.45, 0.15, -0.2],
  ];

  legPositions.forEach(([x, y, z]) => {
    const leg = new THREE.Mesh(legGeometry, legMaterial);
    leg.position.set(x, y, z);
    group.add(leg);
  });

  return group;
};

const createLamp = () => {
  const group = new THREE.Group();

  // Base
  const baseGeometry = new THREE.ConeGeometry(0.25, 0.1, 32);
  const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x505050, roughness: 0.6 });
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  base.position.y = 0.05;
  group.add(base);

  // Pole
  const poleGeometry = new THREE.CylinderGeometry(0.03, 0.03, 1.0, 16);
  const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x303030, metalness: 0.8, roughness: 0.3 });
  const pole = new THREE.Mesh(poleGeometry, poleMaterial);
  pole.position.y = 0.5;
  group.add(pole);

  // Shade
  const shadeGeometry = new THREE.ConeGeometry(0.2, 0.3, 32);
  const shadeMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xFFA500,
    emissive: 0xFF8C00,
    emissiveIntensity: 0.3,
    roughness: 0.4
  });
  const shade = new THREE.Mesh(shadeGeometry, shadeMaterial);
  shade.position.y = 1.15;
  group.add(shade);

  return group;
};

const createFurnitureModel = (type: string) => {
  switch (type) {
    case 'chair':
      return createChair();
    case 'table':
      return createTable();
    case 'sofa':
      return createSofa();
    case 'lamp':
      return createLamp();
    default:
      return createChair();
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

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        // Draw video as background
        const ctx = renderer.getContext();
        ctx.globalCompositeOperation = 'destination-over';
        ctx.drawImage(videoRef.current, 0, 0, width, height);
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
      const model = createFurnitureModel(obj.type);
      model.position.x = (obj.position.x + 0.5) * 3;
      model.position.y = -(obj.position.y - 0.5) * 3;
      model.rotation.z = (obj.rotation.z * Math.PI) / 180;
      model.scale.multiplyScalar(obj.scale);

      // Highlight active object
      if (obj.id === activeObjectId) {
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const originalMaterial = child.material as THREE.MeshStandardMaterial;
            const highlightMaterial = originalMaterial.clone();
            highlightMaterial.emissive = new THREE.Color(0x44ff88);
            highlightMaterial.emissiveIntensity = 0.4;
            child.material = highlightMaterial;
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
    <div className="relative w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl overflow-hidden shadow-2xl">
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
