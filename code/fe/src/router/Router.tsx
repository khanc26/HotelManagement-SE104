import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import RoomsPage from "../pages/RoomsPage";
import ProfilePage from "../pages/ProfilePage";
import SettingsPage from "../pages/SettingsPage";
import { RoomList } from "@/features/room/components/room-list";
import { RoomAddNew } from "@/features/room/components/room-add";
import { RoomEdit } from "@/features/room/components/room-edit";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "rooms",
        element: <RoomsPage />,
        children: [
          {
            path: "list",
            element: <RoomList />,
          },
          {
            path: "add",
            element: <RoomAddNew />,
          },
          {
            path: "edit",
            element: <RoomEdit />,
          },
        ],
      },
      {
        path: "users",
        element: <ProfilePage />,
      },
      {
        path: "rents",
        element: <SettingsPage />,
      },
      {
        path: "regulations",
        element: <SettingsPage />,
      },
      {
        path: "room-types",
        element: <SettingsPage />,
      },
      {
        path: "month-revenue",
        element: <SettingsPage />,
      },
      {
        path: "invoices",
        element: <SettingsPage />,
      },
      {
        path: "",
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
    ],
  },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
