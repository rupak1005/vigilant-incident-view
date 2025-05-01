import React, { useState } from 'react';
import { AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Filter, PlusCircle, FileText } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import AISummary from './AISummary';
import Sidebar from './Sidebar';
import FiltersPanel from './FiltersPanel';
import NewIncidentDialog from './NewIncidentDialog';

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
  // UI state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-3 px-6 flex justify-between items-center shadow-sm">
          <h1 className="text-xl font-bold">{title}</h1>
          
          <div className="flex items-center gap-3">
            <NewIncidentDialog 
              onAddIncident={onAddIncident}
              trigger={
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">New Incident</span>
                </Button>
              }
            />
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onExportClick}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            
            <AISummary incidents={incidents} />
            <ThemeToggle />
          </div>
        </header>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Main dashboard area */}
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
          
          {/* Filters panel */}
          <AnimatePresence>
            <FiltersPanel
              isOpen={filtersOpen}
              onClose={() => setFiltersOpen(false)}
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
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout; 