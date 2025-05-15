import { Link } from "react-router-dom";
import { SidebarHeader } from "./ui/sidebar";
import { ChevronsUpDown, Hotel } from "lucide-react";

export function CustomSidebarHeader() {
  return (
    <SidebarHeader className="p-2">
      <div className="p-2 hover:bg-slate-200 rounded-sm">
        <Link
          to="/landing"
          className="flex flex-row justify-between items-center hover:text-black hover:cursor-pointer"
        >
          <Hotel size={40} className="bg-black rounded-sm text-white p-1" />
          <div className="flex flex-col items-start">
            <p className="text-base font-semibold">Hotel Management</p>
            <p className="text-sm font-light">A simple application</p>
          </div>
          <ChevronsUpDown size={16} className="justify-self-end" />
        </Link>
      </div>
    </SidebarHeader>
  );
}
