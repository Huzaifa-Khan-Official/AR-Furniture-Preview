'use client'

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'

const ROOM_PRESETS = [
  {
    name: 'Modern Living Room',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=85',
    thumb: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&q=80',
  },
  {
    name: 'Minimalist Bedroom',
    image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=1200&q=85',
    thumb: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=200&q=80',
  },
  {
    name: 'Home Office',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=85',
    thumb: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&q=80',
  },
  {
    name: 'Cozy Apartment',
    image: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1200&q=85',
    thumb: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=200&q=80',
  },
]

export type RoomPreset = typeof ROOM_PRESETS[number]

export interface PlacedItem {
  id: string
  type: string
  name: string
  image: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
  opacity: number
}

export interface CatalogItem {
  type: string
  name: string
  image: string
  defaultW: number
  defaultH: number
}

interface PlannerContextValue {
  placedItems: PlacedItem[]
  addItem: (catalogItem: CatalogItem, x: number, y: number) => void
  updateItem: (id: string, updates: Partial<PlacedItem>) => void
  removeItem: (id: string) => void
  clearAll: () => void
  selectedId: string | null
  setSelectedId: (id: string | null) => void
  viewMode: 'design' | 'camera'
  setViewMode: (mode: 'design' | 'camera') => void
  roomPreset: RoomPreset
  setRoomPreset: (preset: RoomPreset) => void
  cameraStream: MediaStream | null
  startCamera: () => Promise<void>
  stopCamera: () => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

const PlannerContext = createContext<PlannerContextValue | null>(null)
const STORAGE_KEY = 'roomcraft_ar_layout_v2'

function loadFromStorage(): { placedItems?: PlacedItem[]; roomPreset?: RoomPreset } | null {
  try {
    const data = sessionStorage.getItem(STORAGE_KEY)
    if (data) return JSON.parse(data)
  } catch {}
  return null
}

export function PlannerProvider({ children }: { children: React.ReactNode }) {
  const saved = useRef(loadFromStorage())

  const [placedItems, setPlacedItems] = useState<PlacedItem[]>(saved.current?.placedItems ?? [])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'design' | 'camera'>('design')
  const [roomPreset, setRoomPreset] = useState<RoomPreset>(saved.current?.roomPreset ?? ROOM_PRESETS[0])
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const addItem = useCallback((catalogItem: CatalogItem, x: number, y: number) => {
    const id = `${catalogItem.type}_${Date.now()}`
    setPlacedItems(prev => [
      ...prev,
      {
        id,
        type: catalogItem.type,
        name: catalogItem.name,
        image: catalogItem.image,
        x: x ?? 300,
        y: y ?? 300,
        width: catalogItem.defaultW,
        height: catalogItem.defaultH,
        rotation: 0,
        opacity: 0.92,
      },
    ])
    setSelectedId(id)
  }, [])

  const updateItem = useCallback((id: string, updates: Partial<PlacedItem>) => {
    setPlacedItems(prev => prev.map(item => (item.id === id ? { ...item, ...updates } : item)))
  }, [])

  const removeItem = useCallback((id: string) => {
    setPlacedItems(prev => prev.filter(item => item.id !== id))
    setSelectedId(prev => (prev === id ? null : prev))
  }, [])

  const clearAll = useCallback(() => {
    setPlacedItems([])
    setSelectedId(null)
  }, [])

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      })
      setCameraStream(stream)
      setViewMode('camera')
    } catch {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        setCameraStream(stream)
        setViewMode('camera')
      } catch {
        alert('Camera access denied. Please allow camera permissions.')
      }
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(t => t.stop())
      setCameraStream(null)
    }
    setViewMode('design')
  }, [cameraStream])

  // Auto-save
  useEffect(() => {
    const interval = setInterval(() => {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ placedItems, roomPreset }))
    }, 10000)
    return () => clearInterval(interval)
  }, [placedItems, roomPreset])

  return (
    <PlannerContext.Provider
      value={{
        placedItems,
        addItem,
        updateItem,
        removeItem,
        clearAll,
        selectedId,
        setSelectedId,
        viewMode,
        setViewMode,
        roomPreset,
        setRoomPreset,
        cameraStream,
        startCamera,
        stopCamera,
        sidebarOpen,
        setSidebarOpen,
      }}
    >
      {children}
    </PlannerContext.Provider>
  )
}

export function usePlanner() {
  const ctx = useContext(PlannerContext)
  if (!ctx) throw new Error('usePlanner must be used within PlannerProvider')
  return ctx
}
