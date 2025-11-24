import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  systemModules,
  superAdminPermissions,
  adminPermissions,
  tourOperatorPermissions,
  hotelManagerPermissions,
  financeOfficerPermissions,
  hrTeamPermissions,
  supportStaffPermissions,
  Role,
  RolePermissions,
  PermissionAction,
} from "../types/permissions";
import {
  Shield,
  Plus,
  Edit,
  Trash2,
  Search,
  ArrowLeft,
  X,
} from "lucide-react";


import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  ApiRole,
} from "../services/roleService";
import { ApiCategory, getCategoriesWithModules, getRolePermissions, saveRolePermissions, saveRolePermissionsBulk, updateRoleModulePermission } from "../services/moduleService";

export const RoleManagementPage = () => {

  const [roles, setRoles] = useState<Role[]>([]);

  const [loading, setLoading] = useState(true); 
  const [isSaving, setIsSaving] = useState(false); 
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "form">("list");
  const [editingRole, setEditingRole] = useState<Role | null>(null);


  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formPermissions, setFormPermissions] = useState<RolePermissions>({});

  const storedUser = localStorage.getItem("fhims_auth_user");

  const loggedInUser = storedUser ? JSON.parse(storedUser) : null;
  const createdBy = loggedInUser?.userId || 0;

  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [dynamicModules, setDynamicModules] = useState<any[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);



  const permissionActions: PermissionAction[] = [
    "view",
    "add",
    "edit",
    "delete",
    "approve",
    "lock",
    "restore",
  ];
  const manageUsersAction = "manageUsers" as const;



const fetchRoles = async () => {
  setLoading(true);
  try {
    const data = await getRoles(currentPage, pageSize);

    setTotalCount(data.totalCount);
    setTotalPages(Math.ceil(data.totalCount / pageSize));

    const apiRoles = data.roles;

    // 🔥 Load ALL role permissions IN PARALLEL (instead of 1 by 1)
    const allPermissions = await Promise.all(
      apiRoles.map((r: any) => getRolePermissions(r.roleId))
    );

    // 🔥 Map roles + permissions
    const mapped: Role[] = apiRoles.map((r: any, index: number) => {
      const permData = allPermissions[index];

      const permissionMap: RolePermissions = {};

      permData.forEach((p: any) => {
        permissionMap[p.moduleId] = {
          view: p.canView,
          add: p.canAdd,
          edit: p.canEdit,
          delete: p.canDelete,
          approve: p.canApprove,
          lock: p.canLock,
          restore: p.canRestore,
          manageUsers: p.canManageUsers,
        };
      });

      return {
        id: String(r.roleId),
        name: r.roleName,
        description: r.roleDescription || "",
        permissions: permissionMap,
        isSystemRole: r.isSystemRole,
        createdDate: r.createdAt ? r.createdAt.split("T")[0] : "",
        roleCode: r.roleCode,
        defaultDashboardUrl: r.defaultDashboardUrl,
      };
    });

    setRoles(mapped);
  } catch (err) {
    console.error("Failed loading roles:", err);
  } finally {
    setLoading(false);
  }
};




  
useEffect(() => {
  fetchRoles();
}, [currentPage, pageSize]);

