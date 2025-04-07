import { Role } from 'src/modules/users/entities/role.entity';
import { setSeederFactory } from 'typeorm-extension';

export const RoleFactory = setSeederFactory(Role, () => {
  return new Role();
});
