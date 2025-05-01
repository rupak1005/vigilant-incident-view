import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/sonner";

interface NewIncidentDialogProps {
  onAddIncident: (incident: {
    title: string;
    description: string;
    severity: 'Low' | 'Medium' | 'High';
  }) => void;
  trigger?: React.ReactNode;
}

export default function NewIncidentDialog({ onAddIncident, trigger }: NewIncidentDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'Low' as 'Low' | 'Medium' | 'High',
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      setError("Title and description are required.");
      return;
    }
    
    onAddIncident({
      title: formData.title,
      description: formData.description,
      severity: formData.severity,
    });
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      severity: 'Low',
    });
    setError(null);
    
    // Close dialog
    setOpen(false);
    
    toast.success("Incident reported!");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
  };

  const handleSeverityChange = (value: string) => {
    setFormData({
      ...formData, 
      severity: value as 'Low' | 'Medium' | 'High' 
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>New Incident</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Report New Incident</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Brief incident title"
              className="w-full"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed incident description"
              className="w-full"
              rows={5}
            />
          </div>
          
          <div>
            <label htmlFor="severity" className="block text-sm font-medium mb-1">Severity</label>
            <Select 
              value={formData.severity} 
              onValueChange={handleSeverityChange}
            >
              <SelectTrigger id="severity" className="w-full">
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end gap-3 pt-3">
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Submit Incident</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 