useEffect(() => {
  (async () => {
    const data = await getCategoriesWithModules(true);
    setCategories(data);

    const flattened = data.flatMap((cat) =>
      cat.modules.map((m) => ({
        id: m.moduleId.toString(),
        name: m.moduleName,
        description: m.description,
        category: cat.categoryName.toLowerCase(),
      }))
    );

    setDynamicModules(flattened);
  })();
}, []);





  if (loading && viewMode === "list") {
    return (
      <div className="flex-1 min-h-[calc(100vh-64px)] flex items-center justify-center">
        <p className="text-sky-700 font-medium">Loading roles...</p>
      </div>
    );
  }

  const handleOpenForm = (role?: Role) => {
    if (role) {
      setEditingRole(role);
      setFormName(role.name);
      setFormDescription(role.description || "");
      (async () => {
    try {
      const perms = await getRolePermissions(parseInt(role.id, 10));

      const formatted: RolePermissions = {};

      dynamicModules.forEach((m) => {
        const p = perms.find((x) => x.moduleId === parseInt(m.id));
        formatted[m.id] = {
          view: p?.canView || false,
          add: p?.canAdd || false,
          edit: p?.canEdit || false,
          delete: p?.canDelete || false,
          approve: p?.canApprove || false,
          lock: p?.canLock || false,
          restore: p?.canRestore || false,
          manageUsers: p?.canManageUsers || false,
        };
      });

      setFormPermissions(formatted);
    } catch (err) {
      console.error("Failed loading permissions", err);
    }
  })();
    } else {
      setEditingRole(null);
      setFormName("");
      setFormDescription("");

      const emptyPermissions: RolePermissions = {};
      dynamicModules.forEach((module) => {
  emptyPermissions[module.id] = {
    view: false,
    add: false,
    edit: false,
    delete: false,
    approve: false,
    lock: false,
    restore: false,
    manageUsers: false,
  };
});

      setFormPermissions(emptyPermissions);
    }

    setTimeout(() => setViewMode("form"), 0);
  };

  const handleBackToList = () => {
    setViewMode("list");
    setEditingRole(null);
  };

  const handleTogglePermission = (moduleId: string, action: PermissionAction) => {
    setFormPermissions((prev) => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [action]: !prev[moduleId]?.[action],
      },
    }));
  };

  const handleSelectAll = (moduleId: string) => {
    const allSelected = permissionActions.every(
      (action) => formPermissions[moduleId]?.[action]
    );
    setFormPermissions((prev) => ({
      ...prev,
      [moduleId]: {
        view: !allSelected,
        add: !allSelected,
        edit: !allSelected,
        delete: !allSelected,
        approve: !allSelected,
        lock: !allSelected,
        restore: !allSelected,
        manageUsers: !allSelected,
      },
    }));
  };


const handleSaveRole = async () => {
  if (!formName.trim()) {
    alert("Please enter a role name");
    return;
  }

  setIsSaving(true);

  try {
    let roleIdToSave: number | null = null;


    if (editingRole) {
      const roleIdNum = parseInt(editingRole.id, 10);

      await updateRole(roleIdNum, {
        roleId: roleIdNum,
        roleCode:
          editingRole?.roleCode ||
          formName.toLowerCase().replace(/\s+/g, "-"),
        roleName: formName,
        description: formDescription,
        isSystemRole: editingRole?.isSystemRole ?? false,
        defaultDashboardUrl: editingRole?.defaultDashboardUrl ?? "",
        isActive: true,
        updatedBy: createdBy,
      });

      roleIdToSave = roleIdNum;
    } else {
      const payload = {
        roleCode: formName.toLowerCase().replace(/\s+/g, "-"),
        roleName: formName,
        description: formDescription,
        isSystemRole: false,
        defaultDashboardUrl: "",
        createdBy,
      };

      const createdRole = await createRole(payload);
      roleIdToSave = createdRole.id;
    }

    if (!roleIdToSave) throw new Error("Missing roleId");

    let permissionsChanged = false;

    if (editingRole) {
      const oldPerms = editingRole.permissions;

      for (const moduleId of Object.keys(formPermissions)) {
        const newP = formPermissions[moduleId];
        const oldP = oldPerms[moduleId];

        if (!oldP) permissionsChanged = true;
        else {
          if (
            newP.view !== oldP.view ||
            newP.add !== oldP.add ||
            newP.edit !== oldP.edit ||
            newP.delete !== oldP.delete ||
            newP.approve !== oldP.approve ||
            newP.lock !== oldP.lock ||
            newP.restore !== oldP.restore ||
            newP.manageUsers !== oldP.manageUsers
          ) {
            permissionsChanged = true;
          }
        }

        if (permissionsChanged) break;
      }
    } else {
      permissionsChanged = true; 
    }


    if (permissionsChanged) {
      const existingPerms = await getRolePermissions(roleIdToSave);

      const createList: any[] = [];
      const updateList: any[] = [];

      dynamicModules.forEach((module) => {
        const moduleId = Number(module.id);
        const perms = formPermissions[module.id];

        const existing = existingPerms.find((p) => p.moduleId === moduleId);

        const basePayload = {
          roleId: roleIdToSave!,
          moduleId,
          canView: perms.view,
          canAdd: perms.add,
          canEdit: perms.edit,
          canDelete: perms.delete,
          canApprove: perms.approve,
          canLock: perms.lock,
          canRestore: perms.restore,
          canManageUsers: perms.manageUsers,
          isActive: true,
          updatedBy: createdBy,
          performedBy: createdBy,
        };

        if (existing) {
          updateList.push({
            ...basePayload,
            roleModulePermissionId: existing.roleModulePermissionId,
          });
        } else {
          createList.push({
            ...basePayload,
            roleModulePermissionId: 0,
          });
        }
      });


      if (createList.length > 0) {
        await saveRolePermissionsBulk(createList);
      }


      for (const perm of updateList) {
        await updateRoleModulePermission(
          perm.roleModulePermissionId,
          perm
        );
      }
    }

    await fetchRoles();
    handleBackToList();

  } catch (err) {
    console.error("Error saving role:", err);
    alert("Failed to save role.");
  } finally {
    setIsSaving(false);
  }
};





  const handleDeleteRole = async (roleId: string) => {
    if (!window.confirm("Are you sure you want to delete this role?")) return;


    const roleIdNum = parseInt(roleId, 10);

    try {
      await deleteRole(roleIdNum, createdBy);

      setRoles((prev) => prev.filter((r) => r.id !== roleId));
    } catch (err) {
      console.error("Failed to delete role:", err);
      alert("Failed to delete role. See console for details.");
    }
  };

