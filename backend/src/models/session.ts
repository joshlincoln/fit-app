import { Schema, model, Document } from 'mongoose';

export interface SessionActivity {
  id: string; // exercise _id
  name: string; // exercise name
  type: 'Lift' | 'Cardio';
  sets: Array<{ reps: number; weight: number }>;
}

export interface SessionDocument extends Document {
  userId: number;
  templateId: string;
  date: Date;
  duration: number;
  activities: SessionActivity[];
  notes?: string;
}

const SessionActivitySchema = new Schema<SessionActivity>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true, enum: ['Lift', 'Cardio'] },
    sets: [
      {
        reps: { type: Number },
        weight: { type: Number },
      },
    ],
  },
  { _id: false },
);

const SessionSchema = new Schema<SessionDocument>(
  {
    userId: { type: Number, required: true },
    templateId: { type: String, required: true },
    date: { type: Date, required: true },
    duration: { type: Number, required: true },
    activities: { type: [SessionActivitySchema], required: true },
    notes: { type: String },
  },
  { timestamps: true },
);

export default model<SessionDocument>('Session', SessionSchema);
