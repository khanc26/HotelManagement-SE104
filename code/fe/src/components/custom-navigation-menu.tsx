import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useLocation } from "react-router-dom";

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
  const location = useLocation();
  const currentPath = location.pathname.split("/").pop() || menuItems[0].url;

  return (
    <Tabs value={currentPath} className={className}>
      <TabsList className="flex w-fit gap-2">
        {menuItems.map((item) => (
          <TabsTrigger key={item.url} value={item.url} asChild className="px-6">
            <Link to={item.url}>{item.title}</Link>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
