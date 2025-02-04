import { Controller, Post, Body, Route, Tags } from 'tsoa';
import WorkoutTemplate, { WorkoutTemplateDocument } from '../models/workout-template';

export interface CreateWorkoutTemplateRequest {
  userId: number;
  name: string;
  description?: string;
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
    // Basic validation: Ensure required fields are present.
    if (!requestBody.userId || !requestBody.name) {
      this.setStatus(400);
      throw new Error('Missing required fields: userId and name are required');
    }
    // Optionally, add more validation here.
    const template = new WorkoutTemplate(requestBody);
    return await template.save();
  }
}
