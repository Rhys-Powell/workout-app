using System.Text.RegularExpressions;
using Microsoft.VisualBasic;
using Workout.Api.Dtos;

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
        var group = app.MapGroup("exercises");

        // GET /exercises
        group.MapGet("/", () => exercises);

        // GET /exercises/{id}
        group.MapGet("/{id}", (int id) =>
        {
            ExerciseDto? exercise = exercises.Find(exercise => exercise.Id == id);

            return exercise is null ? Results.NotFound() : Results.Ok(exercise);
        })
            .WithName(GetExerciseEndpointName);

        // POST /exercises
        group.MapPost("/", (CreateExerciseDto newExercise) =>
        {
            ExerciseDto exercise = new(
                exercises.Count + 1,
                newExercise.Name
            );
            exercises.Add(exercise);
            return Results.CreatedAtRoute(GetExerciseEndpointName, new { id = exercise.Id }, exercise);
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
