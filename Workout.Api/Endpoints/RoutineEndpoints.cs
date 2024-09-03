using Microsoft.EntityFrameworkCore;
using Workout.Api.Data;
using Workout.Api.Dtos;
using Workout.Api.Mapping;

namespace Workout.Api.Endpoints;

public static class RoutineEndpoints
{
    const string GetRoutineEndpointName = "GetRoutine";

    public static RouteGroupBuilder MapRoutineEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("api/users/{userId}/routines").WithParameterValidation();

        // GET api/users/{userId}/routines
        group.MapGet("/", async (int userId, WorkoutContext dbContext) =>
        {
            var routines = await dbContext.Routines
                .Where(ex => ex.UserId == userId)
                .Select(routine => routine.ToDto())
                .AsNoTracking()
                .ToListAsync();

            return Results.Ok(routines);
        });

        // GET api/users/{userId}/routines/{routineId}
        group.MapGet("/{routineId}", async (int userId, int routineId, WorkoutContext dbContext) =>
        {
            var routine = await dbContext.Routines
                .Where(e => e.Id == routineId && e.UserId == userId)
                .FirstOrDefaultAsync();

            return routine is null ? Results.NotFound() : Results.Ok(routine.ToDto());
        })
            .WithName(GetRoutineEndpointName);

        // POST api/users/{userId}/routines
        group.MapPost("/", async (int userId, RoutineDto newRoutine, WorkoutContext dbContext) =>
        {
            var routine = newRoutine.ToEntity();

            dbContext.Routines.Add(routine);
            await dbContext.SaveChangesAsync();

            return Results.CreatedAtRoute(GetRoutineEndpointName, new { userId, routineId = routine.Id }, routine.ToDto());
        });

        //PUT api/users/{userId}/routines/{routineId}
        group.MapPut("/{routineId}", async (int userId, int routineId, RoutineDto updatedWorkout, WorkoutContext dbContext) =>
        {
            var existingRoutine = await dbContext.Routines
                .FirstOrDefaultAsync(w => w.Id == routineId && w.UserId == userId);

            if (existingRoutine is null)
            {
                return Results.NotFound();
            }

            //Update name field
            existingRoutine.Name = updatedWorkout.Name;

            await dbContext.SaveChangesAsync();

            return Results.NoContent();
        });

        // DELETE api/users/{userId}/routines/{routineId}
        group.MapDelete("/{routineId}", async (int userId, int routineId, WorkoutContext dbContext) =>
        {
            await dbContext.Routines
                .Where(e => e.Id == routineId && e.UserId == userId)
                .ExecuteDeleteAsync();

            return Results.NoContent();
        });

        return group;
    }
}
