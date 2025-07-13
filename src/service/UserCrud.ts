import { User } from '../data/User.js';
import { UserCreateDto } from '../dto/UserCreateDto.js';
import { UserDto } from '../dto/UserDto.js';
import { userAuth } from './UserAuth.js';

class UserCrud {
  public async findOneById(id: string): Promise<UserDto | null> {
    const user = await User.findById(id).exec();
    return user && UserDto.fromDataModel(user);
  }

  public async create(createDto: UserCreateDto): Promise<UserDto> {
    const user = await User.create({
      username: createDto.username,
      password: await userAuth.createPasswordHash(createDto.password),
    });
    return UserDto.fromDataModel(user);
  }
}

export const userCrud = new UserCrud();
