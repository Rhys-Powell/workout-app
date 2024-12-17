using Microsoft.EntityFrameworkCore;
using WorkoutApp.Api.Data;
using WorkoutApp.Api.Helpers;
using Microsoft.AspNetCore.Authentication;
using System.IdentityModel.Tokens.Jwt;

namespace WorkoutApp.Api.Middleware;

public class OwnershipMiddleware(RequestDelegate next)
{
    private readonly RequestDelegate _next = next;

    public async Task InvokeAsync(HttpContext context, WorkoutAppDbContext dbContext)
    {
        // Check if the request is from the Auth0 machine-to-machine app or admin user, if so, allow. 
        if (IsAdminOrM2MUser(context))
        {
            await _next(context);
            return;
        }

        var token = await context.GetTokenAsync("access_token");
        if (token == null)
        {
            ResponseHelper.SetUnauthorizedResponse(context);
            return;
        }

        // Identify user from the sub/Auth0 user id value in the access token.
        var tokenHandler = new JwtSecurityTokenHandler();
        var jwtToken = tokenHandler.ReadJwtToken(token);
        var fullAuth0Id = jwtToken.Payload["sub"]?.ToString();
        if (fullAuth0Id == null)
        {
            ResponseHelper.SetUnauthorizedResponse(context);
            return;
        }
        string auth0Id = StringHelper.ExtractSubstring(fullAuth0Id, "|");

        // If the route includes a userId, check if the user is making a request for their own data. If not, don't allow.
        var isRequestingOwnData = await IsRequestingOwnDataAsync(context, dbContext, auth0Id);
        if (!isRequestingOwnData)
        {
            ResponseHelper.SetForbiddenResponse(context);
            return;
        }
        await _next(context);
    }

    private static async Task<bool> IsRequestingOwnDataAsync(HttpContext context, WorkoutAppDbContext dbContext, string auth0Id)
    {
        var routeData = context.GetRouteData() ?? throw new Exception("Unable to determine resource ownership: route data is missing from the HTTP request.");

        if (routeData.Values["userId"] is string userId)
        {
            var user = await dbContext.Users.FirstOrDefaultAsync(u => u.Auth0Id == auth0Id);
            if (user == null)
            {
                return false;
            }

            if (!int.TryParse(userId, out int parsedUserId))
            {
                throw new ArgumentException("Invalid user ID", nameof(userId));
            }
            return user.Id == parsedUserId;
        }
        return false;
    }

    private static bool IsAdminOrM2MUser(HttpContext context)
    {
        return context.Items["IsM2M"] as bool? == true || context.User.Claims.Any(c => c.Type == "permissions" && c.Value == "all");
    }
}