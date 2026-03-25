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
  params: Record<string, any> | undefined,
  globalOpacity: number
) => {
  const safeParams = params ?? {};
  const opacity =
    typeof safeParams.opacity === 'number'
      ? safeParams.opacity
      : globalOpacity;

  const materialParams: Record<string, any> = {
    color: safeParams.color ?? 0xffffff,
  };

  if (typeof safeParams.roughness === 'number') materialParams.roughness = safeParams.roughness;
  if (typeof safeParams.metalness === 'number') materialParams.metalness = safeParams.metalness;
  if (typeof safeParams.emissive === 'number') materialParams.emissive = safeParams.emissive;
  if (typeof safeParams.emissiveIntensity === 'number') materialParams.emissiveIntensity = safeParams.emissiveIntensity;

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
  const seatGeometryCfg = config?.seat?.geometry ?? {};
  const seatMaterialCfg = config?.seat?.material ?? {};
  const seatGeometry = new THREE.BoxGeometry(
    typeof seatGeometryCfg.w === 'number' ? seatGeometryCfg.w : 0.4,
    typeof seatGeometryCfg.h === 'number' ? seatGeometryCfg.h : 0.1,
    typeof seatGeometryCfg.d === 'number' ? seatGeometryCfg.d : 0.4
  );
  const seatMaterial = createStandardMaterial(seatMaterialCfg, globalOpacity);
  const seat = new THREE.Mesh(seatGeometry, seatMaterial);
  seat.position.set(
    typeof config?.seat?.position?.x === 'number' ? config.seat.position.x : 0,
    typeof config?.seat?.position?.y === 'number' ? config.seat.position.y : 0.4,
    typeof config?.seat?.position?.z === 'number' ? config.seat.position.z : 0
  );
  group.add(seat);

  // Backrest
  const backGeometryCfg = config?.backrest?.geometry ?? {};
  const backMaterialCfg = config?.backrest?.material ?? {};
  const backGeometry = new THREE.BoxGeometry(
    typeof backGeometryCfg.w === 'number' ? backGeometryCfg.w : 0.4,
    typeof backGeometryCfg.h === 'number' ? backGeometryCfg.h : 0.6,
    typeof backGeometryCfg.d === 'number' ? backGeometryCfg.d : 0.1
  );
  const backMaterial = createStandardMaterial(backMaterialCfg, globalOpacity);
  const back = new THREE.Mesh(backGeometry, backMaterial);
  back.position.set(
    typeof config?.backrest?.position?.x === 'number' ? config.backrest.position.x : 0,
    typeof config?.backrest?.position?.y === 'number' ? config.backrest.position.y : 0.7,
    typeof config?.backrest?.position?.z === 'number' ? config.backrest.position.z : -0.15
  );
  group.add(back);

  // Legs
  const legsGeometryCfg = config?.legs?.geometry ?? {};
  const legsMaterialCfg = config?.legs?.material ?? {};
  const legGeometry = new THREE.BoxGeometry(
    typeof legsGeometryCfg.w === 'number' ? legsGeometryCfg.w : 0.08,
    typeof legsGeometryCfg.h === 'number' ? legsGeometryCfg.h : 0.4,
    typeof legsGeometryCfg.d === 'number' ? legsGeometryCfg.d : 0.08
  );
  const legMaterial = createStandardMaterial(legsMaterialCfg, globalOpacity);
  const legPositions: Array<{ x: number; y: number; z: number }> =
    config?.legs?.positions ?? [
      { x: 0.15, y: 0.2, z: 0.15 },
      { x: 0.15, y: 0.2, z: -0.15 },
      { x: -0.15, y: 0.2, z: 0.15 },
      { x: -0.15, y: 0.2, z: -0.15 },
    ];

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
  const topGeometryCfg = config?.top?.geometry ?? {};
  const topMaterialCfg = config?.top?.material ?? {};
  const topGeometry = new THREE.BoxGeometry(
    typeof topGeometryCfg.w === 'number' ? topGeometryCfg.w : 0.8,
    typeof topGeometryCfg.h === 'number' ? topGeometryCfg.h : 0.08,
    typeof topGeometryCfg.d === 'number' ? topGeometryCfg.d : 0.5
  );
  const topMaterial = createStandardMaterial(topMaterialCfg, globalOpacity);
  const top = new THREE.Mesh(topGeometry, topMaterial);
  top.position.set(
    typeof config?.top?.position?.x === 'number' ? config.top.position.x : 0,
    typeof config?.top?.position?.y === 'number' ? config.top.position.y : 0.7,
    typeof config?.top?.position?.z === 'number' ? config.top.position.z : 0
  );
  group.add(top);

  // Legs
  const legsGeometryCfg = config?.legs?.geometry ?? {};
  const legsMaterialCfg = config?.legs?.material ?? {};
  const legGeometry = new THREE.BoxGeometry(
    typeof legsGeometryCfg.w === 'number' ? legsGeometryCfg.w : 0.1,
    typeof legsGeometryCfg.h === 'number' ? legsGeometryCfg.h : 0.7,
    typeof legsGeometryCfg.d === 'number' ? legsGeometryCfg.d : 0.1
  );
  const legMaterial = createStandardMaterial(legsMaterialCfg, globalOpacity);
  const legPositions: Array<{ x: number; y: number; z: number }> =
    config?.legs?.positions ?? [
      { x: 0.3, y: 0.35, z: 0.15 },
      { x: 0.3, y: 0.35, z: -0.15 },
      { x: -0.3, y: 0.35, z: 0.15 },
      { x: -0.3, y: 0.35, z: -0.15 },
    ];

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
  const bodyGeometryCfg = config?.body?.geometry ?? {};
  const bodyMaterialCfg = config?.body?.material ?? {};
  const bodyGeometry = new THREE.BoxGeometry(
    typeof bodyGeometryCfg.w === 'number' ? bodyGeometryCfg.w : 1.2,
    typeof bodyGeometryCfg.h === 'number' ? bodyGeometryCfg.h : 0.4,
    typeof bodyGeometryCfg.d === 'number' ? bodyGeometryCfg.d : 0.6
  );
  const bodyMaterial = createStandardMaterial(bodyMaterialCfg, globalOpacity);
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.set(
    typeof config?.body?.position?.x === 'number' ? config.body.position.x : 0,
    typeof config?.body?.position?.y === 'number' ? config.body.position.y : 0.3,
    typeof config?.body?.position?.z === 'number' ? config.body.position.z : 0
  );
  group.add(body);

  // Backrest
  const backGeometryCfg = config?.backrest?.geometry ?? {};
  const backMaterialCfg = config?.backrest?.material ?? {};
  const backGeometry = new THREE.BoxGeometry(
    typeof backGeometryCfg.w === 'number' ? backGeometryCfg.w : 1.2,
    typeof backGeometryCfg.h === 'number' ? backGeometryCfg.h : 0.5,
    typeof backGeometryCfg.d === 'number' ? backGeometryCfg.d : 0.2
  );
  const backMaterial = createStandardMaterial(backMaterialCfg, globalOpacity);
  const back = new THREE.Mesh(backGeometry, backMaterial);
  back.position.set(
    typeof config?.backrest?.position?.x === 'number' ? config.backrest.position.x : 0,
    typeof config?.backrest?.position?.y === 'number' ? config.backrest.position.y : 0.6,
    typeof config?.backrest?.position?.z === 'number' ? config.backrest.position.z : -0.35
  );
  group.add(back);

  // Legs
  const legsGeometryCfg = config?.legs?.geometry ?? {};
  const legsMaterialCfg = config?.legs?.material ?? {};
  const legGeometry = new THREE.BoxGeometry(
    typeof legsGeometryCfg.w === 'number' ? legsGeometryCfg.w : 0.12,
    typeof legsGeometryCfg.h === 'number' ? legsGeometryCfg.h : 0.3,
    typeof legsGeometryCfg.d === 'number' ? legsGeometryCfg.d : 0.12
  );
  const legMaterial = createStandardMaterial(legsMaterialCfg, globalOpacity);
  const legPositions: Array<{ x: number; y: number; z: number }> =
    config?.legs?.positions ?? [
      { x: 0.45, y: 0.15, z: 0.2 },
      { x: 0.45, y: 0.15, z: -0.2 },
      { x: -0.45, y: 0.15, z: 0.2 },
      { x: -0.45, y: 0.15, z: -0.2 },
    ];

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
  const baseGeometryCfg = config?.base?.geometry ?? {};
  const baseMaterialCfg = config?.base?.material ?? {};
  const baseGeometry = new THREE.ConeGeometry(
    typeof baseGeometryCfg.radius === 'number' ? baseGeometryCfg.radius : 0.25,
    typeof baseGeometryCfg.height === 'number' ? baseGeometryCfg.height : 0.1,
    typeof baseGeometryCfg.radialSegments === 'number'
      ? baseGeometryCfg.radialSegments
      : 32
  );
  const baseMaterial = createStandardMaterial(baseMaterialCfg, globalOpacity);
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  base.position.set(
    typeof config?.base?.position?.x === 'number' ? config.base.position.x : 0,
    typeof config?.base?.position?.y === 'number' ? config.base.position.y : 0.05,
    typeof config?.base?.position?.z === 'number' ? config.base.position.z : 0
  );
  group.add(base);

  // Pole
  const poleGeometryCfg = config?.pole?.geometry ?? {};
  const poleMaterialCfg = config?.pole?.material ?? {};
  const poleGeometry = new THREE.CylinderGeometry(
    typeof poleGeometryCfg.radiusTop === 'number' ? poleGeometryCfg.radiusTop : 0.03,
    typeof poleGeometryCfg.radiusBottom === 'number' ? poleGeometryCfg.radiusBottom : 0.03,
    typeof poleGeometryCfg.height === 'number' ? poleGeometryCfg.height : 1.0,
    typeof poleGeometryCfg.radialSegments === 'number'
      ? poleGeometryCfg.radialSegments
      : 16
  );
  const poleMaterial = createStandardMaterial(poleMaterialCfg, globalOpacity);
  const pole = new THREE.Mesh(poleGeometry, poleMaterial);
  pole.position.set(
    typeof config?.pole?.position?.x === 'number' ? config.pole.position.x : 0,
    typeof config?.pole?.position?.y === 'number' ? config.pole.position.y : 0.5,
    typeof config?.pole?.position?.z === 'number' ? config.pole.position.z : 0
  );
  group.add(pole);

  // Shade
  const shadeGeometryCfg = config?.shade?.geometry ?? {};
  const shadeMaterialCfg = config?.shade?.material ?? {};
  const shadeGeometry = new THREE.ConeGeometry(
    typeof shadeGeometryCfg.radius === 'number' ? shadeGeometryCfg.radius : 0.2,
    typeof shadeGeometryCfg.height === 'number' ? shadeGeometryCfg.height : 0.3,
    typeof shadeGeometryCfg.radialSegments === 'number'
      ? shadeGeometryCfg.radialSegments
      : 32
  );
  const shadeMaterial = createStandardMaterial(shadeMaterialCfg, globalOpacity);
  const shade = new THREE.Mesh(shadeGeometry, shadeMaterial);
  shade.position.set(
    typeof config?.shade?.position?.x === 'number' ? config.shade.position.x : 0,
    typeof config?.shade?.position?.y === 'number' ? config.shade.position.y : 1.15,
    typeof config?.shade?.position?.z === 'number' ? config.shade.position.z : 0
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
  const mouseStateRef = useRef<{
    objectId: string;
    startX: number;
    startY: number;
  } | null>(null);
  const didDragRef = useRef(false);

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
      const posX = typeof obj.position?.x === 'number' ? obj.position.x : 0;
      const posY = typeof obj.position?.y === 'number' ? obj.position.y : 0;
      const rotX = typeof obj.rotation?.x === 'number' ? obj.rotation.x : 0;
      const rotY = typeof obj.rotation?.y === 'number' ? obj.rotation.y : 0;
      const rotZ = typeof obj.rotation?.z === 'number' ? obj.rotation.z : 0;
      const scale = typeof obj.scale === 'number' ? obj.scale : 1;

      const sceneWidth = canvasDimensions.width > 0 ? canvasDimensions.width / 100 : 6;
      const sceneHeight = canvasDimensions.height > 0 ? canvasDimensions.height / 100 : 4;
      model.position.x = posX * sceneWidth;
      model.position.y = -posY * sceneHeight;
      model.rotation.x = (rotX * Math.PI) / 180;
      model.rotation.y = (rotY * Math.PI) / 180;
      model.rotation.z = (rotZ * Math.PI) / 180;
      model.scale.set(1, 1, 1);
      model.scale.multiplyScalar(scale);

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
  }, [placedObjects, activeObjectId, canvasDimensions]);

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
    if (didDragRef.current) return; // was a drag, not a click
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

      if (onMoveObject) {
        const activeObj = placedObjects.find(obj => obj.id === touchStateRef.current!.objectId);
        if (activeObj) {
          const normalizedDeltaX = deltaX / rect.width;
          const normalizedDeltaY = deltaY / rect.height;
          onMoveObject(
            touchStateRef.current.objectId,
            activeObj.position.x + normalizedDeltaX,
            activeObj.position.y + normalizedDeltaY
          );
          touchStateRef.current.startX = canvasX;
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

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    didDragRef.current = false;
    const rect = canvasRef.current.getBoundingClientRect();
    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;
    const clickedObject = getObjectAtPosition(canvasX, canvasY);
    if (clickedObject) {
      mouseStateRef.current = {
        objectId: clickedObject.id,
        startX: canvasX,
        startY: canvasY,
      };
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!mouseStateRef.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;
    const deltaX = canvasX - mouseStateRef.current.startX;
    const deltaY = canvasY - mouseStateRef.current.startY;

    if (Math.hypot(deltaX, deltaY) > 4) {
      didDragRef.current = true;
    }

    if (didDragRef.current && onMoveObject) {
      const activeObj = placedObjects.find(obj => obj.id === mouseStateRef.current!.objectId);
      if (activeObj) {
        onMoveObject(
          mouseStateRef.current.objectId,
          activeObj.position.x + deltaX / rect.width,
          activeObj.position.y + deltaY / rect.height
        );
        mouseStateRef.current.startX = canvasX;
        mouseStateRef.current.startY = canvasY;
      }
    }
  };

  const handleMouseUp = () => {
    mouseStateRef.current = null;
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
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
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
        <p>TAP: Place/Select • DRAG: Move • PINCH: Scale</p>
      </div>
    </div>
  );
}
