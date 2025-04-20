import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { LogOut, User } from "lucide-react";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clearAuthLocalStorage } from "@/utils/helpers/clearAuthLocalStorage";
import { toast } from "react-toastify";

const signOut = async () => {
  const response = await fetch("http://localhost:3001/auth/sign-out", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to sign out");
  }

  return response.json();
};

const CustomHeader = () => {
  const queryClient = useQueryClient();

  const location = useLocation();
  const navigate = useNavigate();
  const pathSegments = location.pathname
    .split("/")
    .filter((segment) => segment);

  const mutation = useMutation({
    mutationKey: ["signOut"],
    mutationFn: signOut,
    onSuccess: () => {
      clearAuthLocalStorage();
      queryClient.clear();
      toast.success("Signed out successfully");
      navigate("/auth/sign-in");
    },
    onError: (error: unknown) => {
      console.error("Sign-out failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(`Failed to sign out: ${errorMessage}`);
    },
  });

  const handleLogOut = () => {
    mutation.mutate();
  };

  return (
    <div className="mx-6 pr-2 flex justify-between items-center">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <SidebarTrigger className="text-black bg-white" />
          <BreadcrumbSeparator>|</BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>

          {pathSegments.map((segment, index) => {
            const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
            const isLast = index === pathSegments.length - 1;

            return (
              <React.Fragment key={path}>
                <BreadcrumbSeparator />

                <BreadcrumbItem>
                  {isLast ? (
                    // For the last segment, display as a page, not a link
                    <BreadcrumbPage>
                      {segment.charAt(0).toUpperCase() + segment.slice(1)}
                    </BreadcrumbPage>
                  ) : (
                    // For other segments, create a link
                    <BreadcrumbLink href={path}>
                      {segment.charAt(0).toUpperCase() + segment.slice(1)}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="hover:cursor-pointer hover:opacity-50">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/profile/my-profile")}>
              <User />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleLogOut()}>
              <LogOut />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default CustomHeader;
