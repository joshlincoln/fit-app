import apiClient from './api';

export interface Activity {
  _id: string;
  type: 'Lift' | 'Cardio';
  name: string;
  defaultSets?: { reps: number; weight: number }[];
}

export interface CreateActivityRequest {
  type: 'Lift' | 'Cardio';
  name: string;
  defaultSets?: { reps: number; weight: number }[];
}

export const getActivities = async (): Promise<Activity[]> => {
  const response = await apiClient.get<Activity[]>('/activities');
  return response.data;
};

export const createActivity = async (data: CreateActivityRequest): Promise<Activity> => {
  const response = await apiClient.post<Activity>('/activities', data);
  return response.data;
};
