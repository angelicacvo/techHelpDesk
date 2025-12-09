import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Client } from '../../clients/entities/client.entity';
import { User } from '../../users/entities/user.entity';
import { UserRole } from '../../common/enums/user-role.enum';
import { faker } from '@faker-js/faker';

export default class ClientSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const clientRepository = dataSource.getRepository(Client);
    const userRepository = dataSource.getRepository(User);

    const clientUser = await userRepository.findOne({
      where: { email: 'cliente@techhelpdesk.com' },
    });

    if (clientUser) {
      const existingClient = await clientRepository.findOne({
        where: { user: { id: clientUser.id } },
      });

      if (!existingClient) {
        const client = clientRepository.create({
          name: clientUser.name,
          contactEmail: clientUser.email,
          company: 'Tech Solutions Inc.',
          user: clientUser,
        });
        await clientRepository.save(client);
        console.log('Main client profile created');
      }
    }

    const otherClients = await userRepository.find({
      where: { role: UserRole.CLIENT },
    });

    let count = 0;
    for (const user of otherClients) {
      const existing = await clientRepository.findOne({
        where: { user: { id: user.id } },
      });

      if (!existing) {
        const client = clientRepository.create({
          name: user.name,
          contactEmail: user.email,
          company: faker.company.name(),
          user,
        });
        await clientRepository.save(client);
        count++;
      }
    }

    console.log(`${count} client profiles created`);
    console.log('Client seeding completed');
  }
}
