import { Exercise } from './Exercise';

export interface RoutineExercise {
  id: number;
  routineId: number;
  exerciseId: number;
  exerciseOrder: number;
  exercise: Exercise;
}
