'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createFurnitureModel } from './ARViewer';
import { FURNITURE_LIBRARY } from '@/hooks/useARState';
import type { FurnitureType, PlacedObject } from '@/hooks/useARState';

interface FurniturePreviewProps {
  type: FurnitureType;
}

export function FurniturePreview({ type }: FurniturePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf1f5f9);

    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(1.8, 1.8, 2.5);
    camera.lookAt(0, 0.5, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(80, 80);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const dir = new THREE.DirectionalLight(0xffffff, 0.7);
    dir.position.set(3, 5, 3);
    scene.add(dir);

    const template = FURNITURE_LIBRARY[type];
    const mockObj: PlacedObject = {
      id: 'preview',
      type,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: 1,
      opacity: 1,
      modelConfig: template.modelConfig,
    };
    const model = createFurnitureModel(mockObj);
    scene.add(model);

    let animId: number;
    let angle = Math.PI / 4;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      angle += 0.008;
      camera.position.x = Math.sin(angle) * 2.5;
      camera.position.z = Math.cos(angle) * 2.5;
      camera.lookAt(0, 0.5, 0);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach(m => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, [type]);

  return (
    <canvas
      ref={canvasRef}
      width={80}
      height={80}
      className="w-full h-full rounded-lg"
    />
  );
}
