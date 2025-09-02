// File: src/components/header.tsx (Updated)

import Link from 'next/link';
import { Button } from './ui/button';

export default function Header() {
  return (
    <header className="border-b sticky top-0 bg-white/95 backdrop-blur-sm z-10">
      <div className="container mx-auto flex h-16 items-center justify-between">
        {/* App Title linked to the homepage */}
        <Link href="/" className="text-xl font-bold">
          DroneSurvey
        </Link>
        
        {/* Navigation Links */}
        <nav className="flex items-center gap-2">
          {/* Link to view all missions */}
          <Button asChild variant="ghost">
            <Link href="/missions">All Missions</Link>
          </Button>
          {/* Primary action to plan a new mission */}
          <Button asChild variant="default">
            <Link href="/missions/new">Plan Mission</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}