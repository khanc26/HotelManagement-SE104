import { UserType } from 'src/modules/users/entities/user-type.entity';
import { setSeederFactory } from 'typeorm-extension';

export const UserTypeFactory = setSeederFactory(UserType, () => {
  return new UserType();
});
