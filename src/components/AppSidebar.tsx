import { NavLink as RouterNavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  ListTodo,
  ClipboardList,
  LogOut,
  CheckSquare,
} from "lucide-react";
import { useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { toast } from "sonner";

export function AppSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const location = useLocation();

  const collapsed = state === "collapsed";

  const isAdmin = user?.role === "admin";

  const navItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      show: isAdmin,
    },
    { title: "Tasks", url: "/tasks", icon: ListTodo, show: isAdmin },
    { title: "My Tasks", url: "/my-tasks", icon: ClipboardList, show: true },
  ].filter((item) => item.show);

  const handleLogout = () => {
    toast("Confirm Logout", {
      description: "You will be logged out of your account. and Users",
      action: {
        label: "Yes",
        onClick: () => {
          logout();
          navigate("/login");
          toast.success("Logged out successfully");
        },
      },
      cancel: {
        label: "No",
        onClick: () => {},
      },

      style: {
        background: "#f8d4d4",
      },

      className: "bg-red-600 text-white border-none",
    });
  };

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-muted px-4 py-6 mb-2">
            {!collapsed && (
              <div className="flex items-center gap-2">
                <CheckSquare className="h-6 w-6 text-sidebar-primary" />
                <span className="text-lg font-heading font-bold text-sidebar-foreground">
                  TaskFlow
                </span>
              </div>
            )}
            {collapsed && (
              <CheckSquare className="h-5 w-5 text-sidebar-primary" />
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  location.pathname === item.url ||
                  location.pathname.startsWith(item.url + "/");

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <RouterNavLink
                        to={item.url}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                          isActive
                            ? "bg-sidebar-accent text-sidebar-foreground font-medium"
                            : "text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                        }`}
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </RouterNavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-3">
        {!collapsed && user && (
          <div className="px-3 py-2 mb-2">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user.name}
            </p>
            <p className="text-xs text-sidebar-muted truncate">{user.email}</p>
          </div>
        )}
        <SidebarMenuButton
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sidebar-muted hover:text-destructive hover:bg-sidebar-accent/50 transition-colors w-full"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
