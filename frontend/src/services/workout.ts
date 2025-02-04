import { CreateWorkoutTemplateRequest, WorkoutTemplate } from '../models/workout';
import apiClient from './api';

export const getTemplates = async (): Promise<WorkoutTemplate[]> => {
  const response = await apiClient.get<WorkoutTemplate[]>('/templates');
  return response.data;
};

export const createTemplate = async (
  data: CreateWorkoutTemplateRequest,
): Promise<WorkoutTemplate> => {
  const response = await apiClient.post<WorkoutTemplate>('/templates', data);
  return response.data;
};
