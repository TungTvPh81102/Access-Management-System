import { faker } from '@faker-js/faker';
import type { Department, Company, User, Registration, RegistrationType, DashboardStats, ChartDataPoint, ApprovalStep, Comment, RequestStatus, UserRole } from '@/types';

export function generateDepartments(): Department[] {
  const deptNames = ['IT', 'HR', 'Finance', 'Manufacturing', 'Quality Control', 'Logistics', 'R&D', 'Procurement', 'Admin', 'Sales', 'Engineering', 'Warehouse', 'Maintenance', 'Security', 'Legal', 'Marketing', 'Production Line A', 'Production Line B', 'SMT Department', 'Assembly'];
  return deptNames.map((name, i) => ({
    id: `dept-${i + 1}`,
    name,
    code: `DPT${(i + 1).toString().padStart(3, '0')}`,
  }));
}

export function generateCompanies(): Company[] {
  return Array.from({ length: 10 }).map((_, i) => ({
    id: `comp-${i + 1}`,
    name: faker.company.name(),
    address: faker.location.streetAddress(),
    contactPerson: faker.person.fullName(),
    phone: faker.phone.number(),
  }));
}

export function generateEmployees(departments: Department[]): User[] {
  const roles: UserRole[] = ['admin', 'manager', 'security', 'employee', 'receptionist'];
  return Array.from({ length: 100 }).map((_, i) => ({
    id: `emp-${i + 1}`,
    name: faker.person.fullName(),
    email: faker.internet.email(),
    department: faker.helpers.arrayElement(departments).name,
    role: faker.helpers.arrayElement(roles),
    employeeId: `EMP${(i + 1).toString().padStart(4, '0')}`,
    avatar: faker.image.avatar(),
  }));
}

export function generateRegistrations(type: RegistrationType, count: number, departments: Department[], employees: User[]): Registration[] {
  const statuses: RequestStatus[] = ['pending', 'approved', 'rejected', 'cancelled', 'expired'];
  
  return Array.from({ length: count }).map((_, i) => {
    const status = faker.helpers.weightedArrayElement([
      { weight: 40, value: 'pending' as RequestStatus },
      { weight: 30, value: 'approved' as RequestStatus },
      { weight: 15, value: 'rejected' as RequestStatus },
      { weight: 10, value: 'cancelled' as RequestStatus },
      { weight: 5, value: 'expired' as RequestStatus },
    ]);

    const applicant = faker.helpers.arrayElement(employees);
    const createdAt = faker.date.recent({ days: 30 }).toISOString();
    
    let data: Record<string, unknown> = {};
    let title = '';

    if (type === 'visitor') {
      const visitorName = faker.person.fullName();
      const visitorCompany = faker.company.name();
      title = `Visitor: ${visitorName} from ${visitorCompany}`;
      data = {
        visitorName,
        visitorCompany,
        idNumber: faker.string.alphanumeric(10),
        phone: faker.phone.number(),
        email: faker.internet.email(),
        purpose: faker.helpers.arrayElement(['Meeting', 'Interview', 'Maintenance', 'Delivery', 'Other']),
        hostName: faker.person.fullName(),
        visitDate: faker.date.soon().toISOString(),
        vehiclePlate: faker.helpers.maybe(() => faker.vehicle.vrm(), { probability: 0.3 }),
      };
    } else if (type === 'asset-out') {
      const itemCount = faker.number.int({ min: 1, max: 5 });
      const items = Array.from({ length: itemCount }).map(() => ({
        assetName: faker.commerce.productName(),
        assetId: `AST-${faker.string.alphanumeric(6).toUpperCase()}`,
        serialNumber: faker.string.uuid(),
        quantity: faker.number.int({ min: 1, max: 10 }),
      }));
      title = `Asset Out: ${itemCount} items`;
      data = {
        items,
        reason: faker.lorem.sentence(),
        expectedReturnDate: faker.date.soon({ days: 14 }).toISOString(),
        carrier: faker.person.fullName(),
      };
    } else if (type === 'overtime') {
      const empCount = faker.number.int({ min: 1, max: 10 });
      const otEmps = Array.from({ length: empCount }).map(() => ({
        name: faker.person.fullName(),
        employeeId: `EMP${faker.number.int({ min: 1000, max: 9999 })}`,
      }));
      title = `Overtime: ${empCount} employees`;
      data = {
        employees: otEmps,
        date: faker.date.soon({ days: 5 }).toISOString(),
        startTime: '18:00',
        endTime: '22:00',
        reason: faker.lorem.sentence(),
        department: faker.helpers.arrayElement(departments).name,
      };
    } else {
      title = `${type.replace('-', ' ')} Request ${faker.string.alphanumeric(6).toUpperCase()}`;
      data = {
        description: faker.lorem.paragraph(),
        date: faker.date.soon().toISOString(),
      };
    }

    const numApprovers = faker.number.int({ min: 1, max: 3 });
    const approvalSteps: ApprovalStep[] = Array.from({ length: numApprovers }).map((_, stepIdx) => {
      const stepStatus = stepIdx === 0 && status !== 'pending' ? status : 'pending';
      return {
        id: faker.string.uuid(),
        stepNumber: stepIdx + 1,
        approverName: faker.person.fullName(),
        approverRole: faker.helpers.arrayElement(['Manager', 'Department Head', 'Security']),
        approverId: faker.string.uuid(),
        status: stepStatus,
        comment: stepStatus === 'rejected' ? faker.lorem.sentence() : undefined,
        decidedAt: stepStatus !== 'pending' ? faker.date.recent().toISOString() : undefined,
      };
    });

    const numComments = faker.number.int({ min: 0, max: 3 });
    const comments: Comment[] = Array.from({ length: numComments }).map(() => ({
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      userName: faker.person.fullName(),
      userAvatar: faker.image.avatar(),
      content: faker.lorem.sentences(2),
      createdAt: faker.date.recent().toISOString(),
    }));

    return {
      id: `REQ-${faker.string.alphanumeric(8).toUpperCase()}`,
      type,
      title,
      status,
      applicantId: applicant.id,
      applicantName: applicant.name,
      applicantDepartment: applicant.department,
      createdAt,
      updatedAt: createdAt,
      data,
      approvalSteps,
      comments,
      attachments: [],
    };
  });
}

