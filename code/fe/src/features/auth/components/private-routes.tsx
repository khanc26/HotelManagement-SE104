import { Navigate, Outlet } from "react-router";

export function PrivateRoutes() {
  const auth = { token: true };
  return auth.token ? <Outlet /> : <Navigate to="/auth/sign-in" />;
}