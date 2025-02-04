// src/models/workoutSessionModel.ts
import { Schema, model, Document } from 'mongoose';

export interface SessionActivity {
  id: string;
  type: 'Lift' | 'Cardio';
  name: string;
  sets: Array<{
    reps: number;
    weight: number;
    previous?: { reps: number; weight: number };
  }>;
}

export interface WorkoutSessionDocument extends Document {
  userId: number;
  // Optionally reference the workout template
  templateId?: string;
  date: Date;
  duration: number; // in seconds
  activities: SessionActivity[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SessionActivitySchema = new Schema<SessionActivity>(
  {
    id: { type: String, required: true },
    type: { type: String, required: true, enum: ['Lift', 'Cardio'] },
    name: { type: String, required: true },
    sets: [
      {
        reps: { type: Number, required: true },
        weight: { type: Number, required: true },
        previous: {
          reps: Number,
          weight: Number,
        },
      },
    ],
  },
  { _id: false },
);

const WorkoutSessionSchema = new Schema<WorkoutSessionDocument>(
  {
    userId: { type: Number, required: true },
    templateId: { type: String },
    date: { type: Date, required: true },
    duration: { type: Number, required: true },
    activities: [SessionActivitySchema],
    notes: { type: String },
  },
  { timestamps: true },
);

export default model<WorkoutSessionDocument>('WorkoutSession', WorkoutSessionSchema);
