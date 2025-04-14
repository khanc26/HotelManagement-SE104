import { RoleEnum } from 'src/modules/users/enums/role.enum';

export const roleMockData: Array<{ roleName: RoleEnum; description: string }> =
  [
    {
      roleName: RoleEnum.SUPER_ADMIN,
      description:
        'Has full control over the system, including managing admins, critical configurations, and high-level operations.',
    },
    {
      roleName: RoleEnum.ADMIN,
      description:
        'Responsible for managing users, overseeing content, and handling operational settings within the system.',
    },
    {
      roleName: RoleEnum.USER,
      description:
        'Standard role with access to general system features and personal data management.',
    },
  ];
