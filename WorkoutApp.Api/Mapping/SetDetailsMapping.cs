using WorkoutApp.Api.Dtos;
using WorkoutApp.Api.Entities;
using WorkoutApp.Api.Helpers;

namespace WorkoutApp.Api.Mapping;

public static class SetDetailsMapping
{
    public static Set ToEntity(this SetDetailsDto setDetails, int userId, int workoutId, int exerciseId)
    {
        var restTimeTimespan = string.IsNullOrEmpty(setDetails.RestTimeDuration) ? (TimeSpan?)null : TimeSpanConverter.ConvertToTimeSpan(setDetails.RestTimeDuration);

        return new Set
        {
            WorkoutId = workoutId,
            ExerciseId = exerciseId,
            UserId = userId,
            Reps = setDetails.Reps,
            WeightKg = setDetails.WeightKg,
            EndTime = DateTime.UtcNow,
            RestTime = restTimeTimespan,
        };
    }
}