﻿using Microsoft.EntityFrameworkCore;
using WorkoutApp.Api.Data;
using WorkoutApp.Api.Dtos;
using WorkoutApp.Api.Entities;
using WorkoutApp.Api.Mapping;

namespace WorkoutApp.Api.Endpoints;

public static class ExerciseEndpoints
{
    const string GetExerciseEndpointName = "GetExercise";

    public static RouteGroupBuilder MapExerciseEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("api/users/{userId}/exercises").WithParameterValidation();

        // GET api/users/{userId}/exercises
        group.MapGet("/", async (int userId, WorkoutAppDbContext dbContext) =>
        {
            var exercises = await dbContext.Exercises
                .Where(ex => ex.UserId == userId)
                .Select(exercise => exercise.ToDto())
                .AsNoTracking()
                .ToListAsync();

            return Results.Ok(exercises);
        }).RequireAuthorization();

        // GET api/users/{userId}/exercises/{exerciseId}
        group.MapGet("/{exerciseId}", async (int userId, int exerciseId, WorkoutAppDbContext dbContext) =>
        {
            var exercise = await dbContext.Exercises
                .Where(e => e.Id == exerciseId && e.UserId == userId)
                .FirstOrDefaultAsync();

            return exercise is null ? Results.NotFound() : Results.Ok(exercise.ToDto());
        })
            .WithName(GetExerciseEndpointName)
            .RequireAuthorization();

        // POST api/users/{userId}/exercises
        group.MapPost("/", async (int userId, ExerciseDto newExercise, WorkoutAppDbContext dbContext) =>
        {
            Exercise exercise = newExercise.ToEntity();

            dbContext.Exercises.Add(exercise);
            await dbContext.SaveChangesAsync();

            return Results.CreatedAtRoute(GetExerciseEndpointName, new { userId, exerciseId = exercise.Id }, exercise.ToDto());
        }).RequireAuthorization();

        //PUT api/users/{userId}/exercises/{exerciseId}
        group.MapPut("/{exerciseId}", async (int userId, int exerciseId, ExerciseDto updatedExercise, WorkoutAppDbContext dbContext) =>
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
        }).RequireAuthorization();

        // DELETE api/users/{userId}/exercises/{exerciseId}
        group.MapDelete("/{exerciseId}", async (int userId, int exerciseId, WorkoutAppDbContext dbContext) =>
        {
            await dbContext.Exercises
                .Where(e => e.Id == exerciseId && e.UserId == userId)
                .ExecuteDeleteAsync();

            return Results.NoContent();
        }).RequireAuthorization();

        return group;
    }
}
