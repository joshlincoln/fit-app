import { Controller, Get, Post, Put, Delete, Body, Path, Route, Tags } from 'tsoa';
import Exercise, { ExerciseDocument } from '../models/exercise';

interface CreateExerciseRequest {
  name: string;
  type: 'Lift' | 'Cardio';
  defaultSets?: { reps: number; weight: number }[];
  defaultDuration?: number;
  defaultUnit?: string;
}

interface UpdateExerciseRequest {
  name?: string;
  type?: 'Lift' | 'Cardio';
  defaultSets?: { reps: number; weight: number }[];
  defaultDuration?: number;
  defaultUnit?: string;
}

@Route('exercises')
@Tags('Exercise')
export class ExerciseController extends Controller {
  /**
   * Get all exercises.
   */
  @Get('/')
  public async getExercises(): Promise<ExerciseDocument[]> {
    return Exercise.find().lean();
  }

  /**
   * Create a new exercise.
   */
  @Post('/')
  public async createExercise(
    @Body() requestBody: CreateExerciseRequest,
  ): Promise<ExerciseDocument> {
    const exercise = new Exercise(requestBody);
    return await exercise.save();
  }

  /**
   * Update an exercise.
   */
  @Put('{exerciseId}')
  public async updateExercise(
    @Path() exerciseId: string,
    @Body() requestBody: UpdateExerciseRequest,
  ): Promise<ExerciseDocument> {
    const exercise = await Exercise.findByIdAndUpdate(exerciseId, requestBody, { new: true });
    if (!exercise) {
      throw new Error('Exercise not found');
    }
    return exercise;
  }

  /**
   * Delete an exercise.
   */
  @Delete('{exerciseId}')
  public async deleteExercise(@Path() exerciseId: string): Promise<{ message: string }> {
    await Exercise.findByIdAndDelete(exerciseId);
    return { message: 'Exercise deleted successfully' };
  }
}
