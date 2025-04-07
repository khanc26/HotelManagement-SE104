import { ReactNode, useState } from "react";
import { RoleContext } from "./role-context";
import { Role } from "@/types/user.type";
import { useNavigate } from "react-router";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export function RoleProvider({
  children,
}: {
  children: ReactNode;
  initialRole?: Role;
}) {
  const navigate = useNavigate();

  const [roleVal] = useLocalStorage("role", null);

  if (!roleVal) {
    navigate("/");
  }

  const [role, setRole] = useState<Role>(roleVal as Role);

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}
