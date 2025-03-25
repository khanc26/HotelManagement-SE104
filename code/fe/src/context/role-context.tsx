import { createContext } from 'react';
import { Role } from '@/types/user.type';

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
}

export const RoleContext = createContext<RoleContextType | undefined>(undefined);