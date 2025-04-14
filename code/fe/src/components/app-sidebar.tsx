import { useRole } from "@/hooks/useRole";
import { Role } from "@/types/user.type";
import { BedDouble, BookUser, Home, NotebookPen, UserCog } from "lucide-react";
import { CustomSidebarHeader } from "./custom-sidebar-header";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";

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
      icon: BookUser,
    },
    {
      title: "Users",
      url: "/users/list",
      icon: BookUser,
    },
    {
      title: "Bookings",
      url: "/bookings/list",
      icon: NotebookPen,
    },
  ],
  [Role.USER]: [
    {
      title: "Rooms",
      url: "/rooms/list",
      icon: BedDouble,
    },
    {
      title: "Profile",
      url: "/profile",
      icon: UserCog,
    },
  ],
};

export function AppSidebar() {
  const { role } = useRole();
  console.log("THIS IS ROLE", role as string);
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
