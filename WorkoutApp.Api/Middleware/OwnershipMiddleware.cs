using Microsoft.EntityFrameworkCore;
using WorkoutApp.Api.Data;
using WorkoutApp.Api.Helpers;
using Microsoft.AspNetCore.Authentication;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace WorkoutApp.Api.Middleware;

public class OwnershipMiddleware(RequestDelegate next)
{
    private readonly RequestDelegate _next = next;
    private readonly JwtSecurityTokenHandler tokenHandler = new();

    public async Task InvokeAsync(HttpContext context, WorkoutAppDbContext dbContext)
    {
        // Check if the request is from the Auth0 machine-to-machine app or admin user, if so, allow. 
        if (IsAdminOrM2MUser(context))
        {
            await _next(context);
            return;
        }

        var token = await GetTokenAsyncWrapper(context);
        if (token == null)
        {
            ResponseHelper.SetUnauthorizedResponse(context);
            return;
        }

        // Identify user from the sub/Auth0 user id value in the access token.
        string? auth0Id = ExtractAuth0IdFromToken(token, context);

        if (auth0Id == null)
        {
            ResponseHelper.SetUnauthorizedResponse(context);
            return;
        }
        // If the route includes a userId, check if the user is making a request for their own data. If not, don't allow.
        if (!await IsRequestingOwnDataAsync(context, dbContext, auth0Id))
        {
            ResponseHelper.SetForbiddenResponse(context);
            return;
        }
        await _next(context);
    }

    private string? ExtractAuth0IdFromToken(string token, HttpContext context)
    {
        try
        {
            var jwtToken = ReadJWTTokenWrapper(token);
            string? fullAuth0Id = jwtToken.Payload["sub"]?.ToString();
            return fullAuth0Id != null ? StringHelper.ExtractSubstring(fullAuth0Id, "|") : null;
        }
        catch (Exception)
        {
            ResponseHelper.SetUnauthorizedResponse(context);
            throw;
        }
    }

    private async Task<bool> IsRequestingOwnDataAsync(HttpContext context, WorkoutAppDbContext dbContext, string auth0Id)
    {
        var routeData = GetRouteDataWrapper(context) ?? throw new Exception("Unable to determine resource ownership: route data is missing from the HTTP request.");

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
        // if (context.Items == null && context.User == null) return false;
        return IsM2MUser(context) || IsAdminUser(context.User);
    }

    private static bool IsM2MUser(HttpContext context)
    {
        return context != null && (context.Items?["IsM2M"] as bool? == true);
    }

    private static bool IsAdminUser(ClaimsPrincipal user)
    {
        return user != null && user.Claims != null && (user.Claims?.Any(c => c.Type == "permissions" && c.Value == "all") ?? false);
    }

    protected virtual async Task<string?> GetTokenAsyncWrapper(HttpContext context)
    {
        return await context.GetTokenAsync("access_token");
    }

    protected virtual JwtSecurityToken ReadJWTTokenWrapper(string token)
    {
        return tokenHandler.ReadJwtToken(token);
    }

    protected virtual RouteData GetRouteDataWrapper(HttpContext context)
    {
        return context.GetRouteData();
    }
}