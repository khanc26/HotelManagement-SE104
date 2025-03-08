import { RoleEnum } from 'src/users/enums/role.enum';

export const roleMockData: Array<{ role_name: RoleEnum; description: string }> =
  [
    {
      role_name: RoleEnum.ADMIN,
      description:
        'Role for managing users, configuring settings, and overseeing system operations.',
    },
    {
      role_name: RoleEnum.USER,
      description:
        'Role for accessing and interacting with system features and data.',
    },
  ];
