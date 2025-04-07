import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Navigate } from "react-router";

type PrivateRoutesProps = {
  children: React.ReactNode;
};

export function PrivateRoutes({ children }: PrivateRoutesProps) {
  const [storedValue] = useLocalStorage("access_token", null);

  // Render children only if authenticated, otherwise return null
  return storedValue !== null ? (
    <>{children}</>
  ) : (
    <Navigate to="/not-authenticated" />
  );
}
