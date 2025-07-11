import { IsBoolean, IsString, Length } from 'class-validator';

export class TodoUpdateDto {
  @IsString()
  @Length(1, 100)
  public readonly title!: string;

  @IsBoolean()
  public readonly isDone!: boolean;

  constructor(partial: Partial<TodoUpdateDto>) {
    Object.assign(this, partial);
  }
}
