// marketplaces and their colors

export const PLATFORMS = [
  // { name: 'Flipkart', code: 'FLIPKART' },
  { name: 'Meesho', code: 'MEESHO' },
  // { name: 'Amazon', code: 'AMAZON' },
  // { name: 'Myntra', code: 'MYNTRA' }
];
export interface SelectOption {
  label: string;
  value: string;
}
export const Product_PLATFORMS: SelectOption[] = [
  { label: 'Meesho', value: 'MEESHO' },
  // { label: 'Flipkart', value: 'FLIPKART' },
  // { label: 'Amazon', value: 'AMAZON' },
  // { label: 'Myntra', value: 'MYNTRA' }
];

export const DELIVERY_PARTNERS = [
  { label: 'Shadowfax', value: 'SHADOWFAX' },
  { label: 'Delhivery', value: 'DELHIVERY' },
  { label: 'Ekart', value: 'EKART' },
  { label: 'Blue Dart', value: 'BLUE_DART' },
  { label: 'Ecom Express', value: 'ECOM_EXPRESS' },
  { label: 'Valmo', value: 'VALMO' },
  { label: 'Xpress Bees', value: 'XPRESS_BEES' }
];

export const Product_COLORS: SelectOption[] = [
  { label: "Red", value: "RED" },
  { label: "Blue", value: "BLUE" },
  { label: "Green", value: "GREEN" },
  { label: "Black", value: "BLACK" },
  { label: "White", value: "WHITE" },
  { label: "Yellow", value: "YELLOW" },
  { label: "Pink", value: "PINK" },
  { label: "Purple", value: "PURPLE" },
  { label: "Orange", value: "ORANGE" },
  { label: "Grey", value: "GREY" },
  { label: "Brown", value: "BROWN" },
  { label: "Maroon", value: "MAROON" },
  { label: "Navy Blue", value: "NAVY_BLUE" },
  { label: "Sky Blue", value: "SKY_BLUE" },
  { label: "Beige", value: "BEIGE" },
  { label: "Gold", value: "GOLD" },
  { label: "Silver", value: "SILVER" },
  { label: "Multicolor", value: "MULTICOLOR" },
  { label: "Other", value: "OTHER" }
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