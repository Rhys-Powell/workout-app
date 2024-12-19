export interface ExerciseSet {
    id: number;
    workoutId: number;
    exerciseId: number;
    userId: number;
    reps: number;
    weightKg: number;
    endTime: Date;
    restTime?: string;
  }