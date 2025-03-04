import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

const MainLayout = () => {
  return (
    <div className="w-screen">
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1">
          <Outlet />
          <Outlet />
          <Outlet />
          <Outlet />
          <Outlet />
          <Outlet />
          <Outlet />
          <Outlet />
        </main>
      </SidebarProvider>
    </div>
  );
};

export default MainLayout;
