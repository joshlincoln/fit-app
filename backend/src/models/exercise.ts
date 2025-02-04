import { Schema, model, Document } from 'mongoose';

export interface ExerciseDocument extends Document {
  name: string;
  type: 'Lift' | 'Cardio';
  defaultSets?: Array<{ reps: number; weight: number }>;
  defaultDuration?: number;
  defaultUnit?: string;
}

const ExerciseSchema = new Schema<ExerciseDocument>(
  {
    name: { type: String, required: true, unique: true },
    type: { type: String, required: true, enum: ['Lift', 'Cardio'] },
    defaultSets: [
      {
        reps: { type: Number, required: true },
        weight: { type: Number, required: true },
      },
    ],
    defaultDuration: { type: Number },
    defaultUnit: { type: String },
  },
  { timestamps: true },
);

export default model<ExerciseDocument>('Exercise', ExerciseSchema);
