using Microsoft.AspNetCore.Identity.Data;
using Microsoft.EntityFrameworkCore;
using Workout.Api.Data;
using Workout.Api.Dtos;
using Workout.Api.Entities;
using Workout.Api.Mapping;

namespace Workout.Api.Endpoints;

public static class AuthenticationEndpoints
{
    public static void MapAuthenticationEndpoints(this WebApplication app)
    {
        app.MapPost("/login", (LoginRequest loginRequest, WorkoutContext dbContext) =>
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