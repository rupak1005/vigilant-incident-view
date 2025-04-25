
const STORAGE_KEY = 'incidents_data';

export const saveIncidentsToStorage = (incidents: any[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(incidents));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const loadIncidentsFromStorage = (): any[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return [];
  }
};
