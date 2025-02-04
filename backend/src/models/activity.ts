import { Schema, model, Document } from 'mongoose';

export interface ActivityDocument extends Document {
  type: 'Lift' | 'Cardio';
  name: string;
  defaultSets?: Array<{
    reps: number;
    weight: number;
  }>;
}

const ActivitySchema = new Schema<ActivityDocument>(
  {
    type: { type: String, required: true, enum: ['Lift', 'Cardio'] },
    name: { type: String, required: true, unique: true },
    defaultSets: [
      {
        reps: { type: Number, required: true },
        weight: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default model<ActivityDocument>('Activity', ActivitySchema);
