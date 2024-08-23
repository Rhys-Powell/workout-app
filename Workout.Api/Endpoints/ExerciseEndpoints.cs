using Microsoft.EntityFrameworkCore;
using Workout.Api.Data;
using Workout.Api.Dtos;
using Workout.Api.Entities;
using Workout.Api.Mapping;

namespace Workout.Api.Endpoints;

public static class ExerciseEndpoints
{
    const string GetExerciseEndpointName = "GetExercise";

    public static RouteGroupBuilder MapExerciseEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("users/{userId}/exercises").WithParameterValidation();

        // GET users/{userId}/exercises
        group.MapGet("/", async (int userId, WorkoutContext dbContext) =>
        {
            var exercises = await dbContext.Exercises
                .Where(ex => ex.UserId == userId)
                .Select(exercise => exercise.ToDto())
                .AsNoTracking()
                .ToListAsync();

            return Results.Ok(exercises);
        });

        // GET users/{userId}/exercises/{exerciseId}
        group.MapGet("/{exerciseId}", async (int userId, int exerciseId, WorkoutContext dbContext) =>
        {
            var exercise = await dbContext.Exercises
                .Where(e => e.Id == exerciseId && e.UserId == userId)
                .FirstOrDefaultAsync();

            return exercise is null ? Results.NotFound() : Results.Ok(exercise.ToDto());
        })
            .WithName(GetExerciseEndpointName);

        // POST users/{userId}/exercises
        group.MapPost("/", async (int userId, ExerciseDto newExercise, WorkoutContext dbContext) =>
        {
            Exercise exercise = newExercise.ToEntity();

            dbContext.Exercises.Add(exercise);
            await dbContext.SaveChangesAsync();

            return Results.CreatedAtRoute(GetExerciseEndpointName, new { userId, exerciseId = exercise.Id }, exercise.ToDto());
        });

        //PUT users/{userId}/exercises/{exerciseId}
        group.MapPut("/{exerciseId}", async (int userId, int exerciseId, ExerciseDto updatedExercise, WorkoutContext dbContext) =>
        {
            var existingExercise = await dbContext.Exercises
                 .FirstOrDefaultAsync(e => e.Id == exerciseId && e.UserId == userId);

            if (existingExercise is null)
            {
                return Results.NotFound();
            }

            existingExercise.Name = updatedExercise.Name;

            await dbContext.SaveChangesAsync();

            return Results.NoContent();
        });

        // DELETE users/{userId}/exercises/{exerciseId}
        group.MapDelete("/{exerciseId}", async (int userId, int exerciseId, WorkoutContext dbContext) =>
        {
            await dbContext.Exercises
                .Where(e => e.Id == exerciseId && e.UserId == userId)
                .ExecuteDeleteAsync();

            return Results.NoContent();
        });

        return group;
    }
}
