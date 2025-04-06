// Enum for Role
export enum Role {
  ADMIN = "admin",
  USER = "user",
  GUESS = "guess"
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
  dob: string; //
}
