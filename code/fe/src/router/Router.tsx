import { RoomAddNew } from "@/features/room/components/room-add";
import { RoomEdit } from "@/features/room/components/room-edit";
import { RoomList } from "@/features/room/components/room-list";
import { UserAddNew } from "@/features/user/user-add";
import { UserEdit } from "@/features/user/user-edit";
import { UserList } from "@/features/user/user-list";
import UsersPage from "@/pages/UsersPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import DashboardPage from "../pages/DashboardPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import PasswordResetSuccessPage from "../pages/PasswordResetSuccessPage";
import ProfilePage from "../pages/ProfilePage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import RoomsPage from "../pages/RoomsPage";
import SettingsPage from "../pages/SettingsPage";
import SignInPage from "../pages/SignInPage";
import SignUpPage from "../pages/SignUpPage";
import VerifyOTPPage from "../pages/VerifyOTPPage";
import ErrorPage from "@/pages/ErrorPage";
import NotAuthenticated from "@/pages/NotAuthenticated";
import BookingsPage from "@/pages/BookingsPage";
import { BookingList } from "@/features/booking/components/booking-list";
import { BookingDetailList } from "@/features/booking/components/booking-detail-list";
import { BookingDetail } from "@/features/booking-detail/components/booking-detail";
import { BookingDetailEdit } from "@/features/booking-detail/components/booking-detail-edit";
import { PrivateRoutes } from "@/features/auth/components/private-routes";
import InvoicePage from "@/pages/InvoicesPage";
import { InvoiceList } from "@/features/invoice/components/invoice-list";
import { InvoiceDetail } from "@/features/invoice/components/invoice-detail";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoutes>
        <MainLayout />
      </PrivateRoutes>
    ),
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
        path: "bookings",
        element: <BookingsPage />,
        children: [
          {
            index: true,
            element: <BookingList />,
          },
          {
            path: "list",
            element: <BookingList />,
          },
          {
            path: ":id",
            element: <BookingDetailList />,
          },
          {
            path: ":id/:detailId",
            element: <BookingDetail />,
          },
          {
            path: ":id/:detailId/edit",
            element: <BookingDetailEdit />,
          },
        ],
      },
      {
        path: "invoices",
        element: <InvoicePage />,
        children: [
          {
            index: true,
            element: <InvoiceList />,
          },
          {
            path: "list",
            element: <InvoiceList />,
          },
          {
            path: ":id",
            element: <InvoiceDetail />,
          },
        ],
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "users",
        element: <UsersPage />,
        children: [
          {
            path: "list",
            element: <UserList />,
          },
          {
            path: "add",
            element: <UserAddNew />,
          },
          {
            path: "edit",
            element: <UserEdit />,
          },
        ],
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
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "error",
        element: <ErrorPage />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "not-authenticated",
        element: <NotAuthenticated />,
      },
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
