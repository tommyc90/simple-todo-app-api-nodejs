import bcrypt from 'bcrypt';
import { User } from '../data/User.js';
import { UserAuthDto } from '../dto/UserAuthDto.js';
import { UserDto } from '../dto/UserDto.js';

class UserAuth {
  public async authenticate(authDto: UserAuthDto): Promise<UserDto | null> {
    const user = await User.findOne({ username: authDto.username }).exec();
    if (user === null) {
      return null;
    }

    const isPasswordValid = await this.comparePassword(authDto.password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return UserDto.fromDataModel(user);
  }

  public createPasswordHash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  public comparePassword(rawPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(rawPassword, hashedPassword);
  }
}

export const userAuth = new UserAuth();
