import { CustomNavigationMenu } from "@/components/custom-navigation-menu";
import { Outlet } from "react-router";

const menuItems = [
   {
      title: "Configuration",
      url: "list",
   },
   {
      title: "Edit",
      url: "edit",
   },
   {
      title: "History",
      url: "history",
   }
];

const ConfigurationPage = () => {
   return (
      <div className="px-8 py-6">
        
      <CustomNavigationMenu menuItems={menuItems} className="mb-4" />

      <Outlet />
    </div>
   );
};

export default ConfigurationPage; 