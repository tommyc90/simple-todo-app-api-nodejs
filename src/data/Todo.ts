import { ObjectId, Schema, model } from 'mongoose';
import { User } from './User.js';

export interface TodoDataInterface {
  title: string;
  isDone: boolean;
  userId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TodoSchema = new Schema<TodoDataInterface>({
  title: { type: String, required: true },
  isDone: { type: Boolean, required: true },
  userId: { type: Schema.Types.ObjectId, required: true, ref: User, index: true },
}, {
  timestamps: true,
});

export const Todo = model('Todo', TodoSchema);
