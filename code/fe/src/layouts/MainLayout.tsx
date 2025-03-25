import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import CustomHeader from "@/components/custom-header";
import { RoleProvider } from "@/context/role-provider";

const MainLayout = () => {
  return (
    <div className="w-screen">
      <SidebarProvider>
        <RoleProvider>
          <AppSidebar />
          <main className="flex-1 pr-2 my-6">
            <CustomHeader />
            <Outlet />
          </main>
        </RoleProvider>
      </SidebarProvider>
    </div>
  );
};

export default MainLayout;
