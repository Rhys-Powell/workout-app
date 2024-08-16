using Microsoft.EntityFrameworkCore;
using Workout.Api.Data;
using Workout.Api.Dtos;
using Workout.Api.Entities;
using Workout.Api.Mapping;

namespace Workout.Api.Endpoints;

public static class RoutineExerciseEndpoints
{
    const string GetRoutineExerciseEndpointName = "GetExerciseRoutine";
    private const int InvalidExerciseId = -1;

    public static RouteGroupBuilder MapRoutineExercisesEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("users/{userId}/routines/{routineId}/exercises").WithParameterValidation();


        // GET users/{userId}/routines/{routineId}/exercises?includeDetails=true
        group.MapGet("/", async (int userId, int routineId, bool includeDetails, WorkoutContext dbContext) =>
        {
            var routineExercises = await dbContext.RoutineExercise
                .Where(re => re.RoutineId == routineId)
                .AsNoTracking()
                .ToListAsync();

            if (routineExercises == null || !routineExercises.Any())
            {
                return Results.NotFound("No exercises found for this routine");
            }

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
        .WithName(GetRoutineExerciseEndpointName);

        // POST users/{userId}/routines/{routineId}/exercises
        group.MapPost("/", async (int userId, int routineId, RoutineExercise routineExercise, WorkoutContext dbContext) =>
        {
            var routine = await dbContext.Routines.FindAsync(routineId);
            if (routine == null || routine.UserId != userId) return Results.NotFound();

            var existingExercise = await dbContext.RoutineExercise
                .Where(re => re.RoutineId == routineId && re.ExerciseId == routineExercise.ExerciseId)
                .FirstOrDefaultAsync();

            if (existingExercise != null) return Results.BadRequest("Exercise already exists in routine");

            var maxExerciseOrder = await dbContext.RoutineExercise
                .Where(re => re.RoutineId == routineId)
                .MaxAsync(re => (int?)re.ExerciseOrder) ?? 0;

            var exercise = await dbContext.Exercises.FindAsync(routineExercise.ExerciseId);

            if (exercise == null) return Results.NotFound("Exercise not found");

            dbContext.RoutineExercise.Add(new RoutineExercise
            {
                RoutineId = routineId,
                Exercise = exercise,
                ExerciseOrder = maxExerciseOrder + 1
            });

            await dbContext.SaveChangesAsync();

            return Results.Created($"/users/{userId}/routines/{routineId}/exercises/{routineExercise.ExerciseId}", routineExercise);
        });

        return group;
    }
};