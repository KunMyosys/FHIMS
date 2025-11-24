import { useEffect, useState } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import { mockUsers, UserRole } from "../contexts/UserAuthContext";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  UserPlus,
  Shield,
  Calendar,
} from "lucide-react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserWithRoles,
  assignRoleToUser,
  getUserDashboardSummary,
} from "../services/userService";
import { getRoles } from "../services/roleService";

interface SystemUser {
  mobileNo: string;
  createdBy: null;
  itsNo: string;
  userCode: any;
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roles?: number[];
  roleNames?: string[];
  department?: string;
  isActive: boolean;
  createdDate?: string;
  expiryDate?: string;
}

const roleLabels: Record<UserRole, string> = {
  "super-admin": "Super Admin",
  admin: "Admin",
  staff: "Staff",
  volunteer: "Volunteer",
  guest: "Guest",
  "external-agent": "External Agent",
  "hotel-manager": "Hotel Manager",
  "tour-operator": "Tour Operator",
  "hr-team": "HR Team",
  "finance-officer": "Finance Officer",
  "support-staff": "Support Staff",
  "Mannat-Finance": "Mannat Finance",
  "Mannat-User": "Mannat User",
  "facility-staff": "Facility staff",
};
const roleColorMap: Record<string, string> = {
  "Super Admin": "bg-purple-100 text-purple-800 border-purple-200",
  Admin: "bg-blue-100 text-blue-800 border-blue-200",
  "Finance Officer": "bg-green-100 text-green-800 border-green-200",
  "HR Team": "bg-yellow-100 text-yellow-800 border-yellow-200",
};

export const UserManagementPage = () => {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);

  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRole, setFormRole] = useState<UserRole>("support-staff");
  const [formRoles, setFormRoles] = useState<number[]>([]);
  const [formDepartment, setFormDepartment] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);
  const [formExpiryDate, setFormExpiryDate] = useState("");

  const storedUser = localStorage.getItem("fhims_auth_user");
  const loggedInUser = storedUser ? JSON.parse(storedUser) : null;
  const currentUserId = loggedInUser?.userId || 0;

  const [availableRoles, setAvailableRoles] = useState<any[]>([]);

  const [emailError, setEmailError] = useState("");
  

  const [summary, setSummary] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    totalRoles: 0
  });

  const [formItsNo, setFormItsNo] = useState("");




  const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(10);
const [totalPages, setTotalPages] = useState(1);
const [totalCount, setTotalCount] = useState(0);

 const [formVenue, setFormVenue] = useState('');
  const [formPackage, setFormPackage] = useState('');





  useEffect(() => {
    loadUsers();
    loadRolesFromAPI();
    loadDashboardSummary();
  }, [currentPage, pageSize]);

 const loadRolesFromAPI = async () => {
  try {
    const data = await getRoles(1, 1000); // fetch all roles

    const mappedRoles = data.roles.map((r: any) => ({
      id: r.roleId,
      name: r.roleName,
    }));

    setAvailableRoles(mappedRoles);
  } catch (err) {
    console.error("Failed to load roles:", err);
  }
};




const loadUsers = async () => {
  try {
    const data = await getUsers(currentPage, pageSize);

    console.log("API response:", data);

    // ✅ pagination fix
    const count = data.totalCount || 0;
    setTotalCount(count);
    setTotalPages(Math.ceil(count / pageSize));

    // ✅ list fix
    const list = data.users || [];

    const baseUsers = list.map((u: any) => ({
      id: String(u.userId),
      userCode: u.userCode,
      name: u.fullName,
      email: u.email,
      itsNo: u.itsNo || "",
      mobileNo: u.mobileNo || "",
      createdAt: u.createdAt,
      createdBy: u.createdBy,
      roles: [],
      role: "" as any,
      isActive: u.status === "Active",
      createdDate: u.validityStartDate?.split("T")[0] || "",
      expiryDate: u.validityEndDate?.split("T")[0] || "",
    }));

    const usersWithRoles = await Promise.all(
      baseUsers.map(async (user: { id: any; }) => {
        try {
          const details = await getUserWithRoles(Number(user.id));
          return {
            ...user,
            roles: details.roles?.map((r: any) => r.roleId) || [],
            roleNames: details.roles?.map((r: any) => r.roleName) || [],
          };
        } catch {
          return user;
        }
      })
    );

    setUsers(usersWithRoles);

  } catch (err) {
    console.error("Failed to load users:", err);
  }
};



