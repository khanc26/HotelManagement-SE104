import { UserTypeEnum } from 'src/modules/users/enums/user-type.enum';

export const UserTypeMockData: Array<{
  typeName: UserTypeEnum;
  description: string;
  surcharge_factor: number;
}> = [
  {
    typeName: UserTypeEnum.FOREIGN,
    description:
      'Represents a foreign customer or guest, typically from outside the country.',
    surcharge_factor: 1.5,
  },
  {
    typeName: UserTypeEnum.LOCAL,
    description:
      'Represents a local customer or guest, typically from within the country.',
    surcharge_factor: 1.0,
  },
];
