import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
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
  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: isOpen ? 320 : 0, opacity: isOpen ? 1 : 0 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden"
    >
      {isOpen && (
        <div className="p-5 h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Filters & Search</h3>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium mb-2">Search Incidents</h4>
              <IncidentSearch query={searchQuery} onSearch={onSearch} />
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Date Range</h4>
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
            
            <div>
              <h4 className="text-sm font-medium mb-2">Severity</h4>
              <MultiSeverityFilter
                selectedSeverities={selectedSeverities}
                onChange={onSeverityChange}
              />
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Sort Order</h4>
              <Select value={sortOrder} onValueChange={onSortOrderChange}>
                <SelectTrigger id="sort" className="w-full">
                  <SelectValue placeholder="Sort by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button
              variant="outline"
              onClick={onResetFilters}
              disabled={isResetDisabled}
              className="w-full mt-6"
            >
              Reset All Filters
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
} 