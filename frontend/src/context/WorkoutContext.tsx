import React, { createContext } from "react";
import { RoutineExercise } from "../types/RoutineExercises";

export interface WorkoutContextType {
    getCurrentWorkoutExercises: () =>RoutineExercise[] | [];
    getCurrentWorkoutRoutineId: () => string | null;
    getCurrentWorkoutRoutineName: () => string | null;
    updateCurrentWorkout: (routineExercises: RoutineExercise[] | null, routineName: string) => void;
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

  const getCurrentWorkoutRoutineName: () => string | null = () => {
    if (localStorage.getItem("currentWorkoutRoutineName")) {
      return JSON.parse(localStorage.getItem("currentWorkoutRoutineName")!);
    }
    return null;
  }
  
  const updateCurrentWorkout = (RoutineExercises: RoutineExercise[] | null, RoutineName: string) => {
    if (RoutineExercises) {
      localStorage.setItem("currentWorkoutExercises", JSON.stringify(RoutineExercises));
      localStorage.setItem("currentWorkoutRoutineId", JSON.stringify(RoutineExercises?.[0]?.routineId.toString()));
      localStorage.setItem("currentWorkoutRoutineName", JSON.stringify(RoutineName));
    }
  };

  const removeCurrentWorkout = () => {
    localStorage.removeItem("currentWorkoutExercises");
    localStorage.removeItem("currentWorkoutRoutineId");
    localStorage.removeItem("currentWorkoutRoutineName");
  };

  return (
    <WorkoutContext.Provider value={{ getCurrentWorkoutExercises, getCurrentWorkoutRoutineId, getCurrentWorkoutRoutineName, updateCurrentWorkout, removeCurrentWorkout }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export { WorkoutProvider, WorkoutContext };