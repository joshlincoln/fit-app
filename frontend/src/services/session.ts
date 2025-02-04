import { CreateWorkoutSessionRequest, WorkoutSession } from "../models/session";
import apiClient from "./api";




export const getSessions = async (): Promise<WorkoutSession[]> => {
    const response = await apiClient.get<WorkoutSession[]>('/sessions');
    return response.data;
  };
  
  export const createSession = async (
    data: CreateWorkoutSessionRequest
  ): Promise<WorkoutSession> => {
    const response = await apiClient.post<WorkoutSession>('/sessions', data);
    return response.data;
  };