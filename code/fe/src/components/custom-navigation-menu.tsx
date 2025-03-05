import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { NavLink } from "react-router-dom";

const items = [
  {
    title: "Room List",
    url: "list",
  },
  {
    title: "Add New Room",
    url: "add",
  },
];

export function CustomNavigationMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {items.map((item) => (
          <NavigationMenuItem key={item.url}>
            <NavLink to={item.url}>{item.title}</NavLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
