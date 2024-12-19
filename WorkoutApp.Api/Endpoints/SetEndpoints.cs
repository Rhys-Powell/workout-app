using Microsoft.EntityFrameworkCore;
using WorkoutApp.Api.Data;
using WorkoutApp.Api.Dtos;
using WorkoutApp.Api.Entities;
using WorkoutApp.Api.Mapping;
using WorkoutApp.Api.Helpers;

namespace WorkoutApp.Api.Endpoints;

public static class SetEndpoints
{
    const string GetSetEndpointName = "GetSet";

    public static RouteGroupBuilder MapSetEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("api/users/{userId}/workouts/{workoutId}/exercises/{exerciseId}/sets").WithParameterValidation();

        // GET api/users/{userId}/workouts/{workoutId}/exercises/{exerciseId}/sets
        group.MapGet("/", async (int userId, int workoutId, int exerciseId, WorkoutAppDbContext dbContext) =>
        {
            var sets = await dbContext.Sets
                .Where(ex => ex.UserId == userId && ex.ExerciseId == exerciseId && ex.WorkoutId == workoutId)
                .Select(set => set.ToDto())
                .AsNoTracking()
                .ToListAsync();

            return Results.Ok(sets);
        }).RequireAuthorization();

        // GET api/users/{userId}/workouts/{workoutId}/exercises/{exerciseId}/sets/{setId}
        group.MapGet("/{setId}", async (int userId, int setId, WorkoutAppDbContext dbContext) =>
        {
            var sets = await dbContext.Sets
                .Where(e => e.Id == setId && e.UserId == userId)
                .FirstOrDefaultAsync();

            return sets is null ? Results.NotFound() : Results.Ok(sets.ToDto());
        })
            .WithName(GetSetEndpointName)
            .RequireAuthorization();

        // POST api/users/{userId}/workouts/{workoutId}/exercises/{exerciseId}/sets
        group.MapPost("/", async (int userId, int workoutId, int exerciseId, SetDetailsDto setDetails, WorkoutAppDbContext dbContext) =>
        {
            Set set = SetDetailsMapping.ToEntity(setDetails, userId, workoutId, exerciseId);

            dbContext.Sets.Add(set);
            await dbContext.SaveChangesAsync();
            return Results.Ok(set.ToDto());
        }).RequireAuthorization();

        //PUT api/users/{userId}/workouts/{workoutId}/exercises/{exerciseId}/sets/{setId}
        group.MapPut("/{setId}", async (int userId, int setId, SetDto updatedSet, WorkoutAppDbContext dbContext) =>
        {
            var existingSet = await dbContext.Sets
                .FirstOrDefaultAsync(w => w.Id == setId && w.UserId == userId);

            if (existingSet is null)
            {
                return Results.NotFound();
            }

            await dbContext.SaveChangesAsync();

            return Results.NoContent();
        }).RequireAuthorization();

        // DELETE api/users/{userId}/workouts/{workoutId}/exercises/{exerciseId}/sets/{setId}
        group.MapDelete("/{setId}", async (int userId, int setId, WorkoutAppDbContext dbContext) =>
        {
            await dbContext.Sets
                .Where(e => e.Id == setId && e.UserId == userId)
                .ExecuteDeleteAsync();

            return Results.NoContent();
        }).RequireAuthorization();

        return group;
    }
}
