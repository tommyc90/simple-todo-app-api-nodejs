import { HydratedDocument } from 'mongoose';
import { IsDateString, IsString } from 'class-validator';
import { UserDataInterface } from '../data/User.js';

export class UserDto {
  @IsString()
  public readonly id!: string;
  @IsString()
  public readonly username!: string;
  @IsDateString()
  public readonly createdAt!: string;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }

  public static fromDataModel(dataModel: HydratedDocument<UserDataInterface>): UserDto {
    return new UserDto({
      id: dataModel._id.toString(),
      username: dataModel.username,
      createdAt: dataModel.createdAt.toISOString(),
    });
  }
}
