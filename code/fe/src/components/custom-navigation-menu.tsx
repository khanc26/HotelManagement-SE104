import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { NavLink } from "react-router-dom";
import { Button } from "./ui/button";

interface CustomNavigationMenuProps {
  className?: string;
  menuItems: {
    title: string;
    url: string;
  }[];
}

export function CustomNavigationMenu({
  className,
  menuItems,
}: CustomNavigationMenuProps) {
  return (
    <NavigationMenu className={className}>
      <NavigationMenuList>
        {menuItems.map((item) => (
          <NavLink
            to={item.url}
            key={item.url}
            className={({ isActive }) =>
              isActive ? "rounded-md bg-primary text-white" : "rounded-md"
            }
          >
            <NavigationMenuItem>
              <Button
                variant={"ghost"}
                className="w-full !border-[1px] !border-slate-200"
              >
                {item.title}
              </Button>
            </NavigationMenuItem>
          </NavLink>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
