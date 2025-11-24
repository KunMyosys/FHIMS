// Permission and Role Management Types

export type PermissionAction = 'view' | 'add' | 'edit' | 'delete' | 'approve' | 'lock' | 'restore'  | 'manageUsers';

export type UserRoleKey = 
  | 'super-admin'
  | 'admin'
  | 'tour-operator'
  | 'hotel-manager'
  | 'hr-team'
  | 'finance-officer'
  | 'support-staff'
  | 'volunteer'
  | 'guest'
  | 'external-agent'
  

export type ModuleName = 
  // Tour Operator Operations
  | 'to-registration'
  | 'tours'
  | 'visa-processing'
  | 'muwafiqa-processing'
  
  // Operations Management
  | 'accommodation'
  | 'transport'
  | 'ziyarat'
  
  // Finance Management
  | 'accounts'
  | 'mannat-niyaz'
  | 'loans'
  | 'mawaid'
  
  // Staff Management
  | 'hr-management'
  | 'leave-management'
  
  // Facility Management
  | 'housekeeping'
  | 'laundry'
  | 'maintenance'
  | 'inventory'
  
  // Master Data Management
  | 'country-city-master'
  | 'venue-master'
  | 'document-master'
  | 'port-master'
  | 'to-type-master'
  | 'cutoff-config'
  | 'policy-rules'
  | 'currency-master'
  | 'nationality-master'
  | 'family-master'
  | 'flight-master'
  | 'email-template-master'
  | 'visa-fee-master'
  | 'package-master'
  | 'general-master'
  | 'transport-master'
  
  // System Administration
  | 'user-management'
  | 'role-management';

export interface ModulePermissions {
  view: boolean;
  add: boolean;
  edit: boolean;
  delete: boolean;
  approve: boolean;
  lock: boolean;
  restore: boolean;
  // New: Permission to manage users for this module
  manageUsers?: boolean;
}

export interface RolePermissions {
  [moduleName: string]: ModulePermissions;
}

export interface Role {
  roleCode: string;
  defaultDashboardUrl: string;
  id: string;
  name: string;
  description?: string;
  permissions: RolePermissions;
  isSystemRole?: boolean; // Cannot be deleted (super-admin, admin)
  createdDate: string;
  updatedDate?: string;
  createdBy?: string; // User ID who created this role
  scopedToModules?: ModuleName[]; // If role is scoped to specific modules only
}

export interface Module {
  id: ModuleName;
  name: string;
  description: string;
  category: 'operations' | 'finance' | 'staff' | 'facility' | 'masters' | 'system';
  path: string;
  icon: string;
}

