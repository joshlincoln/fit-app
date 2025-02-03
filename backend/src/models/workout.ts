// src/models/Workout.ts
export interface Exercise {
    name: string;
    sets: number;
    reps: number;
    weight?: number;
  }
  
  export interface Workout {
    id?: string;
    name: string;
    date: string;
    exercises: Exercise[];
  }
  