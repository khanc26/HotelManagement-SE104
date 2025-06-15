import { useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Navigate, useLocation } from "react-router-dom";

type PrivateRoutesProps = {
  children: React.ReactNode;
};

export function PrivateRoutes({ children }: PrivateRoutesProps) {
  const [storedValue] = useLocalStorage("access_token", null);
  const location = useLocation();
    
  useEffect(() => {}, [location.pathname, storedValue]);

  return storedValue ? (
    <>{children}</>
  ) : (
    <Navigate to="/auth/sign-in" replace state={{ from: location }} />
  );
}
