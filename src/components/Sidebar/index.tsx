'use client';

import { useState } from 'react';
import {
  Menu,
  FileText,
  Image,
  Video,
  Music,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const navItems = [
  { label: 'All Files', icon: <FileText /> },
  { label: 'Images', icon: <Image /> },
  { label: 'Document', icon: <FileText /> },
  { label: 'Video', icon: <Video /> },
  { label: 'Music', icon: <Music /> },
  { label: 'Others', icon: <MoreHorizontal /> },
];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Topbar */}
      <div className="lg:hidden flex justify-between items-center p-4 bg-gray-900 text-white">
        <span className="text-lg font-semibold">My Files</span>
        <button onClick={() => setMobileOpen(!mobileOpen)}>
          <Menu />
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="lg:hidden flex flex-col bg-gray-800 text-white px-4 py-2 space-y-2">
          {navItems.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:flex flex-col bg-gray-900 text-gray-200 fixed top-0 left-0 h-screen transition-all duration-300 z-30 p-3 ${
          collapsed ? 'w-16' : 'w-48'
        } transition-all duration-300`}
      >
        <button
          className="lg:flex absolute -right-4 top-1/2 transform -translate-y-1/2 bg-gray-900 border border-gray-700 w-8 h-8 rounded-full items-center justify-center shadow"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>

        {navItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center space-x-2 mb-4 hover:text-white cursor-pointer"
          >
            <div>{item.icon}</div>
            {!collapsed && <span>{item.label}</span>}
          </div>
        ))}
      </div>
    </>
  );
}
