using WorkoutApp.Api.Dtos;
using WorkoutApp.Api.Entities;

namespace WorkoutApp.Api.Mapping;

public static class RoutineExerciseMapping
{

    public static RoutineExercise ToEntity(this RoutineExerciseDto routineExercise)
    {
        return new RoutineExercise
        {
            Id = routineExercise.Id,
            RoutineId = routineExercise.RoutineId,
            ExerciseId = routineExercise.ExerciseId,
            ExerciseOrder = routineExercise.ExerciseOrder
        };
    }

    public static RoutineExerciseDto ToDto(this RoutineExercise routineExercise)
    {
        return new RoutineExerciseDto
        {
            Id = routineExercise.Id,
            RoutineId = routineExercise.RoutineId,
            ExerciseId = routineExercise.ExerciseId,
            ExerciseOrder = routineExercise.ExerciseOrder,
            Exercise = routineExercise.Exercise?.ToDto() ?? null
        };
    }
}