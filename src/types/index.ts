export type RegistrationType = 
  | 'visitor' | 'contractor' | 'asset-in' | 'asset-out' 
  | 'factory-shipment' | 'borrow-asset' | 'take-asset-home-1day' 
  | 'take-asset-home-longterm' | 'vehicle' | 'camera' 
  | 'restricted-area' | 'overtime' | 'work-permit';

export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'expired';

export type UserRole = 'admin' | 'manager' | 'security' | 'employee' | 'receptionist' | 'hr_staff';

export type Permission = 
  | 'view_dashboard' | 'manage_registrations' | 'approve_requests' | 'view_reports' 
  | 'manage_users' | 'manage_workflows' | 'view_history' | 'manage_settings'
  | 'manage_visitors' | 'manage_contractors' | 'manage_assets' | 'manage_vehicles';

export interface PermissionGroup {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  role: UserRole;
  avatar?: string;
  employeeId: string;
  permissionGroupIds: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  managerId?: string;
}

export interface Company {
  id: string;
  name: string;
  address?: string;
  contactPerson?: string;
  phone?: string;
}

export interface ApprovalStep {
  id: string;
  stepNumber: number;
  approverName: string;
  approverRole: string;
  approverId: string;
  status: RequestStatus;
  status: RequestStatus;
  comment?: string;
  decidedAt?: string;
}

export interface WorkflowTemplateStep {
  id: string;
  stepNumber: number;
  roleId?: string; // Role required (e.g. 'manager', 'security')
  departmentId?: string; // Specific department or 'APPLICANT_DEPT'
  specificUserId?: string; // A specific user id
  description: string;
}

export interface WorkflowTemplate {
  id: string;
  registrationType: RegistrationType;
  name: string;
  steps: WorkflowTemplateStep[];
  isActive: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
}

export interface Registration {
  id: string;
  type: RegistrationType;
  title: string;
  status: RequestStatus;
  applicantId: string;
  applicantName: string;
  applicantDepartment: string;
  createdAt: string;
  updatedAt: string;
  data: Record<string, unknown>;
  approvalSteps: ApprovalStep[];
  comments: Comment[];
  attachments: string[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  link?: string;
}

// API types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterConfig {
  field: string;
  value: string | string[];
  operator?: 'eq' | 'contains' | 'in' | 'between';
}

export interface QueryParams {
  page?: number;
  pageSize?: number;
  sort?: SortConfig;
  filters?: FilterConfig[];
  search?: string;
}

// Dashboard types
export interface DashboardStats {
  visitorsToday: number;
  contractorsToday: number;
  pendingApproval: number;
  assetsOut: number;
  assetsReturned: number;
  expiredRequests: number;
  shipmentsToday: number;
  vehicleCheckins: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}
