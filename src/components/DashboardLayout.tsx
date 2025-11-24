import { ReactNode, useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useFavorites } from "../contexts/FavoritesContext";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  LayoutDashboard,
  FileText,
  Receipt,
  Heart,
  Menu,
  ChevronDown,
  ChevronRight,
  LogOut,
  Users,
  Shield,
} from "lucide-react";
import { cn } from "../ui/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  roles: string[];
}

interface NavGroup {
  label: string;
  icon: React.ReactNode;
  roles: string[];
  items: NavItem[];
}

type NavigationItem = NavItem | NavGroup;

function isNavGroup(item: NavigationItem): item is NavGroup {
  return "items" in item;
}

// Sidebar structure visible to all three roles
const navigationStructure: NavigationItem[] = [
  {
    label: "Mannat & Niyaz",
    icon: <Heart className="w-5 h-5" />,
    roles: ["admin", "Mannat-Finance", "Mannat-User"],
    items: [
      {
        label: "Create Receipt",
        icon: <FileText className="w-4 h-4" />,
        path: "mannat",
        roles: ["admin", "Mannat-Finance", "Mannat-User"],
      },
      {
        label: "Receipt Dashboard",
        icon: <Receipt className="w-4 h-4" />,
        path: "mannat-dashboard",
        roles: ["admin", "Mannat-Finance", "Mannat-User"],
      },
    ],
  },
  {
    label: "System Administration",
    icon: <Heart className="w-5 h-5" />,
    roles: ["super-admin", "admin"],
    items: [
      {
        label: "User Management",
        icon: <Users className="w-4 h-4" />,
        path: "user-management",
        roles: ["super-admin", "admin"],
      },
      {
        label: "Role Management",
        icon: <Shield className="w-4 h-4" />,
        path: "role-management",
        roles: ["super-admin", "admin"],
      },
    ],
  },
];

interface DashboardLayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (path: string) => void;
}

interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  item: NavItem | null;
}

