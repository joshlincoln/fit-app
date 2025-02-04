// The overall structure linking a user to their workouts
interface UserWorkout {
    userId: number;
    workouts: Workout[];
  }
  
  // Represents a single workout session
  interface Workout {
    id: string;             // Unique identifier for the workout
    date: string;           // ISO 8601 date string
    duration: number;       // Total workout duration in seconds
    activities: Activity[];
    notes?: string;         // Optional notes for the workout
    createdAt?: string;     // Optional created timestamp
    updatedAt?: string;     // Optional updated timestamp
  }
  
  // Define the possible activity types
  type ActivityType = 'Lift' | 'Cardio';
  
  // Common fields for any activity
  interface BaseActivity {
    id: string;
    type: ActivityType;
    name: string;
    duration?: number;      // Duration in seconds if applicable
  }
  
  // For lift activities, each set has its own details
  interface LiftSet {
    reps: number;
    weight: number;
    previous?: {
      reps: number;
      weight: number;
    };
  }
  
  // Lift activities include an array of sets and specify a weight unit
  interface LiftActivity extends BaseActivity {
    type: 'Lift';
    sets: LiftSet[];
    weightUnit: 'kg' | 'lbs'; // Unit for the weight measurement
  }
  
  // Cardio activities can include distance and pace information, with a specified distance unit
  interface CardioActivity extends BaseActivity {
    type: 'Cardio';
    distance?: number;        // e.g., total distance covered (in the unit specified)
    pace?: number;            // e.g., seconds per kilometer or minute per mile, as defined by your app logic
    distanceUnit: 'km' | 'mi'; // Unit for distance measurement
  }
  
  // Union type for activity, discriminated by the 'type' field
  type Activity = LiftActivity | CardioActivity;
  