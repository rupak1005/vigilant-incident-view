import React from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import FiltersPanel from './FiltersPanel';
import NewIncidentDialog from './NewIncidentDialog';

interface RightPanelProps {
  onAddIncident: (incident: {
    title: string;
    description: string;
    severity: 'Low' | 'Medium' | 'High';
  }) => void;
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
  isMobile?: boolean;
  onClose?: () => void;
}

const RightPanel: React.FC<RightPanelProps> = ({
  onAddIncident,
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
  isMobile = false,
  onClose
}) => {
  return (
    <div className={`h-full flex flex-col ${isMobile ? 'w-full' : 'w-96'} right-panel overflow-hidden`}>
      <div className="h-full overflow-y-auto custom-scrollbar">
        {/* New Incident button section */}
        <div className="sticky top-0 z-10 glass-effect p-6 pb-4 border-b border-gray-200/40 dark:border-gray-800/40">
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
        
        {/* Filters section */}
        <div className="p-6 pt-4">
          <FiltersPanel
            isOpen={true}
            onClose={onClose}
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
  );
};

export default RightPanel; 