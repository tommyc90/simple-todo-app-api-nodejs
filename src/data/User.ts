import { Schema, model } from 'mongoose';

export interface UserDataInterface {
  username: string;
  password: string;
  createdAt: Date;
}

const UserSchema = new Schema<UserDataInterface>({
  username: { type: String, required: true, unique: true, },
  password: { type: String, required: true },
}, {
  timestamps: {
    updatedAt: false,
  },
});

export const User = model('User', UserSchema);
