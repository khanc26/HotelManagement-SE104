import { ReactNode, useState } from 'react';
import { RoleContext } from './role-context';
import { Role } from '@/types/user.type';

export function RoleProvider({ children, initialRole = Role.USER }: { children: ReactNode, initialRole?: Role }) {
  const [role, setRole] = useState<Role>(initialRole);

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}