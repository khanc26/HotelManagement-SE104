// Enum for Role
export enum Role {
  ADMIN = "admin",
  USER = "user",
  SUPER_ADMIN = "superadmin",
}

// Enum for UserType
export enum UserType {
  FOREIGN = "foreign",
  LOCAL = "local",
}

export interface RoleInterface {
  roleName: Role;
}

export interface UserTypeInterface {
  typeName: UserType;
}

// Type for User
export interface User {
  id: string;
  email: string;
  profile: Profile;
  role: RoleInterface;
  userType: UserTypeInterface;
}
export interface Profile {
  id: string;
  fullName: string;
  nationality: string;
  status: "active" | "inactive";
  dob: string | Date;
  phoneNumber: string;
  address: string;
  identityNumber: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface UserSearchRequest {
  fullName?: string;
  roleName?: string;
  email?: string;
  address?: string;
  nationality?: string;
  userTypeName?: UserType;
  identityNumber?: string;
  status?: "active" | "inactive";
  dob?: string | Date;
}

export interface UserUpdateRequest {
  email?: string;
  fullName?: string;
  nationality?: string;
  dob?: Date;
  phoneNumber?: string;
  address?: string;
  identityNumber?: string;
}

export interface LockAccountDto {
  userIds: string[];
}