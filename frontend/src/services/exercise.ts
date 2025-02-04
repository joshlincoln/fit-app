import { CreateExerciseRequest, Exercise } from '../models/exercise';
import apiClient from './api';

export const getExercises = async (): Promise<Exercise[]> => {
  const response = await apiClient.get<Exercise[]>('/exercises');
  return response.data;
};

export const createExercise = async (data: CreateExerciseRequest): Promise<Exercise> => {
  const response = await apiClient.post<Exercise>('/exercises', data);
  return response.data;
};
