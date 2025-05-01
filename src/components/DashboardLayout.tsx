import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { FileText, Menu, PlusCircle } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import AISummary from './AISummary';
import Sidebar from './Sidebar';
import FiltersPanel from './FiltersPanel';
import NewIncidentDialog from './NewIncidentDialog';
import RightPanel from './RightPanel';

// CSS for custom scrollbars and modern UI elements
const customStyles = `
  /* Hide scrollbar for Chrome, Safari and Opera */
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  
  /* Hide scrollbar for IE, Edge and Firefox */
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  /* Custom scrollbar for Chrome, Safari and Opera */
  .custom-scrollbar::-webkit-scrollbar {
    width: 3px;
    height: 3px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(99, 102, 241, 0.2);
    border-radius: 20px;
    transition: background-color 0.3s ease;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: rgba(99, 102, 241, 0.4);
  }
  
  /* For Firefox */
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(99, 102, 241, 0.2) transparent;
  }

  /* Modern glass effect with refined transparency */
  .glass-effect {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .dark .glass-effect {
    background: rgba(17, 24, 39, 0.95);
  }

  /* Sidebar and panel effects */
  .sidebar-panel {
    background: rgba(255, 255, 255, 0.98);
    border-right: 1px solid rgba(226, 232, 240, 0.8);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .dark .sidebar-panel {
    background: rgba(17, 24, 39, 0.98);
    border-right-color: rgba(55, 65, 81, 0.8);
  }

  .right-panel {
    background: rgba(255, 255, 255, 0.98);
    border-left: 1px solid rgba(226, 232, 240, 0.8);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .dark .right-panel {
    background: rgba(17, 24, 39, 0.98);
    border-left-color: rgba(55, 65, 81, 0.8);
  }

  /* Button effects */
  .panel-button {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid rgba(226, 232, 240, 0.8);
  }

  .dark .panel-button {
    border-color: rgba(55, 65, 81, 0.8);
  }

  .panel-button:hover {
    transform: translateY(-1px);
    border-color: rgba(99, 102, 241, 0.5);
    background: rgba(99, 102, 241, 0.1);
  }

  .dark .panel-button:hover {
    border-color: rgba(99, 102, 241, 0.5);
    background: rgba(99, 102, 241, 0.15);
  }

  /* Active state for panel items */
  .panel-item-active {
    background: rgba(99, 102, 241, 0.1);
    border: 1px solid rgba(99, 102, 241, 0.3);
  }

  .dark .panel-item-active {
    background: rgba(99, 102, 241, 0.15);
    border-color: rgba(99, 102, 241, 0.4);
  }
`;

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  // Search and filter props
  searchQuery: string;
  onSearch: (query: string) => void;
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  selectedSeverities: string[];
  onSeverityChange: (severities: string[]) => void;
  sortOrder: string;
  onSortOrderChange: (order: string) => void;
  onResetFilters: () => void;
  isResetDisabled: boolean;
  // Actions
  onAddIncident: (incident: {
    title: string;
    description: string;
    severity: 'Low' | 'Medium' | 'High';
  }) => void;
  onExportClick: () => void;
  incidents: any[];
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  searchQuery,
  onSearch,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  selectedSeverities,
  onSeverityChange,
  sortOrder,
  onSortOrderChange,
  onResetFilters,
  isResetDisabled,
  onAddIncident,
  onExportClick,
  incidents
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Inject custom styles */}
      <style>{customStyles}</style>
      
      <div className="flex h-screen bg-gray-50/95 dark:bg-gray-900/95 overflow-hidden">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <div className="flex-shrink-0 sidebar-panel w-64">
            <Sidebar />
          </div>
        )}
        
        {/* Main content */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Header */}
          <header className="glass-effect border-b border-gray-200/60 dark:border-gray-700/60 py-3 sm:py-4 px-4 sm:px-8 flex justify-between items-center z-10">
            <div className="flex items-center gap-4 sm:gap-6">
              {isMobile && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white panel-button"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              )}
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{title}</h1>
              <div className="hidden sm:block h-6 w-px bg-gray-200/40 dark:bg-gray-700/40" />
              <AISummary incidents={incidents} />
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              {isMobile && (
                <>
                  <NewIncidentDialog 
                    onAddIncident={onAddIncident}
                    trigger={
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="flex items-center gap-2 bg-indigo-600/90 hover:bg-indigo-700/90 shadow-sm transition-all duration-300 panel-button"
                      >
                        <span className="sr-only">New Incident</span>
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                    }
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className="flex items-center gap-2 panel-button"
                  >
                    <span className="sr-only">Filters</span>
                    <Menu className="h-4 w-4" />
                  </Button>
                </>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={onExportClick}
                className="flex items-center gap-2 panel-button"
              >
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
              </Button>
              
              <ThemeToggle />
            </div>
          </header>
          
          <div className="flex flex-1 overflow-hidden">
            {/* Main dashboard area with filters */}
            <div className="flex flex-1 overflow-hidden">
              {/* Mobile Menu */}
              {isMobile && showMobileMenu && (
                <div className="sidebar-panel p-4">
                  <Sidebar 
                    isMobile={true} 
                    onToggle={() => setShowMobileMenu(false)} 
                  />
                </div>
              )}
              
              {/* Content area */}
              <div className="flex-1 overflow-hidden">
                {/* Mobile Filters */}
                {isMobile && showMobileFilters && (
                  <div className="right-panel p-6">
                    <FiltersPanel
                      isOpen={true}
                      onClose={() => setShowMobileFilters(false)}
                      searchQuery={searchQuery}
                      onSearch={onSearch}
                      startDate={startDate}
                      endDate={endDate}
                      onStartDateChange={onStartDateChange}
                      onEndDateChange={onEndDateChange}
                      selectedSeverities={selectedSeverities}
                      onSeverityChange={onSeverityChange}
                      sortOrder={sortOrder}
                      onSortOrderChange={onSortOrderChange}
                      onResetFilters={onResetFilters}
                      isResetDisabled={isResetDisabled}
                    />
                  </div>
                )}
                
                {/* Main Content */}
                <div className="h-full p-4 sm:p-8 space-y-4 sm:space-y-6 overflow-y-auto custom-scrollbar">
                  {children}
                </div>
              </div>
              
              {/* Fixed Desktop Filters panel */}
              {!isMobile && (
                <div className="w-96 flex-shrink-0 right-panel overflow-hidden">
                  <div className="h-full overflow-y-auto custom-scrollbar">
                    {/* New Incident button at the top of the panel */}
                    <div className="sticky top-0 z-10 glass-effect p-6 pb-4 border-b border-gray-200/40 dark:border-gray-700/40">
                      <NewIncidentDialog 
                        onAddIncident={onAddIncident}
                        trigger={
                          <Button 
                            variant="default" 
                            size="default" 
                            className="w-full flex items-center justify-center gap-2 bg-indigo-600/90 hover:bg-indigo-700/90 shadow-sm transition-all duration-300 panel-button"
                          >
                            <PlusCircle className="h-4 w-4" />
                            <span>New Incident</span>
                          </Button>
                        }
                      />
                    </div>
                    
                    <div className="p-6 pt-4">
                      <FiltersPanel
                        isOpen={true}
                        onClose={() => {/* Fixed panel - no close action needed */}}
                        searchQuery={searchQuery}
                        onSearch={onSearch}
                        startDate={startDate}
                        endDate={endDate}
                        onStartDateChange={onStartDateChange}
                        onEndDateChange={onEndDateChange}
                        selectedSeverities={selectedSeverities}
                        onSeverityChange={onSeverityChange}
                        sortOrder={sortOrder}
                        onSortOrderChange={onSortOrderChange}
                        onResetFilters={onResetFilters}
                        isResetDisabled={isResetDisabled}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout; 