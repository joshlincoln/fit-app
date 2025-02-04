// src/controllers/AnalyticsController.ts
import { Controller, Get, Route, Tags } from 'tsoa';
import WorkoutSession from '../models/workout-session';

@Route('analytics')
@Tags('Analytics')
export class AnalyticsController extends Controller {
  /**
   * Retrieve aggregated analytics data for lift activities from workout sessions.
   */
  @Get('/')
  public async getAnalytics(): Promise<Record<string, number[]>> {
    const analytics = await WorkoutSession.aggregate([
      { $unwind: '$activities' },
      { $match: { 'activities.type': 'Lift' } },
      { $unwind: '$activities.sets' },
      {
        $group: {
          _id: '$activities.name',
          weights: { $push: '$activities.sets.weight' },
        },
      },
    ]);

    const formattedAnalytics: Record<string, number[]> = {};
    analytics.forEach((entry: any) => {
      formattedAnalytics[entry._id] = entry.weights;
    });
    return formattedAnalytics;
  }
}
