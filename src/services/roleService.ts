import axiosInstance from "../services/axiosInstance";

export interface ApiRole {
  roleId: number;
  roleCode: string | null;
  roleName: string;
  description: string;
  isSystemRole: boolean;
  defaultDashboardUrl: string | null;
  isActive: boolean;
  createdBy: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  updatedBy?: number | null;
}

// Response for POST /Role
export interface CreateRoleResponse {
  roleId: number | null;
  id: number;
}

// GET ROLES WITH PAGINATION
export const getRoles = async (pageNumber = 1, pageSize = 10) => {
  const response = await axiosInstance.get(
    `/Role/roles?pageNumber=${pageNumber}&pageSize=${pageSize}`
  );
  return response.data; // returns { totalCount, roles, ... }
};


// CREATE ROLE
export const createRole = async (payload: {
  roleCode: string;
  roleName: string;
  description: string;
  isSystemRole: boolean;
  defaultDashboardUrl: string | null;
  createdBy: number;
}): Promise<CreateRoleResponse> => {
  const response = await axiosInstance.post("/Role", payload);
  return response.data;
};

// UPDATE ROLE
export const updateRole = async (
  roleId: number,
  payload: Partial<ApiRole>
) => {
  const response = await axiosInstance.put(`/Role/${roleId}`, payload);
  return response.data;
};

// DELETE ROLE
export const deleteRole = async (roleId: number, performedBy: number) => {
  return axiosInstance.put(`/Role/${roleId}`, {
    roleId,
    isActive: false,
    updatedBy: performedBy
  }).then(res => res.data); 
};

