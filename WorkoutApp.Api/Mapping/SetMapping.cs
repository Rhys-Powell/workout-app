using WorkoutApp.Api.Dtos;
using WorkoutApp.Api.Entities;

namespace WorkoutApp.Api.Mapping;

public static class SetMapping
{
    public static SetDto ToDto(this Set set)
    {
        return new SetDto
        {
            Id = set.Id,
            WorkoutId = set.WorkoutId,
            ExerciseId = set.ExerciseId,
            UserId = set.UserId,
            Reps = set.Reps,
            WeightKg = set.WeightKg,
            EndTime = set.EndTime,
            RestTime = set.RestTime,
        };
    }

    public static Set ToEntity(this SetDto set)
    {
        return new Set
        {
            Id = set.Id,
            WorkoutId = set.WorkoutId,
            ExerciseId = set.ExerciseId,
            UserId = set.UserId,
            Reps = set.Reps,
            WeightKg = set.WeightKg,
            EndTime = set.Id == 0 ? DateTime.UtcNow : set.EndTime,
            RestTime = set.RestTime,
        };
    }
}