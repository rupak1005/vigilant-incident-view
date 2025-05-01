// CSV export utility 
// author: deadlyr
// last updated: June 2023

/* 
This was originally from stack overflow, adapted for our needs.
Example usage: 
   import { exportToCSV } from '../utils/csvExport';
   exportToCSV(myIncidents);
*/

/**
 * Converts an array of incident objects to CSV and triggers download
 */
export function exportToCSV(data: any[]) {
  // Define columns to export
  const cols = ['Title', 'Description', 'Severity', 'Reported At'];
  
  // Build CSV rows
  let rows = [cols.join(',')]; // headers first
  
  // Add each data row
  for (let i = 0; i < data.length; i++) {
    const incident = data[i];
    // Escape quotes in text fields (double them)
    const title = `"${incident.title.replace(/"/g, '""')}"`;
    const desc = `"${incident.description.replace(/"/g, '""')}"`;
    
    // Format datetime
    const date = new Date(incident.reported_at).toLocaleString();
    
    // Add row to output
    rows.push([title, desc, incident.severity, date].join(','));
  }
  
  // Join rows with newlines
  const csvData = rows.join('\n');

  // Create download link
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  // Create filename with current date
  const today = new Date().toISOString().split('T')[0];
  const filename = `incidents_${today}.csv`;
  
  // Trigger download
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  
  // Cleanup
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
};
