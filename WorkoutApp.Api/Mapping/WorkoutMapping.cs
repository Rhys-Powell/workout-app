using WorkoutApp.Api.Dtos;
using WorkoutApp.Api.Entities;

namespace WorkoutApp.Api.Mapping;

public static class WorkoutMapping
{
    public static WorkoutDto ToDto(this Workout workout)
    {
        return new WorkoutDto
        {
            Id = workout.Id,
            UserId = workout.UserId,
            StartTime = workout.StartTime,
            EndTime = workout.EndTime
        };
    }

    public static Workout ToEntity(this WorkoutDto workout)
    {
        return new Workout
        {
            Id = workout.Id,
            UserId = workout.UserId,
            StartTime = workout.StartTime,
            EndTime = workout.EndTime
        };
    }


}