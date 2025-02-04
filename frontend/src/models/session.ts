export interface SessionSet {
    reps: number;
    weight: number;
    previous?: { reps: number; weight: number };
  }
  

export interface SessionActivity {
  id: string;
  type: 'Lift' | 'Cardio';
  name: string;
  sets: SessionSet[];
}

export interface WorkoutSession {
  _id: string;
  userId: number;
  templateId?: string;
  date: string;
  duration: number;
  activities: SessionActivity[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkoutSessionRequest {
  userId: number;
  templateId?: string;
  date: string; // ISO string
  duration: number;
  activities: SessionActivity[];
  notes?: string;
}