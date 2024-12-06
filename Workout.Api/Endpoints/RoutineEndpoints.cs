using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Workout.Api.Data;
using Workout.Api.Dtos;
using Workout.Api.Entities;
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
        }).RequireAuthorization();

        // GET api/users/{userId}/routines/{routineId}
        group.MapGet("/{routineId}", async (int userId, int routineId, WorkoutContext dbContext) =>
        {
            var routine = await dbContext.Routines
                .Where(e => e.Id == routineId && e.UserId == userId)
                .FirstOrDefaultAsync();

            return routine is null ? Results.NotFound() : Results.Ok(routine.ToDto());
        })
            .WithName(GetRoutineEndpointName)
            .RequireAuthorization();

        // POST api/users/{userId}/routines
        group.MapPost("/", async (int userId, RoutineDto newRoutine, WorkoutContext dbContext) =>
        {
            var routine = newRoutine.ToEntity();

            dbContext.Routines.Add(routine);
            await dbContext.SaveChangesAsync();

            return Results.CreatedAtRoute(GetRoutineEndpointName, new { userId, routineId = routine.Id }, routine.ToDto());
        }).RequireAuthorization();

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
        }).RequireAuthorization();

        // PATCH api/users/{userId}/routines/{routineId}
        group.MapPatch("/{routineId}", async (int routineId, [FromBody] ExerciseOrderUpdateDto[] itemsToUpdate, WorkoutContext dbContext) =>
        {
            var routineExercises = await dbContext.RoutineExercise
                .Where(re => re.RoutineId == routineId)
                .ToDictionaryAsync(re => re.ExerciseId);

            var transaction = dbContext.Database.BeginTransaction();
            try
            {
                foreach (var item in itemsToUpdate)
                {
                    int toUpdateExerciseId = item.ExerciseId;
                    int newExerciseOrder = item.NewExerciseOrder;

                    if (newExerciseOrder <= 0)
                    {
                        return Results.BadRequest("Order can't be negative or zero");
                    }

                    if (!routineExercises.TryGetValue(toUpdateExerciseId, out var routineExerciseEntityToPatch))
                    {
                        return Results.NotFound("Routine exercise not found");
                    }

                    routineExerciseEntityToPatch.ExerciseOrder = newExerciseOrder;
                }

                await dbContext.SaveChangesAsync();
                await transaction.CommitAsync();

                return Results.Ok();
            }
            catch (Exception ex)
            {
                if (ex.InnerException != null)
                {
                    Console.WriteLine(ex.InnerException.Message);
                    Console.WriteLine(ex.InnerException.StackTrace);
                }
                await transaction.RollbackAsync();
                throw;
            }
        }).RequireAuthorization();

        // DELETE api/users/{userId}/routines/{routineId}
        group.MapDelete("/{routineId}", async (int userId, int routineId, WorkoutContext dbContext) =>
        {
            await dbContext.Routines
                .Where(e => e.Id == routineId && e.UserId == userId)
                .ExecuteDeleteAsync();

            return Results.NoContent();
        }).RequireAuthorization();

        return group;
    }
}
