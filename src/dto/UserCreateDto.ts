import { IsString, IsStrongPassword, Length } from 'class-validator';

export class UserCreateDto {
  @IsString()
  @Length(1, 100)
  public readonly username!: string;

  @IsString()
  @IsStrongPassword({ minLength: 6 })
  public readonly password!: string;

  constructor(partial: Partial<UserCreateDto>) {
    Object.assign(this, partial);
  }
}
