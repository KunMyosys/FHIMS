import axiosInstance from "./axiosInstance";

export interface ApiModule {
  moduleId: number;
  moduleCode: string;
  moduleName: string;
  description: string;
  isActive: boolean;
  categoryId: number;
}

export interface ApiCategory {
  categoryId: number;
  categoryCode: string;
  categoryName: string;
  displayOrder: number;
  isActive: boolean;
  modules: ApiModule[];
}

export interface ApiRoleModulePermission {
  roleModulePermissionId: number;
  roleId: number;
  roleName: string;
  moduleId: number;
  moduleName: string;
  canView: boolean;
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canApprove: boolean;
  canLock: boolean;
  canRestore: boolean;
  canManageUsers: boolean;
  isActive: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface ApiRoleModulePermission {
  roleModulePermissionId: number;
  roleId: number;
  moduleId: number;
  canView: boolean;
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canApprove: boolean;
  canLock: boolean;
  canRestore: boolean;
  canManageUsers: boolean;
  isActive: boolean;
  updatedBy?: number;
  performedBy?: number;
}

// GET categories + modules (dynamic)
export const getCategoriesWithModules = async (
  onlyActive = true
): Promise<ApiCategory[]> => {
  const response = await axiosInstance.get(
    `/modules/api/admin/categories-modules?onlyActive=${onlyActive}`
  );
  return response.data;
};

// GET permissions of a role
export const getRolePermissions = async (
  roleId: number
): Promise<ApiRoleModulePermission[]> => {
  const response = await axiosInstance.get(
    `/role-module-permissions/role/${roleId}`
  );
  return response.data;
};

// SAVE/UPDATE permissions for a role
export const saveRolePermissions = async (
  payload: any
): Promise<any> => {
  const response = await axiosInstance.post(
    `/role-module-permissions`,
    payload
  );
  return response.data;
};

export const saveRolePermissionsBulk = async (items: any[]) => {
  const response = await axiosInstance.post(
    "/role-module-permissions/bulk",
    { items }
  );
  return response.data;
};

export const updateRoleModulePermission = async (
  roleModulePermissionId: number,
  payload: ApiRoleModulePermission
) => {
  const response = await axiosInstance.put(
    `/role-module-permissions/${roleModulePermissionId}`,
    payload
  );
  return response.data;
};