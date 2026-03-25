'use client';

import { useRef, useEffect, useState } from 'react';
import { PlacedObject } from '@/hooks/useARState';

interface ARViewerProps {
  placedObjects: PlacedObject[];
  activeObjectId: string | null;
  onPlaceObject: (x: number, y: number) => void;
  onCameraReady: (ready: boolean) => void;
  onObjectSelect: (id: string) => void;
}

export function ARViewer({
  placedObjects,
  activeObjectId,
  onPlaceObject,
  onCameraReady,
  onObjectSelect,
}: ARViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAR = async () => {
      try {
        // Request camera access
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
        console.error('Failed to access camera:', err);
        onCameraReady(false);
      }
    };

    initializeAR();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [onCameraReady]);

  useEffect(() => {
    if (!canvasRef.current || !isInitialized) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawFrame = () => {
      // Draw video frame
      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      }

      // Draw placed objects as overlays
      placedObjects.forEach((obj, index) => {
        const x = (obj.position.x + 0.5) * canvas.width;
        const y = (obj.position.y + 0.5) * canvas.height;
        const size = 60 * obj.scale;

        // Draw object rectangle
        const isActive = obj.id === activeObjectId;
        ctx.fillStyle = isActive ? 'rgba(59, 130, 246, 0.3)' : 'rgba(34, 197, 94, 0.2)';
        ctx.fillRect(x - size / 2, y - size / 2, size, size);

        // Draw border
        ctx.strokeStyle = isActive ? '#3b82f6' : '#22c55e';
        ctx.lineWidth = isActive ? 3 : 2;
        ctx.strokeRect(x - size / 2, y - size / 2, size, size);

        // Draw object type text
        ctx.fillStyle = isActive ? '#3b82f6' : '#22c55e';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(obj.type.toUpperCase(), x, y + size / 2 + 20);
      });

      requestAnimationFrame(drawFrame);
    };

    const animationId = requestAnimationFrame(drawFrame);
    return () => cancelAnimationFrame(animationId);
  }, [placedObjects, activeObjectId, isInitialized]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    // Check if clicking on existing object
    let clickedObject: PlacedObject | null = null;
    for (const obj of placedObjects) {
      const dx = Math.abs(obj.position.x - x);
      const dy = Math.abs(obj.position.y - y);
      const size = 0.15 * obj.scale;
      if (dx < size && dy < size) {
        clickedObject = obj;
        break;
      }
    }

    if (clickedObject) {
      onObjectSelect(clickedObject.id);
    } else {
      onPlaceObject(x, y);
    }
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover hidden"
        playsInline
      />
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onClick={handleCanvasClick}
        className="w-full h-full cursor-crosshair touch-none"
      />

      {!isInitialized && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="text-white text-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-lg font-semibold">Initializing camera...</p>
          </div>
        </div>
      )}
    </div>
  );
}
