
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface MultiSeverityFilterProps {
  selectedSeverities: string[];
  onChange: (severities: string[]) => void;
}

const MultiSeverityFilter: React.FC<MultiSeverityFilterProps> = ({ selectedSeverities, onChange }) => {
  const severities = ['Low', 'Medium', 'High'];

  const handleSeverityChange = (severity: string) => {
    if (selectedSeverities.includes(severity)) {
      onChange(selectedSeverities.filter(s => s !== severity));
    } else {
      onChange([...selectedSeverities, severity]);
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Severity (select multiple)</Label>
      <div className="flex flex-wrap gap-4">
        {severities.map((severity) => (
          <div key={severity} className="flex items-center space-x-2">
            <Checkbox
              id={`severity-${severity.toLowerCase()}`}
              checked={selectedSeverities.includes(severity)}
              onCheckedChange={() => handleSeverityChange(severity)}
              aria-label={`Filter by ${severity} severity`}
            />
            <Label
              htmlFor={`severity-${severity.toLowerCase()}`}
              className="text-sm cursor-pointer"
            >
              {severity}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiSeverityFilter;
