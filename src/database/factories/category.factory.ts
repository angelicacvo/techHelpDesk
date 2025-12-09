import { setSeederFactory } from 'typeorm-extension';
import { Category } from '../../categories/entities/category.entity';

export default setSeederFactory(Category, (faker) => {
  const category = new Category();
  category.name = faker.helpers.arrayElement([
    'Solicitud',
    'Incidente de Hardware',
    'Incidente de Software',
    'Consulta General',
    'Mantenimiento',
  ]);
  category.description = faker.lorem.sentence();
  return category;
});
