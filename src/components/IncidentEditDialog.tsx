
import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Pencil } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/sonner";

interface Incident {
  id: number;
  title: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High';
  reported_at: string;
}

interface IncidentEditDialogProps {
  incident: Incident;
  onSave: (updatedIncident: Incident) => void;
}

const IncidentEditDialog: React.FC<IncidentEditDialogProps> = ({ incident, onSave }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editedIncident, setEditedIncident] = useState<Incident>({ ...incident });
  const [formError, setFormError] = useState<string | null>(null);

  const handleSave = () => {
    if (!editedIncident.title.trim() || !editedIncident.description.trim()) {
      setFormError("Title and description are required.");
      return;
    }
    
    onSave(editedIncident);
    setIsOpen(false);
    toast.success("Incident updated successfully");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedIncident(prev => ({ ...prev, [name]: value }));
  };

  const handleSeverityChange = (value: string) => {
    setEditedIncident(prev => ({ 
      ...prev, 
      severity: value as 'Low' | 'Medium' | 'High' 
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="h-8 px-2"
          title="Edit incident"
          aria-label="Edit incident"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Incident</DialogTitle>
          <DialogDescription>
            Update the incident details below
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {formError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}
          
          <div>
            <label htmlFor="edit-title" className="block text-sm font-medium mb-1">
              Title
            </label>
            <Input
              id="edit-title"
              name="title"
              value={editedIncident.title}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>
          
          <div>
            <label htmlFor="edit-description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <Textarea
              id="edit-description"
              name="description"
              value={editedIncident.description}
              onChange={handleInputChange}
              className="w-full"
              rows={4}
            />
          </div>
          
          <div>
            <label htmlFor="edit-severity" className="block text-sm font-medium mb-1">
              Severity
            </label>
            <Select 
              value={editedIncident.severity} 
              onValueChange={handleSeverityChange}
            >
              <SelectTrigger id="edit-severity">
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IncidentEditDialog;
