import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { User } from '../../users/entities/user.entity';
import { UserRole } from '../../common/enums/user-role.enum';
import * as bcrypt from 'bcrypt';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const userRepository = dataSource.getRepository(User);
    const userFactory = factoryManager.get(User);

    const existingAdmin = await userRepository.findOne({
      where: { email: 'admin@techhelpdesk.com' },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('Admin123!', 10);
      const admin = userRepository.create({
        name: 'Admin User',
        email: 'admin@techhelpdesk.com',
        password: hashedPassword,
        role: UserRole.ADMIN,
        isActive: true,
      });
      await userRepository.save(admin);
      console.log('Admin user created');
    }

    const existingTech = await userRepository.findOne({
      where: { email: 'tecnico@techhelpdesk.com' },
    });

    if (!existingTech) {
      const hashedPassword = await bcrypt.hash('Tech123!', 10);
      const technician = userRepository.create({
        name: 'Juan Pérez',
        email: 'tecnico@techhelpdesk.com',
        password: hashedPassword,
        role: UserRole.TECHNICIAN,
        isActive: true,
      });
      await userRepository.save(technician);
      console.log('Technician user created');
    }

    const existingClient = await userRepository.findOne({
      where: { email: 'cliente@techhelpdesk.com' },
    });

    if (!existingClient) {
      const hashedPassword = await bcrypt.hash('Client123!', 10);
      const client = userRepository.create({
        name: 'María García',
        email: 'cliente@techhelpdesk.com',
        password: hashedPassword,
        role: UserRole.CLIENT,
        isActive: true,
      });
      await userRepository.save(client);
      console.log('Client user created');
    }

    await userFactory.saveMany(5, {
      role: UserRole.TECHNICIAN,
      isActive: true,
    });

    await userFactory.saveMany(5, {
      role: UserRole.CLIENT,
      isActive: true,
    });

    const totalUsers = await userRepository.count();
    console.log(`User seeding completed - Total users: ${totalUsers}`);
  }
}