// Predefined modules in the system
export const systemModules: Module[] = [
  // Operations Management
  { 
    id: 'to-registration', 
    name: 'TO Registration', 
    description: 'Tour Operator registration and management', 
    category: 'operations',
    path: 'to-registration',
    icon: 'UserCheck'
  },
  { 
    id: 'tours', 
    name: 'Tours', 
    description: 'Tour creation, applicants, and management', 
    category: 'operations',
    path: 'tours',
    icon: 'Plane'
  },
  { 
    id: 'visa-processing', 
    name: 'Visa (Muwafiqa)', 
    description: 'Visa processing and document verification', 
    category: 'operations',
    path: 'visa',
    icon: 'FileText'
  },
  { 
    id: 'accommodation', 
    name: 'Accommodation', 
    description: 'Hotel booking and allocation', 
    category: 'operations',
    path: 'accommodation',
    icon: 'Hotel'
  },
  { 
    id: 'ziyarat', 
    name: 'Ziyarat', 
    description: 'Ziyarat scheduling and management', 
    category: 'operations',
    path: 'ziyarat',
    icon: 'MapPin'
  },
  { 
    id: 'transport', 
    name: 'Transport', 
    description: 'Vehicle and driver management', 
    category: 'operations',
    path: 'transport',
    icon: 'Bus'
  },
  
  // Finance Management
  { 
    id: 'accounts', 
    name: 'Accounts', 
    description: 'Financial accounts and reporting', 
    category: 'finance',
    path: 'accounts',
    icon: 'Receipt'
  },
  { 
    id: 'loans', 
    name: 'Loans', 
    description: 'Loan management and tracking', 
    category: 'finance',
    path: 'loans',
    icon: 'DollarSign'
  },
  { 
    id: 'mannat-niyaz', 
    name: 'Mannat Niyaz', 
    description: 'Donation and collection management', 
    category: 'finance',
    path: 'mannat',
    icon: 'Heart'
  },
  { 
    id: 'mawaid', 
    name: 'Mawaid', 
    description: 'Meal service management', 
    category: 'finance',
    path: 'mawaid',
    icon: 'UtensilsCrossed'
  },
  
  // Staff Management
  { 
    id: 'hr-management', 
    name: 'HR Management', 
    description: 'Employee records and management', 
    category: 'staff',
    path: 'hr',
    icon: 'Users'
  },
  { 
    id: 'leave-management', 
    name: 'Leave Management', 
    description: 'Leave requests and approvals', 
    category: 'staff',
    path: 'leave',
    icon: 'Calendar'
  },
  
  // Facility Management
  { 
    id: 'housekeeping', 
    name: 'Housekeeping', 
    description: 'Housekeeping tasks and management', 
    category: 'facility',
    path: 'housekeeping',
    icon: 'Home'
  },
  { 
    id: 'laundry', 
    name: 'Laundry Services', 
    description: 'Laundry service management', 
    category: 'facility',
    path: 'laundry',
    icon: 'Shirt'
  },
  { 
    id: 'maintenance', 
    name: 'Maintenance', 
    description: 'Facility maintenance management', 
    category: 'facility',
    path: 'maintenance',
    icon: 'Wrench'
  },
  { 
    id: 'inventory', 
    name: 'Inventory', 
    description: 'Inventory and stock management', 
    category: 'facility',
    path: 'inventory',
    icon: 'Package'
  },
  
  // Master Data Management
  { 
    id: 'country-city-master', 
    name: 'City & Country Master', 
    description: 'Country and city data management', 
    category: 'masters',
    path: 'country-city-master',
    icon: 'Globe'
  },
  { 
    id: 'venue-master', 
    name: 'Venue Master', 
    description: 'Venue configuration and management', 
    category: 'masters',
    path: 'venue-master',
    icon: 'Building2'
  },
  { 
    id: 'document-master', 
    name: 'Document Master', 
    description: 'Document types configuration', 
    category: 'masters',
    path: 'document-master',
    icon: 'FileStack'
  },
  { 
    id: 'port-master', 
    name: 'Port Master', 
    description: 'Entry/Exit ports management', 
    category: 'masters',
    path: 'port-master',
    icon: 'Anchor'
  },
  { 
    id: 'to-type-master', 
    name: 'Tour Operator Type', 
    description: 'Tour operator type configuration', 
    category: 'masters',
    path: 'to-type-master',
    icon: 'Briefcase'
  },
  { 
    id: 'cutoff-config', 
    name: 'Cutoff Configuration', 
    description: 'System cutoff date configuration', 
    category: 'masters',
    path: 'cutoff-config',
    icon: 'Clock'
  },
  { 
    id: 'policy-rules', 
    name: 'Policy Rules', 
    description: 'Business policy configuration', 
    category: 'masters',
    path: 'policy-rules',
    icon: 'AlertCircle'
  },
  { 
    id: 'currency-master', 
    name: 'Currency Master', 
    description: 'Currency and exchange rate management', 
    category: 'masters',
    path: 'currency-master',
    icon: 'Banknote'
  },
  { 
    id: 'nationality-master', 
    name: 'Nationality Master', 
    description: 'Nationality data management', 
    category: 'masters',
    path: 'nationality-master',
    icon: 'Flag'
  },
  { 
    id: 'family-master', 
    name: 'Family Master', 
    description: 'Family grouping configuration', 
    category: 'masters',
    path: 'family-master',
    icon: 'Users'
  },
  { 
    id: 'flight-master', 
    name: 'Flight Master', 
    description: 'Flight information management', 
    category: 'masters',
    path: 'flight-master',
    icon: 'PlaneTakeoff'
  },
  { 
    id: 'email-template-master', 
    name: 'Email Template Master', 
    description: 'Email template configuration', 
    category: 'masters',
    path: 'email-template-master',
    icon: 'Mail'
  },
  { 
    id: 'visa-fee-master', 
    name: 'Visa Fee Master', 
    description: 'Visa fee configuration', 
    category: 'masters',
    path: 'visa-fee-master',
    icon: 'CreditCard'
  },
  { 
    id: 'package-master', 
    name: 'Package Master', 
    description: 'Tour package configuration', 
    category: 'masters',
    path: 'package-master',
    icon: 'Package'
  },
  
  // System Administration
  { 
    id: 'user-management', 
    name: 'User Management', 
    description: 'System user creation and management', 
    category: 'system',
    path: 'user-management',
    icon: 'Users'
  },
  { 
    id: 'role-management', 
    name: 'Role Management', 
    description: 'Role and permission management', 
    category: 'system',
    path: 'role-management',
    icon: 'Shield'
  },
];

