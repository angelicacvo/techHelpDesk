import 'reflect-metadata';
import { AppDataSource } from './data-source';
import { runSeeders } from 'typeorm-extension';

AppDataSource.initialize()
  .then(async () => {
    console.log('Data Source has been initialized!');

    await runSeeders(AppDataSource);

    console.log('Seeding process finished!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error during Data Source initialization or seeding:', error);
    process.exit(1);
  });
