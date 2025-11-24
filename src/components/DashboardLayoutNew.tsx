import { ReactNode, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useSidebar } from '../contexts/SidebarContext';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  LayoutDashboard, 
  Plane, 
  Hotel, 
  MapPin, 
  Bus, 
  FileText, 
  Calendar, 
  Users, 
  DollarSign, 
  Receipt, 
  Shirt, 
  Wrench, 
  Package, 
  Heart, 
  UtensilsCrossed,
  LogOut,
  Menu,
  X,
  UserCheck,
  Shield,
  ChevronDown,
  Globe,
  Building2,
  FileStack,
  Briefcase,
  Clock,
  AlertCircle,
  Star,
  User,
  Anchor,
  Banknote,
  Flag,
  Home,
  Mail,
  CreditCard,
  Monitor,
  PlaneTakeoff,
  Search,
  Bell,
  Moon,
  Sun,
  PanelLeftClose,
  PanelLeft,
  Settings
} from 'lucide-react';
import { cn } from '../ui/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import logoImage from '../assets/receiptLogo.png';
import { canViewModule, hasUserManagementAccess, hasRoleManagementAccess, canManageModuleUsers } from '../utils/permissions';
import type { ModuleName } from '../types/permissions';
import { UserRole } from '../contexts/UserAuthContext';

interface DashboardLayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

interface MenuItem {
  label: string;
  icon: ReactNode;
  iconColor: string;
  iconBg: string;
  path: string;
  moduleName: ModuleName;
}

interface MenuCategory {
  id: string;
  label: string;
  color: string;
  items: MenuItem[];
}

