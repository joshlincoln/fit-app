export interface Exercise {
  _id: string;
  name: string;
  type: 'Lift' | 'Cardio';
  defaultSets?: { reps: number; weight: number }[];
  defaultDuration?: number;
  defaultUnit?: string;
}

export interface CreateExerciseRequest {
  name: string;
  type: 'Lift' | 'Cardio';
  defaultSets?: { reps: number; weight: number }[];
  defaultDuration?: number;
  defaultUnit?: string;
}
