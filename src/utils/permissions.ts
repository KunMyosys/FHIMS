import { 
  RolePermissions, 
  ModuleName, 
  ModulePermissions,
  superAdminPermissions,
  adminPermissions,
  tourOperatorPermissions,
  hotelManagerPermissions,
  financeOfficerPermissions,
  hrTeamPermissions,
  supportStaffPermissions
} from '../types/permissions';
import type { UserRole } from '../contexts/UserAuthContext';

// Get permissions based on user role
export const getRolePermissions = (role: UserRole): RolePermissions => {
  switch (role) {
    case 'super-admin':
      return superAdminPermissions;
    case 'admin':
      return adminPermissions;
    case 'tour-operator':
      return tourOperatorPermissions;
    case 'hotel-manager':
      return hotelManagerPermissions;
    case 'finance-officer':
      return financeOfficerPermissions;
    case 'hr-team':
      return hrTeamPermissions;
    case 'support-staff':
      return supportStaffPermissions;
    default:
      return {}; // No permissions for unknown roles
  }
};

// Check if user has specific permission for a module
export const checkPermission = (
  role: UserRole,
  moduleName: ModuleName,
  action: keyof ModulePermissions
): boolean => {
  const permissions = getRolePermissions(role);
  return permissions[moduleName]?.[action] === true;
};

// Check if user can view a module
export const canViewModule = (role: UserRole, moduleName: ModuleName): boolean => {
  return checkPermission(role, moduleName, 'view');
};

// Check if user can add to a module
export const canAddToModule = (role: UserRole, moduleName: ModuleName): boolean => {
  return checkPermission(role, moduleName, 'add');
};

// Check if user can edit in a module
export const canEditInModule = (role: UserRole, moduleName: ModuleName): boolean => {
  return checkPermission(role, moduleName, 'edit');
};

// Check if user can delete from a module
export const canDeleteFromModule = (role: UserRole, moduleName: ModuleName): boolean => {
  return checkPermission(role, moduleName, 'delete');
};

// Check if user can approve in a module
export const canApproveInModule = (role: UserRole, moduleName: ModuleName): boolean => {
  return checkPermission(role, moduleName, 'approve');
};

// Check if user can manage users for a module
export const canManageModuleUsers = (role: UserRole, moduleName: ModuleName): boolean => {
  return checkPermission(role, moduleName, 'manageUsers');
};

// Get all accessible modules for a user
export const getAccessibleModules = (role: UserRole): ModuleName[] => {
  const permissions = getRolePermissions(role);
  return Object.keys(permissions).filter(
    moduleName => permissions[moduleName as ModuleName].view === true
  ) as ModuleName[];
};

// Get all modules where user can manage users
export const getModulesWithUserManagement = (role: UserRole): ModuleName[] => {
  const permissions = getRolePermissions(role);
  return Object.keys(permissions).filter(
    moduleName => permissions[moduleName as ModuleName].manageUsers === true
  ) as ModuleName[];
};

// Check if user has access to User Management section
export const hasUserManagementAccess = (role: UserRole): boolean => {
  // Super admin always has access
  if (role === 'super-admin') return true;
  
  // Admin always has access
  if (role === 'admin') return true;
  
  // Other users have access if they can manage users for at least one module
  const modulesWithAccess = getModulesWithUserManagement(role);
  return modulesWithAccess.length > 0;
};

// Check if user has access to Role Management section
export const hasRoleManagementAccess = (role: UserRole): boolean => {
  // Only super admin and admin have access to role management
  return role === 'super-admin' || role === 'admin';
};

// Check if user is super admin
export const isSuperAdmin = (role?: string) => {
  if (!role) return false;
  const r = role.toString().trim().toLowerCase();
  return r === "super-admin" || r === "super admin" || r === "superadmin" || r === "sa" || r === "super";
};


// Check if user is admin or super admin
export const isAdminOrAbove = (role: UserRole): boolean => {
  return role === 'super-admin' || role === 'admin';
};

// Get display name for role
  export const getRoleDisplayName = (role: UserRole): string => {
  const roleNames: Record<UserRole, string> = {
    "super-admin": "Super Administrator",
    "admin": "Administrator",
    "tour-operator": "Tour Operator",
    "hotel-manager": "Hotel Manager",
    "finance-officer": "Finance Officer",
    "hr-team": "HR Team",
    "support-staff": "Support Staff",
    "volunteer": "Volunteer",
    "guest": "Guest",
    "external-agent": "External Agent",
    "staff": "Staff",
    "Mannat-Finance": "Mannat Finance",
    "Mannat-User": "Mannat User",
    "facility-staff": "Facility Staff",
  };

  return roleNames[role] ?? role;
};

// Get category for module
export const getModuleCategory = (moduleName: ModuleName): string => {
  const categoryMap: Record<string, string> = {
    'to-registration': 'operations',
    'tours': 'operations',
    'visa-processing': 'operations',
    'accommodation': 'operations',
    'ziyarat': 'operations',
    'transport': 'operations',
    'accounts': 'finance',
    'loans': 'finance',
    'mannat-niyaz': 'finance',
    'mawaid': 'finance',
    'hr-management': 'staff',
    'leave-management': 'staff',
    'housekeeping': 'facility',
    'laundry': 'facility',
    'maintenance': 'facility',
    'inventory': 'facility',
    'country-city-master': 'masters',
    'venue-master': 'masters',
    'document-master': 'masters',
    'port-master': 'masters',
    'to-type-master': 'masters',
    'cutoff-config': 'masters',
    'policy-rules': 'masters',
    'currency-master': 'masters',
    'nationality-master': 'masters',
    'family-master': 'masters',
    'flight-master': 'masters',
    'email-template-master': 'masters',
    'visa-fee-master': 'masters',
    'package-master': 'masters',
    'user-management': 'system',
    'role-management': 'system'
  };
  return categoryMap[moduleName] || 'general';
};
