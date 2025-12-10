import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { databaseConfig } from '../config/database.config';

export const dataSourceOptions: DataSourceOptions & SeederOptions = {
  ...databaseConfig,
  entities: ['src/**/*.entity.ts'],
  synchronize: true,
  dropSchema: true,
  seeds: ['src/database/seeds/**/*.seeder.ts'],
  factories: ['src/database/factories/**/*.factory.ts'],
};

export const AppDataSource = new DataSource(dataSourceOptions);
