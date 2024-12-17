using Microsoft.EntityFrameworkCore;
using WorkoutApp.Api.Data;
using WorkoutApp.Api.Dtos;
using WorkoutApp.Api.Entities;
using WorkoutApp.Api.Mapping;

namespace WorkoutApp.Api.Endpoints;

public static class WorkoutEndpoints
{
    const string GetWorkoutEndpointName = "GetWorkout";

    public static RouteGroupBuilder MapWorkoutEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("api/users/{userId}/workouts").WithParameterValidation();

        // GET api/users/{userId}/workouts
        group.MapGet("/", async (int userId, WorkoutAppDbContext dbContext) =>
        {
            var workouts = await dbContext.Workouts
                .Where(ex => ex.UserId == userId)
                .Select(workout => workout.ToDto())
                .AsNoTracking()
                .ToListAsync();

            return Results.Ok(workouts);
        }).RequireAuthorization();

        // GET api/users/{userId}/workout/{workoutId}
        group.MapGet("/{workoutId}", async (int userId, int workoutId, WorkoutAppDbContext dbContext) =>
        {
            var workout = await dbContext.Workouts
                .Where(e => e.Id == workoutId && e.UserId == userId)
                .FirstOrDefaultAsync();

            return workout is null ? Results.NotFound() : Results.Ok(workout.ToDto());
        })
            .WithName(GetWorkoutEndpointName)
            .RequireAuthorization();

        // POST api/users/{userId}/workouts
        group.MapPost("/", async (int userId, WorkoutAppDbContext dbContext) =>
        {
            var newWorkout = new Workout
            {
                UserId = userId,
                StartTime = DateTime.UtcNow,
                EndTime = null
            };

            dbContext.Workouts.Add(newWorkout);
            await dbContext.SaveChangesAsync();

            return Results.CreatedAtRoute(GetWorkoutEndpointName, new { userId, workoutId = newWorkout.Id }, newWorkout.ToDto());
        }).RequireAuthorization();

        //PUT api/users/{userId}/workouts/{workoutId}
        group.MapPut("/{workoutId}", async (int userId, int workoutId, WorkoutDto updatedWorkout, WorkoutAppDbContext dbContext) =>
        {
            var existingWorkout = await dbContext.Workouts
                .FirstOrDefaultAsync(w => w.Id == workoutId && w.UserId == userId);

            if (existingWorkout is null)
            {
                return Results.NotFound();
            }

            await dbContext.SaveChangesAsync();

            return Results.NoContent();
        }).RequireAuthorization();

        // DELETE api/users/{userId}/workouts/{workoutId}
        group.MapDelete("/{workoutId}", async (int userId, int workoutId, WorkoutAppDbContext dbContext) =>
        {
            await dbContext.Workouts
                .Where(e => e.Id == workoutId && e.UserId == userId)
                .ExecuteDeleteAsync();

            return Results.NoContent();
        }).RequireAuthorization();

        return group;
    }
}