export const DashboardLayout = ({
  children,
  currentPage,
  onNavigate,
}: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 1024);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([
    "Mannat & Niyaz",
  ]);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    item: null,
  });

  const contextMenuRef = useRef<HTMLDivElement>(null);

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) =>
      prev.includes(label) ? prev.filter((g) => g !== label) : [...prev, label]
    );
  };

  const userRole = user?.role || "user";

  const filteredNavigation = navigationStructure.filter((item) =>
    item.roles.includes(userRole)
  );

  const userInitials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  const handleContextMenu = (e: React.MouseEvent, item: NavItem) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      item,
    });
  };

  const handleAddToFavorites = () => {
    if (contextMenu.item) {
      addFavorite({
        path: contextMenu.item.path,
        label: contextMenu.item.label,
        icon: contextMenu.item.icon,
      });
    }
    setContextMenu({ visible: false, x: 0, y: 0, item: null });
  };

  const handleRemoveFromFavorites = () => {
    if (contextMenu.item) removeFavorite(contextMenu.item.path);
    setContextMenu({ visible: false, x: 0, y: 0, item: null });
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(e.target as Node)
      ) {
        setContextMenu({ visible: false, x: 0, y: 0, item: null });
      }
    };
    if (contextMenu.visible) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [contextMenu.visible]);

  useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  };
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 relative overflow-hidden">
      {/* Header */}
      <header
        className={cn(
          "fixed top-0 right-0 h-16 bg-white/90 border-b border-sky-200/50 z-40 shadow-md flex items-center transition-all duration-300",
          sidebarOpen ? "lg:left-64" : "lg:left-20 left-0",
          "w-full lg:w-auto px-4 lg:px-6"
        )}
      >
        {/* Hamburger visible on all screens */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-sky-700 hover:bg-sky-50 mr-4"
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* User dropdown */}
        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-3 hover:bg-sky-50 rounded-xl"
              >
                <Avatar
                  className="w-10 h-10 ring-2 ring-sky-200"
                  style={{
                    background:
                      "linear-gradient(135deg, #5B9BD5 0%, #4A8CC7 100%)",
                  }}
                >
                  <AvatarFallback className="bg-transparent text-white">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm text-sky-900">{user?.name}</span>
                  <span className="text-xs text-sky-600 uppercase">
                    {userRole.replace("-", " ")}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-sky-600" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-56 bg-white/95 border-sky-200 max-w-[90vw]"
            >
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm text-sky-900">{user?.name}</p>
                  <p className="text-xs text-sky-600">{user?.email}</p>
                  <p className="text-xs text-sky-500 uppercase">
                    {userRole.replace("-", " ")}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-sky-200" />
              <DropdownMenuItem
                onClick={logout}
                className="text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen bg-white z-50 flex flex-col shadow-lg transition-all duration-300 ease-in-out",
          sidebarOpen ? "w-64" : "w-20", 
          sidebarOpen ? "translate-x-0" : "-translate-x-full", 
          "lg:translate-x-0" 
        )}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-sky-200/50">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md text-white"
              style={{
                background: "linear-gradient(135deg, #5B9BD5 0%, #4A8CC7 100%)",
              }}
            >
              <LayoutDashboard className="w-6 h-6" />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="text-sky-900 font-semibold text-base">FHIMS</h1>
                <p className="text-xs text-sky-600">Faiz-e-Hussaini</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar nav */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <nav className="space-y-2">
            {filteredNavigation.map((item) => {
              if (isNavGroup(item)) {
                const isExpanded = expandedGroups.includes(item.label);
                const hasActiveChild = item.items.some(
                  (sub) => sub.path === currentPage
                );

                return (
                  <div key={item.label} className="space-y-1">
                    <button
                      onClick={() => toggleGroup(item.label)}
                      className={cn(
                        "flex items-center gap-3 w-full rounded-xl px-3 py-3 transition-colors font-medium",
                        hasActiveChild
                          ? "text-white"
                          : "text-sky-700 hover:bg-sky-50",
                        !sidebarOpen && "justify-center"
                      )}
                      style={
                        hasActiveChild
                          ? {
                              background:
                                "linear-gradient(135deg, #5B9BD5 0%, #4A8CC7 100%)",
                            }
                          : {}
                      }
                    >
                      {item.icon}
                      {sidebarOpen && (
                        <>
                          <span className="flex-1 text-left">{item.label}</span>
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </>
                      )}
                    </button>

                    {/* Sub-menu */}
                    {sidebarOpen && (
                      <div
                        className={cn(
                          "ml-4 space-y-1 overflow-hidden transition-all duration-300",
                          isExpanded ? "max-h-40" : "max-h-0"
                        )}
                      >
                        {item.items.map((subItem) => (
                          <button
                            key={subItem.path}
                            onClick={() => {
                              onNavigate(subItem.path);
                              if (window.innerWidth < 1024) {
                                setSidebarOpen(false);
                              }
                            }}
                            onContextMenu={(e) => handleContextMenu(e, subItem)}
                            className={cn(
                              "flex items-center gap-3 w-full rounded-xl px-3 py-2 text-sm transition-colors",
                              currentPage === subItem.path
                                ? "text-white"
                                : "text-sky-600 hover:bg-sky-50"
                            )}
                            style={
                              currentPage === subItem.path
                                ? {
                                    background:
                                      "linear-gradient(135deg, #5B9BD5 0%, #4A8CC7 100%)",
                                  }
                                : {}
                            }
                          >
                            {subItem.icon}
                            <span>{subItem.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              return null;
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main
        className={cn(
          "transition-all duration-300 mt-16 min-h-[calc(100vh-4rem)] sm:px-6",
          sidebarOpen ? "lg:ml-64" : "lg:ml-20"
        )}
      >
        <div className="p-4 sm:p-6">{children}</div>
      </main>
    </div>
  );
};
