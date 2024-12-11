import { RoutineExercise } from "../types/RoutineExercises";
import { useWorkoutContext } from "./UseWorkoutContextHook"; 

export function useSyncCurrentWorkout(routineId: string, routineExercises: RoutineExercise[]) {
  const { getCurrentWorkoutRoutineId, updateCurrentWorkout } = useWorkoutContext();
  
  const currentWorkoutRoutineId = getCurrentWorkoutRoutineId();
  if (routineExercises.length) {
    if (currentWorkoutRoutineId && currentWorkoutRoutineId === routineId) {
      updateCurrentWorkout(routineExercises);
    }
  }
};