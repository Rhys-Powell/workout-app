using Workout.Api.Dtos;
using Workout.Api.Entities;

namespace Workout.Api.Mapping;

public static class ExerciseMapping
{
    public static ExerciseDto ToDto(this Exercise exercise)
    {
        return new ExerciseDto
        {
            Id = exercise.Id,
            Name = exercise.Name,
            UserId = exercise.UserId
        };
    }

    public static Exercise ToEntity(this ExerciseDto exercise)
    {
        return new Exercise
        {
            Id = exercise.Id,
            Name = exercise.Name,
            UserId = exercise.UserId,
        };
    }

}
