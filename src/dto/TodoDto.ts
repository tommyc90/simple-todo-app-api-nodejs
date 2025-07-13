import { HydratedDocument } from 'mongoose';
import { TodoDataInterface } from '../data/Todo.js';
import { IsBoolean, IsString } from 'class-validator';

export class TodoDto {
  @IsString()
  public readonly id!: string;
  @IsString()
  public readonly title!: string;
  @IsBoolean()
  public readonly isDone!: boolean;
  @IsString()
  public readonly userId!: string;

  constructor(partial: Partial<TodoDto>) {
    Object.assign(this, partial);
  }

  public static fromDataModel(dataModel: HydratedDocument<TodoDataInterface>): TodoDto {
    return new TodoDto({
      id: dataModel._id.toString(),
      title: dataModel.title,
      isDone: dataModel.isDone,
      userId: dataModel.userId.toString(),
    });
  }
}
