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
        group.MapGet("/", async (WorkoutContext dbContext) =>
        {
            var users = await dbContext.Users
                .Select(user => user.ToDto())
                .AsNoTracking()
                .ToListAsync();

            return Results.Ok(users);
        }).RequireAuthorization();

        // GET api/users/{id}
        group.MapGet("/{id}", async (int id, WorkoutContext dbContext) =>
        {
            User? user = await dbContext.Users.FindAsync(id);

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
        });

        // POST api/users
        group.MapPost("/", async (UserDto newUser, WorkoutContext dbContext) =>
        {
            User user = newUser.ToEntity();

            dbContext.Users.Add(user);
            await dbContext.SaveChangesAsync();

            return Results.CreatedAtRoute(GetUserEndpointName, new { id = user.Id }, user.ToDto());
        });

        // PUT api/users/{id}
        group.MapPut("/{id}", async (int id, UserDto updatedUser, WorkoutContext dbContext) =>
        {
            var existingUser = await dbContext.Users.FindAsync(id);

            if (existingUser is null)
            {
                return Results.NotFound();
            }

            existingUser.Name = updatedUser.Name;
            existingUser.Email = updatedUser.Email;

            await dbContext.SaveChangesAsync();

            return Results.NoContent();
        }).RequireAuthorization();

        // DELETE api/users/{id}
        group.MapDelete("/{id}", async (int id, WorkoutContext dbContext) =>
        {
            await dbContext.Users
                .Where(user => user.Id == id)
                .ExecuteDeleteAsync();

            return Results.NoContent();
        }).RequireAuthorization();

        return group;
    }
}
