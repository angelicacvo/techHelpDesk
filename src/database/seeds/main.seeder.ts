import { DataSource } from 'typeorm';
import { runSeeders, Seeder } from 'typeorm-extension';
import UserSeeder from './user.seeder';
import CategorySeeder from './category.seeder';
import ClientSeeder from './client.seeder';
import TechnicianSeeder from './technician.seeder';
import TicketSeeder from './ticket.seeder';

export default class MainSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    console.log('Starting database seeding...\n');

    await runSeeders(dataSource, {
      seeds: [
        UserSeeder,
        CategorySeeder,
        ClientSeeder,
        TechnicianSeeder,
        TicketSeeder,
      ],
    });

    console.log('\nDatabase seeding completed successfully!');
  }
}
