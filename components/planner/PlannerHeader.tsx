'use client'

import {
  LayoutGrid,
  Camera,
  Monitor,
  ImageIcon,
  ChevronDown,
  Trash2,
  HelpCircle,
  Menu,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePlanner } from '@/context/PlannerContext'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import Link from 'next/link'
import type { RoomPreset } from '@/context/PlannerContext'

const ROOM_PRESETS: RoomPreset[] = [
  {
    name: 'Modern Living Room',
    image: 'https://media.base44.com/images/public/user_697e5b6da6a8724b4a816113/b3cef9d6a_Screenshot2026-03-29122821.png',
    thumb: 'https://media.base44.com/images/public/user_697e5b6da6a8724b4a816113/b3cef9d6a_Screenshot2026-03-29122821.png',
  },
  {
    name: 'Minimalist Bedroom',
    image: 'https://media.base44.com/images/public/user_697e5b6da6a8724b4a816113/ebef11e86_Screenshot2026-03-29122742.png',
    thumb: 'https://media.base44.com/images/public/user_697e5b6da6a8724b4a816113/ebef11e86_Screenshot2026-03-29122742.png',
  },
  {
    name: 'Home Office',
    image: 'https://media.base44.com/images/public/user_697e5b6da6a8724b4a816113/95d5ee7e1_Screenshot2026-03-29122855.png',
    thumb: 'https://media.base44.com/images/public/user_697e5b6da6a8724b4a816113/95d5ee7e1_Screenshot2026-03-29122855.png',
  },
  {
    name: 'Cozy Apartment',
    image: 'https://media.istockphoto.com/id/164962664/photo/new-empty-house-room.jpg?b=1&s=612x612&w=0&k=20&c=HpMQ38_okwMj6Z7iiKynsKf6awyW3wtL1kicIeAqSAk=',
    thumb: 'https://media.istockphoto.com/id/164962664/photo/new-empty-house-room.jpg?b=1&s=612x612&w=0&k=20&c=HpMQ38_okwMj6Z7iiKynsKf6awyW3wtL1kicIeAqSAk=',
  },
]

export default function PlannerHeader() {
  const {
    viewMode,
    startCamera,
    stopCamera,
    roomPreset,
    setRoomPreset,
    placedItems,
    clearAll,
    sidebarOpen,
    setSidebarOpen,
  } = usePlanner()

  return (
    <header className="h-14 bg-white/95 backdrop-blur-sm border-b border-border flex items-center px-3 gap-2 shrink-0 shadow-sm z-30">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors shrink-0"
        aria-label="Toggle furniture sidebar"
      >
        <Menu className="w-5 h-5 text-foreground" />
      </button>

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mr-1 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <LayoutGrid className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="font-bold text-sm hidden sm:block">RoomCraft AR</span>
      </Link>

      <div className="h-5 w-px bg-border hidden sm:block" />

      {/* View mode toggle */}
      <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
        <button
          onClick={() => stopCamera()}
          className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            viewMode === 'design'
              ? 'bg-white text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Design</span>
        </button>
        <button
          onClick={() => startCamera()}
          className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            viewMode === 'camera'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">AR Cam</span>
        </button>
      </div>

      {/* Room preset picker (only in design mode) */}
      {viewMode === 'design' && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8 shrink-0">
              <ImageIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline max-w-24 truncate">{roomPreset.name}</span>
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64 p-2">
            {ROOM_PRESETS.map(preset => (
              <DropdownMenuItem
                key={preset.name}
                onClick={() => setRoomPreset(preset)}
                className="flex items-center gap-3 p-2 rounded-lg cursor-pointer"
              >
                <img
                  src={preset.thumb}
                  alt={preset.name}
                  className="w-14 h-10 object-cover rounded-lg"
                />
                <span className="text-sm font-medium">{preset.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <div className="flex-1" />

      {/* Items count */}
      {placedItems.length > 0 && (
        <span className="text-xs text-muted-foreground hidden md:block shrink-0">
          {placedItems.length} item{placedItems.length !== 1 ? 's' : ''}
        </span>
      )}

      {/* Clear all */}
      {placedItems.length > 0 && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs h-8 text-destructive border-destructive/30 hover:bg-destructive/10 shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear all furniture?</AlertDialogTitle>
              <AlertDialogDescription>
                Remove all {placedItems.length} items from the room.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={clearAll}
                className="bg-destructive text-destructive-foreground"
              >
                Clear All
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Help */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <HelpCircle className="w-4 h-4 text-muted-foreground" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs leading-relaxed max-w-52">
            <p className="font-semibold mb-1">Controls:</p>
            <p>Click catalog → add to room</p>
            <p>Drag item → move</p>
            <p>Corner handles → resize</p>
            <p>↻ handle → rotate freely</p>
            <p>R key → rotate 90°</p>
            <p>Delete → remove</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </header>
  )
}
