'use client'

import { useState } from 'react'
import { usePlanner } from '@/context/PlannerContext'
import { Plus, Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'

const FURNITURE_CATALOG = [
  {
    type: 'sofa',
    name: 'Modern Sofa',
    category: 'Living Room',
    defaultW: 280,
    defaultH: 120,
    image: "/img1.png",
    thumb: "/img1.png",
  },
  {
    type: 'armchair',
    name: 'Armchair',
    category: 'Living Room',
    defaultW: 140,
    defaultH: 130,
    image: "/img2.png",
    thumb: "/img2.png",
  },
  {
    type: 'bed',
    name: 'Queen Bed',
    category: 'Bedroom',
    defaultW: 240,
    defaultH: 200,
    image: "/img3.png",
    thumb: "/img3.png",
  },
  {
    type: 'desk',
    name: 'Wooden Desk',
    category: 'Office',
    defaultW: 200,
    defaultH: 90,
    image: "/img4.png",
    thumb: "/img4.png",
  },
  {
    type: 'dining_table',
    name: 'Dining Table',
    category: 'Dining',
    defaultW: 220,
    defaultH: 110,
    image: "/img5.png",
    thumb: "/img5.png",
  },
  {
    type: 'coffee_table',
    name: 'Coffee Table',
    category: 'Living Room',
    defaultW: 160,
    defaultH: 80,
    image: "/img6.png",
    thumb: "/img6.png",
  },
  {
    type: 'bookshelf',
    name: 'Bookshelf',
    category: 'Office',
    defaultW: 120,
    defaultH: 200,
    image: "/img7.png",
    thumb: "/img7.png",
  },
  {
    type: 'wardrobe',
    name: 'Wardrobe',
    category: 'Bedroom',
    defaultW: 180,
    defaultH: 220,
    image: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=400&q=80',
    thumb: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=120&q=80',
  },
  {
    type: 'lamp',
    name: 'Floor Lamp',
    category: 'Lighting',
    defaultW: 60,
    defaultH: 160,
    image: "/img8.png",
    thumb: "/img8.png",
  },
  {
    type: 'tv_unit',
    name: 'TV Unit',
    category: 'Living Room',
    defaultW: 200,
    defaultH: 60,
    image: '/img9.png',
    thumb: '/img9.png',
  },
  {
    type: 'dressing_table',
    name: 'Dressing Table',
    category: 'Living Room',
    defaultW: 200,
    defaultH: 60,
    image: '/img10.png',
    thumb: '/img10.png',
  },
] as const

type FurnitureCatalogItem = (typeof FURNITURE_CATALOG)[number]

const CATEGORIES = ['All', 'Living Room', 'Bedroom', 'Dining', 'Office', 'Lighting', 'Decor']

export default function FurnitureSidebar() {
  const { addItem, sidebarOpen, setSidebarOpen } = usePlanner()
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = FURNITURE_CATALOG.filter(item => {
    const matchCat = category === 'All' || item.category === category
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const handleAdd = (item: FurnitureCatalogItem) => {
    addItem(item, window.innerWidth / 2, window.innerHeight / 2)
    // Close sidebar on mobile after adding
    if (window.innerWidth < 768) setSidebarOpen(false)
  }

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={[
          'fixed md:static inset-y-0 left-0 z-40',
          'w-72 bg-white/95 backdrop-blur-sm border-r border-border',
          'flex flex-col shrink-0 shadow-lg md:h-full overflow-hidden',
          'transition-transform duration-300 ease-in-out',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        ].join(' ')}
      >
        {/* Search */}
        <div className="p-3 border-b border-border space-y-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-bold text-sm text-foreground">Furniture Catalog</h2>
            {/* Close button - mobile only */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1 rounded-lg hover:bg-muted transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search furniture..."
              className="pl-8 h-8 text-xs"
            />
          </div>
        </div>

        {/* Category tabs */}
        <div className="px-3 py-2 border-b border-border">
          <div className="flex flex-wrap gap-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                  category === cat
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Furniture grid */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="p-3 grid grid-cols-2 gap-2">
            {filtered.map(item => (
              <button
                key={item.type}
                onClick={() => handleAdd(item)}
                className="group relative flex flex-col rounded-xl overflow-hidden border border-border/50 hover:border-primary/40 hover:shadow-md transition-all duration-200 bg-card text-left"
              >
                <div className="relative w-full aspect-square overflow-hidden bg-muted/30">
                  <img
                    src={item.thumb}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg">
                      <Plus className="w-4 h-4" />
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <div className="text-xs font-semibold text-foreground leading-tight">{item.name}</div>
                  {/* <div className="text-xs text-muted-foreground mt-0.5">{item.price}</div> */}
                </div>
              </button>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-8 text-sm text-muted-foreground">No furniture found</div>
          )}
        </div>
      </aside>
    </>
  )
}
