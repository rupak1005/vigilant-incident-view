import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

// Props for the date filter component
type DateFilterProps = {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onClearDates: () => void;
}

// Simple date range picker component
export default function DateRangeFilter(props: DateFilterProps) {
  // Extract props for cleaner JSX below
  const { 
    startDate, 
    endDate, 
    onStartDateChange, 
    onEndDateChange, 
    onClearDates 
  } = props;
  
  // Helper to clear a specific date
  const clearDate = (which: 'start' | 'end') => {
    if (which === 'start') {
      onStartDateChange('');
    } else {
      onEndDateChange('');
    }
  };

  // For debugging
  // console.log('DateRangeFilter render', { startDate, endDate });

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {/* Start date field */}
      <div className="flex-1">
        <Label htmlFor="start-date" className="block text-sm font-medium mb-1">From Date</Label>
        <div className="relative">
          <Input
            id="start-date"
            type="date"
            value={startDate}
            onChange={e => onStartDateChange(e.target.value)}
            className="w-full"
            max={endDate || undefined}
          />
          {startDate && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => clearDate('start')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              aria-label="Clear start date"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {/* End date field */}
      <div className="flex-1">
        <Label htmlFor="end-date" className="block text-sm font-medium mb-1">To Date</Label>
        <div className="relative">
          <Input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="w-full"
            min={startDate || undefined}
          />
          {endDate && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => clearDate('end')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              aria-label="Clear end date"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Only show clear button when dates are selected */}
      {(!!startDate || !!endDate) && (
        <div className="flex items-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClearDates}
            className="w-full sm:w-auto"
          >
            Clear Dates
          </Button>
        </div>
      )}
    </div>
  );
}
