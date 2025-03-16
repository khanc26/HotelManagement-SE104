import { UserTypeEnum } from 'src/users/enums/user-type.enum';

export const UserTypeMockData: Array<{
  typeName: UserTypeEnum;
  description: string;
}> = [
  {
    typeName: UserTypeEnum.FOREIGN,
    description:
      'Represents a foreign customer or guest, typically from outside the country.',
  },
  {
    typeName: UserTypeEnum.LOCAL,
    description:
      'Represents a local customer or guest, typically from within the country.',
  },
];
