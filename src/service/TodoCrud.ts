import { Todo } from '../data/Todo.js';
import { TodoCreateDto } from '../dto/TodoCreateDto.js';
import { TodoDto } from '../dto/TodoDto.js';
import { TodoUpdateDto } from '../dto/TodoUpdateDto.js';

class TodoCrud {
  public async findAll(): Promise<Array<TodoDto>> {
    const todos = await Todo.find().exec();
    return todos.map((todo) => TodoDto.fromDataModel(todo));
  }

  public async findOneById(id: string): Promise<TodoDto | null> {
    const todo = await Todo.findById(id).exec();
    return todo && TodoDto.fromDataModel(todo);
  }

  public async create(createDto: TodoCreateDto): Promise<TodoDto> {
    const todo = await Todo.create({
      title: createDto.title,
      isDone: false,
    });
    return TodoDto.fromDataModel(todo);
  }

  public async update(id: string, updateDto: TodoUpdateDto): Promise<TodoDto | null> {
    const todo = await Todo.findByIdAndUpdate(
      id,
      {
        $set: {
          title: updateDto.title,
          isDone: updateDto.isDone,
        },
      },
      { new: true },
    ).exec();
    return todo && TodoDto.fromDataModel(todo);
  }

  public async delete(id: string): Promise<TodoDto | null> {
    const todo = await Todo.findByIdAndDelete(id).exec();
    return todo && TodoDto.fromDataModel(todo);
  }
}

export const todoCrud = new TodoCrud();
