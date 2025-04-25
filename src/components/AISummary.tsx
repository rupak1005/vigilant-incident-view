
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sparkles } from "lucide-react";

interface AISummaryProps {
  incidents: any[];
}

const AISummary: React.FC<AISummaryProps> = ({ incidents }) => {
  const [open, setOpen] = useState(false);
  const [summary, setSummary] = useState('');

  const generateSummary = () => {
    // Mock AI summary generation
    const total = incidents.length;
    const highSeverity = incidents.filter(i => i.severity === 'High').length;
    const recentIncidents = incidents.filter(i => 
      new Date(i.reported_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;

    setSummary(
      `Analysis of ${total} incidents:\n` +
      `- ${highSeverity} high severity incidents identified\n` +
      `- ${recentIncidents} incidents reported in the last 7 days\n` +
      `Key trends: ${highSeverity > total/3 ? 'High' : 'Normal'} alert level`
    );
    setOpen(true);
  };

  return (
    <>
      <Button 
        onClick={generateSummary}
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
