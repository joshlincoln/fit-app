import { Schema, model, Document } from 'mongoose';

export interface ExerciseDocument extends Document {
  name: string;
  type: 'Lift' | 'Cardio';
  // For lifts, defaultSets can be provided.
  defaultSets?: Array<{ reps: number; weight: number }>;
  // For cardio, you might include a default duration and unit.
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
