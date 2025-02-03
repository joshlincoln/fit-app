import axios from 'axios';

const api = axios.create({ baseURL: 'http://YOUR_BACKEND_URL/api' });

export const getWorkouts = async () => {
  const response = await api.get('/workouts');
  return response.data;
};

export const createWorkout = async (workout: { name: string; date: string }) => {
  const response = await api.post('/workouts', workout);
  return response.data;
};
