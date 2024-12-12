using WorkoutApp.Api.Dtos;
using WorkoutApp.Api.Entities;

namespace WorkoutApp.Api.Mapping;

public static class RoutineMapping
{
    public static RoutineDto ToDto(this Routine routine)
    {
        return new RoutineDto
        {
            Id = routine.Id,
            Name = routine.Name,
            UserId = routine.UserId,
        };
    }

    public static Routine ToEntity(this RoutineDto routine)
    {
        return new Routine
        {
            Id = routine.Id,
            Name = routine.Name,
            UserId = routine.UserId,
        };
    }


}