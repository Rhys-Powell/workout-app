using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using WorkoutApp.Api.Data;
using WorkoutApp.Api.Dtos;
using WorkoutApp.Api.Entities;
using WorkoutApp.Api.Mapping;

namespace WorkoutApp.Api.Endpoints;

public static class UserEndpoints
{
    const string GetUserEndpointName = "GetUser";

    public static RouteGroupBuilder MapUserEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("api/users").WithParameterValidation();

        // GET api/users
        group.MapGet("/", [Authorize(Policy = "RequireAdmin")] async (WorkoutAppDbContext dbContext) =>
        {
            var users = await dbContext.Users
                .Select(user => user.ToDto())
                .AsNoTracking()
                .ToListAsync();

            return Results.Ok(users);
        }).RequireAuthorization();

        // GET api/users/{userId}
        group.MapGet("/{userId}", async (int userId, WorkoutAppDbContext dbContext) =>
        {
            User? user = await dbContext.Users.FindAsync(userId);

            return user is null ? Results.NotFound() : Results.Ok(user.ToDto());
        })
            .WithName(GetUserEndpointName)
            .RequireAuthorization();

        // GET api/users/auth/{auth0id}
        group.MapGet("/auth/{auth0Id}", async (string auth0Id, WorkoutAppDbContext dbContext) =>
        {
            User? user = await dbContext.Users
                .Where(u => u.Auth0Id == auth0Id)
                .FirstOrDefaultAsync();

            return user is null ? Results.NotFound() : Results.Ok(user.ToDto());
        }).RequireAuthorization();

        // POST api/users
        group.MapPost("/", async (UserDto newUser, WorkoutAppDbContext dbContext) =>
        {
            User user = newUser.ToEntity();

            dbContext.Users.Add(user);
            await dbContext.SaveChangesAsync();

            return Results.CreatedAtRoute(GetUserEndpointName, new { userId = user.Id }, user.ToDto());
        }).RequireAuthorization();

        // PUT api/users/{userId}
        group.MapPut("/{userId}", async (int userId, UserDto updatedUser, WorkoutAppDbContext dbContext) =>
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
        group.MapDelete("/{userId}", async (int userId, WorkoutAppDbContext dbContext) =>
        {
            await dbContext.Users
                .Where(user => user.Id == userId)
                .ExecuteDeleteAsync();

            return Results.NoContent();
        }).RequireAuthorization();

        return group;
    }
}
