import { Calendar, Home, Inbox, Settings } from "lucide-react";
import { useRole } from "@/hooks/useRole";
import { Role } from "@/types/user.type";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { CustomSidebarHeader } from "./custom-sidebar-header";

const menuItems = {
  [Role.ADMIN]: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Rooms",
      url: "/rooms/list",
      icon: Inbox,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
  ],
  [Role.USER]: [
    {
      title: "Rooms",
      url: "/rooms/list",
      icon: Inbox,
    },
    {
      title: "Profile",
      url: "/profile",
      icon: Calendar,
    },
  ],
};

export function AppSidebar() {
  const { role } = useRole();
  const items = menuItems[role];

  return (
    <Sidebar>
      <CustomSidebarHeader />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}