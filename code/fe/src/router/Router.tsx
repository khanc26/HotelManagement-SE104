import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import SignInPage from "../pages/SignInPage";
import DashboardPage from "../pages/DashboardPage";
import RoomsPage from "../pages/RoomsPage";
import ProfilePage from "../pages/ProfilePage";
import SettingsPage from "../pages/SettingsPage";
import { RoomList } from "@/features/room/components/room-list";
import { RoomAddNew } from "@/features/room/components/room-add";
import { RoomEdit } from "@/features/room/components/room-edit";
import SignUpPage from "../pages/SignUpPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import VerifyOTPPage from "../pages/VerifyOTPPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import PasswordResetSuccessPage from "../pages/PasswordResetSuccessPage";

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
      {
        path: "profile",
        element: <ProfilePage />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "sign-in",
        element: <SignInPage />,
      },
      {
        path: "sign-up",
        element: <SignUpPage />,
      },
      {
        path: "forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "verify-otp",
        element: <VerifyOTPPage />,
      },
      {
        path: "reset-password",
        element: <ResetPasswordPage />,
      },
      {
        path: "password-reset-success",
        element: <PasswordResetSuccessPage />,
      },
    ],
  },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
