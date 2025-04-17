import { IUser } from 'src/libs/common/constants';

export const usersAdminMock: Array<IUser> = [
  {
    email: 'admin123@gmail.com',
    password: 'admin123',
    fullName: 'John Doe',
    nationality: 'England',
    dob: '2025-03-08T00:00:00Z',
    phoneNumber: '0123456789',
    address: '123 Main Street, London, England',
    identityNumber: '+12345522342',
    type: 'admin',
  },

  {
    email: 'superadmin123@gmail.com',
    password: 'superadmin123',
    fullName: 'Emily Hartman',
    nationality: 'Canada',
    dob: '1990-12-15T00:00:00Z',
    phoneNumber: '0987654321',
    address: '456 Maple Avenue, Toronto, Canada',
    identityNumber: 'CA987654321',
    type: 'superadmin',
  },
];
