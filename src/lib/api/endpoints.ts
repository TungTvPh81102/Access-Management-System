import { mockStore } from '@/lib/mock-data/store';
import type { 
  Registration, PaginatedResponse, QueryParams, DashboardStats, 
  RegistrationType, Department, Company, User, ChartDataPoint, Comment,
  WorkflowTemplate, WorkflowTemplateStep
} from '@/types';

// Simulate network delay 300-800ms
const delay = () => new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));

// Simulate ~5% error rate
const maybeError = () => {
  if (Math.random() < 0.05) throw new Error('Network error: Request failed');
};

export async function fetchRegistrations(type: RegistrationType, params: QueryParams): Promise<PaginatedResponse<Registration>> {
  await delay();
  maybeError();
  return mockStore.getRegistrations(type, params);
}

export async function fetchRegistrationById(id: string): Promise<Registration> {
  await delay();
  const reg = mockStore.getRegistrationById(id);
  if (!reg) throw new Error('Not found');
  return reg;
}

export async function createRegistration(type: RegistrationType, data: Record<string, unknown>): Promise<Registration> {
  await delay();
  maybeError();
  return mockStore.createRegistration(type, data);
}

export async function approveRegistration(id: string, comment?: string): Promise<Registration> {
  await delay();
  return mockStore.approveRegistration(id, 'user-001', comment);
}

export async function rejectRegistration(id: string, reason: string): Promise<Registration> {
  await delay();
  return mockStore.rejectRegistration(id, 'user-001', reason);
}

export async function addRegistrationComment(id: string, content: string): Promise<Comment> {
  await delay();
  return mockStore.addComment(id, 'user-001', content);
}

export async function fetchDepartments(): Promise<Department[]> {
  await delay();
  return mockStore.getDepartments();
}

export async function fetchCompanies(): Promise<Company[]> {
  await delay();
  return mockStore.getCompanies();
}

export async function fetchEmployees(search?: string): Promise<User[]> {
  await delay();
  return mockStore.getEmployees(search);
}

export async function fetchWorkflowTemplates(): Promise<WorkflowTemplate[]> {
  await delay();
  return mockStore.getWorkflowTemplates();
}

export async function updateWorkflowTemplate(id: string, steps: WorkflowTemplateStep[]): Promise<WorkflowTemplate> {
  await delay();
  return mockStore.updateWorkflowTemplate(id, steps);
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  await delay();
  return mockStore.getDashboardStats();
}

export async function fetchMonthlyData(): Promise<ChartDataPoint[]> {
  await delay();
  return mockStore.getMonthlyChartData();
}

export async function fetchDepartmentData(): Promise<ChartDataPoint[]> {
  await delay();
  return mockStore.getDepartmentChartData();
}

export async function fetchStatusData(): Promise<ChartDataPoint[]> {
  await delay();
  return mockStore.getStatusChartData();
}

export async function fetchRecentActivities() {
  await delay();
  return [
    { id: '1', action: 'Created Request', subject: 'REQ-A1B2C3', actor: 'John Doe', timestamp: new Date().toISOString() },
    { id: '2', action: 'Approved', subject: 'REQ-X9Y8Z7', actor: 'Jane Smith', timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: '3', action: 'Rejected', subject: 'REQ-M4N5P6', actor: 'Admin User', timestamp: new Date(Date.now() - 7200000).toISOString() },
  ];
}
