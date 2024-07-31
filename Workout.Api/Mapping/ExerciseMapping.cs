using Workout.Api.Dtos;
using Workout.Api.Entities;

namespace Workout.Api.Mapping;

public static class ExerciseMapping
{
    public static Exercise ToEntity(this CreateExerciseDto exercise)
    {
        return new Exercise()
        {
            Name = exercise.Name
        };
    }

    public static ExerciseDto ToDto(this Exercise exercise)
    {
        return new(
                exercise.Id,
                exercise.Name
            );
    }
}
