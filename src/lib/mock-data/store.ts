import { 
  generateDepartments, 
  generateCompanies, 
  generateEmployees, 
  generateRegistrations,
  generateDashboardStats,
  generateMonthlyData,
  generateDepartmentData,
  generateStatusData
} from './generators';
import type { 
  Registration, RegistrationType, Department, Company, User, 
  QueryParams, PaginatedResponse, DashboardStats, ChartDataPoint, Comment,
  WorkflowTemplate, WorkflowTemplateStep
} from '@/types';
import { REGISTRATION_TYPES } from '@/constants';

class MockDataStore {
  private registrations: Map<string, Registration[]> = new Map();
  private workflowTemplates: WorkflowTemplate[] = [];
  private departments: Department[] = [];
  private companies: Company[] = [];
  private employees: User[] = [];
  private initialized: boolean = false;

  initialize(): void {
    if (this.initialized) return;
    
    this.departments = generateDepartments();
    this.companies = generateCompanies();
    this.employees = generateEmployees(this.departments);
    
    // Generate default workflow templates for each type
    REGISTRATION_TYPES.forEach(rt => {
      this.workflowTemplates.push({
        id: `wt-${rt.type}`,
        registrationType: rt.type as RegistrationType,
        name: `Default ${rt.type} Workflow`,
        isActive: true,
        steps: [
          { id: Math.random().toString(), stepNumber: 1, roleId: 'manager', departmentId: 'APPLICANT_DEPT', description: 'Department Manager Approval' },
          { id: Math.random().toString(), stepNumber: 2, roleId: 'security', description: 'Security Check' }
        ]
      });
      this.registrations.set(rt.type, generateRegistrations(rt.type as RegistrationType, 50, this.departments, this.employees));
    });

    this.initialized = true;
  }

