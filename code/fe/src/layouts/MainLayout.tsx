import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";

const MainLayout = () => {
  return (
    <div className="flex flex-row h-screen w-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 bg-blue-100">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
