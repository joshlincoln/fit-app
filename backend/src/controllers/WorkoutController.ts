// src/controllers/WorkoutController.ts
import { Controller, Get, Post, Route, Body, Tags } from 'tsoa';
import { Workout } from '../models/workout';
import WorkoutModel from '../models/workout-model';

@Route('workouts')
@Tags('Workout')
export class WorkoutController extends Controller {
  
  /**
   * Get all workouts
   */
  @Get('/')
  public async getWorkouts(): Promise<Workout[]> {
    // Retrieve workouts from MongoDB using the Mongoose model
    return WorkoutModel.find().exec();
  }

  /**
   * Create a new workout
   * @param workout The workout to create
   */
  @Post('/')
  public async createWorkout(@Body() workout: Workout): Promise<Workout> {
    // Save the workout to MongoDB
    const createdWorkout = new WorkoutModel(workout);
    await createdWorkout.save();
    return createdWorkout.toObject();
  }
}