  getRegistrations(type: RegistrationType, params: QueryParams): PaginatedResponse<Registration> {
    this.initialize();
    
    let data = this.registrations.get(type) || [];
    
    // Search
    if (params.search) {
      const q = params.search.toLowerCase();
      data = data.filter(r => 
        r.title.toLowerCase().includes(q) || 
        r.applicantName.toLowerCase().includes(q) ||
        r.applicantDepartment.toLowerCase().includes(q)
      );
    }
    
    // Filters
    if (params.filters) {
      params.filters.forEach(filter => {
        if (filter.field === 'status' && filter.value && (filter.value as string[]).length > 0) {
          data = data.filter(r => (filter.value as string[]).includes(r.status));
        }
        if (filter.field === 'applicantDepartment' && filter.value && (filter.value as string[]).length > 0) {
          data = data.filter(r => (filter.value as string[]).includes(r.applicantDepartment));
        }
      });
    }
    
    // Sort
    if (params.sort) {
      const { field, direction } = params.sort;
      data.sort((a, b) => {
        const valA = a[field as keyof Registration];
        const valB = b[field as keyof Registration];
        if (valA !== undefined && valB !== undefined) {
          if (valA < valB) return direction === 'asc' ? -1 : 1;
          if (valA > valB) return direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    } else {
      // Default sort by created at desc
      data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    // Pagination
    const total = data.length;
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const paginatedData = data.slice(start, start + pageSize);

    return {
      data: paginatedData,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  getRegistrationById(id: string): Registration | undefined {
    this.initialize();
    for (const [_, regs] of this.registrations.entries()) {
      const found = regs.find(r => r.id === id);
      if (found) return found;
    }
    return undefined;
  }

  createRegistration(type: RegistrationType, data: Record<string, unknown>, userId: string = 'user-001'): Registration {
    this.initialize();
    
    const user = this.employees.find(e => e.id === userId) || this.employees[0];
    
    // Resolve approval steps based on workflow template
    const template = this.workflowTemplates.find(t => t.registrationType === type && t.isActive);
    let approvalSteps: any[] = [];
    
    if (template) {
      approvalSteps = template.steps.map(ts => {
        let approverName = 'Pending Assignment';
        let approverId = '';
        
        // Mock resolution logic
        if (ts.specificUserId) {
           const specific = this.employees.find(e => e.id === ts.specificUserId);
           if (specific) { approverName = specific.name; approverId = specific.id; }
        } else if (ts.roleId === 'manager' && ts.departmentId === 'APPLICANT_DEPT') {
           const mgr = this.employees.find(e => e.department === user.department && e.role === 'manager');
           if (mgr) { approverName = mgr.name; approverId = mgr.id; }
           else approverName = 'Dept Manager';
        } else if (ts.roleId === 'security') {
           const sec = this.employees.find(e => e.role === 'security');
           if (sec) { approverName = sec.name; approverId = sec.id; }
           else approverName = 'Security Dept';
        }

        return {
          id: Math.random().toString(36).substring(2, 9),
          stepNumber: ts.stepNumber,
          approverName,
          approverRole: ts.description,
          approverId,
          status: 'pending'
        };
      });
    } else {
      // Fallback
      approvalSteps = [{
         id: '1', stepNumber: 1, approverName: 'Admin', approverRole: 'System Admin', approverId: 'admin', status: 'pending'
      }];
    }
    
    const newReg: Registration = {
      id: `REQ-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      type,
      title: `${type} Request - ${new Date().toLocaleDateString()}`,
      status: 'pending',
      applicantId: user.id,
      applicantName: user.name,
      applicantDepartment: user.department,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      data,
      approvalSteps,
      comments: [],
      attachments: [],
    };
    
    const currentList = this.registrations.get(type) || [];
    this.registrations.set(type, [newReg, ...currentList]);
    
    return newReg;
  }

  approveRegistration(id: string, approverId: string, comment?: string): Registration {
    const reg = this.getRegistrationById(id);
    if (!reg) throw new Error('Not found');
    reg.status = 'approved';
    reg.updatedAt = new Date().toISOString();
    return reg;
  }

  rejectRegistration(id: string, approverId: string, reason: string): Registration {
    const reg = this.getRegistrationById(id);
    if (!reg) throw new Error('Not found');
    reg.status = 'rejected';
    reg.updatedAt = new Date().toISOString();
    return reg;
  }

  addComment(registrationId: string, userId: string, content: string): Comment {
    const reg = this.getRegistrationById(registrationId);
    if (!reg) throw new Error('Not found');
    
    const user = this.employees.find(e => e.id === userId) || { name: 'Unknown User', avatar: '' };
    
    const newComment: Comment = {
      id: Math.random().toString(36).substring(2, 9),
      userId,
      userName: user.name,
      userAvatar: user.avatar,
      content,
      createdAt: new Date().toISOString(),
    };
    
    reg.comments.push(newComment);
    reg.updatedAt = new Date().toISOString();
    return newComment;
  }

  getDepartments(): Department[] {
    this.initialize();
    return this.departments;
  }

  getCompanies(): Company[] {
    this.initialize();
    return this.companies;
  }

  getEmployees(search?: string): User[] {
    this.initialize();
    if (!search) return this.employees;
    const q = search.toLowerCase();
    return this.employees.filter(e => 
      e.name.toLowerCase().includes(q) || 
      e.email.toLowerCase().includes(q) ||
      e.department.toLowerCase().includes(q)
    );
  }

  getWorkflowTemplates(): WorkflowTemplate[] {
    this.initialize();
    return this.workflowTemplates;
  }

  updateWorkflowTemplate(templateId: string, steps: WorkflowTemplateStep[]): WorkflowTemplate {
    this.initialize();
    const t = this.workflowTemplates.find(x => x.id === templateId);
    if (!t) throw new Error('Template not found');
    t.steps = steps;
    return t;
  }

  getDashboardStats(): DashboardStats {
    return generateDashboardStats();
  }

  getMonthlyChartData(): ChartDataPoint[] {
    return generateMonthlyData();
  }

  getDepartmentChartData(): ChartDataPoint[] {
    return generateDepartmentData();
  }

  getStatusChartData(): ChartDataPoint[] {
    return generateStatusData();
  }
}

export const mockStore = new MockDataStore();
