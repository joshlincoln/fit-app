import { Schema, model, Document } from 'mongoose';

export interface TemplateActivity {
  exercise: string; // references an Exercise _id
  defaultSets?: { reps: number; weight: number }[];
  defaultDuration?: number;
  defaultUnit?: string;
}

export interface WorkoutTemplateDocument extends Document {
  userId: number;
  name: string;
  activities: TemplateActivity[];
  createdAt: Date;
  updatedAt: Date;
}

const TemplateActivitySchema = new Schema<TemplateActivity>(
  {
    exercise: { type: String, required: true },
    defaultSets: [
      {
        reps: { type: Number },
        weight: { type: Number },
      },
    ],
    defaultDuration: { type: Number },
    defaultUnit: { type: String },
  },
  { _id: false },
);

const WorkoutTemplateSchema = new Schema<WorkoutTemplateDocument>(
  {
    userId: { type: Number, required: true },
    name: { type: String, required: true },
    activities: { type: [TemplateActivitySchema], default: [] },
  },
  { timestamps: true },
);

export default model<WorkoutTemplateDocument>('WorkoutTemplate', WorkoutTemplateSchema);
