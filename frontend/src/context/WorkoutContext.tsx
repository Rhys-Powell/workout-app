import React, { createContext } from "react";
import { RoutineExercise } from "../types/RoutineExercises";

export interface WorkoutContextType {
    getCurrentWorkoutExercises: () =>RoutineExercise[] | [];
    getCurrentWorkoutId: () => string | null;
    getCurrentWorkoutRoutineId: () => string | null;
    getCurrentWorkoutRoutineName: () => string | null;
    updateCurrentWorkout: (routineExercises: RoutineExercise[] | null, routineName: string, workoutId?: string) => void;
    removeCurrentWorkout: () => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

const WorkoutProvider = ({ children }: { children: React.ReactNode }) => {

  const getCurrentWorkoutExercises: () => RoutineExercise[] | [] = () => {
    if (localStorage.getItem("currentWorkoutExercises")) {
      return JSON.parse(localStorage.getItem("currentWorkoutExercises")!);
    }
    return [];
  };

  const getCurrentWorkoutId: () => string | null = () => {
    if (localStorage.getItem("currentWorkoutId")) {
      return JSON.parse(localStorage.getItem("currentWorkoutId")!);
    }
    return null;
  }

  const getCurrentWorkoutRoutineId: () => string | null = () => {
    if (localStorage.getItem("currentWorkoutRoutineId")) {
      return JSON.parse(localStorage.getItem("currentWorkoutRoutineId")!);
    }
    return null;
  }

  const getCurrentWorkoutRoutineName: () => string | null = () => {
    if (localStorage.getItem("currentWorkoutRoutineName")) {
      return JSON.parse(localStorage.getItem("currentWorkoutRoutineName")!);
    }
    return null;
  }
  
  const updateCurrentWorkout = (RoutineExercises: RoutineExercise[] | null, RoutineName: string, workoutId?: string) => {
    if (RoutineExercises) {
      localStorage.setItem("currentWorkoutExercises", JSON.stringify(RoutineExercises));
      localStorage.setItem("currentWorkoutRoutineId", JSON.stringify(RoutineExercises?.[0]?.routineId.toString())); 
      localStorage.setItem("currentWorkoutRoutineName", JSON.stringify(RoutineName));
    }
    if (workoutId) {
      localStorage.setItem("currentWorkoutId", JSON.stringify(workoutId));
    }
  };

  const removeCurrentWorkout = () => {
    localStorage.removeItem("currentWorkoutExercises");
    localStorage.removeItem("currentWorkoutId");
    localStorage.removeItem("currentWorkoutRoutineId");
    localStorage.removeItem("currentWorkoutRoutineName");
  };

  return (
    <WorkoutContext.Provider value={{ getCurrentWorkoutExercises, getCurrentWorkoutId, getCurrentWorkoutRoutineId, getCurrentWorkoutRoutineName, updateCurrentWorkout, removeCurrentWorkout }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export { WorkoutProvider, WorkoutContext };