// Define all menu categories with their respective items
const menuCategories: MenuCategory[] = [
  {
    id: 'operations',
    label: 'Operations Management',
    color: 'bg-blue-500',
    items: [
      { 
        label: 'TO Registration', 
        icon: <UserCheck className="w-4 h-4" />, 
        iconColor: 'text-green-600',
        iconBg: 'bg-green-50',
        path: 'to-registration', 
        moduleName: 'to-registration'
      },
      { 
        label: 'Tours', 
        icon: <Plane className="w-4 h-4" />, 
        iconColor: 'text-blue-600',
        iconBg: 'bg-blue-50',
        path: 'tours', 
        moduleName: 'tours'
      },
      { 
        label: 'Accommodation', 
        icon: <Hotel className="w-4 h-4" />, 
        iconColor: 'text-indigo-600',
        iconBg: 'bg-indigo-50',
        path: 'accommodation', 
        moduleName: 'accommodation'
      },
      { 
        label: 'Ziyarat', 
        icon: <MapPin className="w-4 h-4" />, 
        iconColor: 'text-purple-600',
        iconBg: 'bg-purple-50',
        path: 'ziyarat', 
        moduleName: 'ziyarat'
      },
      { 
        label: 'Transport', 
        icon: <Bus className="w-4 h-4" />, 
        iconColor: 'text-orange-600',
        iconBg: 'bg-orange-50',
        path: 'transport', 
        moduleName: 'transport'
      },
      { 
        label: 'Visa (Muwafiqa)', 
        icon: <FileText className="w-4 h-4" />, 
        iconColor: 'text-teal-600',
        iconBg: 'bg-teal-50',
        path: 'visa', 
        moduleName: 'visa-processing'
      }
    ]
  },
  {
    id: 'finance',
    label: 'Finance Management',
    color: 'bg-green-500',
    items: [
      { 
        label: 'Accounts', 
        icon: <Receipt className="w-4 h-4" />, 
        iconColor: 'text-green-600',
        iconBg: 'bg-green-50',
        path: 'accounts', 
        moduleName: 'accounts'
      },
      { 
        label: 'Loans', 
        icon: <DollarSign className="w-4 h-4" />, 
        iconColor: 'text-emerald-600',
        iconBg: 'bg-emerald-50',
        path: 'loans', 
        moduleName: 'loans'
      },
      { 
        label: 'Mannat Niyaz - Create', 
        icon: <Heart className="w-4 h-4" />, 
        iconColor: 'text-rose-600',
        iconBg: 'bg-rose-50',
        path: 'mannat', 
        moduleName: 'mannat-niyaz'
      },
      { 
        label: 'Mannat Niyaz - Dashboard', 
        icon: <Receipt className="w-4 h-4" />, 
        iconColor: 'text-pink-600',
        iconBg: 'bg-pink-50',
        path: 'mannat-dashboard', 
        moduleName: 'mannat-niyaz'
      }
    ]
  },
  {
    id: 'staff',
    label: 'Staff Management',
    color: 'bg-violet-500',
    items: [
      { 
        label: 'HR Management', 
        icon: <Users className="w-4 h-4" />, 
        iconColor: 'text-violet-600',
        iconBg: 'bg-violet-50',
        path: 'hr', 
        moduleName: 'hr-management'
      },
      { 
        label: 'Leave Management', 
        icon: <Calendar className="w-4 h-4" />, 
        iconColor: 'text-purple-600',
        iconBg: 'bg-purple-50',
        path: 'leave', 
        moduleName: 'leave-management'
      }
    ]
  },
  {
    id: 'facility',
    label: 'Facility Management',
    color: 'bg-amber-500',
    items: [
      { 
        label: 'Housekeeping', 
        icon: <Home className="w-4 h-4" />, 
        iconColor: 'text-amber-600',
        iconBg: 'bg-amber-50',
        path: 'housekeeping', 
        moduleName: 'housekeeping'
      },
      { 
        label: 'Laundry Services', 
        icon: <Shirt className="w-4 h-4" />, 
        iconColor: 'text-cyan-600',
        iconBg: 'bg-cyan-50',
        path: 'laundry', 
        moduleName: 'laundry'
      },
      { 
        label: 'Maintenance', 
        icon: <Wrench className="w-4 h-4" />, 
        iconColor: 'text-orange-600',
        iconBg: 'bg-orange-50',
        path: 'maintenance', 
        moduleName: 'maintenance'
      },
      { 
        label: 'Inventory', 
        icon: <Package className="w-4 h-4" />, 
        iconColor: 'text-slate-600',
        iconBg: 'bg-slate-50',
        path: 'inventory', 
        moduleName: 'inventory'
      },
      { 
        label: 'Mawaid', 
        icon: <UtensilsCrossed className="w-4 h-4" />, 
        iconColor: 'text-red-600',
        iconBg: 'bg-red-50',
        path: 'mawaid', 
        moduleName: 'mawaid'
      }
    ]
  },
  {
    id: 'masters',
    label: 'Master Data Management',
    color: 'bg-sky-500',
    items: [
      { 
        label: 'City & Country Master', 
        icon: <Globe className="w-4 h-4" />, 
        iconColor: 'text-green-600',
        iconBg: 'bg-green-50',
        path: 'country-city-master', 
        moduleName: 'country-city-master'
      },
      { 
        label: 'Venue Master', 
        icon: <Building2 className="w-4 h-4" />, 
        iconColor: 'text-orange-600',
        iconBg: 'bg-orange-50',
        path: 'venue-master', 
        moduleName: 'venue-master'
      },
      { 
        label: 'Document Master', 
        icon: <FileStack className="w-4 h-4" />, 
        iconColor: 'text-purple-600',
        iconBg: 'bg-purple-50',
        path: 'document-master', 
        moduleName: 'document-master'
      },
      { 
        label: 'Port Master', 
        icon: <Anchor className="w-4 h-4" />, 
        iconColor: 'text-yellow-600',
        iconBg: 'bg-yellow-50',
        path: 'port-master', 
        moduleName: 'port-master'
      },
      { 
        label: 'Tour Operator Type', 
        icon: <Briefcase className="w-4 h-4" />, 
        iconColor: 'text-blue-600',
        iconBg: 'bg-blue-50',
        path: 'to-type-master', 
        moduleName: 'to-type-master'
      },
      { 
        label: 'Cutoff Configuration', 
        icon: <Clock className="w-4 h-4" />, 
        iconColor: 'text-red-600',
        iconBg: 'bg-red-50',
        path: 'cutoff-config', 
        moduleName: 'cutoff-config'
      },
      { 
        label: 'General Master', 
        icon: <Settings className="w-4 h-4" />, 
        iconColor: 'text-blue-600',
        iconBg: 'bg-blue-50',
        path: 'general-master', 
        moduleName: 'general-master'
      },
      { 
        label: 'Transport Master', 
        icon: <Bus className="w-4 h-4" />, 
        iconColor: 'text-indigo-600',
        iconBg: 'bg-indigo-50',
        path: 'transport-master', 
        moduleName: 'transport-master'
      },
      { 
        label: 'Currency Master', 
        icon: <Banknote className="w-4 h-4" />, 
        iconColor: 'text-emerald-600',
        iconBg: 'bg-emerald-50',
        path: 'currency-master', 
        moduleName: 'currency-master'
      },
      { 
        label: 'Nationality Master', 
        icon: <Flag className="w-4 h-4" />, 
        iconColor: 'text-indigo-600',
        iconBg: 'bg-indigo-50',
        path: 'nationality-master', 
        moduleName: 'nationality-master'
      },
      { 
        label: 'Family Master', 
        icon: <Users className="w-4 h-4" />, 
        iconColor: 'text-violet-600',
        iconBg: 'bg-violet-50',
        path: 'family-master', 
        moduleName: 'family-master'
      },
      { 
        label: 'Flight Master', 
        icon: <PlaneTakeoff className="w-4 h-4" />, 
        iconColor: 'text-sky-600',
        iconBg: 'bg-sky-50',
        path: 'flight-master', 
        moduleName: 'flight-master'
      },
      { 
        label: 'Email Template Master', 
        icon: <Mail className="w-4 h-4" />, 
        iconColor: 'text-pink-600',
        iconBg: 'bg-pink-50',
        path: 'email-template-master', 
        moduleName: 'email-template-master'
      },
      { 
        label: 'Visa Fee Master', 
        icon: <CreditCard className="w-4 h-4" />, 
        iconColor: 'text-teal-600',
        iconBg: 'bg-teal-50',
        path: 'visa-fee-master', 
        moduleName: 'visa-fee-master'
      },
      { 
        label: 'Age Rule Master', 
        icon: <Calendar className="w-4 h-4" />, 
        iconColor: 'text-rose-600',
        iconBg: 'bg-rose-50',
        path: 'age-rule-master', 
        moduleName: 'visa-fee-master'
      },
      { 
        label: 'Pack Threshold Master', 
        icon: <Users className="w-4 h-4" />, 
        iconColor: 'text-cyan-600',
        iconBg: 'bg-cyan-50',
        path: 'pack-threshold-master', 
        moduleName: 'visa-fee-master'
      },
      { 
        label: 'Package Master', 
        icon: <Package className="w-4 h-4" />, 
        iconColor: 'text-purple-600',
        iconBg: 'bg-purple-50',
        path: 'package-master', 
        moduleName: 'package-master'
      }
    ]
  },
  {
    id: 'system',
    label: 'System Administration',
    color: 'bg-red-500',
    items: [
      { 
        label: 'User Management', 
        icon: <Users className="w-4 h-4" />, 
        iconColor: 'text-blue-600',
        iconBg: 'bg-blue-50',
        path: 'user-management', 
        moduleName: 'user-management'
      },
      { 
        label: 'Role Management', 
        icon: <Shield className="w-4 h-4" />, 
        iconColor: 'text-red-600',
        iconBg: 'bg-red-50',
        path: 'role-management', 
        moduleName: 'role-management'
      }
    ]
  }
];

