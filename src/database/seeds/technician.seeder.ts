import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Technician } from '../../technicians/entities/technician.entity';
import { User } from '../../users/entities/user.entity';
import { UserRole } from '../../common/enums/user-role.enum';
import { faker } from '@faker-js/faker';

export default class TechnicianSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const technicianRepository = dataSource.getRepository(Technician);
    const userRepository = dataSource.getRepository(User);

    const techUser = await userRepository.findOne({
      where: { email: 'tecnico@techhelpdesk.com' },
    });

    if (techUser) {
      const existingTech = await technicianRepository.findOne({
        where: { user: { id: techUser.id } },
      });

      if (!existingTech) {
        const technician = technicianRepository.create({
          name: techUser.name,
          specialty: 'Soporte General',
          availability: true,
          user: techUser,
        });
        await technicianRepository.save(technician);
        console.log('Main technician profile created');
      }
    }

    const otherTechs = await userRepository.find({
      where: { role: UserRole.TECHNICIAN },
    });

    const specialties = [
      'Hardware',
      'Software',
      'Redes',
      'Seguridad',
      'Base de Datos',
      'Cloud Computing',
      'Soporte General',
    ];

    let count = 0;
    for (const user of otherTechs) {
      const existing = await technicianRepository.findOne({
        where: { user: { id: user.id } },
      });

      if (!existing) {
        const technician = technicianRepository.create({
          name: user.name,
          specialty: faker.helpers.arrayElement(specialties),
          availability: faker.datatype.boolean(0.7),
          user,
        });
        await technicianRepository.save(technician);
        count++;
      }
    }

    console.log(`${count} technician profiles created`);
    console.log('Technician seeding completed');
  }
}