// Helper function to create permission object
const createPermissions = (
  view = false, 
  add = false, 
  edit = false, 
  deleteP = false, 
  approve = false, 
  lock = false, 
  restore = false,
  manageUsers = false
): ModulePermissions => ({
  view,
  add,
  edit,
  delete: deleteP,
  approve,
  lock,
  restore,
  manageUsers,
});

// Super Admin - Full access to everything including user management
export const superAdminPermissions: RolePermissions = systemModules.reduce((acc, module) => {
  acc[module.id] = createPermissions(true, true, true, true, true, true, true, true);
  return acc;
}, {} as RolePermissions);

// Admin - Department head with approval rights and module-specific user management
export const adminPermissions: RolePermissions = {
  // Operations Management
  'to-registration': createPermissions(true, true, true, true, true, false, false, true),
  'tours': createPermissions(true, true, true, true, true, false, false, true),
  'visa-processing': createPermissions(true, true, true, false, true, false, false, true),
  'accommodation': createPermissions(true, true, true, true, false, false, false, true),
  'ziyarat': createPermissions(true, true, true, true, false, false, false, true),
  'transport': createPermissions(true, true, true, true, false, false, false, true),
  
  // Finance Management
  'accounts': createPermissions(true, true, true, false, true, false, false, true),
  'loans': createPermissions(true, true, true, false, true, false, false, true),
  'mannat-niyaz': createPermissions(true, true, true, false, true, false, false, true),
  'mawaid': createPermissions(true, true, true, false, true, false, false, true),
  
  // Staff Management
  'hr-management': createPermissions(true, true, true, false, true, false, false, true),
  'leave-management': createPermissions(true, true, true, false, true, false, false, true),
  
  // Facility Management
  'housekeeping': createPermissions(true, true, true, false, true, false, false, true),
  'laundry': createPermissions(true, true, true, false, true, false, false, true),
  'maintenance': createPermissions(true, true, true, false, true, false, false, true),
  'inventory': createPermissions(true, true, true, false, true, false, false, true),
  
  // Master Data Management
  'country-city-master': createPermissions(true, true, true, true, false, false, false, false),
  'venue-master': createPermissions(true, true, true, true, false, false, false, false),
  'document-master': createPermissions(true, true, true, true, false, false, false, false),
  'port-master': createPermissions(true, true, true, true, false, false, false, false),
  'to-type-master': createPermissions(true, true, true, true, false, false, false, false),
  'cutoff-config': createPermissions(true, true, true, false, true, false, false, false),
  'policy-rules': createPermissions(true, true, true, false, true, false, false, false),
  'currency-master': createPermissions(true, true, true, true, false, false, false, false),
  'nationality-master': createPermissions(true, true, true, true, false, false, false, false),
  'family-master': createPermissions(true, true, true, true, false, false, false, false),
  'flight-master': createPermissions(true, true, true, true, false, false, false, false),
  'email-template-master': createPermissions(true, true, true, true, false, false, false, false),
  'visa-fee-master': createPermissions(true, true, true, true, false, false, false, false),
  'package-master': createPermissions(true, true, true, true, false, false, false, false),
  
  // System Administration
  'user-management': createPermissions(true, true, true, true, false, false, false, false),
  'role-management': createPermissions(true, true, true, true, false, false, false, false),
};

