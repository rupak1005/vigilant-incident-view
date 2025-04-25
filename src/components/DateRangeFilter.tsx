import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onClearDates: () => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onClearDates
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <Label htmlFor="start-date" className="block text-sm font-medium mb-1">From Date</Label>
        <div className="relative">
          <Input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full"
            max={endDate || undefined}
          />
          {startDate && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onStartDateChange('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              aria-label="Clear start date"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
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
              onClick={() => onEndDateChange('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              aria-label="Clear end date"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {(startDate || endDate) && (
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
};

export default DateRangeFilter;
