import { CustomNavigationMenu } from "@/components/custom-navigation-menu";
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
      <CustomNavigationMenu menuItems={menuItems} className="mb-4" />

      <Outlet />
    </div>
  );
};

export default RoomsPage;
