import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Navigate, useLocation } from "react-router-dom";

type RoleBasedRoutesProps = {
  children: React.ReactNode;
  allowedRoles: string[];
};

export function RoleBasedRoutes({
  children,
  allowedRoles,
}: RoleBasedRoutesProps) {
  const [access_token] = useLocalStorage("access_token", null);
  const [role] = useLocalStorage("role", null);
  const location = useLocation();

  if (!access_token) {
    return (
      <Navigate
        to="/auth/sign-in"
        replace
        state={{ from: location }}
      />
    );
  }

  console.log(allowedRoles.includes(role));

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/error" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
