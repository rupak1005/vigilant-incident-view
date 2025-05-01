import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Home, AlertTriangle, Settings, BarChart2, ExternalLink, FileText } from 'lucide-react';

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  // Menu items for the sidebar
  const menuItems = [
    { icon: <Home className="h-5 w-5" />, label: 'Dashboard', active: true },
    { icon: <AlertTriangle className="h-5 w-5" />, label: 'Incidents', active: false },
    { icon: <BarChart2 className="h-5 w-5" />, label: 'Reports', active: false },
    { icon: <Settings className="h-5 w-5" />, label: 'Settings', active: false },
  ];

  return (
    <motion.div 
      className="h-screen bg-gray-900 dark:bg-gray-950 border-r border-gray-800 flex flex-col"
      initial={{ width: collapsed ? 70 : 240 }}
      animate={{ width: collapsed ? 70 : 240 }}
      transition={{ duration: 0.3 }}
    >
      {/* Logo/Header area */}
      <div className="py-3 px-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center overflow-hidden">
          <img src="/logo.svg" alt="Vigilant Logo" className="h-7 w-7" />
          
          {!collapsed && (
            <motion.div 
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="font-bold text-lg text-white ml-2 truncate"
            >
              Vigilant
            </motion.div>
          )}
        </div>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onToggle}
          className="ml-auto text-gray-400 hover:text-white"
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      {/* Nav Menu */}
      <div className="flex-grow py-2">
        <ul className="space-y-1">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Button
                variant={item.active ? "secondary" : "ghost"}
                className={`w-full flex items-center justify-${collapsed ? 'center' : 'start'} px-4 py-2`}
              >
                <span className={`${item.active ? 'text-indigo-700 dark:text-primary' : 'text-gray-500 dark:text-gray-400'}`}>
                  {item.icon}
                </span>
                
                {!collapsed && (
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`ml-3 ${item.active ? 'font-semibold text-indigo-700 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}
                  >
                    {item.label}
                  </motion.span>
                )}
              </Button>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div className="p-5 pb-6 mt-2 border-t border-gray-800 bg-gray-950">
        <div className="flex items-center mb-4">
          <div className="w-9 h-9 rounded-full bg-indigo-600/40 flex items-center justify-center text-white font-bold shadow-sm">
            V
          </div>
          
          {!collapsed && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="ml-4 text-sm font-medium text-white"
            >
              Vigilant v1.0
            </motion.div>
          )}
        </div>
        
        {/* Developer Links */}
        {!collapsed ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="mt-3 space-y-2"
          >
            <a 
              href="https://rupak-s.netlify.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors duration-200 group"
            >
              <ExternalLink className="h-3.5 w-3.5 group-hover:text-indigo-400 transition-colors duration-200" />
              Portfolio
            </a>
            <a 
              href="https://drive.google.com/file/d/1DkVjDSGFoqvA2bqGO2WXtNRJQnR6m89z/view" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors duration-200 group"
            >
              <FileText className="h-3.5 w-3.5 group-hover:text-indigo-400 transition-colors duration-200" />
              Resume
            </a>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center gap-3 mt-3">
            <a 
              href="https://rupak-s.netlify.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-200"
              title="Portfolio"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
            <a 
              href="https://drive.google.com/file/d/1DkVjDSGFoqvA2bqGO2WXtNRJQnR6m89z/view" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-200"
              title="Resume"
            >
              <FileText className="h-4 w-4" />
            </a>
          </div>
        )}
      </div>
    </motion.div>
  );
} 