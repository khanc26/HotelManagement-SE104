import { UserTypeEnum } from 'src/users/enums/user-type.enum';

export const UserTypeMockData: Array<{
  type_name: UserTypeEnum;
  description: string;
}> = [
  {
    type_name: UserTypeEnum.FOREIGN,
    description:
      'Represents a foreign customer or guest, typically from outside the country.',
  },
  {
    type_name: UserTypeEnum.LOCAL,
    description:
      'Represents a local customer or guest, typically from within the country.',
  },
];
