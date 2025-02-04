// src/store/fitStore.ts
import { create } from 'zustand';
import {
  getTemplates,
  getSessions,
  getAnalytics,
  createTemplate as apiCreateTemplate,
  createSession as apiCreateSession,
  WorkoutTemplate,
  WorkoutSession,
  AnalyticsData,
  CreateWorkoutTemplateRequest,
  CreateWorkoutSessionRequest,
} from '../services/workout';

interface FitState {
  templates: WorkoutTemplate[];
  sessions: WorkoutSession[];
  analytics: AnalyticsData;
  loadingTemplates: boolean;
  loadingSessions: boolean;
  loadingAnalytics: boolean;
  error: string | null;
  fetchTemplates: () => Promise<void>;
  fetchSessions: () => Promise<void>;
  fetchAnalytics: () => Promise<void>;
  createTemplate: (data: CreateWorkoutTemplateRequest) => Promise<void>;
  createSession: (data: CreateWorkoutSessionRequest) => Promise<void>;
}

export const useFitStore = create<FitState>((set) => ({
  templates: [],
  sessions: [],
  analytics: {},
  loadingTemplates: false,
  loadingSessions: false,
  loadingAnalytics: false,
  error: null,
  fetchTemplates: async () => {
    set({ loadingTemplates: true });
    try {
      const templates = await getTemplates();
      set({ templates, error: null });
    } catch (error) {
      console.error(error);
      set({ error: 'Failed to load templates.' });
    } finally {
      set({ loadingTemplates: false });
    }
  },
  fetchSessions: async () => {
    set({ loadingSessions: true });
    try {
      const sessions = await getSessions();
      set({ sessions, error: null });
    } catch (error) {
      console.error(error);
      set({ error: 'Failed to load sessions.' });
    } finally {
      set({ loadingSessions: false });
    }
  },
  fetchAnalytics: async () => {
    set({ loadingAnalytics: true });
    try {
      const analytics = await getAnalytics();
      set({ analytics, error: null });
    } catch (error) {
      console.error(error);
      set({ error: 'Failed to load analytics.' });
    } finally {
      set({ loadingAnalytics: false });
    }
  },
  createTemplate: async (data: CreateWorkoutTemplateRequest) => {
    try {
      const newTemplate = await apiCreateTemplate(data);
      set((state) => ({ templates: [...state.templates, newTemplate] }));
    } catch (error) {
      console.error(error);
      set({ error: 'Failed to create template.' });
    }
  },
  createSession: async (data: CreateWorkoutSessionRequest) => {
    try {
      const newSession = await apiCreateSession(data);
      set((state) => ({ sessions: [...state.sessions, newSession] }));
    } catch (error) {
      console.error(error);
      set({ error: 'Failed to create session.' });
    }
  },
}));
