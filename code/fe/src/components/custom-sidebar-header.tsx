import { Link } from "react-router-dom";
import { SidebarHeader } from "./ui/sidebar";
import { ChevronsUpDown, Hotel } from "lucide-react";

export function CustomSidebarHeader() {
  return (
    <SidebarHeader className="p-2">
      <div className="p-2 hover:bg-slate-200 rounded-sm">
        <Link
          to="#"
          className="flex flex-row gap-2 items-center hover:text-black"
        >
          <Hotel size={40} className="bg-black rounded-sm text-white p-1" />
          <div className="flex flex-col items-start">
            <p className="text-base font-semibold">Hotel Management</p>
            <p className="text-sm font-light">A simple application</p>
          </div>
          <ChevronsUpDown absoluteStrokeWidth />
        </Link>
      </div>
    </SidebarHeader>
  );
}
