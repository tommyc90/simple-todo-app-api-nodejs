import { IsString, Length } from 'class-validator';

export class TodoCreateDto {
  @IsString()
  @Length(1, 100)
  public readonly title!: string;

  constructor(partial: Partial<TodoCreateDto>) {
    Object.assign(this, partial);
  }
}