// Tour Operator - Limited to tour operations only
export const tourOperatorPermissions: RolePermissions = {
  // Operations Management
  'to-registration': createPermissions(false, false, false, false, false, false, false, false),
  'tours': createPermissions(true, true, true, false, false, false, false, false),
  'visa-processing': createPermissions(true, true, true, false, false, false, false, false),
  'accommodation': createPermissions(true, false, false, false, false, false, false, false),
  'ziyarat': createPermissions(true, false, false, false, false, false, false, false),
  'transport': createPermissions(true, false, false, false, false, false, false, false),
  
  // Finance Management
  'accounts': createPermissions(false, false, false, false, false, false, false, false),
  'loans': createPermissions(false, false, false, false, false, false, false, false),
  'mannat-niyaz': createPermissions(false, false, false, false, false, false, false, false),
  'mawaid': createPermissions(false, false, false, false, false, false, false, false),
  
  // Staff Management
  'hr-management': createPermissions(false, false, false, false, false, false, false, false),
  'leave-management': createPermissions(false, false, false, false, false, false, false, false),
  
  // Facility Management
  'housekeeping': createPermissions(false, false, false, false, false, false, false, false),
  'laundry': createPermissions(false, false, false, false, false, false, false, false),
  'maintenance': createPermissions(false, false, false, false, false, false, false, false),
  'inventory': createPermissions(false, false, false, false, false, false, false, false),
  
  // Master Data Management - No access
  'country-city-master': createPermissions(false, false, false, false, false, false, false, false),
  'venue-master': createPermissions(false, false, false, false, false, false, false, false),
  'document-master': createPermissions(false, false, false, false, false, false, false, false),
  'port-master': createPermissions(false, false, false, false, false, false, false, false),
  'to-type-master': createPermissions(false, false, false, false, false, false, false, false),
  'cutoff-config': createPermissions(false, false, false, false, false, false, false, false),
  'policy-rules': createPermissions(false, false, false, false, false, false, false, false),
  'currency-master': createPermissions(false, false, false, false, false, false, false, false),
  'nationality-master': createPermissions(false, false, false, false, false, false, false, false),
  'family-master': createPermissions(false, false, false, false, false, false, false, false),
  'flight-master': createPermissions(false, false, false, false, false, false, false, false),
  'email-template-master': createPermissions(false, false, false, false, false, false, false, false),
  'visa-fee-master': createPermissions(false, false, false, false, false, false, false, false),
  'package-master': createPermissions(false, false, false, false, false, false, false, false),
  
  // System Administration - No access
  'user-management': createPermissions(false, false, false, false, false, false, false, false),
  'role-management': createPermissions(false, false, false, false, false, false, false, false),
};

// Hotel Manager - Accommodation and facility focused
export const hotelManagerPermissions: RolePermissions = {
  // Operations Management
  'to-registration': createPermissions(false, false, false, false, false, false, false, false),
  'tours': createPermissions(true, false, false, false, false, false, false, false),
  'visa-processing': createPermissions(false, false, false, false, false, false, false, false),
  'accommodation': createPermissions(true, true, true, false, true, false, false, true),
  'ziyarat': createPermissions(true, false, false, false, false, false, false, false),
  'transport': createPermissions(true, false, false, false, false, false, false, false),
  
  // Finance Management
  'accounts': createPermissions(false, false, false, false, false, false, false, false),
  'loans': createPermissions(false, false, false, false, false, false, false, false),
  'mannat-niyaz': createPermissions(false, false, false, false, false, false, false, false),
  'mawaid': createPermissions(true, true, true, false, false, false, false, true),
  
  // Staff Management
  'hr-management': createPermissions(false, false, false, false, false, false, false, false),
  'leave-management': createPermissions(false, false, false, false, false, false, false, false),
  
  // Facility Management
  'housekeeping': createPermissions(true, true, true, false, true, false, false, true),
  'laundry': createPermissions(true, true, true, false, true, false, false, true),
  'maintenance': createPermissions(true, true, true, false, true, false, false, true),
  'inventory': createPermissions(true, true, true, false, false, false, false, true),
  
  // Master Data Management - No access
  'country-city-master': createPermissions(false, false, false, false, false, false, false, false),
  'venue-master': createPermissions(false, false, false, false, false, false, false, false),
  'document-master': createPermissions(false, false, false, false, false, false, false, false),
  'port-master': createPermissions(false, false, false, false, false, false, false, false),
  'to-type-master': createPermissions(false, false, false, false, false, false, false, false),
  'cutoff-config': createPermissions(false, false, false, false, false, false, false, false),
  'policy-rules': createPermissions(false, false, false, false, false, false, false, false),
  'currency-master': createPermissions(false, false, false, false, false, false, false, false),
  'nationality-master': createPermissions(false, false, false, false, false, false, false, false),
  'family-master': createPermissions(false, false, false, false, false, false, false, false),
  'flight-master': createPermissions(false, false, false, false, false, false, false, false),
  'email-template-master': createPermissions(false, false, false, false, false, false, false, false),
  'visa-fee-master': createPermissions(false, false, false, false, false, false, false, false),
  'package-master': createPermissions(false, false, false, false, false, false, false, false),
  
  // System Administration - Limited to viewing their module users
  'user-management': createPermissions(true, false, false, false, false, false, false, false),
  'role-management': createPermissions(true, false, false, false, false, false, false, false),
};

