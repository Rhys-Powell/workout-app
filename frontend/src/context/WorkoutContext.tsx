import React, { createContext } from "react";
import { RoutineExercise } from "../types/RoutineExercises";

export interface WorkoutContextType {
    getCurrentWorkoutExercises: () =>RoutineExercise[] | [];
    getCurrentWorkoutRoutineId: () => string | null;
    updateCurrentWorkout: (routineExercises: RoutineExercise[] | null) => void;
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

  const getCurrentWorkoutRoutineId: () => string | null = () => {
    if (localStorage.getItem("currentWorkoutRoutineId")) {
      return JSON.parse(localStorage.getItem("currentWorkoutRoutineId")!);
    }
    return null;
  }
  
  const updateCurrentWorkout = (RoutineExercises: RoutineExercise[] | null) => {
    if (RoutineExercises) {
      localStorage.setItem("currentWorkoutExercises", JSON.stringify(RoutineExercises));
      localStorage.setItem("currentWorkoutRoutineId", JSON.stringify(RoutineExercises?.[0]?.routineId.toString()));
    }
  };

  const removeCurrentWorkout = () => {
    localStorage.removeItem("currentWorkoutExercises");
    localStorage.removeItem("currentWorkoutRoutineId");
  };

  return (
    <WorkoutContext.Provider value={{ getCurrentWorkoutExercises, getCurrentWorkoutRoutineId, updateCurrentWorkout, removeCurrentWorkout }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export { WorkoutProvider, WorkoutContext };