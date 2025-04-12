// Enum for Role
export enum Role {
  ADMIN = "admin",
  USER = "user",
}

// Enum for UserType
export enum UserType {
  FOREIGN = "foreign",
  LOCAL = "local",
}

// Type for User
export interface User {
  id: string;
  fullname: string;
  role: Role;
  email: string;
  address: string;
  nationality: string;
  user_type: UserType;
  phone_number: string;
  identity_number: string;
  // password: string | null;
  dob: Date; //
}

export interface UserSearchRequest {
  fullName?: string;
  roleName?: string;
  email?: string;
  address?: string;
  nationality?: string;
  userTypeName?: UserType;
  identifyNumber?: string;
  status?: "active" | "inactive";
  dob?: Date;
}

export interface UserUpdateRequest {
  email?: string;
  fullName?: string;
  nationality?: string;
  status?: "active" | "inactive";
  dob?: Date;
  phoneNumber?: string;
  address?: string;
  identityNumber?: string;
}
