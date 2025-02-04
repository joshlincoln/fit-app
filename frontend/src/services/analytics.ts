import { AnalyticsData } from "../models/analytics";
import apiClient from "./api";

export const getAnalytics = async (): Promise<AnalyticsData> => {
    const response = await apiClient.get<AnalyticsData>('/analytics');
    return response.data;
  };
  