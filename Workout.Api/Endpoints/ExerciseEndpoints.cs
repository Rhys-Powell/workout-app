using Microsoft.EntityFrameworkCore;
using Workout.Api.Data;
using Workout.Api.Dtos;
using Workout.Api.Entities;
using Workout.Api.Mapping;

namespace Workout.Api.Endpoints;

public static class ExerciseEndpoints
{
    const string GetExerciseEndpointName = "GetExercise";

    public static RouteGroupBuilder MapExercisesEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("exercises").WithParameterValidation();

        // GET /exercises
        group.MapGet("/", async (WorkoutContext dbContext) =>
            await dbContext.Exercises
                .Select(exercise => exercise.ToDto())
                .AsNoTracking()
                .ToListAsync()
        );

        // GET /exercises/{id}
        group.MapGet("/{id}", async (int id, WorkoutContext dbContext) =>
        {
            Exercise? exercise = await dbContext.Exercises.FindAsync(id);

            return exercise is null ? Results.NotFound() : Results.Ok(exercise.ToDto());
        })
            .WithName(GetExerciseEndpointName);

        // POST /exercises
        group.MapPost("/", async (CreateExerciseDto newExercise, WorkoutContext dbContext) =>
        {
            Exercise exercise = newExercise.ToEntity();

            dbContext.Exercises.Add(exercise);
            await dbContext.SaveChangesAsync();

            return Results.CreatedAtRoute(GetExerciseEndpointName, new { id = exercise.Id }, exercise.ToDto());
        });

        //PUT /exercises/{id}
        group.MapPut("/{id}", async (int id, UpdateExerciseDto updatedExercise, WorkoutContext dbContext) =>
        {
            var existingExercise = await dbContext.Exercises.FindAsync(id);

            if (existingExercise is null)
            {
                return Results.NotFound();
            }

            dbContext.Entry(existingExercise)
                .CurrentValues.SetValues(updatedExercise.ToEntity(id));

            await dbContext.SaveChangesAsync();

            return Results.NoContent();
        });

        // DELETE /exercises/{id}
        group.MapDelete("/{id}", async (int id, WorkoutContext dbContext) =>
        {
            await dbContext.Exercises
                .Where(exercise => exercise.Id == id)
                .ExecuteDeleteAsync();

            return Results.NoContent();
        });

        return group;
    }
}
