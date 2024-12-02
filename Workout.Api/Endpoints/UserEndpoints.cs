using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Workout.Api.Data;
using Workout.Api.Dtos;
using Workout.Api.Entities;
using Workout.Api.Mapping;

namespace Workout.Api.Endpoints;

public static class UserEndpoints
{
    const string GetUserEndpointName = "GetUser";

    public static RouteGroupBuilder MapUserEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("api/users").WithParameterValidation();

        // GET api/users
        group.MapGet("/", [Authorize(Policy = "RequireAdmin")] async (WorkoutContext dbContext) =>
        {
            var users = await dbContext.Users
                .Select(user => user.ToDto())
                .AsNoTracking()
                .ToListAsync();

            return Results.Ok(users);
        }).RequireAuthorization();

        // GET api/users/{userId}
        group.MapGet("/{userId}", async (int userId, WorkoutContext dbContext) =>
        {
            User? user = await dbContext.Users.FindAsync(userId);

            return user is null ? Results.NotFound() : Results.Ok(user.ToDto());
        })
            .WithName(GetUserEndpointName)
            .RequireAuthorization();

        // GET api/users/auth/{auth0id}
        group.MapGet("/auth/{auth0Id}", async (string auth0Id, WorkoutContext dbContext) =>
        {
            User? user = await dbContext.Users
                .Where(u => u.Auth0Id == auth0Id)
                .FirstOrDefaultAsync();

            return user is null ? Results.NotFound() : Results.Ok(user.ToDto());
        }).RequireAuthorization();

        // POST api/users
        group.MapPost("/", async (UserDto newUser, WorkoutContext dbContext) =>
        {
            User user = newUser.ToEntity();

            dbContext.Users.Add(user);
            await dbContext.SaveChangesAsync();

            return Results.CreatedAtRoute(GetUserEndpointName, new { userId = user.Id }, user.ToDto());
        }).RequireAuthorization();

        // PUT api/users/{userId}
        group.MapPut("/{userId}", async (int userId, UserDto updatedUser, WorkoutContext dbContext) =>
        {
            var existingUser = await dbContext.Users.FindAsync(userId);

            if (existingUser is null)
            {
                return Results.NotFound();
            }

            existingUser.Name = updatedUser.Name;
            existingUser.Email = updatedUser.Email;

            await dbContext.SaveChangesAsync();

            return Results.NoContent();
        }).RequireAuthorization();

        // DELETE api/users/{userId}
        group.MapDelete("/{userId}", async (int userId, WorkoutContext dbContext) =>
        {
            await dbContext.Users
                .Where(user => user.Id == userId)
                .ExecuteDeleteAsync();

            return Results.NoContent();
        }).RequireAuthorization();

        return group;
    }
}
