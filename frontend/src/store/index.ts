import { create } from 'zustand';

interface WorkoutState {
  workouts: any[];
  addWorkout: (workout: any) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const useWorkoutStore = create<WorkoutState>((set) => ({
  workouts: [],
  addWorkout: (workout) => set((state) => ({ workouts: [...state.workouts, workout] })),
  isDarkMode: false,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode }))
}));
