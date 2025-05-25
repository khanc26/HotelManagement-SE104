export const SESSION_MAX_AGE = 1000 * 60 * 60;
export const MAX_GUESTS_PER_ROOM = 'max_guests_per_room';
export const FOREIGN_GUEST_FACTOR = 'foreign_guest_factor';
export const SURCHARGE_RATE = 'surcharge_rate';
export const ROOM_A_PRICE = 150000;
export const ROOM_B_PRICE = 170000;
export const ROOM_C_PRICE = 200000;
export const EMAILS_QUEUE = 'emails-queue';
export const BULLMQ_RETRY_LIMIT = 5;
export const BULLMQ_RETRY_DELAY = 5000;
export const DEFAULT_TTL_OTP_EXPIRED = 600000;

export enum EmailTemplateNameEnum {
  EMAIL_FORGET_PASSWORD = 'email-forget-password',
}

export const SUBJECT_EMAIL_MAP = {
  'email-forget-password': 'Reset Your Password',
};

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

export type VerifiedOtpPayload = {
  email: string;
  is_verified: boolean;
  otp: string;
};
