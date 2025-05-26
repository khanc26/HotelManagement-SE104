import { useRole } from "@/hooks/useRole";
import { Role } from "@/types/user.type";
import {
  Bed,
  BedDouble,
  BookUser,
  ChartNoAxesCombined,
  Home,
  NotebookPen,
  Receipt,
  SettingsIcon,
  UserCog
} from "lucide-react";
import { CustomSidebarHeader } from "./custom-sidebar-header";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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
      icon: Bed,
    },
    {
      title: "Users",
      url: "/users/list",
      icon: BookUser,
    },
    {
      title:"Room Types",
      url:"/room-types/list",
      icon: BookUser,
    },
    {
      title: "Bookings",
      url: "/bookings/list",
      icon: NotebookPen,
    },
    {
      title: "Invoices",
      url: "/invoices/list",
      icon: Receipt,
    },
    {
      title: "Reports",
      url: "/reports/list",
      icon: ChartNoAxesCombined,
    },
    {
      title: "Configuration",
      url: "/configuration/list",
      icon: SettingsIcon,
    }
  ],
  [Role.USER]: [
    {
      title: "Book rooms",
      url: "/user-rooms",
      icon: BedDouble,
    },
    {
      title: "Profile",
      url: "/profile/my-profile",
      icon: UserCog,
    },
    {
      title: "Invoices",
      url: "/user-invoices",
      icon: Receipt,
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
                  <SidebarMenuButton asChild className="py-6">
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
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
