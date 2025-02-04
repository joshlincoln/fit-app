import { Controller, Post, Body, Route, Tags, Get } from 'tsoa';
import Session, { SessionDocument } from '../models/session';

export interface CreateSessionRequest {
  userId: number;
  templateId: string;
  date: string;
  duration: number;
  activities: {
    id: string;
    name: string;
    type: 'Lift' | 'Cardio';
    sets: { reps: number; weight: number }[];
  }[];
  notes?: string;
}

@Route('sessions')
@Tags('Session')
export class SessionController extends Controller {
  /**
   * Create a new workout session.
   * If a templateId is provided, you may choose to pre-populate the session data from the template.
   */
  @Post('/')
  public async createSession(@Body() requestBody: CreateSessionRequest): Promise<SessionDocument> {
    const session = new Session({
      ...requestBody,
      date: new Date(requestBody.date),
    });
    return await session.save();
  }

  /**
   * Retrieve all workout sessions.
   */
  @Get('/')
  public async getSessions(): Promise<SessionDocument[]> {
    return Session.find().lean();
  }
}