// Finance Officer - Finance module focused
export const financeOfficerPermissions: RolePermissions = {
  // Operations Management
  'to-registration': createPermissions(true, false, false, false, false, false, false, false),
  'tours': createPermissions(true, false, false, false, false, false, false, false),
  'visa-processing': createPermissions(true, false, false, false, false, false, false, false),
  'accommodation': createPermissions(true, false, false, false, false, false, false, false),
  'ziyarat': createPermissions(false, false, false, false, false, false, false, false),
  'transport': createPermissions(false, false, false, false, false, false, false, false),
  
  // Finance Management
  'accounts': createPermissions(true, true, true, false, true, false, false, true),
  'loans': createPermissions(true, true, true, false, true, false, false, true),
  'mannat-niyaz': createPermissions(true, true, true, false, true, false, false, true),
  'mawaid': createPermissions(true, true, true, false, false, false, false, true),
  
  // Staff Management
  'hr-management': createPermissions(false, false, false, false, false, false, false, false),
  'leave-management': createPermissions(false, false, false, false, false, false, false, false),
  
  // Facility Management
  'housekeeping': createPermissions(false, false, false, false, false, false, false, false),
  'laundry': createPermissions(false, false, false, false, false, false, false, false),
  'maintenance': createPermissions(false, false, false, false, false, false, false, false),
  'inventory': createPermissions(false, false, false, false, false, false, false, false),
  
  // Master Data Management - Limited
  'country-city-master': createPermissions(true, false, false, false, false, false, false, false),
  'venue-master': createPermissions(true, false, false, false, false, false, false, false),
  'document-master': createPermissions(true, false, false, false, false, false, false, false),
  'port-master': createPermissions(true, false, false, false, false, false, false, false),
  'to-type-master': createPermissions(true, false, false, false, false, false, false, false),
  'cutoff-config': createPermissions(true, false, false, false, false, false, false, false),
  'policy-rules': createPermissions(true, false, false, false, false, false, false, false),
  'currency-master': createPermissions(true, true, true, false, false, false, false, false),
  'nationality-master': createPermissions(true, false, false, false, false, false, false, false),
  'family-master': createPermissions(true, false, false, false, false, false, false, false),
  'flight-master': createPermissions(true, false, false, false, false, false, false, false),
  'email-template-master': createPermissions(true, false, false, false, false, false, false, false),
  'visa-fee-master': createPermissions(true, true, true, false, false, false, false, false),
  'package-master': createPermissions(true, false, false, false, false, false, false, false),
  
  // System Administration - Limited to viewing their module users
  'user-management': createPermissions(true, false, false, false, false, false, false, false),
  'role-management': createPermissions(true, false, false, false, false, false, false, false),
};

// HR Team - HR module focused
export const hrTeamPermissions: RolePermissions = {
  // Operations Management
  'to-registration': createPermissions(false, false, false, false, false, false, false, false),
  'tours': createPermissions(false, false, false, false, false, false, false, false),
  'visa-processing': createPermissions(false, false, false, false, false, false, false, false),
  'accommodation': createPermissions(false, false, false, false, false, false, false, false),
  'ziyarat': createPermissions(false, false, false, false, false, false, false, false),
  'transport': createPermissions(false, false, false, false, false, false, false, false),
  
  // Finance Management
  'accounts': createPermissions(false, false, false, false, false, false, false, false),
  'loans': createPermissions(true, true, true, false, false, false, false, false),
  'mannat-niyaz': createPermissions(false, false, false, false, false, false, false, false),
  'mawaid': createPermissions(false, false, false, false, false, false, false, false),
  
  // Staff Management
  'hr-management': createPermissions(true, true, true, false, true, false, false, true),
  'leave-management': createPermissions(true, true, true, false, true, false, false, true),
  
  // Facility Management
  'housekeeping': createPermissions(false, false, false, false, false, false, false, false),
  'laundry': createPermissions(false, false, false, false, false, false, false, false),
  'maintenance': createPermissions(false, false, false, false, false, false, false, false),
  'inventory': createPermissions(false, false, false, false, false, false, false, false),
  
  // Master Data Management - No access
  'country-city-master': createPermissions(false, false, false, false, false, false, false, false),
  'venue-master': createPermissions(false, false, false, false, false, false, false, false),
  'document-master': createPermissions(false, false, false, false, false, false, false, false),
  'port-master': createPermissions(false, false, false, false, false, false, false, false),
  'to-type-master': createPermissions(false, false, false, false, false, false, false, false),
  'cutoff-config': createPermissions(false, false, false, false, false, false, false, false),
  'policy-rules': createPermissions(false, false, false, false, false, false, false, false),
  'currency-master': createPermissions(false, false, false, false, false, false, false, false),
  'nationality-master': createPermissions(false, false, false, false, false, false, false, false),
  'family-master': createPermissions(false, false, false, false, false, false, false, false),
  'flight-master': createPermissions(false, false, false, false, false, false, false, false),
  'email-template-master': createPermissions(false, false, false, false, false, false, false, false),
  'visa-fee-master': createPermissions(false, false, false, false, false, false, false, false),
  'package-master': createPermissions(false, false, false, false, false, false, false, false),
  
  // System Administration - Limited to viewing their module users
  'user-management': createPermissions(true, false, false, false, false, false, false, false),
  'role-management': createPermissions(true, false, false, false, false, false, false, false),
};

