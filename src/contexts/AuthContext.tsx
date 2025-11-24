import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axiosInstance from "../services/axiosInstance";
import { getConsolidatedPermissions } from "../services/userService";


export interface User {
  id: string | number;
  name: string;
  email: string;
  role: string;
  token?: string;
  expiresAt?: string;
  permissions?: any;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  error: string | null;
  loading: boolean;
  permissions?: any; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

const STORAGE_KEY_USER = "fhims_auth_user";
const STORAGE_KEY_TOKEN = "fhims_auth_token";

const getBaseRole = (email: string): "admin" | "Mannat-Finance" | "Mannat-User" => {
  const lower = email.toLowerCase();
  if (lower.includes("admin")) return "admin";
  if (lower.includes("mannatfinance")) return "Mannat-Finance";
  return "Mannat-User";
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY_USER);
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.expiresAt && new Date(parsed.expiresAt) > new Date()) {
          setUser(parsed);
          axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${parsed.token}`;
        } else {
          localStorage.removeItem(STORAGE_KEY_USER);
          localStorage.removeItem(STORAGE_KEY_TOKEN);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY_USER);
        localStorage.removeItem(STORAGE_KEY_TOKEN);
      }
    }
    setLoading(false);
  }, []);

const login = async (email: string, password: string) => {
  setError(null);
  setLoading(true);

  try {
    const response = await axiosInstance.post("/Auth/login", {
      email,
      password,
    });

    if (response.status === 200 && response.data) {
      const { token, expiresAt, userId, fullName } = response.data;
      const baseRole = getBaseRole(email);

      let newUser: User = {
        id: userId,
        name: fullName,
        email,
        token,
        expiresAt,
        role: baseRole,
      };

      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // -----------------------------------------
      // 🔄 INSERT UPDATED PERMISSION BLOCK HERE
      // -----------------------------------------
      try {
        const permissionsData = await getConsolidatedPermissions(userId);

        if (permissionsData) {
          newUser = {
            ...newUser,
            permissions: permissionsData,
            role: permissionsData.roles?.[0]?.roleName || baseRole || "User",
          };
        }
      } catch (permErr) {
        console.error("Error fetching consolidated permissions:", permErr);
      }
      // -----------------------------------------

      setUser(newUser);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
      localStorage.setItem(STORAGE_KEY_TOKEN, token);

      if (expiresAt) scheduleAutoLogout(expiresAt);
    } else {
      setError("Login failed. Please check your credentials.");
      throw new Error("Invalid response from API");
    }
  } catch (err: any) {
    console.error("Login error:", err);
    if (err.response?.status === 400 || err.response?.status === 401) {
      setError("Invalid email or password.");
    } else if (err.code === "ERR_NETWORK") {
      setError("Unable to connect to the server. Please try again later.");
    } else {
      setError("Unexpected error during login.");
    }
    throw err;
  } finally {
    setLoading(false);
  }
};


  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    delete axiosInstance.defaults.headers.common["Authorization"];
  };

  const scheduleAutoLogout = (expiresAt: string) => {
    const expiryTime = new Date(expiresAt).getTime() - Date.now();
    if (expiryTime > 0) {
      setTimeout(() => {
        console.warn("Session expired — logging out automatically");
        logout();
      }, expiryTime);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        error,
        loading,
        permissions: user?.permissions,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
