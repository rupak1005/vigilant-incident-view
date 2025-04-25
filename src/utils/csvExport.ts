
export const exportToCSV = (incidents: any[]) => {
  const headers = ['Title', 'Description', 'Severity', 'Reported At'];
  const csvContent = [
    headers.join(','),
    ...incidents.map(incident => [
      `"${incident.title.replace(/"/g, '""')}"`,
      `"${incident.description.replace(/"/g, '""')}"`,
      incident.severity,
      new Date(incident.reported_at).toLocaleString()
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `incidents_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
