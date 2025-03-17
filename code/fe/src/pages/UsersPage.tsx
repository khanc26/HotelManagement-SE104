import { CustomNavigationMenu } from "@/components/custom-navigation-menu";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router";

const menuItems = [
   {
      title: "User List",
      url: "list",
   },
   {
      title: "Add New User",
      url: "add",
   }
];

const UsersPage = () => {
   return (
      <div className="px-8 py-6">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <SidebarTrigger className="text-black bg-white" />
          <BreadcrumbSeparator>|</BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">User</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
          <BreadcrumbLink href="/users/list">Users</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <CustomNavigationMenu menuItems={menuItems} className="mb-4" />

      <Outlet />
    </div>
   );
};

export default UsersPage;