import { CustomNavigationMenu } from "@/components/custom-navigation-menu";
import { Outlet } from "react-router";

const menuItems = [
  {
    title: "User List",
    url: "list",
  },
  // {
  //   title: "Add New User",
  //   url: "add",
  // },
];

const UsersPage = () => {
  return (
    <div className="px-8 py-6">
      <CustomNavigationMenu menuItems={menuItems} className="mb-4" />

      <Outlet />
    </div>
  );
};

export default UsersPage;
