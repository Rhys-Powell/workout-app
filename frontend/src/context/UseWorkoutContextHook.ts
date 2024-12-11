import { useContext } from 'react';
import { WorkoutContext, WorkoutContextType } from './WorkoutContext';

export const useWorkoutContext = (): WorkoutContextType => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useCurrentWorkoutExercises must be used within a WorkoutProvider');
  }
  return context;
};