const groupedModules = categories.reduce<Record<string, any[]>>(
  (acc, category) => {
    const catName = category.categoryName.toLowerCase();

    acc[catName] = category.modules.map((m) => ({
      id: m.moduleId.toString(),
      name: m.moduleName,
      description: m.description,
    }));

    return acc;
  },
  {}
);




  const categoryLabels = categories.reduce<Record<string, string>>(
  (acc, cat) => {
    acc[cat.categoryName.toLowerCase()] = cat.categoryName;
    return acc;
  },
  {}
);



const getEnabledModules = (role: Role) => {
  const enabled: string[] = [];

  dynamicModules.forEach((module) => {
    const perms = role.permissions[module.id];
    if (perms && Object.values(perms).some((p) => p === true)) {
      enabled.push(module.name);
    }
  });

  return enabled;
};


  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  if (viewMode === "form") {
    return (
      <div className="space-y-4 sm:space-y-6 min-h-screen bg-gradient-to-br from-gray-50 to-white p-3 sm:p-6">
        {/* Header with Back Button - Mobile Responsive */}
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Title Row with Back Button */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <Button
                type="button"
                variant="ghost"
                onClick={handleBackToList}
                className="hover:bg-[#5B9BD5]/10 -ml-2 h-8 sm:h-10 w-8 sm:w-10 p-0 flex-shrink-0"
                style={{ color: "#5B9BD5" }}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h1 className="text-xl sm:text-2xl truncate" style={{ color: "#5B9BD5" }}>
                {editingRole ? `Edit Role: ${editingRole.name}` : "Create New Role"}
              </h1>
            </div>
            <div className="hidden sm:flex gap-3 items-center flex-shrink-0">
              <Button type="button" variant="ghost" onClick={handleBackToList} className="hover:bg-gray-100 h-10 text-sm">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSaveRole}
                className="text-white shadow-lg hover:opacity-90 transition-opacity h-10 text-sm"
                style={{ backgroundColor: "#5B9BD5" }}
                disabled={isSaving}
              >
                {isSaving ? (editingRole ? "Updating..." : "Creating...") : editingRole ? "Update Role" : "Create Role"}
              </Button>
            </div>
          </div>

          {/* Description Row */}
          <p className="text-sm sm:text-base text-gray-600">Configure role details and assign granular permissions</p>

          {/* Mobile Action Buttons */}
          <div className="flex sm:hidden gap-2 w-full">
            <Button type="button" variant="ghost" onClick={handleBackToList} className="hover:bg-gray-100 flex-1 h-9 text-sm">
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveRole}
              className="text-white shadow-lg hover:opacity-90 transition-opacity flex-1 h-9 text-sm"
              style={{ backgroundColor: "#5B9BD5" }}
              disabled={isSaving}
            >
              {isSaving ? (editingRole ? "Updating..." : "Creating...") : editingRole ? "Update Role" : "Create Role"}
            </Button>
          </div>
        </div>

        {/* Role Information Card */}
        <Card className="bg-white border-gray-200 shadow-sm">
  <CardHeader>
    <CardTitle className="text-base sm:text-lg" style={{ color: "#5B9BD5" }}>
      Role Information
    </CardTitle>
    <CardDescription className="text-xs sm:text-sm text-gray-500 !mt-0">
      Basic details about this role
    </CardDescription>
  </CardHeader>

  <CardContent >
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
      <div className="space-y-2">
        <Label className="text-xs sm:text-sm text-gray-700">
          Role Name <span className="text-red-500">*</span>
        </Label>
        <Input
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          placeholder="e.g., Department Manager"
          className="border-gray-300 focus:border-[#5B9BD5] focus:ring-[#5B9BD5] text-sm h-9 sm:h-10"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs sm:text-sm text-gray-700">Description</Label>
        <Input
          value={formDescription}
          onChange={(e) => setFormDescription(e.target.value)}
          placeholder="Brief role description"
          className="border-gray-300 focus:border-[#5B9BD5] focus:ring-[#5B9BD5] text-sm h-9 sm:h-10"
        />
      </div>
    </div>
  </CardContent>
