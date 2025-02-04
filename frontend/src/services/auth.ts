// src/services/authService.ts
import { AppleAuthRequest, AuthResponse, GoogleAuthRequest } from '../models/auth';
import apiClient from './api';



export const googleSignIn = async (data: GoogleAuthRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/google', data);
  return response.data;
};

export const appleSignIn = async (data: AppleAuthRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/apple', data);
  return response.data;
};
