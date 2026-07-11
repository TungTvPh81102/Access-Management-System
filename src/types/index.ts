export type RegistrationType = 
  | 'visitor' | 'contractor' | 'asset-in' | 'asset-out' 
  | 'factory-shipment' | 'borrow-asset' | 'take-asset-home-1day' 
  | 'take-asset-home-longterm' | 'vehicle' | 'camera' 
  | 'restricted-area' | 'overtime' | 'work-permit';

export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'expired';

// Backward compatibility: old role types (deprecated, use Role entity instead)
export type UserRole = 'admin' | 'manager' | 'security' | 'employee' | 'receptionist' | 'hr_staff';

// ========== PERMISSION SYSTEM TYPES ==========

// Module (chức năng chính: Visitor, Asset, Overtime, Vehicle...)
export interface Module {
  id: string;
  code: string;        // "VISITOR", "ASSET", "OVERTIME", "VEHICLE"
  name: string;
  description?: string;
  actions: ModuleAction[];
}

export type ModuleAction = 'read' | 'create' | 'update' | 'delete' | 'approve' | 'export';

// Permission (Module:Action:Scope)
export interface Permission {
  id: string;
  code: string;         // "VISITOR:approve", "ASSET:create"
  moduleCode: string;
  action: ModuleAction;
  scope: 'all' | 'department' | 'own';
  description: string;
}

// Role (tập hợp permissions, không chứa scope - scope qua User)
export interface Role {
  id: string;
  name: string;              // "Department Approver", "Asset Manager", "Super Admin"
  description: string;
  permissionIds: string[];   // IDs của permissions
  isSystemRole: boolean;     // true = không cho xóa/sửa
  createdAt: string;
  updatedAt: string;
}

// Department (hỗ trợ cây phòng ban)
export interface Department {
  id: string;
  code: string;
  name: string;
  parentId: string | null;   // null nếu là root
  level: number;             // depth trong tree
  childrenCount?: number;
}

// Approval Delegation (ủy quyền duyệt)
export interface ApprovalDelegate {
  id: string;
  fromUserId: string;
  toUserId: string;
  startDate: string;
  endDate: string;
  moduleScopes?: string[];   // ["VISITOR", "ASSET"] or undefined (tất cả)
  reason: string;
  isActive?: boolean;
}

// User (core - định nghĩa quyền truy cập)
export interface User {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'locked';
  departmentId: string;              // phòng ban CHÍNH user thuộc về
  roleIds: string[];                 // nhiều role, tính union quyền
  scopeDepartmentIds: string[];      // phòng ban user được PHÉP TÁC ĐỘNG (riêng biệt khỏi departmentId)
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
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
