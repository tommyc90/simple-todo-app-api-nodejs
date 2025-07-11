import { Schema, model } from 'mongoose';

export interface TodoDataInterface {
  title: string;
  isDone: boolean;
}

const TodoSchema = new Schema<TodoDataInterface>({
  title: { type: String, required: true },
  isDone: { type: Boolean, required: true },
});

export const Todo = model('Todo', TodoSchema);
