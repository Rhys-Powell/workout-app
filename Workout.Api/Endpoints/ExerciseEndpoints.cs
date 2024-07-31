using Workout.Api.Data;
using Workout.Api.Dtos;
using Workout.Api.Entities;
using Workout.Api.Mapping;

namespace Workout.Api.Endpoints;

public static class ExerciseEndpoints
{
    const string GetExerciseEndpointName = "GetExercise";

    private static readonly List<ExerciseDto> exercises = [
        new (
            1,
            "Bench Press"
        ),
        new (
            2,
            "Squat"
        ),
        new (
            3,
            "Deadlift"
        )
    ];

    public static RouteGroupBuilder MapExercisesEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("exercises").WithParameterValidation();

        // GET /exercises
        group.MapGet("/", () => exercises);

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
        group.MapPut("/{id}", (int id, UpdateExerciseDto updatedExercise) =>
        {
            var index = exercises.FindIndex(exercise => exercise.Id == id);

            if (index == -1)
            {
                return Results.NotFound();
            }

            exercises[index] = new ExerciseDto(
                id,
                updatedExercise.Name
            );
            return Results.NoContent();
        });

        // DELETE /exercises/{id}
        group.MapDelete("/{id}", (int id) =>
        {
            exercises.RemoveAll(exercise => exercise.Id == id);
            return Results.NoContent();
        });

        return group;
    }
}
