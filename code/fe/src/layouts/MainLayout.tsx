import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import CustomHeader from "@/components/custom-header";

const MainLayout = () => {
  return (
    <div className="w-screen">
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 pr-2 my-6">
          <CustomHeader />
          <Outlet />
        </main>
      </SidebarProvider>
    </div>
  );
};

export default MainLayout;
