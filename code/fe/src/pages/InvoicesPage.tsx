// import { CustomNavigationMenu } from "@/components/custom-navigation-menu";
import { Outlet } from "react-router-dom";

// const menuItems = [
//   {
//     title: "Booking List",
//     url: "list",
//   },
// ];

const InvoicePage = () => {
  return (
    <div className="px-8 py-6">
      {/* <CustomNavigationMenu menuItems={menuItems} className="mb-4" /> */}
      <Outlet />
    </div>
  );
};

export default InvoicePage;
