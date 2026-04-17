// marketplaces and their colors

export const PLATFORMS = [
  // { name: 'Flipkart', code: 'FLIPKART' },
  { name: 'Meesho', code: 'MEESHO' },
  // { name: 'Amazon', code: 'AMAZON' },
  // { name: 'Myntra', code: 'MYNTRA' }
];

export const PLATFORM_COLORS: Record<string, string> = {
  AMAZON: '#FF9900',   // orange
  FLIPKART: '#0C73EB', // blue
  MEESHO: '#E91E63',   // pink
  MYNTRA: '#F05524',   // orange-red
};


export const COLORS = {
  buttons: {
    add: '#28a745',       // green Add button
    edit: '#007bff',      // blue Edit button
    delete: '#dc3545',    // red Delete button
  },
  headers: {
    headerBg: '#28a745',     // light gray table header background
    headerText: '#fffff',   // primary header text color
  },
  marketplaces: {
    Amazon: '#FF9900',    // orange
    Flipkart: '#0C73EB',  // blue
    Meesho: '#E91E63',    // pink
    Myntra: '#F05524',    // example
  },
  text: {
    primary: '#212529',
    secondary: '#6c757d',
  },
  borders: {
    default: '#dee2e6',
  },
};