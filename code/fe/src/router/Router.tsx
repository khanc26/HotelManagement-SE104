import { ProfileEdit } from "@/features/profile/profile-edit";
import { MyProfile } from "@/features/profile/profile-my-profile";
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
import { RoleBasedRoutes } from "@/features/auth/components/role-based-routes";
import InvoicePage from "@/pages/InvoicesPage";
import { InvoiceList } from "@/features/invoice/components/invoice-list";
import { InvoiceDetail } from "@/features/invoice/components/invoice-detail";
import LandingLayout from "@/layouts/LandingLayout";
import HomePage from "@/pages/landing/HomePage";
import NotFound from "@/pages/NotFound";
import ReportPage from "@/pages/ReportPage";
import { ReportList } from "@/features/report/components/report-list";
import { ReportDetail } from "@/features/report/components/report-detail";
import { UserRoomList } from "@/features/room/components/view-user/room-list";
import { Role } from "@/types/role";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import UserRoomPage from "@/pages/UserRoomPage";

const RootPath = () => {
  const [role] = useLocalStorage("role", null);

  if (role === Role.ADMIN) {
    return <DashboardPage />;
  } else if (role === Role.USER) {
    return <UserRoomList />;
  }

  return <ErrorPage />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoutes>
        <RoleBasedRoutes allowedRoles={[Role.ADMIN, Role.USER]}>
          <MainLayout />
        </RoleBasedRoutes>
      </PrivateRoutes>
    ),
    children: [
      {
        index: true,
        element: <RootPath />,
      },
      // Admin routes
      {
        path: "dashboard",
        element: (
          <RoleBasedRoutes allowedRoles={[Role.ADMIN]}>
            <DashboardPage />
          </RoleBasedRoutes>
        ),
      },
      {
        path: "rooms",
        element: (
          <RoleBasedRoutes allowedRoles={[Role.ADMIN]}>
            <RoomsPage />
          </RoleBasedRoutes>
        ),
        children: [
          {
            index: true,
            element: <RoomList />,
          },
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
        element: (
          <RoleBasedRoutes allowedRoles={[Role.ADMIN]}>
            <UsersPage />
          </RoleBasedRoutes>
        ),
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
        path: "bookings",
        element: (
          <RoleBasedRoutes allowedRoles={[Role.ADMIN]}>
            <BookingsPage />
          </RoleBasedRoutes>
        ),
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
        element: (
          <RoleBasedRoutes allowedRoles={[Role.ADMIN]}>
            <InvoicePage />
          </RoleBasedRoutes>
        ),
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
        path: "reports",
        element: (
          <RoleBasedRoutes allowedRoles={[Role.ADMIN]}>
            <ReportPage />
          </RoleBasedRoutes>
        ),
        children: [
          {
            index: true,
            element: <ReportList />,
          },
          {
            path: "list",
            element: <ReportList />,
          },
          {
            path: ":id",
            element: <ReportDetail />,
          },
        ],
      },
      // User routes
      {
        path: "user-rooms",
        element: (
          <RoleBasedRoutes allowedRoles={[Role.USER]}>
            <UserRoomPage />
          </RoleBasedRoutes>
        ),
        children: [
          {
            index: true,
            element: <UserRoomList />,
          },
          {
            path: "list",
            element: <UserRoomList />,
          },
        ],
      },
      {
        path: "profile",
        element: (
          <RoleBasedRoutes allowedRoles={[Role.USER]}>
            <ProfilePage />
          </RoleBasedRoutes>
        ),
        children: [
          {
            path: "my-profile",
            element: <MyProfile />,
          },
          {
            path: "edit",
            element: <ProfileEdit />,
          },
        ],
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
  {
    path: "/landing",
    element: <LandingLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
