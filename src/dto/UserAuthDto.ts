import { IsString } from 'class-validator';

export class UserAuthDto {
  @IsString()
  public readonly username!: string;

  @IsString()
  public readonly password!: string;

  constructor(partial: Partial<UserAuthDto>) {
    Object.assign(this, partial);
  }
}
