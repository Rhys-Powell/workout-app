using Microsoft.AspNetCore.Identity.Data;
using Workout.Api.Data;
using Workout.Api.Entities;

namespace Workout.Api.Endpoints;

public static class AuthenticationEndpoints
{
    public static void MapAuthenticationEndpoints(this WebApplication app)
    {
        // POST api/login
        app.MapPost("api/login", (LoginRequest loginRequest, WorkoutContext dbContext) =>
        {
            User? user = dbContext.Users.FirstOrDefault(u => u.Email == loginRequest.Email);

            if (user != null)
            {
                return Results.Json(new
                {
                    success = true,
                    token = "some_auth_token",
                    user = new
                    {
                        id = user.Id,
                        name = user.Name,
                        email = user.Email
                    }
                });
            }
            else
            {
                return Results.Unauthorized();
            }
        });
    }
}