export function generateDashboardStats(): DashboardStats {
  return {
    visitorsToday: faker.number.int({ min: 10, max: 150 }),
    contractorsToday: faker.number.int({ min: 5, max: 50 }),
    pendingApproval: faker.number.int({ min: 1, max: 30 }),
    assetsOut: faker.number.int({ min: 0, max: 20 }),
    assetsReturned: faker.number.int({ min: 0, max: 15 }),
    expiredRequests: faker.number.int({ min: 0, max: 5 }),
    shipmentsToday: faker.number.int({ min: 2, max: 25 }),
    vehicleCheckins: faker.number.int({ min: 20, max: 200 }),
  };
}

export function generateMonthlyData(): ChartDataPoint[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map(month => ({
    name: month,
    value: faker.number.int({ min: 100, max: 1000 }),
    visitor: faker.number.int({ min: 50, max: 500 }),
    asset: faker.number.int({ min: 20, max: 200 }),
  }));
}

export function generateDepartmentData(): ChartDataPoint[] {
  const depts = ['IT', 'HR', 'Manufacturing', 'Logistics', 'R&D'];
  return depts.map(dept => ({
    name: dept,
    value: faker.number.int({ min: 50, max: 500 }),
  }));
}

export function generateStatusData(): ChartDataPoint[] {
  return [
    { name: 'Pending', value: faker.number.int({ min: 10, max: 50 }), fill: 'var(--color-status-warning)' },
    { name: 'Approved', value: faker.number.int({ min: 50, max: 300 }), fill: 'var(--color-status-success)' },
    { name: 'Rejected', value: faker.number.int({ min: 5, max: 30 }), fill: 'var(--color-status-danger)' },
    { name: 'Cancelled', value: faker.number.int({ min: 0, max: 20 }), fill: 'var(--color-status-neutral)' },
  ];
}
