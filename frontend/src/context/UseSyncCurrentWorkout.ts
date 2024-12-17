import { RoutineExercise } from "../types/RoutineExercises";
import { useWorkoutContext } from "./UseWorkoutContextHook"; 

export function useSyncCurrentWorkout(routineExercises: RoutineExercise[], routineId: string, routineName: string, workoutId?: string) {
  const { getCurrentWorkoutRoutineId, updateCurrentWorkout } = useWorkoutContext();
  
  const currentWorkoutRoutineId = getCurrentWorkoutRoutineId();
  if (routineExercises.length) {
    if (currentWorkoutRoutineId && currentWorkoutRoutineId === routineId) {
      updateCurrentWorkout(routineExercises, routineName, workoutId);
    }
  }
};