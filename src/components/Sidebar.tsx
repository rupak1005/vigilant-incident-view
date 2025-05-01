import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Home, AlertTriangle, Settings, BarChart2, ExternalLink, FileText, X } from 'lucide-react';

type SidebarProps = {
  onToggle?: () => void;
  isMobile?: boolean;
};

export default function Sidebar({ onToggle, isMobile = false }: SidebarProps) {
  const menuItems = [
    { icon: <Home className="h-5 w-5" />, label: 'Dashboard', active: true },
    { icon: <AlertTriangle className="h-5 w-5" />, label: 'Incidents', active: false },
    { icon: <BarChart2 className="h-5 w-5" />, label: 'Reports', active: false },
    { icon: <Settings className="h-5 w-5" />, label: 'Settings', active: false },
  ];

  return (
    <div className={`${
      isMobile 
        ? 'w-full' 
        : 'h-screen w-64 bg-white/98 dark:bg-gray-950/98'
    } flex flex-col`}>
      {/* Logo/Header area */}
      <div className={`py-4 px-4 sm:px-6 ${
        isMobile 
          ? 'bg-white/98 dark:bg-gray-950/98 flex items-center justify-between border-b border-gray-200/40 dark:border-gray-800/40' 
          : 'border-b border-gray-200/40 dark:border-gray-800/40'
      }`}>
        <div className="flex items-center">
          <img src="/logo.svg" alt="Vigilant Logo" className="h-7 sm:h-8 w-7 sm:w-8" />
          <div className="font-bold text-lg sm:text-xl ml-3 truncate text-gray-900 dark:text-white">
            {isMobile ? 'Menu' : 'Vigilant'}
          </div>
        </div>
        
        {isMobile && onToggle && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onToggle}
            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white panel-button"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Nav Menu */}
      <div className="flex-grow py-4 px-3 overflow-y-auto custom-scrollbar">
        <ul className="space-y-1.5">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Button
                variant={item.active ? "secondary" : "ghost"}
                className={`w-full flex items-center justify-start px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all duration-200 ${
                  item.active 
                    ? 'panel-item-active text-indigo-600 dark:text-indigo-400' 
                    : `${isMobile 
                        ? 'text-gray-700 dark:text-gray-300' 
                        : 'text-gray-600 dark:text-gray-400'} 
                       hover:text-indigo-600 dark:hover:text-indigo-400 panel-button`
                }`}
              >
                <span className={`${
                  item.active 
                    ? 'text-indigo-600 dark:text-indigo-400' 
                    : isMobile 
                      ? 'text-gray-700 dark:text-gray-300' 
                      : 'text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                } transition-colors duration-200`}>
                  {item.icon}
                </span>
                <span className="ml-3 text-sm sm:text-base">
                  {item.label}
                </span>
              </Button>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      {!isMobile && (
        <div className="p-4 sm:p-6 border-t border-gray-200/40 dark:border-gray-800/40 bg-gray-50/50 dark:bg-gray-950/50">
          {/* Developer Links */}
          <div className="mb-4 sm:mb-6 space-y-2 sm:space-y-3">
            <a 
              href="https://rupak-s.netlify.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 group panel-button px-3 py-2 rounded-md"
            >
              <ExternalLink className="h-3.5 sm:h-4 w-3.5 sm:w-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200" />
              Portfolio
            </a>
            <a 
              href="https://drive.google.com/file/d/1yIF1cpF3Uz6M7-_TP0gn18bzplbX-_kf/view?usp=sharing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 group panel-button px-3 py-2 rounded-md"
            >
              <FileText className="h-3.5 sm:h-4 w-3.5 sm:w-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200" />
              Resume
            </a>
          </div>

          {/* Avatar + Label */}
          <div className="flex items-center px-3 py-2 panel-button rounded-md">
            <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-indigo-600/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
              V
            </div>
            <div className="ml-3 sm:ml-4 text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
              Vigilant v1.0
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 