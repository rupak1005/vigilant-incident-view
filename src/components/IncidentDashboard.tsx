import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, CheckSquare, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/sonner";
import IncidentCharts from "@/components/IncidentCharts";
import IncidentEditDialog from "@/components/IncidentEditDialog";
import IncidentDeleteDialog from "@/components/IncidentDeleteDialog";
import { exportToCSV } from '../utils/csvExport';
import { saveIncidentsToStorage, loadIncidentsFromStorage } from '../utils/localStorage';
import DashboardLayout from './DashboardLayout';

// TODO: Move this to types file later
interface Incident {
  id: number;
  title: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High';
  reported_at: string; // ISO timestamp
}

const IncidentDashboard = () => {
  // Some starter data for demo purposes
  const sampleIncidents: Incident[] = [
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

  const [incidents, setIncidents] = useState<Incident[]>(sampleIncidents);
  const [expanded, setExpanded] = useState<number[]>([]);
  const [activeSeverities, setActiveSeverities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("newest");
  
  // For adding new incidents
  const [newInc, setNewInc] = useState<Omit<Incident, 'id' | 'reported_at'>>({
    title: '',
    description: '',
    severity: 'Low',
  });
  const [error, setError] = useState<string | null>(null);
  
  // Search and filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selected, setSelected] = useState<number[]>([]);

  // UI state
  const [showAddForm, setShowAddForm] = useState(false);

  // Load saved incidents once on startup
  useEffect(() => {
    const saved = loadIncidentsFromStorage();
    if (saved && saved.length > 0) {
      setIncidents(saved);
    }
  }, []);

  // Show toast for high severity incidents
  useEffect(() => {
    const highSevs = incidents.filter(inc => inc.severity === "High");
    
    if (highSevs.length > 0) {
      let newest = highSevs[0];
      for (let i = 1; i < highSevs.length; i++) {
        if (new Date(highSevs[i].reported_at) > new Date(newest.reported_at)) {
          newest = highSevs[i];
        }
      }
      
      const isNew = (Date.now() - new Date(newest.reported_at).getTime()) < 60000;
      
      if (isNew) {
        toast.warning(
          `High Severity Alert: ${newest.title}`, 
          { 
            duration: 5000,
            important: true,
          }
        );
      }
    }
  }, [incidents]);

  // Save to localStorage whenever incidents change
  useEffect(() => {
    saveIncidentsToStorage(incidents);
  }, [incidents]);

  // Toggle expanded details view
  const toggleExpand = (id: number) => {
    if (expanded.includes(id)) {
      setExpanded(expanded.filter(i => i !== id));
    } else {
      setExpanded([...expanded, id]);
    }
  };

  // Toggle incident selection for bulk actions
  const toggleSelect = (id: number) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(i => i !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const toggleAll = () => {
    if (selected.length === filtered.length) {
      setSelected([]);
    } else {
      setSelected(filtered.map(inc => inc.id));
    }
  };

  // Apply all filters and sort
  const filtered = incidents
    .filter(inc => {
      // Severity filter
      const sevMatch = activeSeverities.length === 0 || 
                        activeSeverities.includes(inc.severity);
      
      // Text search
      const textMatch = !searchQuery || 
                        inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        inc.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Date range filter
      const incDate = new Date(inc.reported_at);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      
      if (start) start.setHours(0, 0, 0, 0);
      if (end) end.setHours(23, 59, 59, 999);
      
      const dateMatch = (!start || incDate >= start) &&
                        (!end || incDate <= end);
      
      return sevMatch && textMatch && dateMatch;
    })
    .sort((a, b) => {
      const dateA = new Date(a.reported_at).getTime();
      const dateB = new Date(b.reported_at).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

  // Submit new incident
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newInc.title.trim() || !newInc.description.trim()) {
      setError("Title and description are required.");
      return;
    }
    
    // Find next ID
    let nextId = 1;
    if (incidents.length > 0) {
      nextId = Math.max(...incidents.map(i => i.id)) + 1;
    }
    
    const incToAdd = {
      ...newInc,
      id: nextId,
      reported_at: new Date().toISOString(),
    };
    
    setIncidents([incToAdd, ...incidents]);
    setNewInc({
      title: '',
      description: '',
      severity: 'Low',
    });
    setError(null);
    setShowAddForm(false);
    
    toast.success("Incident reported!");
  };

  // Form input handlers
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewInc({...newInc, [name]: value});
  };

  const setSeverity = (value: string) => {
    setNewInc({
      ...newInc, 
      severity: value as 'Low' | 'Medium' | 'High' 
    });
  };

  // Get CSS class for severity badge
  const getSevBadgeStyle = (sev: string) => {
    switch (sev) {
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
  
  // Update an existing incident
  const updateIncident = (updated: Incident) => {
    setIncidents(incidents.map(inc => 
      inc.id === updated.id ? updated : inc
    ));
  };
  
  // Delete a single incident
  const deleteIncident = (id: number) => {
    setIncidents(incidents.filter(inc => inc.id !== id));
    setSelected(selected.filter(selId => selId !== id));
  };
  
  // Delete multiple selected incidents
  const bulkDelete = () => {
    if (selected.length === 0) return;
    
    setIncidents(incidents.filter(inc => !selected.includes(inc.id)));
    setSelected([]);
    
    toast.success(`Deleted ${selected.length} incident${selected.length > 1 ? 's' : ''}`);
  };
  
  // Reset all filters
  const resetFilters = () => {
    setActiveSeverities([]);
    setSearchQuery('');
    setStartDate('');
    setEndDate('');
    setSortBy("newest");
  };

  // Text highlighting for search results
  const highlight = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark className="bg-yellow-200 dark:bg-yellow-900">$1</mark>');
  };

  // Check if reset filters is disabled
  const isResetFiltersDisabled = !searchQuery && !startDate && !endDate && activeSeverities.length === 0 && sortBy === "newest";

  return (
    <DashboardLayout
      title="Incident Dashboard"
      searchQuery={searchQuery}
      onSearch={setSearchQuery}
      startDate={startDate}
      endDate={endDate}
      onStartDateChange={setStartDate}
      onEndDateChange={setEndDate}
      selectedSeverities={activeSeverities}
      onSeverityChange={setActiveSeverities}
      sortOrder={sortBy}
      onSortOrderChange={setSortBy}
      onResetFilters={resetFilters}
      isResetDisabled={isResetFiltersDisabled}
      onAddClick={() => setShowAddForm(true)}
      onExportClick={() => exportToCSV(filtered)}
      incidents={incidents}
    >
      {/* Metrics section */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <Card className="bg-card/80 p-4">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Total Incidents</div>
          <div className="text-2xl font-bold">{incidents.length}</div>
          <div className="text-xs mt-2 text-green-600">
            <span className="flex items-center">
              <RefreshCw className="h-3 w-3 mr-1" /> Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </Card>
        
        <Card className="bg-card/80 p-4">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">High Severity</div>
          <div className="text-2xl font-bold">{incidents.filter(i => i.severity === 'High').length}</div>
          <div className="text-xs mt-2 text-red-600">
            <span className="flex items-center">
              <RefreshCw className="h-3 w-3 mr-1" /> Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </Card>
        
        <Card className="bg-card/80 p-4">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Medium Severity</div>
          <div className="text-2xl font-bold">{incidents.filter(i => i.severity === 'Medium').length}</div>
          <div className="text-xs mt-2 text-yellow-600">
            <span className="flex items-center">
              <RefreshCw className="h-3 w-3 mr-1" /> Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </Card>
        
        <Card className="bg-card/80 p-4">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Low Severity</div>
          <div className="text-2xl font-bold">{incidents.filter(i => i.severity === 'Low').length}</div>
          <div className="text-xs mt-2 text-blue-600">
            <span className="flex items-center">
              <RefreshCw className="h-3 w-3 mr-1" /> Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </Card>
      </div>
      
      {/* Charts section */}
      <IncidentCharts incidents={incidents} />
      
      {/* New incident form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-6 overflow-hidden"
          >
            <Card className="bg-card/50 backdrop-blur-xl border border-border/50 p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Report New Incident</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                  <AlertCircle className="h-4 w-4" />
                </Button>
              </div>
              
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
                  <Input
                    id="title"
                    name="title"
                    value={newInc.title}
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
                    value={newInc.description}
                    onChange={handleChange}
                    placeholder="Detailed incident description"
                    className="w-full"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label htmlFor="severity" className="block text-sm font-medium mb-1">Severity</label>
                  <Select 
                    value={newInc.severity} 
                    onValueChange={setSeverity}
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
                
                <Button type="submit" className="w-full">Submit Incident</Button>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Incident list */}
      <div className="mt-6">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Incidents</h2>
          <div className="text-sm text-gray-500">
            Showing {filtered.length} of {incidents.length} incidents
          </div>
        </div>
        
        {selected.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-md"
          >
            <div className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="font-medium">
                {selected.length} incident{selected.length > 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelected([])}
              >
                Deselect All
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={bulkDelete}
              >
                Delete Selected
              </Button>
            </div>
          </motion.div>
        )}
        
        <div className="flex items-center gap-2 mb-4">
          <Checkbox
            id="select-all"
            checked={selected.length === filtered.length && filtered.length > 0}
            onCheckedChange={toggleAll}
            aria-label="Select all incidents"
          />
          <label htmlFor="select-all" className="text-sm cursor-pointer">
            Select All
          </label>
        </div>
        
        <AnimatePresence>
          <div className="space-y-4">
            {filtered.length === 0 ? (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-gray-500 py-8"
              >
                No incidents match your criteria.
              </motion.p>
            ) : (
              filtered.map(incident => (
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
                          checked={selected.includes(incident.id)}
                          onCheckedChange={() => toggleSelect(incident.id)}
                          aria-label={`Select incident ${incident.title}`}
                        />
                      </div>
                      
                      <div className="flex-1 w-full">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <h3 className="text-base sm:text-lg font-semibold" 
                                dangerouslySetInnerHTML={{ 
                                  __html: highlight(incident.title, searchQuery) 
                                }} 
                            />
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                              {new Date(incident.reported_at).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getSevBadgeStyle(incident.severity)}`}>
                              {incident.severity}
                            </span>
                            <div className="flex gap-2">
                              <IncidentEditDialog 
                                incident={incident}
                                onSave={updateIncident}
                              />
                              <IncidentDeleteDialog
                                incidentId={incident.id}
                                incidentTitle={incident.title}
                                onDelete={deleteIncident}
                              />
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => toggleExpand(incident.id)}
                                aria-expanded={expanded.includes(incident.id)}
                                className="h-8"
                              >
                                {expanded.includes(incident.id) ? 'Hide Details' : 'View Details'}
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <AnimatePresence mode="wait">
                          {expanded.includes(incident.id) && (
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
                                  __html: highlight(incident.description, searchQuery) 
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
    </DashboardLayout>
  );
};

export default IncidentDashboard;
