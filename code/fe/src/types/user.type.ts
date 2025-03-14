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
  name: string;
  email: string;
  role: Role;
  password: string;
  nationality: string;
  userType: UserType;
}
