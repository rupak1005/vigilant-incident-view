import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sparkles } from "lucide-react";

// quick & dirty incident type - TODO: reuse the real type from somewhere
interface AISummaryProps {
  incidents: any[]; // fix this type later
}

// This generates a fake summary for now
// Eventually hook up to OpenAI API
function AISummary({ incidents }: AISummaryProps) {
  const [open, setOpen] = useState(false);
  const [summary, setSummary] = useState('');

  // FIXME: replace with real API call when ready
  function makeSummary() {
    // Just a basic summary for now
    const total = incidents.length;
    const criticalCount = incidents.filter(i => i.severity === 'High').length;
    
    // Count incidents from last week
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const recentCount = incidents.filter(i => 
      new Date(i.reported_at) > lastWeek
    ).length;

    // Generate summary text
    let summaryText = `Analysis of ${total} incidents:\n`;
    summaryText += `- ${criticalCount} high severity incidents found\n`;
    summaryText += `- ${recentCount} incidents from last 7 days\n`;
    
    // Simple alert level logic
    const alertLevel = criticalCount > total/3 ? 'High' : 'Normal';
    summaryText += `Alert level: ${alertLevel}`;

    setSummary(summaryText);
    setOpen(true);
  };

  return (
    <>
      <Button 
        onClick={makeSummary}
        className="flex items-center gap-2"
        variant="outline"
      >
        <Sparkles className="h-4 w-4" />
        AI Summary
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px] bg-card">
          <DialogHeader>
            <DialogTitle>AI Incident Analysis</DialogTitle>
          </DialogHeader>
          <div className="mt-4 whitespace-pre-line">
            {summary}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AISummary;
