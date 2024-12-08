using System.IdentityModel.Tokens.Jwt;
using Microsoft.EntityFrameworkCore;
using Workout.Api.Data;
using Workout.Api.Helpers;

namespace Workout.Api.Middleware;

public class OwnershipMiddleware(RequestDelegate next)
{
    private readonly RequestDelegate _next = next;

    public async Task InvokeAsync(HttpContext context, WorkoutContext dbContext)
    {
        // Check if the request is from the Auth0 machine-to-machine app or admin user, if so, allow. 
        if (context.Items["IsM2M"] as bool? == true || context.User.Claims.Any(c => c.Type == "permissions" && c.Value == "all"))
        {
            await _next(context);
            return;
        }

        // Identify user from the sub/Auth0 user id value in the access token.
        var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
        if (token == null)
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsync("Unauthorized");
            return;
        }
        var tokenHandler = new JwtSecurityTokenHandler();
        var jwtToken = tokenHandler.ReadJwtToken(token);
        var fullAuth0Id = jwtToken.Payload["sub"]?.ToString();
        if (fullAuth0Id == null)
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsync("Unauthorized");
            return;
        }
        string auth0Id = StringHelper.ExtractSubstring(fullAuth0Id, "|");

        // If the route includes a userId, check if the user is making a request for their own data. If not, don't allow.
        var routeData = context.GetRouteData() ?? throw new Exception("Unable to determine resource ownership: route data is missing from the HTTP request.");

        if (routeData.Values["userId"] is string userId)
        {
            var user = await dbContext.Users.FirstOrDefaultAsync(u => u.Auth0Id == auth0Id);
            if (user == null)
            {
                context.Response.StatusCode = 401;
                await context.Response.WriteAsync("Unauthorized");
                return;
            }

            if (!int.TryParse(userId, out int parsedUserId))
            {
                throw new ArgumentException("Invalid user ID", nameof(userId));
            }

            if (user.Id != parsedUserId)
            {
                context.Response.StatusCode = 403;
                await context.Response.WriteAsync("Forbidden");
                return;
            }
        }

        await _next(context);
    }
}