export function DashboardLayoutNew({ children, currentPage, onNavigate }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { sidebarCollapsed, toggleSidebar } = useSidebar();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

// normalize role -> "super-admin" or "admin" etc.
const rawRole = (user?.role || 'tour-operator').toString();
const normalizedRole = rawRole.trim().toLowerCase().replace(/\s+/g, '-'); // "Super Admin" -> "super-admin"
const userRole = normalizedRole as UserRole;


  
  // Filter categories and items based on user permissions and search query
  const filteredCategories = menuCategories
    .map(category => ({
      ...category,
      items: category.items.filter(item => {
        // First check permissions
        let hasPermission = false;
        if (item.moduleName === 'user-management') {
          hasPermission = hasUserManagementAccess(userRole);
        } else if (item.moduleName === 'role-management') {
          hasPermission = hasRoleManagementAccess(userRole);
        } else {
          hasPermission = canViewModule(userRole, item.moduleName);
        }
        
        // If no permission, don't show
        if (!hasPermission) return false;
        
        // If there's a search query, filter by it
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          return (
            item.label.toLowerCase().includes(query) ||
            item.moduleName.toLowerCase().includes(query) ||
            category.label.toLowerCase().includes(query)
          );
        }
        
        return true;
      })
    }))
    .filter(category => category.items.length > 0);

  // Get all favorite items (filtered by search if applicable)
  const allItems = menuCategories
    .flatMap(category => category.items)
    .filter(item => {
      // Check permissions first
      let hasPermission = false;
      if (item.moduleName === 'user-management') {
        hasPermission = hasUserManagementAccess(userRole);
      } else if (item.moduleName === 'role-management') {
        hasPermission = hasRoleManagementAccess(userRole);
      } else {
        hasPermission = canViewModule(userRole, item.moduleName);
      }
      return hasPermission && isFavorite(item.path);
    });
  
  const favoriteItems = searchQuery.trim() 
    ? allItems.filter(item => {
        const query = searchQuery.toLowerCase();
        return item.label.toLowerCase().includes(query) || item.moduleName.toLowerCase().includes(query);
      })
    : allItems;

  // Check if user can manage users for at least one module
  const showUserManagement = hasUserManagementAccess(userRole);
  const showRoleManagement = hasRoleManagementAccess(userRole);

  const handleLogout = () => {
    logout();
  };

  const handleNavigation = (path: string) => {
    onNavigate(path);
    setSidebarOpen(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen bg-background pattern-bg flex">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed top-0 left-0 z-40 h-screen bg-white border-r border-gray-200 overflow-y-auto transition-all duration-300",
          // Desktop: sticky sidebar with collapse support
          "lg:sticky",
          // Width based on collapse state and screen size
          sidebarCollapsed && !sidebarOpen ? "lg:w-16" : "w-64",
          // Mobile: slide in/out
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo Section */}
        <div className={cn(
          "p-5 border-b border-gray-200 flex items-center",
          sidebarCollapsed && !sidebarOpen ? "justify-center" : "gap-3 justify-between"
        )}>
          <div className="flex items-center gap-3">
            {(sidebarCollapsed && !sidebarOpen) ? (
              <img src={logoImage} alt="FHIMS Logo" className="w-8 h-8" />
            ) : (
              <>
                <img src={logoImage} alt="FHIMS Logo" className="w-10 h-10" />
                <div>
                  <h1 className="text-sky-900 text-lg">FHIMS</h1>
                  <p className="text-xs text-gray-500">Faiz E Husaini - Iraq</p>
                </div>
              </>
            )}
          </div>
          {/* Close button for mobile */}
          {sidebarOpen && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* Search Bar */}
        {(!sidebarCollapsed || sidebarOpen) && (
          <div className="px-3 pt-3 pb-2 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-8 py-2 text-sm border-gray-300 focus:border-sky-400 focus:ring-sky-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5 text-gray-400" />
                </button>
              )}
            </div>
            {searchQuery && (
              <div className="mt-2 text-xs text-gray-600 px-1">
                {filteredCategories.reduce((acc, cat) => acc + cat.items.length, 0)} result(s) found
              </div>
            )}
          </div>
        )}

        <div className="py-3 px-3 space-y-1">
          {/* Dashboard - Standalone */}
          <button
            onClick={() => handleNavigation('dashboard')}
            className={cn(
              "w-full flex items-center rounded-lg transition-all",
              (sidebarCollapsed && !sidebarOpen) ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5 text-left",
              currentPage === 'dashboard'
                ? "bg-sky-50 text-sky-900"
                : "hover:bg-gray-50 text-gray-700"
            )}
            title={(sidebarCollapsed && !sidebarOpen) ? "Dashboard" : ""}
          >
            <div className={cn("p-1.5 rounded-lg", "bg-sky-50")}>
              <LayoutDashboard className="w-4 h-4 text-sky-600" />
            </div>
            {(!sidebarCollapsed || sidebarOpen) && (
              <>
                <span className="text-sm">Dashboard</span>
                {currentPage === 'dashboard' && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-sky-500" />
                )}
              </>
            )}
          </button>

          {/* Favorites Section */}
          {favoriteItems.length > 0 && (!sidebarCollapsed || sidebarOpen) && (
            <div className="pt-4 pb-2">
              <div className="px-3 mb-2">
                <div className="flex items-center gap-2">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Favorites</span>
                </div>
              </div>
              {favoriteItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-lg transition-all mb-1",
                    currentPage === item.path
                      ? "bg-sky-50 text-sky-900"
                      : "hover:bg-gray-50 text-gray-700"
                  )}
                >
                  <div className={cn("p-1.5 rounded-lg", item.iconBg)}>
                    {item.icon}
                  </div>
                  <span className="text-sm">{item.label}</span>
                  {currentPage === item.path && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-sky-500" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Menu Categories */}
          {(!sidebarCollapsed || sidebarOpen) ? (
            filteredCategories.length > 0 ? (
              <Accordion type="multiple" defaultValue={[]} className="pt-2">
                {filteredCategories.map((category) => (
                  <AccordionItem key={category.id} value={category.id} className="border-0">
                    <AccordionTrigger className="hover:no-underline py-2 px-3 hover:bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", category.color)} />
                        <span className="text-sm text-gray-700">{category.label}</span>
                        {searchQuery && (
                          <Badge variant="secondary" className="ml-auto text-xs">
                            {category.items.length}
                          </Badge>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-2 pt-1">
                      <div className="space-y-1">
                        {category.items.map((item) => (
                          <div key={item.path} className="relative group">
                            <button
                              onClick={() => handleNavigation(item.path)}
                              className={cn(
                                "w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-lg transition-all",
                                currentPage === item.path
                                  ? "bg-sky-50 text-sky-900"
                                  : "hover:bg-gray-50 text-gray-700"
                              )}
                            >
                              <div className={cn("p-1.5 rounded-lg", item.iconBg)}>
                                {item.icon}
                              </div>
                              <span className="text-sm flex-1">{item.label}</span>
                              {currentPage === item.path && (
                                <div className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                              )}
                            </button>
                            <button
                              onClick={() => toggleFavorite(item)}
                              className={cn(
                                "absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity",
                                isFavorite(item.path) ? "text-amber-500" : "text-gray-400 hover:text-amber-500"
                              )}
                              title={isFavorite(item.path) ? "Remove from favorites" : "Add to favorites"}
                            >
                              <Star className={cn("w-3.5 h-3.5", isFavorite(item.path) && "fill-current")} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : searchQuery ? (
              <div className="pt-8 pb-6 px-3 text-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <Search className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-900">No results found</p>
                    <p className="text-xs text-gray-500">
                      Try searching with different keywords
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchQuery('')}
                    className="mt-2 text-sky-600 hover:text-sky-700 hover:bg-sky-50"
                  >
                    Clear search
                  </Button>
                </div>
              </div>
            ) : null
          ) : (
            // Collapsed sidebar - show icons only (desktop only)
            <div className="space-y-1 pt-2 hidden lg:block">
              {filteredCategories.flatMap(category => category.items).map((item) => (
                <div key={item.path} className="relative">
                  <button
                    onClick={() => handleNavigation(item.path)}
                    className={cn(
                      "w-full flex items-center justify-center px-2 py-2.5 rounded-lg transition-all",
                      currentPage === item.path
                        ? "bg-sky-50 text-sky-900"
                        : "hover:bg-gray-50 text-gray-700"
                    )}
                    title={item.label}
                  >
                    <div className={cn("p-1.5 rounded-lg", item.iconBg)}>
                      {item.icon}
                    </div>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 w-full lg:w-auto">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-3 sm:px-4 lg:px-6 py-3">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden shrink-0"
              >
                <Menu className="w-5 h-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="hidden lg:flex shrink-0"
              >
                {sidebarCollapsed ? (
                  <PanelLeft className="w-5 h-5" />
                ) : (
                  <PanelLeftClose className="w-5 h-5" />
                )}
              </Button>

              <div className="relative hidden md:block flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full h-9"
                />
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="hidden sm:flex">
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>

              <Button variant="ghost" size="icon" className="relative hidden sm:flex">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-1 sm:gap-2 h-9 px-2 sm:px-3">
                    <Avatar className="w-7 h-7">
                      <AvatarFallback className="bg-sky-100 text-sky-700 text-xs">
                        {user?.name.split(' ').map(n => n[0]).join('') || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden xl:block text-left">
                      <p className="text-sm">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.role}</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div>
                      <p className="text-sm">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleNavigation('profile')}>
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavigation('settings')}>
                    <Monitor className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-3 sm:p-4 lg:p-6 w-full">
          <div className="max-w-full">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
