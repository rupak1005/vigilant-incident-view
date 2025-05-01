import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { X, Search, Calendar, AlertCircle, SortAsc } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import IncidentSearch from "./IncidentSearch";
import DateRangeFilter from "./DateRangeFilter";
import MultiSeverityFilter from "./MultiSeverityFilter";

type FiltersPanelProps = {
  isOpen: boolean;
  onClose: () => void;
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
};

export default function FiltersPanel({
  isOpen,
  onClose,
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
  isResetDisabled
}: FiltersPanelProps) {
  // Determine if this is a mobile view (if onClose is actually used)
  const isMobile = onClose && onClose.toString() !== "() => {/* Fixed panel - no close action needed */}";
  
  // Use a regular div for fixed desktop panel, motion.div for mobile panel
  const Container = isMobile ? motion.div : 'div';
  
  // Only apply animations for mobile view
  const animationProps = isMobile ? {
    initial: { width: 0, opacity: 0 },
    animate: { width: isOpen ? 320 : 0, opacity: isOpen ? 1 : 0 },
    exit: { width: 0, opacity: 0 },
    transition: { duration: 0.3 }
  } : {};

  // Only render if the panel is open or it's the fixed desktop panel
  if (!isOpen) return null;
  
  return (
    <Container
      {...animationProps}
      className={`h-full ${isMobile ? 'border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800' : ''} overflow-hidden`}
    >
      <div className="h-full overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Filters & Search</h3>
          
          {isMobile && (
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
        
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              <Search className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <h4 className="text-sm font-medium">Search Incidents</h4>
            </div>
            <IncidentSearch query={searchQuery} onSearch={onSearch} />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <h4 className="text-sm font-medium">Date Range</h4>
            </div>
            <DateRangeFilter
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={onStartDateChange}
              onEndDateChange={onEndDateChange}
              onClearDates={() => {
                onStartDateChange('');
                onEndDateChange('');
              }}
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              <AlertCircle className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <h4 className="text-sm font-medium">Severity</h4>
            </div>
            <MultiSeverityFilter
              selectedSeverities={selectedSeverities}
              onChange={onSeverityChange}
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
              <SortAsc className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <h4 className="text-sm font-medium">Sort Order</h4>
            </div>
            <Select value={sortOrder} onValueChange={onSortOrderChange}>
              <SelectTrigger id="sort" className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <SelectValue placeholder="Sort by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={onResetFilters}
              disabled={isResetDisabled}
              className="w-full font-medium border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Reset All Filters
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
} 