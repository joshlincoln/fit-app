// src/controllers/WorkoutSessionController.ts
import { Controller, Get, Post, Body, Route, Tags } from 'tsoa';
import WorkoutSession, { WorkoutSessionDocument } from '../models/workout-session';
import WorkoutTemplate from '../models/workout-template';

interface CreateWorkoutSessionRequest {
  userId: number;
  templateId?: string;
  date: string; // ISO string
  duration: number;
  activities: {
    id: string;
    type: 'Lift' | 'Cardio';
    name: string;
    sets: { reps: number; weight: number; previous?: { reps: number; weight: number } }[];
  }[];
  notes?: string;
}

@Route('sessions')
@Tags('WorkoutSession')
export class WorkoutSessionController extends Controller {
  /**
   * Create a new workout session.
   * If a templateId is provided, you may choose to pre-populate the session data from the template.
   */
  @Post('/')
  public async createSession(@Body() body: CreateWorkoutSessionRequest): Promise<WorkoutSessionDocument> {
    // Optionally: If templateId is provided, load the template and merge any default values if not supplied.
    if (body.templateId) {
      const template = await WorkoutTemplate.findById(body.templateId);
      if (!template) {
        throw new Error('Template not found');
      }
      // For example, you might fill in missing activity details from the template.
    }
    const session = new WorkoutSession({
      ...body,
      date: new Date(body.date),
    });
    return await session.save();
  }

  /**
   * Retrieve all workout sessions.
   */
  @Get('/')
  public async getSessions(): Promise<WorkoutSessionDocument[]> {
    return await WorkoutSession.find().lean();
  }
}
