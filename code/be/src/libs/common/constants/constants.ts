export const SESSION_MAX_AGE = 1000 * 60 * 60;
export const MAX_GUESTS_PER_ROOM = 'max_guests_per_room';
export const FOREIGN_GUEST_FACTOR = 'foreign_guest_factor';
export const SURCHARGE_RATE = 'surcharge_rate';
export const ROOM_A_PRICE = 150000;
export const ROOM_B_PRICE = 170000;
export const ROOM_C_PRICE = 200000;
export const DEFAULT_MAX_GUESTS = 3;

export interface IUser {
  email: string;
  password: string;
  fullName: string;
  nationality: string;
  dob: string;
  phoneNumber: string;
  address: string;
  identityNumber: string;
  type: string;
}
