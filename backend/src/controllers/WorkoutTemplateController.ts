import { Controller, Post, Body, Route, Tags } from 'tsoa';
import WorkoutTemplate, { WorkoutTemplateDocument } from '../models/workout-template';

export interface CreateWorkoutTemplateRequest {
  userId: number;
  name: string;
  activities: {
    exercise: string;
    defaultSets?: { reps: number; weight: number }[];
    defaultDuration?: number;
    defaultUnit?: string;
  }[];
}

@Route('templates')
@Tags('WorkoutTemplate')
export class WorkoutTemplateController extends Controller {
  @Post('/')
  public async createTemplate(
    @Body() requestBody: CreateWorkoutTemplateRequest,
  ): Promise<WorkoutTemplateDocument> {
    if (!requestBody.userId || !requestBody.name) {
      this.setStatus(400);
      throw new Error('Missing required fields: userId and name are required');
    }
    const template = new WorkoutTemplate(requestBody);
    return await template.save();
  }
}
