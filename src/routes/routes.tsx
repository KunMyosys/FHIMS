import * as React from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { Toaster } from "sonner";
import { useAuth } from "../contexts/AuthContext";

import { LoginPage } from "../components/LoginPage";
import { ForgotPasswordPage } from "../components/ForgotPasswordPage";
import { DashboardLayoutNew } from "../components/DashboardLayoutNew";
import { DashboardLayout } from "../components/DashboardLayout";

import { DashboardPage } from "../pages/DashboardPage";
import { MannatNiyazReceiptPage } from "../pages/MannatNiyazReceiptPage";
import { MannatNiyazDashboardPage } from "../pages/MannatNiyazDashboardPage";
import { MannatNiyazReceiptViewPage } from "../pages/MannatNiyazReceiptViewPage";
import { RoleManagementPage } from "../pages/RoleManagementPage";
import { UserManagementPage } from "../pages/UserManagementPage";
import { CountryCityMasterPage } from "../pages/CountryCityMasterPage";
import { DocumentMasterPage } from "../pages/DocumentMasterPage";
import { PortMasterPage } from "../pages/PortMasterPage";

/* ✅ Protected route wrapper */
const ProtectedRoute = ({ children }: { children: React.JSX.Element }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-sky-700 font-medium">
        Loading...
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

const AppRoutes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = React.useState("dashboard");

  React.useEffect(() => {
    const path = location.pathname.split("/").pop() || "dashboard";

    // If we're on the print view page, clear sidebar highlight
    if (path === "mannat-receipt-view") {
      setCurrentPage("");
    } else {
      setCurrentPage(path);
    }
  }, [location]);

  const handleNavigate = (path: string) => {
    setCurrentPage(path);
    navigate(path === "dashboard" ? "/dashboard" : `/${path}`);
  };

  return (
    <Routes>
      {/* ---------- Public Routes ---------- */}
      <Route path="/" element={<LoginPage />} />
      <Route
        path="/forgot-password"
        element={<ForgotPasswordPage onBackToLogin={() => navigate("/")} />}
      />

      {/* ---------- Protected Routes ---------- */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayoutNew
              currentPage={currentPage}
              onNavigate={handleNavigate}
            >
              <DashboardPage />
            </DashboardLayoutNew>
          </ProtectedRoute>
        }
      />

      <Route
        path="/mannat"
        element={
          <ProtectedRoute>
            <DashboardLayoutNew
              currentPage="mannat"
              onNavigate={handleNavigate}
            >
              <MannatNiyazReceiptPage />
            </DashboardLayoutNew>
          </ProtectedRoute>
        }
      />

      <Route
        path="/mannat-dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayoutNew
              currentPage="mannat-dashboard"
              onNavigate={handleNavigate}
            >
              <MannatNiyazDashboardPage />
            </DashboardLayoutNew>
          </ProtectedRoute>
        }
      />

      {/* ✅ Receipt View Page (no sidebar highlight) */}
      <Route
        path="/mannat-receipt-view"
        element={
          <ProtectedRoute>
            <DashboardLayoutNew
              currentPage=""
              onNavigate={handleNavigate}
            >
              <MannatNiyazReceiptViewPage onNavigate={handleNavigate} />
            </DashboardLayoutNew>
          </ProtectedRoute>
        }
      />

      {/* ✅ Fixed: Role Management (kebab-case path) */}
      <Route
        path="/role-management"
        element={
          <ProtectedRoute>
            <DashboardLayoutNew
              currentPage="role-management"
              onNavigate={handleNavigate}
            >
              <RoleManagementPage />
            </DashboardLayoutNew>
          </ProtectedRoute>
        }
      />

      <Route
        path="/user-management"
        element={
          <ProtectedRoute>
            <DashboardLayoutNew
              currentPage="user-management"
              onNavigate={handleNavigate}
            >
              <UserManagementPage />
            </DashboardLayoutNew>
          </ProtectedRoute>
        }
      />

      <Route
        path="/country-city-master"
        element={
          <ProtectedRoute>
            <DashboardLayoutNew
              currentPage="country-city-master"
              onNavigate={handleNavigate}
            >
              <CountryCityMasterPage />
            </DashboardLayoutNew>
          </ProtectedRoute>
        }
      />

      <Route
        path="/document-master"
        element={
          <ProtectedRoute>
            <DashboardLayoutNew
              currentPage="document-master"
              onNavigate={handleNavigate}
            >
              <DocumentMasterPage />
            </DashboardLayoutNew>
          </ProtectedRoute>
        }
      />

      <Route
        path="/port-master"
        element={
          <ProtectedRoute>
            <DashboardLayoutNew
              currentPage="port-master"
              onNavigate={handleNavigate}
            >
              <PortMasterPage />
            </DashboardLayoutNew>
          </ProtectedRoute>
        }
      />

      {/* ---------- Fallback ---------- */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
