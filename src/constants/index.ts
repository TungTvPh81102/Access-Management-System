export const REGISTRATION_TYPES = [
  { type: 'visitor', labelKey: 'visitor', icon: 'UserCheck', route: '/registrations/visitor' },
  { type: 'contractor', labelKey: 'contractor', icon: 'HardHat', route: '/registrations/contractor' },
  { type: 'asset-in', labelKey: 'asset-in', icon: 'PackagePlus', route: '/registrations/asset-in' },
  { type: 'asset-out', labelKey: 'asset-out', icon: 'PackageMinus', route: '/registrations/asset-out' },
  { type: 'factory-shipment', labelKey: 'factory-shipment', icon: 'Truck', route: '/registrations/factory-shipment' },
  { type: 'borrow-asset', labelKey: 'borrow-asset', icon: 'HandCoins', route: '/registrations/borrow-asset' },
  { type: 'take-asset-home-1day', labelKey: 'take-asset-home-1day', icon: 'Clock', route: '/registrations/take-asset-home-1day' },
  { type: 'take-asset-home-longterm', labelKey: 'take-asset-home-longterm', icon: 'CalendarClock', route: '/registrations/take-asset-home-longterm' },
  { type: 'vehicle', labelKey: 'vehicle', icon: 'Car', route: '/registrations/vehicle' },
  { type: 'camera', labelKey: 'camera', icon: 'Camera', route: '/registrations/camera' },
  { type: 'restricted-area', labelKey: 'restricted-area', icon: 'ShieldAlert', route: '/registrations/restricted-area' },
  { type: 'overtime', labelKey: 'overtime', icon: 'Timer', route: '/registrations/overtime' },
  { type: 'work-permit', labelKey: 'work-permit', icon: 'FileCheck', route: '/registrations/work-permit' },
];

export const STATUS_COLORS = {
  pending: { bg: 'bg-status-warning', text: 'text-status-warning', border: 'border-status-warning/20' },
  approved: { bg: 'bg-status-success', text: 'text-status-success', border: 'border-status-success/20' },
  rejected: { bg: 'bg-status-danger', text: 'text-status-danger', border: 'border-status-danger/20' },
  cancelled: { bg: 'bg-status-neutral', text: 'text-status-neutral', border: 'border-status-neutral/20' },
  expired: { bg: 'bg-status-info', text: 'text-status-info', border: 'border-status-info/20' },
};

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export const NAV_ITEMS = [
  { labelKey: 'dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  {
    labelKey: 'registration',
    href: '/registrations',
    icon: 'ClipboardList',
    children: REGISTRATION_TYPES,
  },
  { labelKey: 'approvalCenter', href: '/approvals', icon: 'CheckSquare' },
  { labelKey: 'myRequests', href: '/my-requests', icon: 'FileText' },
  { labelKey: 'history', href: '/history', icon: 'History' },
  { labelKey: 'reports', href: '/reports', icon: 'BarChart3' },
  { labelKey: 'admin', href: '/admin', icon: 'Settings2' },
  { labelKey: 'settings', href: '/settings', icon: 'Settings' },
];
