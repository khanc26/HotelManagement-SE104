import { CustomNavigationMenu } from "@/components/custom-navigation-menu";
import { Outlet } from "react-router";

const menuItems = [
   {
      title: " My Profile",
      url: "my-profile",
   },
   {
      title: "Edit",
      url: "edit",
   }
];

const ProfilePage = () => {
   return (
      <div className="px-8 py-6">
        
      <CustomNavigationMenu menuItems={menuItems} className="mb-4" />

      <Outlet />
    </div>
   );
};

export default ProfilePage; 