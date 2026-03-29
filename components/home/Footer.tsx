import { LayoutGrid } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <LayoutGrid className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-inter font-bold text-foreground">RoomCraft</span>
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} RoomCraft.
        </p>
      </div>
    </footer>
  );
}