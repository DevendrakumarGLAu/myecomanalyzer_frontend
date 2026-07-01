export interface SidebarMenuItem {
  label: string;
  icon: string;
  route?: string;
  children?: SidebarMenuItem[];
}

export const SIDEBAR_MENU: SidebarMenuItem[] = [
  {
    label: 'My Dashboard',
    icon: 'fas fa-tachometer-alt',
    route: '/user-dashboard'
  },
  {
    label: 'Category',
    icon: 'fas fa-list',
    route: '/category'
  },
  {
    label: 'Products',
    icon: 'fas fa-box',
    route: '/products'
  },
  {
    label: 'Dispatch Invoice',
    icon: 'fas fa-file-invoice',
    route: '/dispatch-invoice'
  },
  {
    label: 'Inventory',
    icon: 'fas fa-box-open',
    route: '/inventory'
  },
  {
    label: 'Manifest',
    icon: 'fas fa-truck-loading',
    route: '/manifest'
  },
];
