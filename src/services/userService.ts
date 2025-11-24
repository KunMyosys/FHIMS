import axiosInstance from "./axiosInstance";

export const getConsolidatedPermissions = async (userId: number | string) => {
  try {
    const res = await axiosInstance.get(`/User/${userId}/consolidated-permissions`);
    return res.data;
  } catch (error) {
    console.error("Error fetching consolidated permissions:", error);
    throw error;
  }
};

// GET USERS WITH PAGINATION
export const getUsers = async (pageNumber = 1, pageSize = 10) => {
  const res = await axiosInstance.get("/User/users", {
    params: { pageNumber, pageSize },
  });
  return res.data;
};



// CREATE USER
export const createUser = async (payload: any) => {
  const res = await axiosInstance.post("/User", payload);
  return res.data; // should return { userId: X }
};

// UPDATE USER
export const updateUser = async (userId: number, payload: any) => {
  const res = await axiosInstance.put(`/User/${userId}`, payload);
  return res.data;
};

// DELETE USER (soft delete by setting status)
export const deleteUser = async (userId: number, updatedBy: number) => {
  const payload = {
    userId,
    status: "Inactive",
    updatedBy,
  };

  const res = await axiosInstance.put(`/User/${userId}`, payload);
  return res.data;
};

// GET USER WITH ROLES
export const getUserWithRoles = async (userId: number) => {
  const res = await axiosInstance.get(`/User/${userId}/with-roles`);
  return res.data;
};

// ASSIGN ROLE TO USER
export const assignRoleToUser = async (userId: number, roleId: number) => {
  const payload = { userId, roleId };
  const res = await axiosInstance.post("/User/assign-role", payload);
  return res.data;
};

// GET USER DASHBOARD SUMMARY
export const getUserDashboardSummary = async () => {
  try {
    const res = await axiosInstance.get("/User/dashboard-summary");
    return res.data; // { totalUsers, activeUsers, inactiveUsers, totalRoles }
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    throw error;
  }
};

export const unassignRoleFromUser = async (userId: number, roleId: number) => {
  const payload = { userId, roleId };
  const res = await axiosInstance.post("/User/unassign-role", payload);
  return res.data;
};
