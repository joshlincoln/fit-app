import { Controller, Get, Post, Put, Delete, Body, Path, Route, Tags } from 'tsoa';
import Activity, { ActivityDocument } from '../models/activity';

interface CreateActivityRequest {
  type: 'Lift' | 'Cardio';
  name: string;
  defaultSets?: { reps: number; weight: number }[];
}

interface UpdateActivityRequest {
  type?: 'Lift' | 'Cardio';
  name?: string;
  defaultSets?: { reps: number; weight: number }[];
}

@Route('activities')
@Tags('Activity')
export class ActivityController extends Controller {
  /**
   * Get all activities.
   */
  @Get('/')
  public async getActivities(): Promise<ActivityDocument[]> {
    return Activity.find().lean();
  }

  /**
   * Create a new activity.
   */
  @Post('/')
  public async createActivity(
    @Body() requestBody: CreateActivityRequest
  ): Promise<ActivityDocument> {
    const activity = new Activity(requestBody);
    return await activity.save();
  }

  /**
   * Update an activity.
   */
  @Put('{activityId}')
  public async updateActivity(
    @Path() activityId: string,
    @Body() requestBody: UpdateActivityRequest
  ): Promise<ActivityDocument> {
    const activity = await Activity.findByIdAndUpdate(activityId, requestBody, { new: true });
    if (!activity) {
      throw new Error('Activity not found');
    }
    return activity;
  }

  /**
   * Delete an activity.
   */
  @Delete('{activityId}')
  public async deleteActivity(@Path() activityId: string): Promise<{ message: string }> {
    await Activity.findByIdAndDelete(activityId);
    return { message: 'Activity deleted successfully' };
  }
}
