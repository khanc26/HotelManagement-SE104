import AppDataSource from 'src/config/typeorm.config';
import { MainSeeder } from 'src/libs/common/seeds/main.seeder';
import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';

const options: DataSourceOptions & SeederOptions = {
  ...AppDataSource.options,
  seeds: [MainSeeder],
};

const datasource = new DataSource(options);

const initializeDataSource = async () => {
  try {
    await datasource.initialize();
    await runSeeders(datasource);
    process.exit();
  } catch (error) {
    console.error('Error during data source initialization or seeding:', error);
    process.exit(1);
  }
};

initializeDataSource().catch((err) => {
  console.error(err);
});
