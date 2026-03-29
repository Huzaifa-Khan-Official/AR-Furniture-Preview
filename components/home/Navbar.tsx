import { LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <LayoutGrid className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-inter font-bold text-lg tracking-tight text-foreground">RoomCraft</span>
        </Link>
        <Link href="/planner">
          <Button className="rounded-full px-6 font-semibold">
            Start Planning
          </Button>
        </Link>
      </div>
    </nav>
  );
}