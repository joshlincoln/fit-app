export interface TemplateActivity {
    id: string;
    type: 'Lift' | 'Cardio';
    name: string;
    defaultSets?: { reps: number; weight: number }[];
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