</Card>


        {/* Permission Matrix Card */}
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg" style={{ color: "#5B9BD5" }}>
              Permission Matrix
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-gray-500">Assign granular permissions for each module across all categories</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <Tabs defaultValue="operations" className="w-full">
              <TabsList className="mb-4 sm:mb-6 bg-gray-100 w-full flex flex-wrap gap-1 h-auto p-1 justify-start">
                {Object.keys(groupedModules).map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm flex-shrink-0 px-2 sm:px-3 py-1.5"
                    style={{ color: category === "operations" ? "#5B9BD5" : undefined }}
                  >
                    {categoryLabels[category] || category}
                  </TabsTrigger>
                ))}
              </TabsList>

              {Object.entries(groupedModules).map(([category, modules]) => (
                <TabsContent key={category} value={category} className="mt-0">
                  {/* Desktop Table View */}
                  <div className="hidden md:block border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left p-4 border-b border-gray-200 sticky left-0 bg-gray-50 z-10 min-w-[280px]" style={{ color: "#5B9BD5" }}>
                              Menu Name
                            </th>
                            <th className="text-center p-4 border-b border-l border-gray-200 min-w-[100px]" style={{ color: "#5B9BD5" }}>
                              Select All
                            </th>
                            {permissionActions.map((action) => (
                              <th key={action} className="text-center p-4 border-b border-l border-gray-200 capitalize min-w-[90px]" style={{ color: "#5B9BD5" }}>
                                {action}
                              </th>
                            ))}
                            <th className="text-center p-4 border-b border-l border-gray-200 capitalize min-w-[110px]" style={{ color: "#5B9BD5" }}>
                              Manage Users
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {modules.map((module) => {
                            const modulePermissions = formPermissions[module.id] || {};
                            const allSelected = permissionActions.every((action) => modulePermissions[action]);

                            return (
                              <tr key={module.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                <td className="p-4 sticky left-0 bg-white hover:bg-gray-50 z-10">
                                  <div>
                                    <p style={{ color: "#5B9BD5" }}>{module.name}</p>
                                    <p className="text-xs text-gray-500">{module.description}</p>
                                  </div>
                                </td>
                                <td className="text-center p-4 border-l border-gray-100">
                                  <div className="flex justify-center">
                                    <Checkbox checked={allSelected} onCheckedChange={() => handleSelectAll(module.id)} className="border-gray-300 data-[state=checked]:bg-[#5B9BD5] data-[state=checked]:border-[#5B9BD5]" />
                                  </div>
                                </td>
                                {permissionActions.map((action) => (
                                  <td key={action} className="text-center p-4 border-l border-gray-100">
                                    <div className="flex justify-center">
                                      <Checkbox checked={modulePermissions[action] || false} onCheckedChange={() => handleTogglePermission(module.id, action)} className="border-gray-300 data-[state=checked]:bg-[#5B9BD5] data-[state=checked]:border-[#5B9BD5]" />
                                    </div>
                                  </td>
                                ))}
                                <td className="text-center p-4 border-l border-gray-100">
                                  <div className="flex justify-center">
                                    <Checkbox checked={modulePermissions.manageUsers || false} onCheckedChange={() => handleTogglePermission(module.id, manageUsersAction)} className="border-gray-300 data-[state=checked]:bg-[#5B9BD5] data-[state=checked]:border-[#5B9BD5]" />
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-3">
                    {modules.map((module) => {
                      const modulePermissions = formPermissions[module.id] || {};
                      const allSelected = permissionActions.every((action) => modulePermissions[action]);
                      const selectedCount = [...permissionActions, "manageUsers" as const].filter((action) => modulePermissions[action]).length;

                      return (
                        <div key={module.id} className="border border-gray-200 rounded-xl p-3 bg-white shadow-sm">
                          {/* Module Header */}
                          <div className="flex items-start justify-between mb-3 pb-3 border-b border-gray-100">
                            <div className="flex-1 min-w-0 pr-2">
                              <div className="flex items-center gap-2">
                                <p className="text-sm" style={{ color: "#5B9BD5" }}>{module.name}</p>
                                {selectedCount > 0 && (
                                  <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: "#5B9BD5", color: "white" }}>{selectedCount}</span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mt-1 line-clamp-1">{module.description}</p>
                            </div>
                            <Button size="sm" variant="outline" onClick={() => handleSelectAll(module.id)} className="h-7 px-2.5 text-xs whitespace-nowrap flex-shrink-0 rounded-lg transition-all" style={allSelected ? { backgroundColor: "#5B9BD5", color: "white", borderColor: "#5B9BD5" } : {}}>
                              {allSelected ? "Clear" : "All"}
                            </Button>
                          </div>

                          {/* Permissions Grid */}
                          <div className="overflow-x-auto -mx-3 px-3 pb-2">
                            <div className="flex gap-2 min-w-max">
                              {permissionActions.map((action) => (
                                <div key={action} className={`flex items-center space-x-2 p-2.5 rounded-lg border transition-all flex-shrink-0 ${modulePermissions[action] ? "border-[#5B9BD5]/30 bg-[#5B9BD5]/5" : "border-gray-200 bg-gray-50"}`}>
                                  <Checkbox id={`${module.id}-${action}`} checked={modulePermissions[action] || false} onCheckedChange={() => handleTogglePermission(module.id, action)} className="border-gray-300 data-[state=checked]:bg-[#5B9BD5] data-[state=checked]:border-[#5B9BD5] w-4 h-4 md:w-auto md:h-auto" style={{ minWidth: "auto", minHeight: "auto" }} />
                                  <label htmlFor={`${module.id}-${action}`} className="text-xs text-gray-700 capitalize cursor-pointer select-none whitespace-nowrap">{action}</label>
                                </div>
                              ))}

                              <div className={`flex items-center space-x-2 p-2.5 rounded-lg border transition-all flex-shrink-0 ${modulePermissions.manageUsers ? "border-[#5B9BD5]/30 bg-[#5B9BD5]/5" : "border-gray-200 bg-gray-50"}`}>
                                <Checkbox id={`${module.id}-manageUsers`} checked={modulePermissions.manageUsers || false} onCheckedChange={() => handleTogglePermission(module.id, manageUsersAction)} className="border-gray-300 data-[state=checked]:bg-[#5B9BD5] data-[state=checked]:border-[#5B9BD5] w-4 h-4 md:w-auto md:h-auto" style={{ minWidth: "auto", minHeight: "auto" }} />
                                <label htmlFor={`${module.id}-manageUsers`} className="text-xs text-gray-700 cursor-pointer select-none whitespace-nowrap">Manage Users</label>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    );
  }

  // LIST VIEW (default)
  return (
    <div className="space-y-6 p-3 md:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 style={{ color: "#5B9BD5" }} className="text-xl sm:text-2xl md:text-3xl">Role & Permission Management</h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">Configure roles and granular access permissions</p>
        </div>
        <Button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleOpenForm();
          }}
          className="w-full sm:w-auto text-white shadow-lg hover:opacity-90 transition-opacity rounded-lg"
          style={{ backgroundColor: "#5B9BD5" }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Role
        </Button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
  <div className="relative">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
    <Input
      placeholder="Search roles..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="pl-10 border border-gray-300 bg-gray-50 focus:bg-white focus:border-[#5B9BD5] text-base h-11 rounded-lg"
    />
  </div>
</div>


      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredRoles.map((role) => {
          const enabledModules = getEnabledModules(role);
          const maxVisibleModules = 7;
          const visibleModules = enabledModules.slice(0, maxVisibleModules);
          const remainingCount = enabledModules.length - maxVisibleModules;

          return (
            <Card key={role.id} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col rounded-xl">
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#E8F3FC] flex items-center justify-center">
                    <Shield className="w-6 h-6" style={{ color: "#5B9BD5" }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 style={{ color: "#5B9BD5" }} className="text-lg">{role.name}</h3>
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => handleOpenForm(role)} className="w-9 h-9 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        {role.name.toLowerCase() !== "super admin" && (
                          <button onClick={() => handleDeleteRole(role.id)} className="w-9 h-9 rounded-lg border border-red-300 flex items-center justify-center hover:bg-red-50 transition-colors">
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed">{role.description}</p>
                  </div>
                </div>

                {/* Page Access Section */}
                <div className="flex-1">
                  <p className="text-gray-600 text-sm mb-3">Page Access:</p>
                  {enabledModules.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {visibleModules.map((moduleName, idx) => (
                        <Badge key={idx} className="text-xs px-3 py-1.5 rounded-md border-0 h-auto" style={{ backgroundColor: "#E3F2FD", color: "#5B9BD5" }}>
                          {moduleName}
                        </Badge>
                      ))}
                      {remainingCount > 0 && (
                        <Badge className="text-xs px-3 py-1.5 rounded-md border-0 h-auto" style={{ backgroundColor: "#E3F2FD", color: "#5B9BD5" }}>+{remainingCount} more</Badge>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic">No modules enabled</p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-between items-center mt-6 border-t pt-4">
  <div className="flex items-center gap-2">
    <span>
      Page {currentPage} of {totalPages}
    </span>

    <select
      value={pageSize}
      onChange={(e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1);
      }}
      className="border rounded px-2 py-1"
    >
      <option value={10}>10</option>
      <option value={25}>25</option>
      <option value={50}>50</option>
      <option value={100}>100</option>
    </select>
    <span>records</span>
  </div>

  <div className="flex gap-2">
    <Button
      variant="outline"
      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
      disabled={currentPage === 1}
    >
      Previous
    </Button>

    <Button
      variant="outline"
      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
      disabled={currentPage === totalPages}
    >
      Next
    </Button>
  </div>
</div>

    </div>
  );
};
