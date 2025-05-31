'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  FileText,
  Folder,
  MessageSquare,
  Settings,
  Layers,
} from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { label: 'Dashboard', href: '/', icon: FileText },
  { label: 'Blogs', href: '/blogs', icon: FileText },
  { label: 'Project', href: '/project', icon: Folder },
  { label: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
  { label: 'Skills', href: '/skills', icon: Layers },
  { label: 'Other', href: '/other', icon: Settings },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close sidebar when clicking outside (mobile only)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const SidebarContent = (
    <div
      ref={ref}
      className={clsx(
        'h-full bg-[#00283a] text-white flex flex-col transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
        {!collapsed && <span className="text-xl font-bold">SB CMS</span>}
        <button
          className="text-white"
          onClick={() => (collapsed ? setCollapsed(false) : setCollapsed(true))}
        >
          {collapsed ? <Menu size={24} /> : <X size={24} />}
        </button>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-2">
        {navItems.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              'flex items-center gap-3 rounded-md px-3 py-2 hover:bg-[#004e75] transition',
              pathname === href && 'bg-[#004e75]'
            )}
          >
            <Icon size={20} />
            {!collapsed && <span>{label}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">{SidebarContent}</div>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          {SidebarContent}
        </div>
      )}

      {/* Mobile toggle button (in header space) */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-[#00283a] text-white lg:hidden"
        onClick={() => setMobileOpen(true)}
      >
        <Menu />
      </button>
    </>
  );
}
