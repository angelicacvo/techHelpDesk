import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Category } from '../../categories/entities/category.entity';

export default class CategorySeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const categoryRepository = dataSource.getRepository(Category);

    const categories = [
      {
        name: 'Solicitud',
        description: 'Solicitudes generales de soporte técnico',
      },
      {
        name: 'Incidente de Hardware',
        description: 'Problemas relacionados con hardware y equipos físicos',
      },
      {
        name: 'Incidente de Software',
        description: 'Problemas relacionados con software y aplicaciones',
      },
      {
        name: 'Consulta General',
        description: 'Consultas sobre el uso de sistemas y procedimientos',
      },
      {
        name: 'Mantenimiento',
        description: 'Mantenimiento preventivo y correctivo de equipos',
      },
    ];

    for (const categoryData of categories) {
      const existing = await categoryRepository.findOne({
        where: { name: categoryData.name },
      });

      if (!existing) {
        const category = categoryRepository.create(categoryData);
        await categoryRepository.save(category);
        console.log(`Category created: ${categoryData.name}`);
      }
    }

    console.log('Category seeding completed');
  }
}
