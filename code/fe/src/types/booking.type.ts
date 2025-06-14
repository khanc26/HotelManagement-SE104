export interface Participant {
  email: string;
  fullName: string;
  address: string;
  identityNumber: string;
  userType: "local" | "foreign";
}

export interface Booking {
  id: string;
  roomNumber: string;
  checkInDate: Date;
  checkOutDate: Date;
  booker: {
    email: string;
    fullName: string;
  };
  participants: Participant[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
