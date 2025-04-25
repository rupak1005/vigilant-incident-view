import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, CheckSquare } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/sonner";
import ThemeToggle from "@/components/ThemeToggle";
import IncidentCharts from "@/components/IncidentCharts";
import IncidentSearch from "@/components/IncidentSearch";
import DateRangeFilter from "@/components/DateRangeFilter";
import MultiSeverityFilter from "@/components/MultiSeverityFilter";
import IncidentEditDialog from "@/components/IncidentEditDialog";
import IncidentDeleteDialog from "@/components/IncidentDeleteDialog";
import { exportToCSV } from '../utils/csvExport';
import { saveIncidentsToStorage, loadIncidentsFromStorage } from '../utils/localStorage';
import AISummary from './AISummary';
import { FileText } from 'lucide-react';

interface Incident {
  id: number;
  title: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High';
  reported_at: string; // ISO timestamp
}

const IncidentDashboard: React.FC = () => {
  const initialIncidents: Incident[] = [
    { 
      id: 1, 
      title: "Biased Recommendation Algorithm", 
      description: "Algorithm consistently favored certain demographics...", 
      severity: "Medium", 
      reported_at: "2025-03-15T10:00:00Z" 
    },
    { 
      id: 2, 
      title: "LLM Hallucination in Critical Info", 
      description: "LLM provided incorrect safety procedure information...", 
      severity: "High", 
      reported_at: "2025-04-01T14:30:00Z" 
    },
    { 
      id: 3, 
      title: "Minor Data Leak via Chatbot", 
      description: "Chatbot inadvertently exposed non-sensitive user metadata...", 
      severity: "Low", 
      reported_at: "2025-03-20T09:15:00Z" 
    }
  ];

  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const [selectedSeverities, setSelectedSeverities] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<string>("newest");
  
  const [newIncident, setNewIncident] = useState<Omit<Incident, 'id' | 'reported_at'>>({
    title: '',
    description: '',
    severity: 'Low',
  });
  const [formError, setFormError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedIncidents, setSelectedIncidents] = useState<number[]>([]);

  useEffect(() => {
    const savedIncidents = loadIncidentsFromStorage();
    if (savedIncidents.length > 0) {
      setIncidents(savedIncidents);
    }
  }, []);

  useEffect(() => {
    const highSeverityIncidents = incidents.filter(
      incident => incident.severity === "High"
    );
    
    if (highSeverityIncidents.length > 0) {
      const latestHighSeverity = highSeverityIncidents.reduce((latest, current) => 
        new Date(current.reported_at) > new Date(latest.reported_at) ? current : latest
      );
      
      const isRecent = (Date.now() - new Date(latestHighSeverity.reported_at).getTime()) < 60000;
      
      if (isRecent) {
        toast.warning(
          `High Severity Alert: ${latestHighSeverity.title}`, 
          { 
            duration: 5000,
            important: true,
          }
        );
      }
    }
  }, [incidents]);

  useEffect(() => {
    saveIncidentsToStorage(incidents);
  }, [incidents]);

  const toggleDetails = (id: number) => {
    setExpandedIds(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const toggleSelectIncident = (id: number) => {
    setSelectedIncidents(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIncidents.length === filteredAndSortedIncidents.length) {
      setSelectedIncidents([]);
    } else {
      setSelectedIncidents(filteredAndSortedIncidents.map(inc => inc.id));
    }
  };

  const filteredAndSortedIncidents = incidents
    .filter(incident => {
      const severityMatch = selectedSeverities.length === 0 || 
                            selectedSeverities.includes(incident.severity);
      
      const searchMatch = !searchQuery || 
                          incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          incident.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const incidentDate = new Date(incident.reported_at);
      const startDateObj = startDate ? new Date(startDate) : null;
      const endDateObj = endDate ? new Date(endDate) : null;
      
      if (startDateObj) startDateObj.setHours(0, 0, 0, 0);
      if (endDateObj) endDateObj.setHours(23, 59, 59, 999);
      
      const dateMatch = (!startDateObj || incidentDate >= startDateObj) &&
                        (!endDateObj || incidentDate <= endDateObj);
      
      return severityMatch && searchMatch && dateMatch;
    })
    .sort((a, b) => {
      const dateA = new Date(a.reported_at).getTime();
      const dateB = new Date(b.reported_at).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newIncident.title.trim() || !newIncident.description.trim()) {
      setFormError("Title and description are required.");
      return;
    }
    
    const newIncidentWithIdAndDate = {
      ...newIncident,
      id: Math.max(0, ...incidents.map(inc => inc.id)) + 1,
      reported_at: new Date().toISOString(),
    };
    
    setIncidents([newIncidentWithIdAndDate, ...incidents]);
    setNewIncident({
      title: '',
      description: '',
      severity: 'Low',
    });
    setFormError(null);
    
    toast.success("New incident reported successfully");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewIncident(prev => ({ ...prev, [name]: value }));
  };

  const handleSeverityChange = (value: string) => {
    setNewIncident(prev => ({ 
      ...prev, 
      severity: value as 'Low' | 'Medium' | 'High' 
    }));
  };

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
      case 'Low':
        return 'bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Medium':
        return 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'High':
        return 'bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };
  
  const handleUpdateIncident = (updatedIncident: Incident) => {
    setIncidents(prev => prev.map(inc => 
      inc.id === updatedIncident.id ? updatedIncident : inc
    ));
  };
  
  const handleDeleteIncident = (id: number) => {
    setIncidents(prev => prev.filter(inc => inc.id !== id));
    setSelectedIncidents(prev => prev.filter(selectedId => selectedId !== id));
  };
  
  const handleBulkDelete = () => {
    if (selectedIncidents.length === 0) return;
    
    setIncidents(prev => prev.filter(inc => !selectedIncidents.includes(inc.id)));
    setSelectedIncidents([]);
    
    toast.success(`${selectedIncidents.length} incident${selectedIncidents.length > 1 ? 's' : ''} deleted`);
  };
  
  const clearAllFilters = () => {
    setSelectedSeverities([]);
    setSearchQuery('');
    setStartDate('');
    setEndDate('');
    setSortOrder("newest");
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark className="bg-yellow-200 dark:bg-yellow-900">$1</mark>');
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl font-bold text-center sm:text-left"
        >
          Incident Dashboard
        </motion.h1>
        <div className="flex flex-wrap gap-2 sm:gap-4 items-center w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={() => exportToCSV(filteredAndSortedIncidents)}
            className="flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <FileText className="h-4 w-4" />
            Export CSV
          </Button>
          <AISummary incidents={incidents} />
          <ThemeToggle />
        </div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 bg-card/50 backdrop-blur-xl border border-border/50 p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
      >
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Report New Incident</h2>
        
        {formError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title
            </label>
            <Input
              id="title"
              name="title"
              value={newIncident.title}
              onChange={handleInputChange}
              placeholder="Brief incident title"
              className="w-full"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              value={newIncident.description}
              onChange={handleInputChange}
              placeholder="Detailed incident description"
              className="w-full"
              rows={3}
            />
          </div>
          
          <div>
            <label htmlFor="severity" className="block text-sm font-medium mb-1">
              Severity
            </label>
            <Select 
              value={newIncident.severity} 
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
          
          <Button type="submit" className="w-full">
            Submit Incident
          </Button>
        </form>
      </motion.div>

      <IncidentCharts incidents={incidents} />
      
      <div className="mb-6 bg-card/50 backdrop-blur-xl border border-border/50 p-4 sm:p-6 rounded-lg shadow-lg">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Search & Filter</h2>
        
        <IncidentSearch query={searchQuery} onSearch={setSearchQuery} />
        
        <DateRangeFilter
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onClearDates={() => {
            setStartDate('');
            setEndDate('');
          }}
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4">
          <MultiSeverityFilter
            selectedSeverities={selectedSeverities}
            onChange={setSelectedSeverities}
          />
          
          <div>
            <label htmlFor="sort" className="block text-sm font-medium mb-1">
              Sort by Date
            </label>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger id="sort" className="w-full">
                <SelectValue placeholder="Sort by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-between items-center mt-4 gap-4">
          <div className="text-sm text-gray-500">
            Showing {filteredAndSortedIncidents.length} of {incidents.length} incidents
          </div>
          
          <Button
            variant="outline"
            onClick={clearAllFilters}
            disabled={!searchQuery && !startDate && !endDate && selectedSeverities.length === 0 && sortOrder === "newest"}
          >
            Clear All Filters
          </Button>
        </div>
      </div>
      
      {selectedIncidents.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-md"
        >
          <div className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="font-medium">
              {selectedIncidents.length} incident{selectedIncidents.length > 1 ? 's' : ''} selected
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedIncidents([])}
            >
              Deselect All
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
            >
              Delete Selected
            </Button>
          </div>
        </motion.div>
      )}
      
      <div className="flex flex-col sm:flex-row items-center gap-2 mb-4">
        <Checkbox
          id="select-all"
          checked={selectedIncidents.length === filteredAndSortedIncidents.length && filteredAndSortedIncidents.length > 0}
          onCheckedChange={toggleSelectAll}
          aria-label="Select all incidents"
        />
        <label htmlFor="select-all" className="text-sm cursor-pointer">
          Select All
        </label>
      </div>
      
      <AnimatePresence>
        <div className="space-y-4">
          {filteredAndSortedIncidents.length === 0 ? (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-gray-500 py-8"
            >
              No incidents match your criteria.
            </motion.p>
          ) : (
            filteredAndSortedIncidents.map(incident => (
              <motion.div
                key={incident.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                layout
              >
                <Card className="bg-card/50 backdrop-blur-xl border border-border/50 transition-all duration-300 ease-in-out hover:shadow-lg dark:hover:bg-gray-800/50 hover:border-primary/50">
                  <div className="flex flex-col sm:flex-row items-start gap-4 p-4">
                    <div className="pt-1">
                      <Checkbox
                        checked={selectedIncidents.includes(incident.id)}
                        onCheckedChange={() => toggleSelectIncident(incident.id)}
                        aria-label={`Select incident ${incident.title}`}
                      />
                    </div>
                    
                    <div className="flex-1 w-full">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h3 className="text-base sm:text-lg font-semibold" 
                              dangerouslySetInnerHTML={{ 
                                __html: highlightText(incident.title, searchQuery) 
                              }} 
                          />
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            {new Date(incident.reported_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getSeverityBadgeClass(incident.severity)}`}>
                            {incident.severity}
                          </span>
                          <div className="flex gap-2">
                            <IncidentEditDialog 
                              incident={incident}
                              onSave={handleUpdateIncident}
                            />
                            <IncidentDeleteDialog
                              incidentId={incident.id}
                              incidentTitle={incident.title}
                              onDelete={handleDeleteIncident}
                            />
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => toggleDetails(incident.id)}
                              aria-expanded={expandedIds.includes(incident.id)}
                              className="h-8"
                            >
                              {expandedIds.includes(incident.id) ? 'Hide Details' : 'View Details'}
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <AnimatePresence mode="wait">
                        {expandedIds.includes(incident.id) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ 
                              height: "auto", 
                              opacity: 1,
                              transition: {
                                height: { duration: 0.3, ease: "easeOut" },
                                opacity: { duration: 0.2, delay: 0.1 }
                              }
                            }}
                            exit={{ 
                              height: 0, 
                              opacity: 0,
                              transition: {
                                height: { duration: 0.3, ease: "easeIn" },
                                opacity: { duration: 0.2 }
                              }
                            }}
                            className="mt-4 px-4 py-3 bg-background/50 backdrop-blur-sm rounded-md overflow-hidden"
                          >
                            <p 
                              className="text-foreground"
                              dangerouslySetInnerHTML={{ 
                                __html: highlightText(incident.description, searchQuery) 
                              }}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </AnimatePresence>
    </div>
  );
};

export default IncidentDashboard;
