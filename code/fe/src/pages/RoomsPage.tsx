import { CustomNavigationMenu } from "@/components/custom-navigation-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

const menuItems = [
  {
    title: "Room List",
    url: "list",
  },
  {
    title: "Add New Room",
    url: "add",
  },
];

const RoomsPage = () => {
  return (
    <div className="px-8 py-6">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <SidebarTrigger className="text-black bg-white" />
          <BreadcrumbSeparator>|</BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
          <BreadcrumbLink href="/rooms/list">Rooms</BreadcrumbLink>
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

export default RoomsPage;
