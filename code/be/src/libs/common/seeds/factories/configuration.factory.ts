import { Configuration } from 'src/modules/configurations/entities';
import { setSeederFactory } from 'typeorm-extension';

export const ConfigurationFactory = setSeederFactory(Configuration, () => {
  return new Configuration();
});
