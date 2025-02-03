// src/models/workout-model.ts
import mongoose, { Schema, Document } from 'mongoose';
import { Workout } from './workout';

export interface IWorkoutModel extends Omit<Workout, 'id'>, Document {}

const ExerciseSchema: Schema = new Schema({
  name: { type: String, required: true },
  sets: { type: Number, required: true },
  reps: { type: Number, required: true },
  weight: { type: Number }
});

const WorkoutSchema: Schema = new Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  exercises: { type: [ExerciseSchema], required: true }
});

export default mongoose.model<IWorkoutModel>('Workout', WorkoutSchema);