// Support Staff - Limited operational access
export const supportStaffPermissions: RolePermissions = {
  // Operations Management
  'to-registration': createPermissions(false, false, false, false, false, false, false, false),
  'tours': createPermissions(true, false, false, false, false, false, false, false),
  'visa-processing': createPermissions(true, false, false, false, false, false, false, false),
  'accommodation': createPermissions(true, false, false, false, false, false, false, false),
  'ziyarat': createPermissions(true, false, false, false, false, false, false, false),
  'transport': createPermissions(true, true, true, false, false, false, false, false),
  
  // Finance Management
  'accounts': createPermissions(false, false, false, false, false, false, false, false),
  'loans': createPermissions(false, false, false, false, false, false, false, false),
  'mannat-niyaz': createPermissions(false, false, false, false, false, false, false, false),
  'mawaid': createPermissions(true, false, false, false, false, false, false, false),
  
  // Staff Management
  'hr-management': createPermissions(false, false, false, false, false, false, false, false),
  'leave-management': createPermissions(true, true, false, false, false, false, false, false),
  
  // Facility Management
  'housekeeping': createPermissions(true, true, true, false, false, false, false, false),
  'laundry': createPermissions(true, true, true, false, false, false, false, false),
  'maintenance': createPermissions(true, true, true, false, false, false, false, false),
  'inventory': createPermissions(true, true, true, false, false, false, false, false),
  
  // Master Data Management - No access
  'country-city-master': createPermissions(false, false, false, false, false, false, false, false),
  'venue-master': createPermissions(false, false, false, false, false, false, false, false),
  'document-master': createPermissions(false, false, false, false, false, false, false, false),
  'port-master': createPermissions(false, false, false, false, false, false, false, false),
  'to-type-master': createPermissions(false, false, false, false, false, false, false, false),
  'cutoff-config': createPermissions(false, false, false, false, false, false, false, false),
  'policy-rules': createPermissions(false, false, false, false, false, false, false, false),
  'currency-master': createPermissions(false, false, false, false, false, false, false, false),
  'nationality-master': createPermissions(false, false, false, false, false, false, false, false),
  'family-master': createPermissions(false, false, false, false, false, false, false, false),
  'flight-master': createPermissions(false, false, false, false, false, false, false, false),
  'email-template-master': createPermissions(false, false, false, false, false, false, false, false),
  'visa-fee-master': createPermissions(false, false, false, false, false, false, false, false),
  'package-master': createPermissions(false, false, false, false, false, false, false, false),
  
  // System Administration - No access
  'user-management': createPermissions(false, false, false, false, false, false, false, false),
  'role-management': createPermissions(false, false, false, false, false, false, false, false),
};

// Helper function to check if user has permission for a module action
export const hasPermission = (
  userPermissions: RolePermissions,
  moduleName: ModuleName,
  action: keyof ModulePermissions
): boolean => {
  return userPermissions[moduleName]?.[action] === true;
};

// Helper function to get all modules a user has access to
export const getAccessibleModules = (userPermissions: RolePermissions): ModuleName[] => {
  return Object.keys(userPermissions).filter(
    moduleName => userPermissions[moduleName].view === true
  ) as ModuleName[];
};

// Helper function to check if user can manage users for any module
export const canManageUsers = (userPermissions: RolePermissions): boolean => {
  return Object.values(userPermissions).some(
    permissions => permissions.manageUsers === true
  );
};

// Helper function to get modules where user can manage users
export const getModulesWithUserManagement = (userPermissions: RolePermissions): ModuleName[] => {
  return Object.keys(userPermissions).filter(
    moduleName => userPermissions[moduleName].manageUsers === true
  ) as ModuleName[];
};
