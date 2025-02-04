import { Exercise } from './exercise';

// src/services/workoutService.ts

// A TemplateActivity is stored as part of a workout template. It references an Exercise
// by its _id. Depending on the type of exercise, it can store default sets (for lifts)
// or default duration/unit (for cardio).
export interface TemplateActivity {
  exercise: string; // Must be a valid Exercise _id
  defaultSets?: { reps: number; weight: number }[];
  defaultDuration?: number;
  defaultUnit?: string;
}

export interface WorkoutTemplate {
  _id: string;
  userId: number;
  name: string;
  description?: string;
  activities: TemplateActivity[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkoutTemplateRequest {
  userId: number;
  name: string;
  description?: string;
  activities: TemplateActivity[];
}
