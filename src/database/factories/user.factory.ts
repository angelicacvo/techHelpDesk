import { setSeederFactory } from 'typeorm-extension';
import { User } from '../../users/entities/user.entity';
import { UserRole } from '../../common/enums/user-role.enum';
import * as bcrypt from 'bcrypt';

export default setSeederFactory(User, (faker) => {
  const user = new User();
  user.name = faker.person.fullName();
  user.email = faker.internet.email().toLowerCase();
  user.password = bcrypt.hashSync('Password123!', 10);
  user.role = faker.helpers.arrayElement([
    UserRole.CLIENT,
    UserRole.TECHNICIAN,
  ]);
  user.isActive = faker.datatype.boolean(0.9);
  return user;
});
