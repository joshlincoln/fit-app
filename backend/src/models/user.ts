import { Schema, model, Document } from 'mongoose';

export interface UserDocument extends Document {
  email: string;
  name: string;
  provider: 'apple' | 'google';
  providerId: string;
}

const UserSchema = new Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    provider: { type: String, required: true, enum: ['apple', 'google'] },
    providerId: { type: String, required: true },
  },
  { timestamps: true }
);

export default model<UserDocument>('User', UserSchema);
