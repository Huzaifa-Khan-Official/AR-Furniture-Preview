'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { usePlanner, type PlacedItem } from '@/context/PlannerContext'
import { Trash2, RotateCw, ZoomIn, ZoomOut } from 'lucide-react'

const imgCache: Record<string, HTMLImageElement> = {}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  if (imgCache[src]) return Promise.resolve(imgCache[src])
  return new Promise(resolve => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      imgCache[src] = img
      resolve(img)
    }
    img.onerror = () => resolve(null)
    img.src = src
  })
}

type DragState = { id: string; ox: number; oy: number } | null
type ResizeState = {
  id: string
  handle: string
  sx: number
  sy: number
  sw: number
  sh: number
  spx: number
  spy: number
} | null
type RotateState = { id: string; startAngle: number; startRotation: number } | null

export default function ARCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const animFrameRef = useRef<number | null>(null)
  const imagesRef = useRef<Record<string, HTMLImageElement>>({})

  const {
    placedItems,
    selectedId,
    setSelectedId,
    updateItem,
    removeItem,
    viewMode,
    cameraStream,
    roomPreset,
  } = usePlanner()

  const [dragging, setDragging] = useState<DragState>(null)
  const [resizing, setResizing] = useState<ResizeState>(null)
  const [rotating, setRotating] = useState<RotateState>(null)

  // Preload all placed images
  useEffect(() => {
    placedItems.forEach(item => {
      if (!imagesRef.current[item.image]) {
        loadImage(item.image).then(img => {
          if (img) imagesRef.current[item.image] = img
        })
      }
    })
  }, [placedItems])

  // Camera stream
  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream
      videoRef.current.play().catch(() => {})
    }
  }, [cameraStream])

  // Drawing loop
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const dpr = window.devicePixelRatio || 1
    const rect = container.getBoundingClientRect()
    const W = rect.width
    const H = rect.height

    if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
      canvas.width = W * dpr
      canvas.height = H * dpr
      canvas.style.width = W + 'px'
      canvas.style.height = H + 'px'
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, W, H)

    // Draw video frame for camera mode
    if (viewMode === 'camera' && videoRef.current && videoRef.current.readyState >= 2) {
      ctx.drawImage(videoRef.current, 0, 0, W, H)
    }

    // Draw each furniture item
    for (const item of placedItems) {
      const img = imagesRef.current[item.image]
      const isSelected = item.id === selectedId
      const cx = item.x
      const cy = item.y
      const w = item.width
      const h = item.height
      const rad = (item.rotation * Math.PI) / 180

      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(rad)

      ctx.shadowColor = 'rgba(0,0,0,0.35)'
      ctx.shadowBlur = 20
      ctx.shadowOffsetX = 8
      ctx.shadowOffsetY = 8

      if (img) {
        ctx.globalAlpha = item.opacity ?? 0.92
        ctx.drawImage(img, -w / 2, -h / 2, w, h)
        ctx.globalAlpha = 1
      } else {
        ctx.fillStyle = '#E5E7EB'
        ctx.fillRect(-w / 2, -h / 2, w, h)
      }

      ctx.shadowColor = 'transparent'
      ctx.shadowBlur = 0
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0

      if (isSelected) {
        ctx.strokeStyle = '#FBBF24'
        ctx.lineWidth = 3
        ctx.shadowColor = 'rgba(251,191,36,0.6)'
        ctx.shadowBlur = 12
        ctx.strokeRect(-w / 2, -h / 2, w, h)
        ctx.shadowBlur = 0

        const cs = 16
        ctx.strokeStyle = '#F59E0B'
        ctx.lineWidth = 3
        for (const [cx2, cy2, sx, sy] of [
          [-w / 2, -h / 2, 1, 1],
          [w / 2, -h / 2, -1, 1],
          [w / 2, h / 2, -1, -1],
          [-w / 2, h / 2, 1, -1],
        ] as [number, number, number, number][]) {
          ctx.beginPath()
          ctx.moveTo(cx2 + sx * cs, cy2)
          ctx.lineTo(cx2, cy2)
          ctx.lineTo(cx2, cy2 + sy * cs)
          ctx.stroke()
        }

        const handles = [
          { x: -w / 2, y: -h / 2 },
          { x: w / 2, y: -h / 2 },
          { x: w / 2, y: h / 2 },
          { x: -w / 2, y: h / 2 },
          { x: 0, y: -h / 2 },
          { x: w / 2, y: 0 },
          { x: 0, y: h / 2 },
          { x: -w / 2, y: 0 },
        ]
        for (const hnd of handles) {
          ctx.beginPath()
          ctx.arc(hnd.x, hnd.y, 6, 0, Math.PI * 2)
          ctx.fillStyle = '#FFFFFF'
          ctx.fill()
          ctx.strokeStyle = '#F59E0B'
          ctx.lineWidth = 2
          ctx.stroke()
        }

        ctx.beginPath()
        ctx.moveTo(0, -h / 2)
        ctx.lineTo(0, -h / 2 - 30)
        ctx.strokeStyle = '#FFFFFF'
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(0, -h / 2 - 30, 10, 0, Math.PI * 2)
        ctx.fillStyle = '#FBBF24'
        ctx.fill()
        ctx.strokeStyle = '#FFF'
        ctx.lineWidth = 1.5
        ctx.stroke()
        ctx.fillStyle = '#FFFFFF'
        ctx.font = 'bold 12px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('↻', 0, -h / 2 - 30)
      } else {
        ctx.strokeStyle = 'rgba(59,130,246,0.5)'
        ctx.lineWidth = 1.5
        ctx.strokeRect(-w / 2, -h / 2, w, h)
      }

      ctx.restore()
    }
  }, [placedItems, selectedId, viewMode])

  // Animation loop
  useEffect(() => {
    let running = true
    function loop() {
      if (!running) return
      draw()
      animFrameRef.current = requestAnimationFrame(loop)
    }
    loop()
    return () => {
      running = false
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [draw])

  // Mouse/touch helpers
  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    const touch = 'touches' in e ? e.touches[0] : null
    const clientX = touch ? touch.clientX : (e as React.MouseEvent).clientX
    const clientY = touch ? touch.clientY : (e as React.MouseEvent).clientY
    return { x: clientX - rect.left, y: clientY - rect.top }
  }

  const hitTest = useCallback(
    (mx: number, my: number): PlacedItem | null => {
      for (let i = placedItems.length - 1; i >= 0; i--) {
        const item = placedItems[i]
        const rad = -(item.rotation * Math.PI) / 180
        const dx = mx - item.x
        const dy = my - item.y
        const lx = dx * Math.cos(rad) - dy * Math.sin(rad)
        const ly = dx * Math.sin(rad) + dy * Math.cos(rad)
        if (Math.abs(lx) <= item.width / 2 && Math.abs(ly) <= item.height / 2) return item
      }
      return null
    },
    [placedItems]
  )

  const hitRotationHandle = useCallback(
    (mx: number, my: number): boolean => {
      if (!selectedId) return false
      const item = placedItems.find(f => f.id === selectedId)
      if (!item) return false
      const rad = (item.rotation * Math.PI) / 180
      const hx = item.x + Math.sin(rad) * -(item.height / 2 + 30)
      const hy = item.y - Math.cos(rad) * (item.height / 2 + 30)
      return Math.sqrt((mx - hx) ** 2 + (my - hy) ** 2) < 15
    },
    [selectedId, placedItems]
  )

  const hitResizeHandle = useCallback(
    (mx: number, my: number): string | null => {
      if (!selectedId) return null
      const item = placedItems.find(f => f.id === selectedId)
      if (!item) return null
      const rad = -(item.rotation * Math.PI) / 180
      const dx = mx - item.x
      const dy = my - item.y
      const lx = dx * Math.cos(rad) - dy * Math.sin(rad)
      const ly = dx * Math.sin(rad) + dy * Math.cos(rad)
      const w = item.width / 2
      const h = item.height / 2
      const T = 14
      const handles = [
        { name: 'nw', x: -w, y: -h },
        { name: 'ne', x: w, y: -h },
        { name: 'se', x: w, y: h },
        { name: 'sw', x: -w, y: h },
        { name: 'n', x: 0, y: -h },
        { name: 'e', x: w, y: 0 },
        { name: 's', x: 0, y: h },
        { name: 'w', x: -w, y: 0 },
      ]
      for (const hnd of handles) {
        if (Math.abs(lx - hnd.x) < T && Math.abs(ly - hnd.y) < T) return hnd.name
      }
      return null
    },
    [selectedId, placedItems]
  )

  const onMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    const pos = getPos(e)

    if (hitRotationHandle(pos.x, pos.y)) {
      const item = placedItems.find(f => f.id === selectedId)
      if (!item) return
      const startAngle = (Math.atan2(pos.y - item.y, pos.x - item.x) * 180) / Math.PI
      setRotating({ id: selectedId!, startAngle, startRotation: item.rotation })
      return
    }

    const handle = hitResizeHandle(pos.x, pos.y)
    if (handle) {
      const item = placedItems.find(f => f.id === selectedId)
      if (!item) return
      setResizing({
        id: selectedId!,
        handle,
        sx: pos.x,
        sy: pos.y,
        sw: item.width,
        sh: item.height,
        spx: item.x,
        spy: item.y,
      })
      return
    }

    const hit = hitTest(pos.x, pos.y)
    if (hit) {
      setSelectedId(hit.id)
      setDragging({ id: hit.id, ox: pos.x - hit.x, oy: pos.y - hit.y })
    } else {
      setSelectedId(null)
    }
  }

  const onMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    const pos = getPos(e)

    if (dragging) {
      updateItem(dragging.id, { x: pos.x - dragging.ox, y: pos.y - dragging.oy })
    }

    if (resizing) {
      const item = placedItems.find(f => f.id === resizing.id)
      if (!item) return
      const rad = -(item.rotation * Math.PI) / 180
      const dx = (pos.x - resizing.sx) * Math.cos(rad) - (pos.y - resizing.sy) * Math.sin(rad)
      const dy = (pos.x - resizing.sx) * Math.sin(rad) + (pos.y - resizing.sy) * Math.cos(rad)
      const h = resizing.handle
      let nw = resizing.sw
      let nh = resizing.sh

      if (h.includes('e')) nw = Math.max(40, resizing.sw + dx)
      if (h.includes('w')) nw = Math.max(40, resizing.sw - dx)
      if (h.includes('s')) nh = Math.max(40, resizing.sh + dy)
      if (h.includes('n')) nh = Math.max(40, resizing.sh - dy)

      updateItem(resizing.id, { width: nw, height: nh })
    }

    if (rotating) {
      const item = placedItems.find(f => f.id === rotating.id)
      if (!item) return
      const angle = (Math.atan2(pos.y - item.y, pos.x - item.x) * 180) / Math.PI
      let delta = angle - rotating.startAngle
      let newRot = (rotating.startRotation + delta) % 360
      if (newRot < 0) newRot += 360
      const snapped = Math.round(newRot / 15) * 15
      if (Math.abs(newRot - snapped) < 7) newRot = snapped
      updateItem(rotating.id, { rotation: newRot })
    }
  }

  const onMouseUp = () => {
    setDragging(null)
    setResizing(null)
    setRotating(null)
  }

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!selectedId) return
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault()
        removeItem(selectedId)
      }
      if (e.key === 'Escape') setSelectedId(null)
      if (e.key === 'r' || e.key === 'R') {
        const item = placedItems.find(f => f.id === selectedId)
        if (item) updateItem(selectedId, { rotation: (item.rotation + 90) % 360 })
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        const it = placedItems.find(f => f.id === selectedId)
        if (it) updateItem(selectedId, { y: it.y - 5 })
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        const it = placedItems.find(f => f.id === selectedId)
        if (it) updateItem(selectedId, { y: it.y + 5 })
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        const it = placedItems.find(f => f.id === selectedId)
        if (it) updateItem(selectedId, { x: it.x - 5 })
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        const it = placedItems.find(f => f.id === selectedId)
        if (it) updateItem(selectedId, { x: it.x + 5 })
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [selectedId, placedItems, updateItem, removeItem, setSelectedId])

  const selectedItem = placedItems.find(f => f.id === selectedId)

  const getCursor = () => {
    if (dragging) return 'grabbing'
    if (resizing) return 'nwse-resize'
    if (rotating) return 'crosshair'
    return 'default'
  }

  return (
    <div ref={containerRef} className="relative flex-1 overflow-hidden" style={{ cursor: getCursor() }}>
      {/* Room background image */}
      {viewMode === 'design' && (
        <img
          src={roomPreset.image}
          alt="room"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ userSelect: 'none', pointerEvents: 'none' }}
          draggable={false}
        />
      )}

      {/* Camera video element */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover ${viewMode === 'camera' ? 'block' : 'hidden'}`}
        autoPlay
        playsInline
        muted
        style={{ userSelect: 'none', pointerEvents: 'none' }}
      />

      {/* Canvas overlay for furniture */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onMouseDown}
        onTouchMove={onMouseMove}
        onTouchEnd={onMouseUp}
      />

      {/* Selected item floating toolbar */}
      {selectedItem && (
        <div
          className="absolute z-20 flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-yellow-200 px-2 py-1.5"
          style={{
            left: Math.min(
              selectedItem.x + selectedItem.width / 2 - 80,
              (typeof window !== 'undefined' ? window.innerWidth : 800) - 200
            ),
            top: Math.max(selectedItem.y - selectedItem.height / 2 - 50, 10),
          }}
        >
          <button
            onClick={() =>
              updateItem(selectedId!, { rotation: (selectedItem.rotation + 90) % 360 })
            }
            className="p-1.5 rounded-lg hover:bg-amber-50 transition-colors"
            title="Rotate 90°"
          >
            <RotateCw className="w-4 h-4 text-amber-500" />
          </button>
          <button
            onClick={() =>
              updateItem(selectedId!, {
                width: selectedItem.width * 1.1,
                height: selectedItem.height * 1.1,
              })
            }
            className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
            title="Scale up"
          >
            <ZoomIn className="w-4 h-4 text-blue-500" />
          </button>
          <button
            onClick={() =>
              updateItem(selectedId!, {
                width: Math.max(40, selectedItem.width * 0.9),
                height: Math.max(40, selectedItem.height * 0.9),
              })
            }
            className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
            title="Scale down"
          >
            <ZoomOut className="w-4 h-4 text-blue-500" />
          </button>
          <div className="w-px h-5 bg-border mx-0.5" />
          <button
            onClick={() => removeItem(selectedId!)}
            className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      )}

      {/* Empty state hint */}
      {placedItems.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/40 backdrop-blur-sm text-white rounded-2xl px-6 py-4 text-center mx-4">
            <p className="text-base sm:text-lg font-semibold">Click furniture to place it</p>
            <p className="text-xs sm:text-sm text-white/70 mt-1">
              Drag to move · Handles to resize · ↻ to rotate
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
