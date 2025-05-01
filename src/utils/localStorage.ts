// Local storage persistence
// This is a bit hacky but works for now - we should use a proper DB eventually!

// Key used in localStorage 
const KEY = 'incidents_data_v1'; // v1 = added severity field

/**
 * Save incidents data to localStorage
 */
export function saveIncidentsToStorage(data: any[]) {
  if (!data || !Array.isArray(data)) {
    console.warn('Invalid data passed to saveIncidentsToStorage');
    return;
  }
  
  // Stringify and save
  try {
    const json = JSON.stringify(data);
    localStorage.setItem(KEY, json);
    // console.log(`Saved ${data.length} incidents to localStorage`);
  } catch (e) {
    // This can happen if storage is full or in incognito mode
    console.error('Failed to save to localStorage:', e);
  }
}

// Load data from localStorage
export const loadIncidentsFromStorage = () => {
  try {
    // Get from storage
    const json = localStorage.getItem(KEY);
    
    // Handle no data
    if (!json) return [];
    
    // Parse and validate
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) {
      console.warn('Invalid format in localStorage - expected array');
      return [];
    }
    
    return parsed;
  } catch (err) {
    // Something went wrong, start fresh
    console.error('Error loading data:', err);
    return [];
  }
};
