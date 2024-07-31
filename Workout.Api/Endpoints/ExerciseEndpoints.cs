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
        group.MapGet("/", (WorkoutContext dbContext) =>
            dbContext.Exercises
                .Select(exercise => exercise.ToDto())
                .AsNoTracking()
        );

        // GET /exercises/{id}
        group.MapGet("/{id}", (int id, WorkoutContext dbContext) =>
        {
            Exercise? exercise = dbContext.Exercises.Find(id);

            return exercise is null ? Results.NotFound() : Results.Ok(exercise.ToDto());
        })
            .WithName(GetExerciseEndpointName);

        // POST /exercises
        group.MapPost("/", (CreateExerciseDto newExercise, WorkoutContext dbContext) =>
        {
            Exercise exercise = newExercise.ToEntity();

            dbContext.Exercises.Add(exercise);
            dbContext.SaveChanges();

            return Results.CreatedAtRoute(GetExerciseEndpointName, new { id = exercise.Id }, exercise.ToDto());
        });

        //PUT /exercises/{id}
        group.MapPut("/{id}", (int id, UpdateExerciseDto updatedExercise, WorkoutContext dbContext) =>
        {
            var existingExercise = dbContext.Exercises.Find(id);

            if (existingExercise is null)
            {
                return Results.NotFound();
            }

            dbContext.Entry(existingExercise)
                .CurrentValues.SetValues(updatedExercise.ToEntity(id));

            dbContext.SaveChanges();

            return Results.NoContent();
        });

        // DELETE /exercises/{id}
        group.MapDelete("/{id}", (int id, WorkoutContext dbContext) =>
        {
            dbContext.Exercises
                .Where(exercise => exercise.Id == id)
                .ExecuteDelete();

            return Results.NoContent();
        });

        return group;
    }
}