const handlePrevPage = () => {
  if (currentPage > 1) setCurrentPage(currentPage - 1);
};

const handleNextPage = () => {
  if (currentPage < totalPages) setCurrentPage(currentPage + 1);
};



  const loadDashboardSummary = async () => {
  try {
    const data = await getUserDashboardSummary();
    setSummary(data);
  } catch (err) {
    console.error("Failed to load dashboard summary:", err);
  }
};


  const handleOpenDialog = (user?: SystemUser) => {
    if (user) {
      setEditingUser(user);
      (user as any).userCode = user.userCode;
      setFormName(user.name);
      setFormEmail(user.email);
      setFormRoles(user.roles || []);
      setFormDepartment(user.department || "");
      setFormIsActive(user.isActive);
      setFormExpiryDate(user.expiryDate || "");
      setFormItsNo(user.itsNo || "");
    } else {
      setEditingUser(null);
      setFormName("");
      setFormEmail("");
      setFormRoles([]); 
      setFormDepartment("");
      setFormIsActive(true);
      setFormExpiryDate("");
      setFormItsNo("");
    }

    setTimeout(() => setIsDialogOpen(true), 0);
  };

 const handleSaveUser = async () => {
  if (!formName || !formEmail) {
    alert("Please fill in all required fields");
    return;
  }

  // 🔥 ITS Number validation (must be exactly 8 digits)
  if (!/^\d{8}$/.test(formItsNo)) {
    alert("ITS Number must be exactly 8 digits");
    return;
  }

  try {
    let savedUserId: number;

    /* ------------------------------------------------
       CREATE USER
    ------------------------------------------------ */
    if (!editingUser) {
      try {
        const res = await createUser({
          userCode: `USR${Date.now()}`,
          fullName: formName,
          email: formEmail,
          itsNo: formItsNo, // ✅ sending ITS
          plainPassword: "Password@123",
          mobileNo: "0000000000",
          status: formIsActive ? "Active" : "Inactive",
          validityStartDate: new Date().toISOString(),
          validityEndDate: formExpiryDate
            ? new Date(formExpiryDate).toISOString()
            : null,
          createdBy: currentUserId,
        });

        savedUserId = res.userId || res.id;
      } catch (err: any) {
        if (
          err.response?.status === 409 ||
          err.response?.data?.message?.toLowerCase().includes("email")
        ) {
          setEmailError("Email already registered");
          return;
        }
        throw err;
      }
    }

    /* ------------------------------------------------
       UPDATE USER
    ------------------------------------------------ */
    else {
      try {
       await updateUser(Number(editingUser.id), {
  userId: Number(editingUser.id),                                 // REQUIRED
  userCode: editingUser.userCode || `USR${editingUser.id}`,
  fullName: formName,
  email: formEmail,
  mobileNo: editingUser.mobileNo || "0000000000",
  itsNo: formItsNo,
  passwordHash: null,                                             
  status: formIsActive ? "Active" : "Inactive",
  validityStartDate: editingUser.createdDate                      
    ? new Date(editingUser.createdDate).toISOString()
    : new Date().toISOString(),
  validityEndDate: formExpiryDate
    ? new Date(formExpiryDate).toISOString()
    : null,
  lastLoginTime: null,                                            
  failedLoginAttempts: 0,                                         
  isEmailVerified: false,                                         
  createdBy: editingUser.createdBy || null,                       
  createdAt: editingUser.createdDate || new Date().toISOString(),   
  updatedBy: currentUserId                                       
});

      } catch (err: any) {
        if (
          err.response?.status === 409 ||
          err.response?.data?.message?.toLowerCase().includes("email")
        ) {
          setEmailError("Email already registered");
          return;
        }
        throw err;
      }

      savedUserId = Number(editingUser.id);
    }

    /* ------------------------------------------------
       ASSIGN ROLES
    ------------------------------------------------ */
    if (formRoles.length > 0) {
      for (const roleId of formRoles) {
        await assignRoleToUser(savedUserId, roleId);
      }
    }

    /* ------------------------------------------------
       REFRESH + CLOSE
    ------------------------------------------------ */
    await loadUsers();
    setIsDialogOpen(false);

  } catch (err) {
    console.error("Error saving user:", err);
    alert("Failed to save user.");
  }
};


  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await deleteUser(Number(userId), 1);
      await loadUsers();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleToggleStatus = async (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    try {
      await updateUser(Number(userId), {
        userCode: userId,
        fullName: user.name,
        email: user.email,
        mobileNo: "0000000000",
        status: user.isActive ? "Inactive" : "Active",
        validityStartDate: new Date().toISOString(),
        validityEndDate: user.expiryDate
          ? new Date(user.expiryDate).toISOString()
          : null,
        updatedBy: currentUserId,
      });

      await loadUsers();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  
  const getRoleColor = (role: string) => {
    return roleColorMap[role] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const activeUsers = users.filter((u) => u.isActive).length;
  const inactiveUsers = users.filter((u) => !u.isActive).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 style={{ color: "#5B9BD5" }}>User Management</h1>
          <p className="text-gray-600 mt-1">
            Manage system users and access control
          </p>
        </div>
        <Button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleOpenDialog();
          }}
          className="text-white shadow-lg hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "#5B9BD5" }}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add New User
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/95 backdrop-blur-sm border-[#5B9BD5]/20 shadow-lg hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm" style={{ color: "#5B9BD5" }}>
              Total Users
            </CardTitle>
            <Shield className="w-4 h-4" style={{ color: "#5B9BD5" }} />
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">{summary.totalUsers}</div>
            <p className="text-xs text-gray-600">Registered in system</p>
          </CardContent>
        </Card>
        <Card className="bg-white/95 backdrop-blur-sm border-[#5B9BD5]/20 shadow-lg hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm" style={{ color: "#5B9BD5" }}>
              Active Users
            </CardTitle>
            <UserPlus className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">{summary.activeUsers}</div>
            <p className="text-xs text-gray-600">Currently active</p>
          </CardContent>
        </Card>
        <Card className="bg-white/95 backdrop-blur-sm border-[#5B9BD5]/20 shadow-lg hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm" style={{ color: "#5B9BD5" }}>
              Inactive Users
            </CardTitle>
            <Trash2 className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">{summary.inactiveUsers}</div>
            <p className="text-xs text-gray-600">Disabled accounts</p>
          </CardContent>
        </Card>
        <Card className="bg-white/95 backdrop-blur-sm border-[#5B9BD5]/20 shadow-lg hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm" style={{ color: "#5B9BD5" }}>
              Roles
            </CardTitle>
            <Shield className="w-4 h-4" style={{ color: "#5B9BD5" }} />
          </CardHeader>
          <CardContent>
            <div className="text-gray-900">{summary.totalRoles}</div>
            <p className="text-xs text-gray-600">System roles</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/95 backdrop-blur-sm border-[#5B9BD5]/20 shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle style={{ color: "#5B9BD5" }}>System Users</CardTitle>
              <CardDescription className="text-gray-600">
                Manage user accounts and permissions
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => {
  setSearchTerm(e.target.value);
  setCurrentPage(1);     // important
}}

                className="pl-10 border-gray-300 rounded-xl"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200">
                  <TableHead className="text-gray-900">Name</TableHead>
                  <TableHead className="text-gray-900">Email</TableHead>
                  <TableHead className="text-gray-900">Role</TableHead>
                  <TableHead className="text-gray-900">Expiry Date</TableHead>
                  <TableHead className="text-gray-900">Status</TableHead>
                  <TableHead className="text-gray-900">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
{users.map((user) => (

                  <TableRow key={user.id} className="border-gray-200">
                    <TableCell className="text-gray-900">
                      <div>{user.name}</div>
                      <div className="text-xs text-gray-500">{user.itsNo ?? "N/A"}</div>
                    </TableCell>

                    <TableCell className="text-gray-700">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.roleNames && user.roleNames.length > 0 ? (
                          user.roleNames.map((name, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className={getRoleColor(name)}
                            >
                              {name}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-gray-500 text-sm">
                            No Roles
                          </span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-gray-700">
                      {user.expiryDate ? (
                        <div className="flex items-center gap-1">
                          <Calendar
                            className="w-3 h-3"
                            style={{ color: "#5B9BD5" }}
                          />
                          <span className="text-sm">
                            {new Date(user.expiryDate).toLocaleDateString()}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Permanent</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={user.isActive}
                          onCheckedChange={() => handleToggleStatus(user.id)}
                        />
                        <span className="text-sm text-gray-700">
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenDialog(user)}
                          className="border-gray-300 hover:border-[#5B9BD5] hover:text-[#5B9BD5]"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteUser(user.id)}
                          className="border-red-200 text-red-600 hover:bg-red-50"
                          disabled={user.role === "super-admin"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-sky-700 font-medium py-8"
                    >
                      Loading users...
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
<div className="flex flex-wrap justify-between items-center mt-4 border-t pt-3 gap-3">
  <div className="flex items-center gap-3">
    <span>
      Page {currentPage} of {totalPages}
    </span>

    <div className="flex items-center gap-2">
      <Select
        value={String(pageSize)}
        onValueChange={(value) => {
          setPageSize(Number(value));
          setCurrentPage(1);
        }}
      >
        <SelectTrigger className="w-[80px]">
          <SelectValue placeholder={pageSize.toString()} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="25">25</SelectItem>
          <SelectItem value="100">100</SelectItem>
        </SelectContent>
      </Select>
      <Label className="text-sm text-gray-700">Records</Label>
    </div>
  </div>

  <div className="flex gap-2">
    <Button
      variant="outline"
      onClick={handlePrevPage}
      disabled={currentPage === 1}
    >
      Previous
    </Button>
    <Button
      variant="outline"
      onClick={handleNextPage}
      disabled={currentPage === totalPages}
    >
      Next
    </Button>
  </div>
</div>


          </div>
        </CardContent>
      </Card>

      {/* Add/Edit User Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[80vw] !max-w-[80vw] max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle style={{ color: "#5B9BD5" }}>
              {editingUser ? "Edit User" : "Add New User"}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {editingUser
                ? "Update user information and permissions"
                : "Create a new system user with role assignments"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 mt-4">
            {/* Basic Information Section */}
            <div className="space-y-3">
              <h3 className="text-sm text-gray-700">Basic Information</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-700">
                    ITS Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={formItsNo}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (/^\d{0,8}$/.test(v)) setFormItsNo(v); // only numbers, max 8 digits
                    }}
                    placeholder="Enter 8-digit ITS number"
                    className="border-gray-300 focus:border-[#5B9BD5] focus:ring-[#5B9BD5]"
                  />
                  {formItsNo.length > 0 && formItsNo.length < 8 && (
                    <p className="text-xs text-red-500">ITS Number must be 8 digits</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Enter full name"
                    className="border-gray-300 focus:border-[#5B9BD5] focus:ring-[#5B9BD5]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    value={formEmail}
                    onChange={(e) => {
                      setFormEmail(e.target.value);
                      setEmailError(""); // clears error while typing
                    }}
                    placeholder="user@fhims.com"
                    className="border-gray-300 focus:border-[#5B9BD5] focus:ring-[#5B9BD5]"
                  />

                  {emailError && (
                    <p className="text-red-500 text-xs mt-1">{emailError}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Venue & Package Section */}
            <div className="space-y-3 mt-4">
              <h3 className="text-sm text-gray-700">Venue & Event</h3>

              <div className="grid grid-cols-2 gap-4">
                {/* VENUE */}
                <div className="space-y-2">
                  <Label className="text-gray-700">Venue</Label>

                  <Select value={formVenue} onValueChange={setFormVenue}>
                    <SelectTrigger
                      className="flex h-10 w-full items-center justify-between rounded-md 
                      border border-gray-300 bg-transparent px-3 py-2 text-sm shadow-sm 
                      focus:outline-none focus:ring-1 focus:ring-[#5B9BD5]"
                    >
                      <SelectValue placeholder="Select Venue" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="karbala">Karbala</SelectItem>
                      <SelectItem value="najaf">Najaf</SelectItem>
                      <SelectItem value="baghdad">Baghdad</SelectItem>
                      <SelectItem value="samarra">Samarra</SelectItem>
                      <SelectItem value="kadhimiya">Kadhimiya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* PACKAGE */}
                <div className="space-y-2">
                  <Label className="text-gray-700">Event</Label>

                  <Select value={formPackage} onValueChange={setFormPackage}>
                    <SelectTrigger
                      className="flex h-10 w-full items-center justify-between rounded-md 
                      border border-gray-300 bg-transparent px-3 py-2 text-sm shadow-sm 
                      focus:outline-none focus:ring-1 focus:ring-[#5B9BD5]"
                    >
                      <SelectValue placeholder="Select Package" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="arbaeen-special-2025">
                        Arbaeen Special Package 2025
                      </SelectItem>
                      <SelectItem value="ziyarat-standard">
                        Ziyarat Standard Package
                      </SelectItem>
                      <SelectItem value="premium-pilgrimage">
                        Premium Pilgrimage Package
                      </SelectItem>
                      <SelectItem value="family-package">Family Package</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Department & Expiry Section */}
            <div className="space-y-3">
              <h3 className="text-sm text-gray-700">
                Access Duration
              </h3>
              <div className="">
                <div className="space-y-2">
                  <Label className="text-gray-700">
                    <span className="flex items-center gap-2">
                      <Calendar
                        className="w-4 h-4"
                        style={{ color: "#5B9BD5" }}
                      />
                      Expiry Date (Optional for Temporary Users)
                    </span>
                  </Label>
                  <Input
                    type="date"
                    value={formExpiryDate}
                    onChange={(e) => setFormExpiryDate(e.target.value)}
                    className="border-gray-300 focus:border-[#5B9BD5] focus:ring-[#5B9BD5]"
                    min={new Date().toISOString().split("T")[0]}
                  />
                  <p className="text-xs text-gray-500">
                    Leave empty for permanent access
                  </p>
                </div>
              </div>
            </div>

            {/* Role Assignment Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm text-gray-700">
                  Role Assignment <span className="text-red-500">*</span>
                </h3>
                <p className="text-xs text-gray-500">
                  Select one or multiple roles
                </p>
              </div>
              <div className="border-2 border-[#5B9BD5]/30 rounded-lg p-4 bg-gradient-to-br from-[#5B9BD5]/5 to-white">
                <div className="grid grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-2">
                  {availableRoles.map((role) => (
                    <div
                      key={role.id}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/80 transition-colors border border-gray-200 bg-white/50"
                    >
                      <Checkbox
                        id={`role-${role.id}`}
                        checked={formRoles.includes(role.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormRoles([...formRoles, role.id]);
                          } else {
                            setFormRoles(
                              formRoles.filter((r) => r !== role.id)
                            );
                          }
                        }}
                      />
                      <label
                        htmlFor={`role-${role.id}`}
                        className="text-sm text-gray-900 cursor-pointer flex-1"
                      >
                        {role.name} 
                      </label>
                    </div>
                  ))}
                </div>
                {formRoles.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[#5B9BD5]/20">
                    <p className="text-xs text-gray-600">
                      Selected:{" "}
                      <span style={{ color: "#5B9BD5" }}>
                        {formRoles.length} role(s)
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Status Section */}
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <Switch
                checked={formIsActive}
                onCheckedChange={setFormIsActive}
                className="data-[state=checked]:bg-[#5B9BD5]"
              />
              <div>
                <Label className="cursor-pointer text-gray-900">
                  Active User
                </Label>
                <p className="text-xs text-gray-500">
                  User can login and access assigned modules
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="flex-1 border-gray-300"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSaveUser}
                className="flex-1 text-white shadow-lg hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "#5B9BD5" }}
              >
                {editingUser ? "Update User" : "Create User"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
