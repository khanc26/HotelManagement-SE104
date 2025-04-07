import { RoleEnum } from 'src/modules/users/enums/role.enum';

export const roleMockData: Array<{ roleName: RoleEnum; description: string }> =
  [
    {
      roleName: RoleEnum.ADMIN,
      description:
        'Role for managing users, configuring settings, and overseeing system operations.',
    },
    {
      roleName: RoleEnum.USER,
      description:
        'Role for accessing and interacting with system features and data.',
    },
  ];
