using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Workout.Api.Data;
using Workout.Api.Dtos;
using Workout.Api.Entities;
using Workout.Api.Mapping;

namespace Workout.Api.Endpoints;

public static class RoutineExerciseEndpoints
{
    const string GetRoutineExerciseEndpointName = "GetRoutineExercise";

    public static RouteGroupBuilder MapRoutineExercisesEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("api/users/{userId}/routines/{routineId}/exercises").WithParameterValidation();

        // GET api/users/{userId}/routines/{routineId}/exercises?includeDetails=true
        group.MapGet("/", async (int userId, int routineId, bool includeDetails, WorkoutContext dbContext) =>
        {
            var routineExercises = await dbContext.RoutineExercise
                .Where(re => re.RoutineId == routineId)
                .AsNoTracking()
                .ToListAsync();

            if (includeDetails)
            {
                routineExercises = await dbContext.RoutineExercise
                    .Where(re => re.RoutineId == routineId)
                    .Include(re => re.Exercise)
                    .AsNoTracking()
                    .ToListAsync(); ;
            }
            return Results.Ok(routineExercises.Select(re => re.ToDto()));
        })
            .WithName(GetRoutineExerciseEndpointName)
            .RequireAuthorization();

        // POST api/users/{userId}/routines/{routineId}/exercises
        group.MapPost("/", async (int userId, [FromQuery] int exerciseId, int routineId, WorkoutContext dbContext) =>
        {
            //Validate routineId
            var routine = await dbContext.Routines.FindAsync(routineId);
            if (routine == null || routine.UserId != userId) return Results.NotFound("Routine not found");

            //Validate exerciseId
            var exercise = await dbContext.Exercises.FindAsync(exerciseId);
            if (exercise == null) return Results.NotFound("Exercise not found");

            //Check if exercise already exists in routine
            var existingExercise = await dbContext.RoutineExercise
                .Where(re => re.RoutineId == routineId && re.ExerciseId == exerciseId)
                .FirstOrDefaultAsync();

            if (existingExercise != null) return Results.BadRequest("Exercise already exists in routine");

            //Find the highest existing exercise order
            var maxExerciseOrder = await dbContext.RoutineExercise
                .Where(re => re.RoutineId == routineId)
                .MaxAsync(re => (int?)re.ExerciseOrder) ?? 0;

            var newRoutineExercise = dbContext.RoutineExercise.Add(new RoutineExercise
            {
                RoutineId = routineId,
                ExerciseId = exerciseId,
                ExerciseOrder = maxExerciseOrder + 1
            });

            await dbContext.SaveChangesAsync();

            return Results.CreatedAtRoute(GetRoutineExerciseEndpointName, new { routineId, exerciseId }, newRoutineExercise.Entity.ToDto());
        }).RequireAuthorization();

        // DELETE api/users/{userId}/routines/{routineId}/exercises/{exerciseId}
        group.MapDelete("/{exerciseId}", async (int routineId, int exerciseId, WorkoutContext dbContext) =>
        {
            await dbContext.RoutineExercise
                .Where(re => re.RoutineId == routineId && re.ExerciseId == exerciseId)
                .ExecuteDeleteAsync();

            return Results.NoContent();
        }).RequireAuthorization();

        return group;
    }
};