'use client';
import { Menu } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <header className="lg:hidden flex items-center justify-between bg-[#00283a] text-white px-4 py-3">
      <button onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}>
        <Menu />
      </button>
      <h1 className="text-lg font-semibold">SB CMS</h1>
    </header>
  );
}
